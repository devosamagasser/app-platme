export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export interface AddModuleCall {
  id: string;
  label: string;
  category: string;
  dependencies: string[];
}

interface StreamChatOptions {
  messages: ChatMessage[];
  businessType: string;
  onDelta: (text: string) => void;
  onToolCall: (module: AddModuleCall) => void;
  onComplete: () => void;
  onDone: () => void;
  onError: (error: string) => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export async function streamChat({ messages, businessType, onDelta, onToolCall, onComplete, onDone, onError }: StreamChatOptions) {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages, businessType }),
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
    let toolCallArgs = "";
    let isCollectingToolCall = false;
    let toolCallName = "";
    let streamDone = false;

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

          const toolCalls = choice?.delta?.tool_calls;
          if (toolCalls && toolCalls.length > 0) {
            const tc = toolCalls[0];
            if (tc.function?.name) {
              toolCallName = tc.function.name;
              isCollectingToolCall = true;
              toolCallArgs = tc.function.arguments || "";
            } else if (tc.function?.arguments) {
              toolCallArgs += tc.function.arguments;
            }
          }

          if (choice?.finish_reason === "tool_calls" && isCollectingToolCall) {
            try {
              const args = JSON.parse(toolCallArgs);
              if (toolCallName === "add_module") onToolCall(args as AddModuleCall);
            } catch { /* incomplete */ }
            isCollectingToolCall = false;
            toolCallArgs = "";
            toolCallName = "";
          }
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }

    if (isCollectingToolCall && toolCallArgs) {
      try {
        const args = JSON.parse(toolCallArgs);
        if (toolCallName === "add_module") onToolCall(args as AddModuleCall);
      } catch { /* ignore */ }
    }

    onDone();
  } catch (e) {
    onError(e instanceof Error ? e.message : "Unknown error");
  }
}
