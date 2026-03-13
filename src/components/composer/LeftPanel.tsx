import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { streamChat, type ChatMessage, type AddModuleCall } from "@/lib/streamChat";
import ReactMarkdown from "react-markdown";

interface LeftPanelProps {
  businessType: string;
  suggestions: string[];
  onAddModule: (module: AddModuleCall) => void;
  onComplete: () => void;
}

const LeftPanel = ({ businessType, suggestions, onAddModule, onComplete }: LeftPanelProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Awaiting system intent. Describe the infrastructure you wish to provision, or select a suggested architecture below.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Only send conversation messages (no system prompt — backend handles it)
    const conversationMessages: ChatMessage[] = [
      ...messages.filter((m) => m.role !== "system"),
      userMsg,
    ];

    let assistantSoFar = "";

    await streamChat({
      messages: conversationMessages,
      businessType,
      onDelta: (chunk) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && prev.length > 1 && prev[prev.length - 2]?.role === "user") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      },
      onToolCall: (module) => {
        onAddModule(module);
        assistantSoFar += `\n\n✅ **${module.label}** module added to the architecture.`;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      },
      onDone: () => setIsLoading(false),
      onError: (error) => {
        setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ ${error}` }]);
        setIsLoading(false);
      },
    });
  };

  return (
    <div className="w-[380px] border-r border-primary/8 bg-card flex flex-col shrink-0">
      <div className="p-4 border-b border-primary/8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs font-mono uppercase tracking-widest text-primary/70">
            Gomaa — System Architect
          </span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.filter((m) => m.role !== "system").map((msg, i) => (
          <div
            key={i}
            className={`${
              msg.role === "assistant"
                ? "bg-secondary/40 rounded-tr-xl rounded-br-xl rounded-bl-xl"
                : "bg-primary/10 rounded-tl-xl rounded-bl-xl rounded-br-xl ml-8"
            } p-4`}
          >
            {msg.role === "assistant" && (
              <div className="text-[10px] font-mono uppercase text-primary/50 mb-2 tracking-wider">
                Gomaa
              </div>
            )}
            <div className="text-sm text-foreground/90 leading-relaxed prose prose-sm prose-invert max-w-none">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="bg-secondary/40 rounded-tr-xl rounded-br-xl rounded-bl-xl p-4">
            <div className="text-[10px] font-mono uppercase text-primary/50 mb-2 tracking-wider">
              Gomaa
            </div>
            <Loader2 className="w-4 h-4 text-primary/50 animate-spin" />
          </div>
        )}
      </div>

      <div className="px-4 pb-2">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-md text-[11px] font-medium border border-primary/15 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-primary/8">
        <div className="flex items-center gap-2 border border-primary/10 bg-background/50 rounded-lg p-3 focus-within:border-primary/40 transition-colors">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Describe system intent..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50"
          />
          <button
            onClick={() => send(input)}
            disabled={isLoading}
            className="text-primary/60 hover:text-primary transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
