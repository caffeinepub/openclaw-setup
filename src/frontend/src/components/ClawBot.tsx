import { useEffect, useRef, useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: Date;
}

interface ApiConfig {
  openclaw: { enabled: boolean; key: string };
  chatgpt: { enabled: boolean; key: string };
  gemini: { enabled: boolean; key: string };
}

const DEFAULT_API_CONFIG: ApiConfig = {
  openclaw: { enabled: true, key: "" },
  chatgpt: { enabled: false, key: "" },
  gemini: { enabled: false, key: "" },
};

const STORAGE_KEY_API = "clawbot_api_config";
const STORAGE_KEY_MSGS = "clawbot_messages";

function loadApiConfig(): ApiConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_API);
    return raw
      ? { ...DEFAULT_API_CONFIG, ...(JSON.parse(raw) as ApiConfig) }
      : DEFAULT_API_CONFIG;
  } catch {
    return DEFAULT_API_CONFIG;
  }
}

function saveApiConfig(cfg: ApiConfig) {
  localStorage.setItem(STORAGE_KEY_API, JSON.stringify(cfg));
}

function loadMessages(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MSGS);
    if (!raw) return [];
    const msgs = JSON.parse(raw) as Array<{
      id: string;
      role: "user" | "bot";
      text: string;
      timestamp: string;
    }>;
    return msgs.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [];
  }
}

function saveMessages(msgs: Message[]) {
  localStorage.setItem(STORAGE_KEY_MSGS, JSON.stringify(msgs.slice(-50)));
}

// ─── Claw / Talon Animation ────────────────────────────────────────────────

function ClawAnimation({
  isActive,
  isTalking,
}: { isActive: boolean; isTalking: boolean }) {
  return (
    <div
      className="relative select-none flex items-center justify-center"
      style={{ width: 120, height: 120 }}
    >
      {/* Glow halo */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(220,38,38,0.25) 0%, rgba(255,215,0,0.1) 55%, transparent 80%)",
          animation: isTalking
            ? "haloFlare 0.5s ease-in-out infinite alternate"
            : "haloFlare 2.8s ease-in-out infinite alternate",
        }}
      />

      <svg
        viewBox="0 0 120 120"
        width="110"
        height="110"
        style={{ position: "relative", zIndex: 2, overflow: "visible" }}
        aria-label="ClawBot claw"
      >
        <title>ClawBot Claw</title>
        <defs>
          <linearGradient id="clawShell" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="55%" stopColor="#7f1d1d" />
            <stop offset="100%" stopColor="#3b0707" />
          </linearGradient>
          <linearGradient id="clawTip" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fca5a5" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient id="armGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b91c1c" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>
          <filter id="clawGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="tipGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Arm / wrist ── */}
        <rect
          x="46"
          y="88"
          width="28"
          height="24"
          rx="8"
          fill="url(#armGrad)"
          filter="url(#clawGlow)"
        />
        {/* wrist joint ring */}
        <ellipse cx="60" cy="88" rx="14" ry="5" fill="#dc2626" opacity="0.7" />
        <ellipse cx="60" cy="88" rx="9" ry="3" fill="#fca5a5" opacity="0.3" />

        {/* ── Left finger (upper jaw) ── */}
        <g
          style={{
            transformOrigin: "60px 88px",
            animation: isActive
              ? "leftJaw 1.8s ease-in-out infinite"
              : isTalking
                ? "leftJawTalk 0.5s ease-in-out infinite"
                : "leftJawIdle 3s ease-in-out infinite",
          }}
        >
          {/* finger body */}
          <path
            d="M52,88 Q44,68 36,44 Q34,38 40,36 Q46,34 50,40 L60,88 Z"
            fill="url(#clawShell)"
            filter="url(#clawGlow)"
          />
          {/* highlight stripe */}
          <path
            d="M54,86 Q48,70 43,50 Q42,46 46,45"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="2"
            fill="none"
          />
          {/* sharp tip */}
          <path
            d="M40,36 Q34,38 36,44 Q40,40 46,34 Z"
            fill="url(#clawTip)"
            filter="url(#tipGlow)"
          />
        </g>

        {/* ── Right finger (lower jaw) ── */}
        <g
          style={{
            transformOrigin: "60px 88px",
            animation: isActive
              ? "rightJaw 1.8s ease-in-out infinite"
              : isTalking
                ? "rightJawTalk 0.5s ease-in-out infinite"
                : "rightJawIdle 3s ease-in-out infinite",
          }}
        >
          {/* finger body */}
          <path
            d="M68,88 Q76,68 84,44 Q86,38 80,36 Q74,34 70,40 L60,88 Z"
            fill="url(#clawShell)"
            filter="url(#clawGlow)"
          />
          {/* highlight stripe */}
          <path
            d="M66,86 Q72,70 77,50 Q78,46 74,45"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="2"
            fill="none"
          />
          {/* sharp tip */}
          <path
            d="M80,36 Q86,38 84,44 Q80,40 74,34 Z"
            fill="url(#clawTip)"
            filter="url(#tipGlow)"
          />
        </g>

        {/* ── Center spine knuckle ── */}
        <ellipse cx="60" cy="70" rx="5" ry="8" fill="#dc2626" opacity="0.5" />

        {/* ── Status LED on wrist ── */}
        <circle
          cx="60"
          cy="105"
          r="4"
          fill={isTalking ? "#fca5a5" : "#dc2626"}
          filter="url(#clawGlow)"
          style={{
            animation: "ledPulse 1.5s ease-in-out infinite",
            transition: "fill 0.2s",
          }}
        />
        <circle
          cx="60"
          cy="105"
          r="2"
          fill="white"
          opacity={isTalking ? 0.9 : 0.3}
        />
      </svg>

      <style>{`
        @keyframes leftJaw {
          0%, 100% { transform: rotate(-5deg); }
          40%       { transform: rotate(-22deg); }
          60%       { transform: rotate(-8deg); }
        }
        @keyframes rightJaw {
          0%, 100% { transform: rotate(5deg); }
          40%       { transform: rotate(22deg); }
          60%       { transform: rotate(8deg); }
        }
        @keyframes leftJawTalk {
          0%, 100% { transform: rotate(-4deg); }
          50%       { transform: rotate(-18deg); }
        }
        @keyframes rightJawTalk {
          0%, 100% { transform: rotate(4deg); }
          50%       { transform: rotate(18deg); }
        }
        @keyframes leftJawIdle {
          0%, 100% { transform: rotate(-3deg); }
          50%       { transform: rotate(-8deg); }
        }
        @keyframes rightJawIdle {
          0%, 100% { transform: rotate(3deg); }
          50%       { transform: rotate(8deg); }
        }
        @keyframes haloFlare {
          0%   { opacity: 0.5; transform: scale(1); }
          100% { opacity: 1;   transform: scale(1.1); }
        }
        @keyframes ledPulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── API Switcher Card ─────────────────────────────────────────────────────

function ApiSwitchCard({
  name,
  icon,
  color,
  enabled,
  apiKey,
  onToggle,
  onKeyChange,
}: {
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
  apiKey: string;
  onToggle: () => void;
  onKeyChange: (key: string) => void;
}) {
  const [showKey, setShowKey] = useState(false);
  return (
    <div
      className="rounded-xl border p-3 transition-all"
      style={{
        background: enabled ? `${color}10` : "rgba(0,0,0,0.2)",
        borderColor: enabled ? `${color}50` : "rgba(255,255,255,0.07)",
        boxShadow: enabled ? `0 0 12px ${color}20` : "none",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <div>
            <p
              className="text-xs font-bold"
              style={{ color: enabled ? color : "rgba(255,255,255,0.5)" }}
            >
              {name}
            </p>
            <p
              className="text-[9px]"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              {enabled ? "Active · Brain enabled" : "Inactive"}
            </p>
          </div>
        </div>
        {/* Switch */}
        <button
          type="button"
          onClick={onToggle}
          className="relative w-10 h-5 rounded-full transition-all flex-shrink-0"
          style={{
            background: enabled ? color : "rgba(255,255,255,0.12)",
            boxShadow: enabled ? `0 0 8px ${color}60` : "none",
          }}
          aria-label={`Toggle ${name}`}
          data-ocid="clawbot.api.switch"
        >
          <span
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
            style={{
              left: enabled ? "calc(100% - 18px)" : "2px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
            }}
          />
        </button>
      </div>

      {/* API Key input */}
      {enabled && (
        <div className="flex items-center gap-1.5 mt-2">
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => onKeyChange(e.target.value)}
            placeholder={`${name} API key...`}
            className="flex-1 bg-black/30 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white/70 placeholder-white/20 outline-none focus:border-white/20"
            data-ocid="clawbot.api.input"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="text-xs px-1.5 py-1 rounded opacity-50 hover:opacity-100 transition-opacity"
            style={{ color: color }}
          >
            {showKey ? "●●" : "○○"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── ClawBot Main Component ────────────────────────────────────────────────

interface ClawBotProps {
  username: string;
}

export function ClawBot({ username }: ClawBotProps) {
  const botName = username ? `${username}-CLAW` : "ClawBot";
  const [apiConfig, setApiConfig] = useState<ApiConfig>(loadApiConfig);
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Welcome message on first load
  const botNameRef = useRef(botName);
  botNameRef.current = botName;
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length > 0) return prev;
      return [
        {
          id: crypto.randomUUID(),
          role: "bot" as const,
          text: `Hello! I'm ${botNameRef.current}, your personal AI claw assistant. I'm powered by OpenClaw.ai, ChatGPT, and Gemini. How can I help you today? 🦞`,
          timestamp: new Date(),
        },
      ];
    });
  }, []);

  // Auto-scroll + persist on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    saveMessages(messages);
  }, [messages]);

  // Persist API config
  useEffect(() => {
    saveApiConfig(apiConfig);
  }, [apiConfig]);

  // Autonomous idle behavior
  useEffect(() => {
    const idleActions = [
      "Analyzing your ClawPro data...",
      "Running system diagnostics...",
      "Scanning for integrations...",
      "Checking API status...",
      "All systems are operational! ✅",
      "I found 3 new optimizations for your setup.",
      "Your ClawPro rank is trending up! 📈",
    ];
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timeout = setTimeout(
        () => {
          if (Math.random() > 0.5) {
            const text =
              idleActions[Math.floor(Math.random() * idleActions.length)];
            const idleMsg: Message = {
              id: crypto.randomUUID(),
              role: "bot",
              text: `[Auto] ${text}`,
              timestamp: new Date(),
            };
            setIsTalking(true);
            setMessages((prev) => [...prev, idleMsg]);
            setTimeout(() => setIsTalking(false), 1500);
          }
          schedule();
        },
        15000 + Math.random() * 25000,
      );
    };
    schedule();
    return () => clearTimeout(timeout);
  }, []);

  const getActiveApiName = () => {
    if (apiConfig.chatgpt.enabled && apiConfig.chatgpt.key) return "ChatGPT";
    if (apiConfig.gemini.enabled && apiConfig.gemini.key) return "Gemini";
    if (apiConfig.openclaw.enabled) return "OpenClaw";
    return "OpenClaw";
  };

  const generateBotResponse = async (userText: string): Promise<string> => {
    const activeApi = getActiveApiName();
    const lower = userText.toLowerCase();

    if (apiConfig.chatgpt.enabled && apiConfig.chatgpt.key) {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiConfig.chatgpt.key}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `You are ${botName}, a claw AI assistant for ClawPro.ai. Be helpful and concise. Keep responses under 100 words.`,
              },
              { role: "user", content: userText },
            ],
            max_tokens: 150,
            temperature: 0.8,
          }),
        });
        const data = (await res.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        const reply = data.choices?.[0]?.message?.content;
        if (reply) return reply;
      } catch {
        // fall through
      }
    }

    if (apiConfig.gemini.enabled && apiConfig.gemini.key) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiConfig.gemini.key}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are ${botName}, a claw AI. Answer briefly: ${userText}`,
                    },
                  ],
                },
              ],
            }),
          },
        );
        const data = (await res.json()) as {
          candidates?: Array<{
            content?: { parts?: Array<{ text?: string }> };
          }>;
        };
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) return reply;
      } catch {
        // fall through
      }
    }

    if (
      lower.includes("hello") ||
      lower.includes("hi") ||
      lower.includes("hey")
    ) {
      return `Hello! I'm ${botName}. My claws are ready to help! 🦞 Powered by ${activeApi}.`;
    }
    if (lower.includes("status") || lower.includes("system")) {
      return `All ClawPro systems operational! APIs: ${
        [
          apiConfig.openclaw.enabled ? "OpenClaw" : null,
          apiConfig.chatgpt.enabled ? "ChatGPT" : null,
          apiConfig.gemini.enabled ? "Gemini" : null,
        ]
          .filter(Boolean)
          .join(", ") || "OpenClaw (default)"
      }. ✅`;
    }
    if (lower.includes("token") || lower.includes("balance")) {
      return "Your token balance is displayed in your Profile tab. Earn more by staying active on ClawPro! 💰";
    }
    if (lower.includes("rank") || lower.includes("leaderboard")) {
      return "Check your Rank tab to see your position on the ClawPro leaderboard! Top 3 earn bonus tokens. 🏆";
    }
    if (lower.includes("plan") || lower.includes("tier")) {
      return "ClawPro offers Silver ($9.99), Gold ($29.99), and Platinum ($79.99) plans. Each gives you tokens, integrations, and exclusive features! 💎";
    }
    if (lower.includes("help")) {
      return "I can help you with: account setup, API integrations, token balance, membership tiers, leaderboard, and general ClawPro questions. Just ask! 🦞";
    }
    return `I'm ${botName}, your ClawPro AI claw. Powered by ${activeApi}. Add a ChatGPT or Gemini API key in Settings for smarter responses! 🦞`;
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isThinking) return;
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);
    setIsActive(true);
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));
    const responseText = await generateBotResponse(text);
    const botMsg: Message = {
      id: crypto.randomUUID(),
      role: "bot",
      text: responseText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMsg]);
    setIsThinking(false);
    setIsTalking(true);
    setTimeout(() => setIsTalking(false), 2000);
  };

  const toggleApi = (key: keyof ApiConfig) => {
    setApiConfig((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
  };

  const updateApiKey = (apiKey: keyof ApiConfig, value: string) => {
    setApiConfig((prev) => ({
      ...prev,
      [apiKey]: { ...prev[apiKey], key: value },
    }));
  };

  return (
    <div
      className="rounded-2xl overflow-hidden border flex flex-col"
      style={{
        background: "linear-gradient(180deg, #0a0510 0%, #080318 100%)",
        borderColor: "rgba(220,38,38,0.25)",
        boxShadow: "0 0 30px rgba(220,38,38,0.08), 0 0 60px rgba(0,0,0,0.5)",
        minHeight: 500,
        maxHeight: 600,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(127,29,29,0.25), rgba(8,3,24,0.5))",
          borderColor: "rgba(220,38,38,0.2)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-base"
              style={{
                background: "radial-gradient(circle, #7f1d1d, #1a0505)",
                boxShadow: "0 0 10px rgba(220,38,38,0.4)",
              }}
            >
              🦞
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#080318]"
              style={{
                background: "#22c55e",
                boxShadow: "0 0 4px #22c55e",
                animation: "dotPulse 2s ease-in-out infinite",
              }}
            />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "#fca5a5" }}>
              {botName}
            </p>
            <p
              className="text-[9px]"
              style={{ color: "rgba(252,165,165,0.4)" }}
            >
              Powered by {getActiveApiName()} · Autonomous mode
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="text-xs px-2.5 py-1 rounded-lg border transition-all"
            style={{
              background: showSettings
                ? "rgba(220,38,38,0.2)"
                : "rgba(0,0,0,0.3)",
              borderColor: showSettings
                ? "rgba(220,38,38,0.5)"
                : "rgba(255,255,255,0.08)",
              color: showSettings ? "#fca5a5" : "rgba(255,255,255,0.4)",
            }}
            data-ocid="clawbot.settings.button"
          >
            ⚙️ Settings
          </button>
          <button
            type="button"
            onClick={() => {
              setMessages([]);
              localStorage.removeItem(STORAGE_KEY_MSGS);
            }}
            className="text-xs px-2 py-1 rounded-lg border transition-all"
            style={{
              background: "rgba(0,0,0,0.3)",
              borderColor: "rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div
          className="px-4 py-3 border-b flex-shrink-0"
          style={{
            background: "rgba(0,0,0,0.3)",
            borderColor: "rgba(220,38,38,0.12)",
          }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-3"
            style={{ color: "rgba(252,165,165,0.5)" }}
          >
            AI Brain Settings
          </p>
          <div className="grid grid-cols-1 gap-2">
            <ApiSwitchCard
              name="OpenClaw.ai"
              icon="🦞"
              color="#dc2626"
              enabled={apiConfig.openclaw.enabled}
              apiKey={apiConfig.openclaw.key}
              onToggle={() => toggleApi("openclaw")}
              onKeyChange={(k) => updateApiKey("openclaw", k)}
            />
            <ApiSwitchCard
              name="ChatGPT"
              icon="🤖"
              color="#10b981"
              enabled={apiConfig.chatgpt.enabled}
              apiKey={apiConfig.chatgpt.key}
              onToggle={() => toggleApi("chatgpt")}
              onKeyChange={(k) => updateApiKey("chatgpt", k)}
            />
            <ApiSwitchCard
              name="Gemini"
              icon="✨"
              color="#8b5cf6"
              enabled={apiConfig.gemini.enabled}
              apiKey={apiConfig.gemini.key}
              onToggle={() => toggleApi("gemini")}
              onKeyChange={(k) => updateApiKey("gemini", k)}
            />
          </div>
        </div>
      )}

      {/* Claw + Messages split */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Claw visual */}
        <div
          className="w-28 flex-shrink-0 flex flex-col items-center justify-start pt-4 gap-2 border-r hidden sm:flex"
          style={{
            borderColor: "rgba(220,38,38,0.12)",
            background: "rgba(127,29,29,0.05)",
          }}
        >
          <ClawAnimation
            isActive={isActive}
            isTalking={isTalking || isThinking}
          />
          <div className="flex flex-col gap-1 items-center">
            {[
              {
                label: "OpenClaw",
                en: apiConfig.openclaw.enabled,
                color: "#dc2626",
              },
              {
                label: "ChatGPT",
                en: apiConfig.chatgpt.enabled,
                color: "#10b981",
              },
              {
                label: "Gemini",
                en: apiConfig.gemini.enabled,
                color: "#8b5cf6",
              },
            ].map((api) => (
              <div key={api.label} className="flex items-center gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: api.en ? api.color : "rgba(255,255,255,0.15)",
                    boxShadow: api.en ? `0 0 4px ${api.color}` : "none",
                  }}
                />
                <span
                  className="text-[8px]"
                  style={{
                    color: api.en ? api.color : "rgba(255,255,255,0.2)",
                  }}
                >
                  {api.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Messages list */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            className="flex-1 overflow-y-auto px-3 py-3 space-y-2"
            style={{ scrollbarWidth: "none" }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed"
                  style={
                    msg.role === "user"
                      ? {
                          background:
                            "linear-gradient(135deg, rgba(220,38,38,0.35), rgba(127,29,29,0.5))",
                          color: "#fecdd3",
                          borderBottomRightRadius: 4,
                        }
                      : {
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(220,38,38,0.2)",
                          color: "rgba(255,255,255,0.8)",
                          borderBottomLeftRadius: 4,
                        }
                  }
                >
                  {msg.role === "bot" && (
                    <span
                      className="text-[9px] block mb-0.5 font-bold"
                      style={{ color: "rgba(252,165,165,0.5)" }}
                    >
                      {botName}
                    </span>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start">
                <div
                  className="rounded-2xl px-3 py-2 flex items-center gap-1.5 text-xs"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(220,38,38,0.2)",
                    color: "rgba(252,165,165,0.5)",
                    borderBottomLeftRadius: 4,
                  }}
                >
                  {[0, 0.2, 0.4].map((delay) => (
                    <span
                      key={delay}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: "#dc2626",
                        animation: `dotPulse 0.8s ease-in-out ${delay}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div
            className="flex items-center gap-2 px-3 py-2.5 border-t flex-shrink-0"
            style={{
              borderColor: "rgba(220,38,38,0.15)",
              background: "rgba(0,0,0,0.2)",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleSend();
                }
              }}
              placeholder={`Command ${botName}...`}
              className="flex-1 bg-black/30 border rounded-xl px-3 py-2 text-xs text-white/80 placeholder-white/20 outline-none transition-colors"
              style={{ borderColor: "rgba(220,38,38,0.2)" }}
              disabled={isThinking}
              data-ocid="clawbot.chat.input"
            />
            <button
              type="button"
              onClick={() => void handleSend()}
              disabled={isThinking || !input.trim()}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
              style={{
                background: input.trim()
                  ? "linear-gradient(135deg, #dc2626, #7f1d1d)"
                  : "rgba(255,255,255,0.05)",
                boxShadow: input.trim()
                  ? "0 0 10px rgba(220,38,38,0.4)"
                  : "none",
                color: input.trim() ? "white" : "rgba(255,255,255,0.2)",
              }}
              data-ocid="clawbot.chat.submit_button"
            >
              {isThinking ? (
                <span
                  className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full"
                  style={{ animation: "spin 0.8s linear infinite" }}
                />
              ) : (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M1 6l4-4 4 4M5 2v8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.5); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
