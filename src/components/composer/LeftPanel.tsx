import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, PanelLeftClose, PanelLeftOpen, Coins, Copy, Check, RotateCcw, Sparkles, BookOpen, CreditCard, Users, BarChart3 } from "lucide-react";
import { streamChat, type ChatMessage, type AddModuleCall } from "@/lib/streamChat";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import gomaaAvatar from "@/assets/gomaa-avatar.png";

function detectDir(text: string): "rtl" | "ltr" {
  const firstChar = text.trim().charAt(0);
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(firstChar) ? "rtl" : "ltr";
}

interface LeftPanelProps {
  businessType: string;
  onAddModule: (module: AddModuleCall) => void;
  onComplete: () => void;
  collapsed: boolean;
  onToggle: () => void;
  fullWidth?: boolean;
}

const TYPING_SPEED = 12;

// Module card component shown inline in chat
const ModuleCard = ({ module }: { module: AddModuleCall }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="my-2 flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 border border-primary/20"
  >
    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
      <Sparkles className="w-4 h-4 text-primary" />
    </div>
    <div className="min-w-0">
      <div className="text-xs font-semibold text-foreground truncate">{module.label}</div>
      <div className="text-[10px] text-primary/60 font-mono uppercase">{module.category}</div>
    </div>
    <Check className="w-3.5 h-3.5 text-primary ms-auto shrink-0" />
  </motion.div>
);

// Message action buttons
const MessageActions = ({ content, onRetry }: { content: string; onRetry?: () => void }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={handleCopy}
        className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
        title="Copy"
      >
        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      </button>
      {onRetry && (
        <button
          onClick={onRetry}
          className="p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
          title="Retry"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

const LeftPanel = ({ businessType, onAddModule, onComplete, collapsed, onToggle, fullWidth }: LeftPanelProps) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const currentLang = i18n.language?.startsWith("ar") ? "ar" : "en";
  const chatStorageKey = `platme_chat_${businessType}`;
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem(chatStorageKey);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [tokenCount, setTokenCount] = useState<number | null>(null);
  const [addedModules, setAddedModules] = useState<AddModuleCall[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchTokens = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("tokens")
        .eq("id", user.id)
        .single();
      if (data) setTokenCount(data.tokens);
    };
    fetchTokens();
  }, [user]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const introSent = useRef(false);

  // Typing animation state
  const [displayedContent, setDisplayedContent] = useState("");
  const rawContentRef = useRef("");
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isStreamingRef = useRef(false);
  const displayedLengthRef = useRef(0);

  const startTypingAnimation = useCallback(() => {
    if (typingIntervalRef.current) return;
    typingIntervalRef.current = setInterval(() => {
      const raw = rawContentRef.current;
      const currentLen = displayedLengthRef.current;
      if (currentLen < raw.length) {
        const charsToReveal = Math.min(3, raw.length - currentLen);
        displayedLengthRef.current = currentLen + charsToReveal;
        setDisplayedContent(raw.slice(0, displayedLengthRef.current));
      } else if (!isStreamingRef.current) {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
      }
    }, TYPING_SPEED);
  }, []);

  const stopTypingAnimation = useCallback(() => {
    setDisplayedContent(rawContentRef.current);
    displayedLengthRef.current = rawContentRef.current.length;
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(chatStorageKey, JSON.stringify(messages));
    }
  }, [messages, chatStorageKey]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, displayedContent]);

  // Hide welcome when messages exist
  useEffect(() => {
    if (messages.length > 0) setShowWelcome(false);
  }, [messages]);

  // Auto-intro
  useEffect(() => {
    if (introSent.current) return;
    introSent.current = true;
    if (messages.length > 0) return;
    // Don't auto-send — show welcome screen instead
  }, [businessType, messages.length]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const startChat = (text: string) => {
    setShowWelcome(false);
    send(text);
  };

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

    rawContentRef.current = "";
    displayedLengthRef.current = 0;
    setDisplayedContent("");
    isStreamingRef.current = true;
    startTypingAnimation();

    let assistantSoFar = "";

    await streamChat({
      messages: conversationMessages,
      businessType,
      language: currentLang,
      onDelta: (chunk) => {
        assistantSoFar += chunk;
        rawContentRef.current = assistantSoFar;
      },
      onComplete: () => {
        onComplete();
      },
      onToolCall: (module) => {
        onAddModule(module);
        setAddedModules((prev) => [...prev, module]);
      },
      onDone: () => {
        isStreamingRef.current = false;
        setTimeout(() => {
          stopTypingAnimation();
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") {
              return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: rawContentRef.current } : m));
            }
            return [...prev, { role: "assistant", content: rawContentRef.current }];
          });
          setIsLoading(false);
        }, 300);
      },
      onError: (error) => {
        isStreamingRef.current = false;
        stopTypingAnimation();
        setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ ${error}` }]);
        setIsLoading(false);
      },
    });
  };

  const retryLastMessage = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMsg) return;
    // Remove last assistant message
    setMessages((prev) => {
      const idx = prev.length - 1;
      if (prev[idx]?.role === "assistant") return prev.slice(0, idx);
      return prev;
    });
    send(lastUserMsg.content);
  };

  if (!fullWidth && collapsed) {
    return (
      <div className="w-12 border-e border-primary/8 bg-card flex flex-col items-center py-3 shrink-0">
        <button onClick={onToggle} className="p-2 rounded-md hover:bg-primary/10 text-primary/60 hover:text-primary transition-colors">
          <PanelLeftOpen className="w-4 h-4" />
        </button>
        <img src={gomaaAvatar} alt="Gomaa" className="w-7 h-7 rounded-full mt-3" loading="lazy" width={28} height={28} />
      </div>
    );
  }

  const showTypingBubble = isLoading && displayedContent.length > 0;

  // Quick suggestion buttons
  const suggestions = [
    { icon: BookOpen, label: t("composer.suggestModules"), message: currentLang === "ar" ? "اقترح لي أهم الموديولات لمنصتي" : "Suggest the best modules for my platform" },
    { icon: CreditCard, label: t("composer.suggestPayment"), message: currentLang === "ar" ? "أضف نظام الدفع والاشتراكات" : "Add payment and subscription system" },
    { icon: Users, label: t("composer.suggestUsers"), message: currentLang === "ar" ? "أضف إدارة المستخدمين والصلاحيات" : "Add user management and permissions" },
    { icon: BarChart3, label: t("composer.suggestAnalytics"), message: currentLang === "ar" ? "أضف التقارير والإحصائيات" : "Add reports and analytics" },
  ];

  return (
    <div className={`${fullWidth ? "w-full h-full" : "w-[380px] shrink-0"} border-e border-primary/8 bg-card flex flex-col`}>
      {!fullWidth && (
        <div className="p-4 border-b border-primary/8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={gomaaAvatar} alt="Gomaa" className="w-8 h-8 rounded-full ring-2 ring-primary/20" loading="lazy" width={32} height={32} />
            <div>
              <span className="text-xs font-semibold text-foreground">
                {t("composer.gomaaLabel")}
              </span>
              <div className="text-[10px] text-primary/50 font-mono">
                {t("composer.gomaaSubtitle")}
              </div>
            </div>
          </div>
          <button onClick={onToggle} className="p-1.5 rounded-md hover:bg-primary/10 text-primary/40 hover:text-primary transition-colors">
            <PanelLeftClose className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Welcome Screen */}
        <AnimatePresence>
          {showWelcome && messages.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center text-center pt-8 pb-4"
            >
              <img src={gomaaAvatar} alt="Gomaa" className="w-20 h-20 mb-4" loading="lazy" width={80} height={80} />
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {t("composer.welcomeTitle")}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-[280px]">
                {t("composer.welcomeDesc")}
              </p>
              <div className="grid grid-cols-2 gap-2 w-full">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => startChat(s.message)}
                    className="flex items-center gap-2 p-3 rounded-xl border border-primary/15 bg-primary/5 hover:bg-primary/10 hover:border-primary/30 transition-all text-start group"
                  >
                    <s.icon className="w-4 h-4 text-primary/60 group-hover:text-primary shrink-0" />
                    <span className="text-xs text-foreground/80 group-hover:text-foreground leading-tight">{s.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        {messages.filter((m) => m.role !== "system").map((msg, i) => {
          const dir = detectDir(msg.content);
          const isAssistant = msg.role === "assistant";
          const isLastAssistant = isAssistant && i === messages.filter(m => m.role !== "system").length - 1;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              dir={dir}
              className="group"
            >
              {isAssistant ? (
                <div className="flex gap-2.5 items-start">
                  <img src={gomaaAvatar} alt="" className="w-7 h-7 rounded-full mt-0.5 shrink-0 ring-1 ring-primary/10" loading="lazy" width={28} height={28} />
                  <div className="flex-1 min-w-0">
                    <div className="bg-secondary/50 rounded-2xl rounded-tl-sm p-3.5 shadow-sm">
                      <div className={`text-sm text-foreground/90 leading-relaxed prose prose-sm prose-invert max-w-none ${dir === "rtl" ? "text-right" : "text-left"}`}>
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                    <MessageActions content={msg.content} onRetry={isLastAssistant ? retryLastMessage : undefined} />
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <div className="bg-primary/15 rounded-2xl rounded-tr-sm p-3.5 max-w-[85%] shadow-sm">
                    <div className={`text-sm text-foreground leading-relaxed ${dir === "rtl" ? "text-right" : "text-left"}`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Inline module cards */}
        {addedModules.length > 0 && !isLoading && (
          <div className="space-y-1">
            {addedModules.slice(-3).map((mod, i) => (
              <ModuleCard key={`${mod.id}-${i}`} module={mod} />
            ))}
          </div>
        )}

        {/* Live typing bubble */}
        {showTypingBubble && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            dir={detectDir(displayedContent)}
            className="flex gap-2.5 items-start"
          >
            <img src={gomaaAvatar} alt="" className="w-7 h-7 rounded-full mt-0.5 shrink-0 ring-1 ring-primary/10" loading="lazy" width={28} height={28} />
            <div className="flex-1 min-w-0">
              <div className="bg-secondary/50 rounded-2xl rounded-tl-sm p-3.5 shadow-sm">
                <div className={`text-sm text-foreground/90 leading-relaxed prose prose-sm prose-invert max-w-none ${detectDir(displayedContent) === "rtl" ? "text-right" : "text-left"}`}>
                  <ReactMarkdown>{displayedContent}</ReactMarkdown>
                  <span className="inline-block w-0.5 h-4 bg-primary/70 animate-pulse ms-0.5 align-text-bottom" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading dots */}
        {isLoading && !showTypingBubble && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2.5 items-start"
          >
            <img src={gomaaAvatar} alt="" className="w-7 h-7 rounded-full mt-0.5 shrink-0 ring-1 ring-primary/10" loading="lazy" width={28} height={28} />
            <div className="bg-secondary/50 rounded-2xl rounded-tl-sm p-3.5 shadow-sm">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-3 border-t border-primary/8 space-y-2">
        {tokenCount !== null && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/5 border border-primary/10 w-fit">
            <Coins className="w-3 h-3 text-primary/70" />
            <span className="text-[10px] font-mono text-primary/70">
              {tokenCount} {t("composer.tokens")}
            </span>
          </div>
        )}
        <div className="flex items-end gap-2 border border-primary/10 bg-background/50 rounded-2xl p-2.5 focus-within:border-primary/30 focus-within:shadow-[0_0_12px_rgba(159,255,208,0.08)] transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (showWelcome) startChat(input);
                else send(input);
              }
            }}
            placeholder={t("composer.placeholder")}
            disabled={isLoading}
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50 resize-none min-h-[36px] leading-relaxed"
          />
          <button
            onClick={() => showWelcome ? startChat(input) : send(input)}
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-30 disabled:bg-primary/20"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
