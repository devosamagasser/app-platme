import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";
const MAX_CONTINUATIONS = 5;

interface ToolCallAccum {
  id: string;
  name: string;
  args: string;
}

async function parseSSEStream(
  response: Response,
  onData: (line: string) => void
): Promise<{ toolCalls: ToolCallAccum[]; contentText: string; finishReason: string | null }> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  const toolCalls = new Map<number, ToolCallAccum>();
  let contentText = "";
  let finishReason: string | null = null;

  while (true) {
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
      if (jsonStr === "[DONE]") break;

      try {
        const parsed = JSON.parse(jsonStr);
        const choice = parsed.choices?.[0];
        const content = choice?.delta?.content;
        if (content) {
          contentText += content;
          onData(line); // forward SSE line
        }

        const deltaToolCalls = choice?.delta?.tool_calls;
        if (deltaToolCalls) {
          for (const tc of deltaToolCalls) {
            const idx = tc.index ?? 0;
            if (!toolCalls.has(idx)) {
              toolCalls.set(idx, { id: tc.id || `call_${idx}`, name: "", args: "" });
            }
            const entry = toolCalls.get(idx)!;
            if (tc.id) entry.id = tc.id;
            if (tc.function?.name) entry.name = tc.function.name;
            if (tc.function?.arguments) entry.args += tc.function.arguments;
          }
        }

        // Forward tool_calls SSE events so client can act on them
        if (deltaToolCalls) {
          onData(line);
        }

        if (choice?.finish_reason) {
          finishReason = choice.finish_reason;
        }
      } catch {
        // partial JSON, put back
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }

  return {
    toolCalls: Array.from(toolCalls.values()),
    contentText,
    finishReason,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, businessType, language } = await req.json();
    const lang = language === "ar" ? "ar" : "en";
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let defaultFeatureList = "";
    let optionalFeatureList = "";
    const { data: system } = await supabase
      .from("systems")
      .select("id, name")
      .eq("slug", businessType || "education")
      .single();

    if (system) {
      const { data: features } = await supabase
        .from("system_features")
        .select("slug, name, description, name_ar, description_ar, category, dependencies, is_default")
        .eq("system_id", system.id);

      if (features && features.length > 0) {
        const defaults = features.filter((f: any) => f.is_default);
        const optionals = features.filter((f: any) => !f.is_default);

        defaultFeatureList = defaults
          .map((f: any) => `- **${f.name}** (${f.name_ar}) [slug: ${f.slug}]`)
          .join("\n");

        optionalFeatureList = optionals
          .map((f: any) => {
            const deps = Array.isArray(f.dependencies) && f.dependencies.length > 0
              ? ` (depends on: ${f.dependencies.join(", ")})`
              : "";
            return `- **${f.name}** (${f.name_ar}) [slug: ${f.slug}] (${f.category}): ${f.description} / ${f.description_ar}${deps}`;
          })
          .join("\n");
      }
    }

    const systemName = system?.name || "System";

    const systemPrompt = `You are Gomaa (جمعة), a Guided Intelligence™ System Architect for PLATME.

You are helping the user build a ${systemName} system.

DEFAULT MODULES (already added to the workspace automatically):
${defaultFeatureList}

These modules are already active. Do NOT propose them again.

OPTIONAL MODULES (propose these one at a time):
${optionalFeatureList}

BEHAVIOR RULES:
1. Start by welcoming the user and briefly explaining that the default modules are already included in their system, then IMMEDIATELY propose the first optional module.
2. Propose optional modules ONE AT A TIME. Explain what each does and why they might need it.
3. When the user confirms they want a module, use the add_module tool AND in the SAME response continue by proposing the next logical module. Never just confirm and stop.
4. If the user declines a module, acknowledge briefly and propose the next one.
5. If a module depends on another, explain and propose the dependency first.
6. Keep responses concise — 2-3 sentences max per module explanation.
7. Never add modules without user confirmation.
8. If the user says they want ALL features/modules (e.g., "add all", "عايز كلهم", "ضيفهم كلهم"), add ALL remaining optional modules at once using multiple add_module tool calls, then ask if they're ready to proceed.
9. When the user says they're done (e.g., "خلاص", "done", "that's it", "كده تمام"), call the complete_setup tool to finalize.
10. Do NOT call complete_setup until the user explicitly says they're finished.
11. CRITICAL: After every add_module call, you MUST continue the conversation — propose the next module or ask if they're done. Never end your response with just a confirmation.

CRITICAL LANGUAGE RULE:
- ALWAYS respond in the SAME language the user writes in.
- If the user writes in Arabic, respond entirely in Arabic.
- If the user writes in English, respond in English.
- If the user mixes languages, match their primary language.

TONE: Professional, confident, architectural. Think infrastructure engineer meets enterprise sales.`;

    const tools = [
      {
        type: "function",
        function: {
          name: "add_module",
          description:
            "Add an infrastructure module to the architecture graph. Call this ONLY after the user confirms they want the module.",
          parameters: {
            type: "object",
            properties: {
              id: { type: "string", description: "Module slug — must match one of the available module slugs" },
              label: { type: "string", description: "Display name of the module" },
              category: { type: "string", description: "Module category" },
              dependencies: { type: "array", items: { type: "string" }, description: "Array of module slugs this depends on" },
            },
            required: ["id", "label", "category", "dependencies"],
            additionalProperties: false,
          },
        },
      },
      {
        type: "function",
        function: {
          name: "complete_setup",
          description: "Call this when the user confirms they are done selecting modules and want to proceed to configuration.",
          parameters: {
            type: "object",
            properties: {},
            required: [],
            additionalProperties: false,
          },
        },
      },
    ];

    // Use a TransformStream to write SSE events to client
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    const writeSSE = (line: string) => {
      writer.write(encoder.encode(line + "\n\n"));
    };

    // Run the multi-turn loop in the background
    (async () => {
      try {
        let conversationMessages: any[] = [
          { role: "system", content: systemPrompt },
          ...messages,
        ];

        for (let turn = 0; turn < MAX_CONTINUATIONS; turn++) {
          const response = await fetch(AI_URL, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: MODEL,
              messages: conversationMessages,
              stream: true,
              tools,
            }),
          });

          if (!response.ok) {
            const status = response.status;
            const text = await response.text();
            console.error("AI gateway error:", status, text);
            writeSSE(`data: ${JSON.stringify({ error: true, status })}`);
            break;
          }

          const { toolCalls, contentText, finishReason } = await parseSSEStream(
            response,
            (line) => writeSSE(line)
          );

          // If no tool calls, we're done
          if (finishReason !== "tool_calls" || toolCalls.length === 0) {
            break;
          }

          // Build assistant message with tool_calls for conversation context
          const assistantMsg: any = { role: "assistant" };
          if (contentText) assistantMsg.content = contentText;
          assistantMsg.tool_calls = toolCalls.map((tc) => ({
            id: tc.id,
            type: "function",
            function: { name: tc.name, arguments: tc.args },
          }));

          conversationMessages.push(assistantMsg);

          // Add tool results for each tool call
          for (const tc of toolCalls) {
            conversationMessages.push({
              role: "tool",
              tool_call_id: tc.id,
              content: JSON.stringify({ success: true }),
            });
          }

          // Loop continues — next iteration will call AI again with tool results
        }
      } catch (e) {
        console.error("Stream processing error:", e);
      } finally {
        writeSSE("data: [DONE]");
        writer.close();
      }
    })();

    return new Response(readable, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
