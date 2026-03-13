import { useState } from "react";
import { Send } from "lucide-react";

interface Message {
  role: "gomaa" | "user";
  content: string;
}

const suggestions = [
  "Build LMS Platform",
  "Add Subscription Logic",
  "Enable Multi-Tenant",
  "Add Payment Gateway",
  "Add Course Certification",
];

const initialMessages: Message[] = [
  {
    role: "gomaa",
    content:
      "Awaiting system intent. Describe the infrastructure you wish to provision, or select a suggested architecture below.",
  },
];

const LeftPanel = ({
  onUserMessage,
}: {
  onUserMessage: (msg: string) => void;
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    onUserMessage(text);

    // Simulate Gomaa response
    setTimeout(() => {
      let response =
        "Architecture proposal generated. Review the center graph for dependency mapping.";
      if (text.toLowerCase().includes("subscription")) {
        response =
          "Provisioning subscription infrastructure. I have mapped the Billing Engine to the Access Control layer. Modules proposed: Billing Engine, Recurring Logic, Access Control Update. Confirm to commit.";
      } else if (text.toLowerCase().includes("lms")) {
        response =
          "LMS architecture initialized. Core modules provisioned: Authentication, User Roles, Content Engine, Storage Layer, Analytics Base. Review the graph for structural dependencies.";
      } else if (text.toLowerCase().includes("payment")) {
        response =
          "Payment Gateway module proposed. Dependencies: Billing Engine, Transaction Logger, Webhook Handler. Validating integration paths.";
      } else if (text.toLowerCase().includes("certification")) {
        response =
          "Certification module queued. Dependencies: Content Engine, User Roles, Credential Store. Awaiting confirmation to provision.";
      }
      setMessages((prev) => [...prev, { role: "gomaa", content: response }]);
    }, 800);
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${
              msg.role === "gomaa"
                ? "bg-secondary/40 rounded-tr-xl rounded-br-xl rounded-bl-xl"
                : "bg-primary/10 rounded-tl-xl rounded-bl-xl rounded-br-xl ml-8"
            } p-4`}
          >
            {msg.role === "gomaa" && (
              <div className="text-[10px] font-mono uppercase text-primary/50 mb-2 tracking-wider">
                Gomaa
              </div>
            )}
            <p className="text-sm text-foreground/90 leading-relaxed">
              {msg.content}
            </p>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      <div className="px-4 pb-2">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="px-3 py-1.5 rounded-md text-[11px] font-medium border border-primary/15 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-primary/8">
        <div className="flex items-center gap-2 border border-primary/10 bg-background/50 rounded-lg p-3 focus-within:border-primary/40 transition-colors">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Describe system intent..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            onClick={() => send(input)}
            className="text-primary/60 hover:text-primary transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
