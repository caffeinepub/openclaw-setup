import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Key,
  Send,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────

interface OpenClawDashboardPanelProps {
  handle?: string;
}

type OCModel = "openclaw-base" | "openclaw-pro" | "openclaw-experimental";

const MODELS: {
  id: OCModel;
  label: string;
  desc: string;
  badge: string;
  color: string;
}[] = [
  {
    id: "openclaw-base",
    label: "Base",
    desc: "Fast & efficient",
    badge: "FREE",
    color: "#00e5c7",
  },
  {
    id: "openclaw-pro",
    label: "Pro",
    desc: "Smarter reasoning",
    badge: "PRO",
    color: "#ff7043",
  },
  {
    id: "openclaw-experimental",
    label: "Experimental",
    desc: "Bleeding edge 🧪",
    badge: "β",
    color: "#8b5cf6",
  },
];

const OS_INTEGRATIONS = [
  { os: "Android", icon: "🤖", color: "#00ff88" },
  { os: "Windows", icon: "🪟", color: "#0078ff" },
  { os: "macOS", icon: "🍎", color: "#c8c8c8" },
  { os: "Linux", icon: "🐧", color: "#ff6a00" },
];

const CODE_SNIPPETS: Record<string, string> = {
  Android: `// Android (Kotlin)
val client = OpenClawClient(apiKey = "YOUR_KEY")
client.chat("Hello from Android!")`,
  Windows: `// Windows (PowerShell)\n$headers = @{"Authorization" = "Bearer YOUR_KEY"}\nInvoke-RestMethod -Uri https://api.openclaw.ai/v1/chat -Headers $headers`,
  macOS: `# macOS (Terminal)\ncurl -H "Authorization: Bearer YOUR_KEY" \\\n  https://api.openclaw.ai/v1/chat \\\n  -d '{"message": "Hello!"}'`,
  Linux: `# Linux\ncurl -H "Authorization: Bearer YOUR_KEY" \\\n  https://api.openclaw.ai/v1/chat \\\n  -d '{"message": "Hello from Linux!"}'`,
};

const STATS_KEY = "openclaw_dashboard_stats";

function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw
      ? (JSON.parse(raw) as { calls: number; lastUsed: string | null })
      : { calls: 0, lastUsed: null };
  } catch {
    return { calls: 0, lastUsed: null };
  }
}

function saveStats(s: { calls: number; lastUsed: string | null }) {
  localStorage.setItem(STATS_KEY, JSON.stringify(s));
}

// ── Main Component ────────────────────────────────────────────────────────

export function OpenClawDashboardPanel({
  handle,
}: OpenClawDashboardPanelProps) {
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("openclaw_api_key") ?? "",
  );
  const [showKey, setShowKey] = useState(false);
  const [savedKey, setSavedKey] = useState(
    () => !!localStorage.getItem("openclaw_api_key"),
  );
  const [model, setModel] = useState<OCModel>("openclaw-base");
  const [testPrompt, setTestPrompt] = useState("");
  const [testResult, setTestResult] = useState("");
  const [testing, setTesting] = useState(false);
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">(
    "checking",
  );
  const [expandedOs, setExpandedOs] = useState<string | null>(null);
  const [stats, setStats] = useState(loadStats);
  const [copiedOs, setCopiedOs] = useState<string | null>(null);

  // Check API status
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        await fetch("https://openclaw.ai", { method: "HEAD", mode: "no-cors" });
        if (!cancelled) setApiStatus("online");
      } catch {
        if (!cancelled) setApiStatus("offline");
      }
    };
    void check();
    const interval = setInterval(() => void check(), 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const handleSaveKey = () => {
    localStorage.setItem("openclaw_api_key", apiKey);
    setSavedKey(true);
    toast.success("OpenClaw API key saved!");
  };

  const handleTestApi = async () => {
    if (!testPrompt.trim()) return;
    setTesting(true);
    setTestResult("");

    const key = localStorage.getItem("openclaw_api_key") ?? "";
    const newStats = {
      calls: stats.calls + 1,
      lastUsed: new Date().toISOString(),
    };
    setStats(newStats);
    saveStats(newStats);

    if (key) {
      try {
        const res = await fetch("https://api.openclaw.ai/v1/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({ message: testPrompt, model }),
        });
        const data = (await res.json()) as {
          response?: string;
          message?: string;
          error?: string;
        };
        setTestResult(
          data.response ?? data.message ?? JSON.stringify(data, null, 2),
        );
      } catch {
        setTestResult(
          `[Demo Response]\nHello from OpenClaw ${model}! 🦞\nYou said: "${testPrompt}"\n\n(Add a real API key for live responses)`,
        );
      }
    } else {
      await new Promise((r) => setTimeout(r, 800));
      setTestResult(
        `[Demo Response]\nHello from OpenClaw ${model}! 🦞\nYou said: "${testPrompt}"\n\n(Add your API key above for live responses)`,
      );
    }
    setTesting(false);
  };

  const copySnippet = (os: string) => {
    void navigator.clipboard.writeText(CODE_SNIPPETS[os] ?? "");
    setCopiedOs(os);
    setTimeout(() => setCopiedOs(null), 2000);
    toast.success(`Copied ${os} snippet!`);
  };

  return (
    <div className="flex flex-col gap-5 pb-6">
      <style>{`
        @keyframes oc-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes oc-slide-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div
        className="rounded-2xl border p-5 flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, #0d0805 0%, #120a06 100%)",
          borderColor: "rgba(255,112,67,0.3)",
          boxShadow: "0 0 24px rgba(255,112,67,0.08)",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{
              background:
                "radial-gradient(circle, rgba(255,112,67,0.2), rgba(0,0,0,0.5))",
              boxShadow: "0 0 20px rgba(255,112,67,0.3)",
              border: "1px solid rgba(255,112,67,0.3)",
            }}
          >
            🦞
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: "#ff7043" }}>
              OpenClaw API
            </h2>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
              {handle
                ? `Connected as @${handle}`
                : "Your AI-powered claw engine"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {apiStatus === "checking" && (
            <Badge
              variant="outline"
              className="text-xs"
              style={{
                borderColor: "rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5 inline-block" />
              Checking...
            </Badge>
          )}
          {apiStatus === "online" && (
            <Badge
              variant="outline"
              className="text-xs"
              style={{
                borderColor: "rgba(0,229,199,0.4)",
                color: "#00e5c7",
                background: "rgba(0,229,199,0.08)",
              }}
            >
              <Wifi className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          )}
          {apiStatus === "offline" && (
            <Badge
              variant="outline"
              className="text-xs"
              style={{
                borderColor: "rgba(255,100,100,0.4)",
                color: "#ff6464",
                background: "rgba(255,100,100,0.08)",
              }}
            >
              <WifiOff className="w-3 h-3 mr-1" />
              Offline
            </Badge>
          )}
        </div>
      </div>

      {/* API Key Section */}
      <div
        className="rounded-2xl border p-5"
        style={{
          background: "rgba(10, 15, 26, 0.9)",
          borderColor: "rgba(255,112,67,0.2)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Key className="w-4 h-4" style={{ color: "#ff7043" }} />
          <span
            className="text-sm font-bold"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            API Key
          </span>
          {savedKey && (
            <Badge
              variant="outline"
              className="text-[10px] ml-auto"
              style={{ borderColor: "rgba(0,229,199,0.4)", color: "#00e5c7" }}
            >
              ✓ Saved
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="oc-xxxxxxxxxxxxxxxxxxxxxxxx"
            className="flex-1 rounded-xl px-3 py-2.5 text-sm font-mono outline-none transition-all"
            style={{
              background: "rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,112,67,0.2)",
              color: "rgba(255,255,255,0.7)",
            }}
            data-ocid="openclaw.api.input"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="px-3 rounded-xl text-xs transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            {showKey ? "Hide" : "Show"}
          </button>
          <button
            type="button"
            onClick={handleSaveKey}
            disabled={!apiKey.trim()}
            className="px-4 rounded-xl text-sm font-bold transition-all"
            style={{
              background: apiKey.trim()
                ? "linear-gradient(135deg, #ff7043, #ff4500)"
                : "rgba(255,255,255,0.05)",
              border: "1px solid transparent",
              color: apiKey.trim() ? "#fff" : "rgba(255,255,255,0.2)",
              boxShadow: apiKey.trim()
                ? "0 0 12px rgba(255,112,67,0.3)"
                : "none",
            }}
            data-ocid="openclaw.api.save_button"
          >
            Save
          </button>
        </div>
        <p
          className="text-[10px] mt-2"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          Get your API key at{" "}
          <a
            href="https://openclaw.ai"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#ff7043" }}
          >
            openclaw.ai
          </a>
        </p>
      </div>

      {/* Model Selector */}
      <div
        className="rounded-2xl border p-5"
        style={{
          background: "rgba(10, 15, 26, 0.9)",
          borderColor: "rgba(255,112,67,0.2)",
        }}
      >
        <p
          className="text-sm font-bold mb-3"
          style={{ color: "rgba(255,255,255,0.8)" }}
        >
          Model
        </p>
        <div className="flex flex-wrap gap-2">
          {MODELS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setModel(m.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
              style={{
                background:
                  model === m.id ? `${m.color}18` : "rgba(255,255,255,0.04)",
                border: `1px solid ${
                  model === m.id ? `${m.color}60` : "rgba(255,255,255,0.08)"
                }`,
                color: model === m.id ? m.color : "rgba(255,255,255,0.45)",
                boxShadow: model === m.id ? `0 0 10px ${m.color}20` : "none",
              }}
              data-ocid="openclaw.model.toggle"
            >
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{
                  background: `${m.color}25`,
                  color: m.color,
                  border: `1px solid ${m.color}40`,
                }}
              >
                {m.badge}
              </span>
              <span>
                <span className="font-semibold">{m.label}</span>
                <span className="text-[10px] ml-1.5 opacity-60">{m.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Test */}
      <div
        className="rounded-2xl border p-5"
        style={{
          background: "rgba(10, 15, 26, 0.9)",
          borderColor: "rgba(255,112,67,0.2)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4" style={{ color: "#ff7043" }} />
          <span
            className="text-sm font-bold"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            Quick Test
          </span>
          <span
            className="text-[10px] ml-auto"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Model: {model}
          </span>
        </div>
        <textarea
          value={testPrompt}
          onChange={(e) => setTestPrompt(e.target.value)}
          placeholder="Type a prompt to test the API..."
          rows={2}
          className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none mb-2"
          style={{
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,112,67,0.2)",
            color: "rgba(255,255,255,0.7)",
          }}
          data-ocid="openclaw.test.textarea"
        />
        <button
          type="button"
          onClick={() => void handleTestApi()}
          disabled={!testPrompt.trim() || testing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
          style={{
            background: testPrompt.trim()
              ? "linear-gradient(135deg, #ff7043, #ff4500)"
              : "rgba(255,255,255,0.05)",
            color: testPrompt.trim() ? "#fff" : "rgba(255,255,255,0.2)",
            boxShadow: testPrompt.trim()
              ? "0 0 14px rgba(255,112,67,0.3)"
              : "none",
            border: "1px solid transparent",
          }}
          data-ocid="openclaw.test.submit_button"
        >
          {testing ? (
            <span
              className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
              style={{ animation: "spin 0.8s linear infinite" }}
            />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          {testing ? "Testing..." : "Test API"}
        </button>
        {testResult && (
          <div
            className="mt-3 rounded-xl p-3 font-mono text-xs whitespace-pre-wrap"
            style={{
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(0,229,199,0.15)",
              color: "#00e5c7",
              animation: "oc-slide-in 0.3s ease",
            }}
            data-ocid="openclaw.test.success_state"
          >
            {testResult}
          </div>
        )}
      </div>

      {/* Usage Stats */}
      <div
        className="rounded-2xl border p-5"
        style={{
          background: "rgba(10, 15, 26, 0.9)",
          borderColor: "rgba(255,112,67,0.2)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4" style={{ color: "#ff7043" }} />
          <span
            className="text-sm font-bold"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            Usage Stats
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-xl p-3 text-center"
            style={{
              background: "rgba(255,112,67,0.08)",
              border: "1px solid rgba(255,112,67,0.2)",
            }}
            data-ocid="openclaw.stats.card"
          >
            <p className="text-2xl font-black" style={{ color: "#ff7043" }}>
              {stats.calls}
            </p>
            <p
              className="text-[10px] mt-0.5"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              API Calls
            </p>
          </div>
          <div
            className="rounded-xl p-3 text-center"
            style={{
              background: "rgba(0,229,199,0.06)",
              border: "1px solid rgba(0,229,199,0.15)",
            }}
          >
            <p className="text-xs font-bold" style={{ color: "#00e5c7" }}>
              {stats.lastUsed
                ? new Date(stats.lastUsed).toLocaleDateString()
                : "Never"}
            </p>
            <p
              className="text-[10px] mt-0.5"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Last Used
            </p>
          </div>
        </div>
      </div>

      {/* OS Integration Status */}
      <div
        className="rounded-2xl border p-5"
        style={{
          background: "rgba(10, 15, 26, 0.9)",
          borderColor: "rgba(255,112,67,0.2)",
        }}
      >
        <p
          className="text-sm font-bold mb-3"
          style={{ color: "rgba(255,255,255,0.8)" }}
        >
          Platform Integration Status
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {OS_INTEGRATIONS.map((item) => (
            <div
              key={item.os}
              className="rounded-xl p-3 text-center"
              style={{
                background: `${item.color}10`,
                border: `1px solid ${item.color}30`,
              }}
            >
              <div className="text-xl mb-1">{item.icon}</div>
              <p className="text-xs font-bold" style={{ color: item.color }}>
                {item.os}
              </p>
              <div
                className="flex items-center justify-center gap-1 mt-1"
                style={{ color: "#22c55e" }}
              >
                <Check className="w-3 h-3" />
                <span className="text-[9px] font-bold">Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How to Integrate */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "rgba(10, 15, 26, 0.9)",
          borderColor: "rgba(255,112,67,0.2)",
        }}
      >
        <div className="p-5">
          <p
            className="text-sm font-bold"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            How to Integrate
          </p>
          <p
            className="text-[11px] mt-0.5"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Code snippets for each platform
          </p>
        </div>
        <div
          className="border-t"
          style={{ borderColor: "rgba(255,112,67,0.1)" }}
        >
          {OS_INTEGRATIONS.map((item) => (
            <div
              key={item.os}
              className="border-b last:border-b-0"
              style={{ borderColor: "rgba(255,112,67,0.08)" }}
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedOs(expandedOs === item.os ? null : item.os)
                }
                className="w-full flex items-center justify-between px-5 py-3 transition-all"
                style={{
                  color:
                    expandedOs === item.os
                      ? item.color
                      : "rgba(255,255,255,0.5)",
                  background:
                    expandedOs === item.os ? `${item.color}08` : "transparent",
                }}
                data-ocid="openclaw.integration.toggle"
              >
                <div className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span className="text-sm font-semibold">{item.os}</span>
                </div>
                {expandedOs === item.os ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {expandedOs === item.os && (
                <div
                  className="px-5 pb-4"
                  style={{ animation: "oc-slide-in 0.25s ease" }}
                >
                  <div
                    className="relative rounded-xl p-4 font-mono text-xs whitespace-pre-wrap"
                    style={{
                      background: "rgba(0,0,0,0.5)",
                      border: `1px solid ${item.color}20`,
                      color: "#00e5c7",
                    }}
                  >
                    {CODE_SNIPPETS[item.os]}
                    <button
                      type="button"
                      onClick={() => copySnippet(item.os)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg transition-all"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        color:
                          copiedOs === item.os
                            ? "#22c55e"
                            : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {copiedOs === item.os ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
