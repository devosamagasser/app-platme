import { useState, useRef, useEffect } from "react";
import { Send, Loader2, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { streamChat, type ChatMessage, type AddModuleCall } from "@/lib/streamChat";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

interface LeftPanelProps {
  businessType: string;
  onAddModule: (module: AddModuleCall) => void;
  onComplete: () => void;
  collapsed: boolean;
  onToggle: () => void;
  fullWidth?: boolean;
}

const LeftPanel = ({ businessType, onAddModule, onComplete, collapsed, onToggle, fullWidth }: LeftPanelProps) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: t("composer.initialMessage"),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

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
      onComplete: () => {
        onComplete();
      },
      onToolCall: (module) => {
        onAddModule(module);
        assistantSoFar += `\n\n✅ **${module.label}** added.`;
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

  if (!fullWidth && collapsed) {
    return (
      <div className="w-12 border-e border-primary/8 bg-card flex flex-col items-center py-3 shrink-0">
        <button onClick={onToggle} className="p-2 rounded-md hover:bg-primary/10 text-primary/60 hover:text-primary transition-colors">
          <PanelLeftOpen className="w-4 h-4" />
        </button>
        <div className="w-2 h-2 rounded-full bg-primary mt-3" />
      </div>
    );
  }

  return (
    <div className={`${fullWidth ? "w-full h-full" : "w-[380px] shrink-0"} border-e border-primary/8 bg-card flex flex-col`}>
      {!fullWidth && (
        <div className="p-4 border-b border-primary/8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-xs font-mono uppercase tracking-widest text-primary/70">
              {t("composer.gomaaTitle")}
            </span>
          </div>
          <button onClick={onToggle} className="p-1.5 rounded-md hover:bg-primary/10 text-primary/40 hover:text-primary transition-colors">
            <PanelLeftClose className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.filter((m) => m.role !== "system").map((msg, i) => (
          <div
            key={i}
            className={`${
              msg.role === "assistant"
                ? "bg-secondary/40 rounded-te-xl rounded-be-xl rounded-bs-xl"
                : "bg-primary/10 rounded-ts-xl rounded-bs-xl rounded-be-xl ms-8"
            } p-4`}
          >
            {msg.role === "assistant" && (
              <div className="text-[10px] font-mono uppercase text-primary/50 mb-2 tracking-wider">
                {t("composer.gomaaLabel")}
              </div>
            )}
            <div className="text-sm text-foreground/90 leading-relaxed prose prose-sm prose-invert max-w-none">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="bg-secondary/40 rounded-te-xl rounded-be-xl rounded-bs-xl p-4">
            <div className="text-[10px] font-mono uppercase text-primary/50 mb-2 tracking-wider">
              {t("composer.gomaaLabel")}
            </div>
            <Loader2 className="w-4 h-4 text-primary/50 animate-spin" />
          </div>
        )}
      </div>

      <div className="p-4 border-t border-primary/8">
        <div className="flex items-end gap-2 border border-primary/10 bg-background/50 rounded-xl p-3 focus-within:border-primary/40 transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder={t("composer.placeholder")}
            disabled={isLoading}
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50 resize-none min-h-[40px] leading-relaxed"
          />
          <button
            onClick={() => send(input)}
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-30"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
