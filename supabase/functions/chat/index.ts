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

    // Fetch features from DB for this business type
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let featureList = "";
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
        featureList = features
          .map((f: any) => {
            const deps = Array.isArray(f.dependencies) && f.dependencies.length > 0
              ? ` (depends on: ${f.dependencies.join(", ")})`
              : "";
            const defaultTag = f.is_default ? " [DEFAULT - included by default]" : " [OPTIONAL - needs confirmation]";
            return `- **${f.name}** (${f.name_ar}) [slug: ${f.slug}] (${f.category}): ${f.description} / ${f.description_ar}${deps}${defaultTag}`;
          })
          .join("\n");
      }
    }

    const systemName = system?.name || "System";

    const systemPrompt = `You are Gomaa (جمعة), a Guided Intelligence™ System Architect for PLATME.

You are helping the user build a ${systemName} system. Your role is to act as a sales architect — understand what the user needs and propose infrastructure modules one at a time.

Available modules for ${systemName}:
${featureList}

BEHAVIOR RULES:
1. Ask what the user wants to build. Understand their specific needs.
2. Propose modules one at a time. Explain what each module does and why they need it.
3. When the user confirms they want a module, use the add_module tool to add it to the architecture. Use the exact slug as the id.
4. After adding a module, ask about the next logical feature they might need.
5. Suggest dependencies automatically — if a module requires another, explain that and propose both.
6. Keep responses concise — 2-3 sentences max per message unless explaining a complex module.
7. Never add modules without user confirmation.

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
                  id: { type: "string", description: "Module slug (lowercase, snake_case) — must match one of the available module slugs" },
                  label: { type: "string", description: "Display name of the module" },
                  category: { type: "string", description: "Module category" },
                  dependencies: { type: "array", items: { type: "string" }, description: "Array of module slugs this module depends on" },
                },
                required: ["id", "label", "category", "dependencies"],
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
