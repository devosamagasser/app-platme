export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export interface AddModuleCall {
  id: string;
  label: string;
  category: string;
}

interface StreamChatOptions {
  messages: ChatMessage[];
  businessType: string;
  language: string;
  onDelta: (text: string) => void;
  onToolCall: (module: AddModuleCall) => void;
  onComplete: () => void;
  onDone: () => void;
  onError: (error: string) => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export async function streamChat({ messages, businessType, language, onDelta, onToolCall, onComplete, onDone, onError }: StreamChatOptions) {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages, businessType, language }),
    });

    if (!resp.ok) {
      if (resp.status === 429) { onError("Rate limit exceeded. Please wait a moment and try again."); return; }
      if (resp.status === 402) { onError("AI credits exhausted. Please add credits to continue."); return; }
      const text = await resp.text();
      onError(`Error: ${text}`);
      return;
    }

    if (!resp.body) { onError("No response body"); return; }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let streamDone = false;

    // Track multiple parallel tool calls by index
    const toolCalls: Map<number, { name: string; args: string }> = new Map();

    const flushToolCall = (tc: { name: string; args: string }) => {
      try {
        const args = JSON.parse(tc.args);
        if (tc.name === "add_module") onToolCall(args as AddModuleCall);
        if (tc.name === "complete_setup") onComplete();
      } catch { /* incomplete */ }
    };

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") { streamDone = true; break; }

        try {
          const parsed = JSON.parse(jsonStr);
          const choice = parsed.choices?.[0];
          const content = choice?.delta?.content as string | undefined;
          if (content) onDelta(content);

          const deltaToolCalls = choice?.delta?.tool_calls;
          if (deltaToolCalls && deltaToolCalls.length > 0) {
            for (const tc of deltaToolCalls) {
              const idx = tc.index ?? 0;
              if (!toolCalls.has(idx)) {
                toolCalls.set(idx, { name: "", args: "" });
              }
              const entry = toolCalls.get(idx)!;
              if (tc.function?.name) entry.name = tc.function.name;
              if (tc.function?.arguments) entry.args += tc.function.arguments;
            }
          }

          if (choice?.finish_reason === "tool_calls") {
            for (const [, tc] of toolCalls) {
              flushToolCall(tc);
            }
            toolCalls.clear();
          }
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }

    // Flush any remaining tool calls
    for (const [, tc] of toolCalls) {
      if (tc.args) flushToolCall(tc);
    }

    onDone();
  } catch (e) {
    onError(e instanceof Error ? e.message : "Unknown error");
  }
}
