import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, businessType } = await req.json();
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

    const allMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: allMessages,
        stream: true,
        tools: [
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
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(response.body, {
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
