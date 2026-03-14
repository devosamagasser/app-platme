import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { streamChat, type ChatMessage, type AddModuleCall } from "@/lib/streamChat";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

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

const TYPING_SPEED = 12; // ms per character

const LeftPanel = ({ businessType, onAddModule, onComplete, collapsed, onToggle, fullWidth }: LeftPanelProps) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("ar") ? "ar" : "en";
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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
        // Reveal multiple chars per tick for speed
        const charsToReveal = Math.min(3, raw.length - currentLen);
        displayedLengthRef.current = currentLen + charsToReveal;
        setDisplayedContent(raw.slice(0, displayedLengthRef.current));
      } else if (!isStreamingRef.current) {
        // Done streaming and caught up
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
      }
    }, TYPING_SPEED);
  }, []);

  const stopTypingAnimation = useCallback(() => {
    // Flush remaining content immediately
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
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, displayedContent]);

  // Auto-intro: trigger AI greeting on mount
  useEffect(() => {
    if (introSent.current) return;
    introSent.current = true;
    setIsLoading(true);
    rawContentRef.current = "";
    displayedLengthRef.current = 0;
    setDisplayedContent("");
    isStreamingRef.current = true;
    startTypingAnimation();

    let assistantSoFar = "";
    streamChat({
      messages: [{ role: "user", content: currentLang === "ar" ? "ابدأ" : "Start" }],
      businessType,
      language: currentLang,
      onDelta: (chunk) => {
        assistantSoFar += chunk;
        rawContentRef.current = assistantSoFar;
      },
      onComplete: () => {},
      onToolCall: (module) => {
        onAddModule(module);
      },
      onDone: () => {
        isStreamingRef.current = false;
        // Finalize: flush displayed and save to messages
        setTimeout(() => {
          stopTypingAnimation();
          setMessages([{ role: "assistant", content: rawContentRef.current }]);
          setIsLoading(false);
        }, 300);
      },
      onError: (error) => {
        isStreamingRef.current = false;
        stopTypingAnimation();
        setMessages([{ role: "assistant", content: `⚠️ ${error}` }]);
        setIsLoading(false);
      },
    });
  }, [businessType, onAddModule, startTypingAnimation, stopTypingAnimation]);

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

    rawContentRef.current = "";
    displayedLengthRef.current = 0;
    setDisplayedContent("");
    isStreamingRef.current = true;
    startTypingAnimation();

    let assistantSoFar = "";

    await streamChat({
      messages: conversationMessages,
      businessType,
      onDelta: (chunk) => {
        assistantSoFar += chunk;
        rawContentRef.current = assistantSoFar;
      },
      onComplete: () => {
        onComplete();
      },
      onToolCall: (module) => {
        onAddModule(module);
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

  // Determine what to show as the "live" assistant message (typing animation)
  const showTypingBubble = isLoading && displayedContent.length > 0;

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
        {messages.filter((m) => m.role !== "system").map((msg, i) => {
          const dir = detectDir(msg.content);
          return (
            <div
              key={i}
              dir={dir}
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
              <div className={`text-sm text-foreground/90 leading-relaxed prose prose-sm prose-invert max-w-none ${dir === "rtl" ? "text-right" : "text-left"}`}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          );
        })}

        {/* Live typing bubble */}
        {showTypingBubble && (
          <div
            dir={detectDir(displayedContent)}
            className="bg-secondary/40 rounded-te-xl rounded-be-xl rounded-bs-xl p-4"
          >
            <div className="text-[10px] font-mono uppercase text-primary/50 mb-2 tracking-wider">
              {t("composer.gomaaLabel")}
            </div>
            <div className={`text-sm text-foreground/90 leading-relaxed prose prose-sm prose-invert max-w-none ${detectDir(displayedContent) === "rtl" ? "text-right" : "text-left"}`}>
              <ReactMarkdown>{displayedContent}</ReactMarkdown>
              <span className="inline-block w-0.5 h-4 bg-primary/70 animate-pulse ms-0.5 align-text-bottom" />
            </div>
          </div>
        )}

        {/* Loading spinner when waiting for first chunk */}
        {isLoading && !showTypingBubble && messages[messages.length - 1]?.role === "user" && (
          <div className="bg-secondary/40 rounded-te-xl rounded-be-xl rounded-bs-xl p-4">
            <div className="text-[10px] font-mono uppercase text-primary/50 mb-2 tracking-wider">
              {t("composer.gomaaLabel")}
            </div>
            <Loader2 className="w-4 h-4 text-primary/50 animate-spin" />
          </div>
        )}

        {/* Initial loading (intro, no messages yet) */}
        {isLoading && messages.length === 0 && !showTypingBubble && (
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
