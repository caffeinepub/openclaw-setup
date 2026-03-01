import { DotsBackground } from "@/components/DotsBackground";
import { useLanguage } from "@/i18n/LanguageContext";
// Pre-footer section: ClawPro.ai brand + partner logos + app download badges
import React from "react";

function OpenClawLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size * 3.2}
      height={size}
      viewBox="0 0 96 32"
      fill="none"
      role="img"
      aria-label="OpenClaw.ai"
    >
      <title>OpenClaw.ai</title>
      {/* Claw icon */}
      <path
        d="M8 24 C6 20 4 16 6 12 C8 8 12 7 14 10 C15 12 14 15 12 16"
        stroke="url(#oc-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M12 24 C11 20 10 16 12 12 C13 9 16 8 17 11 C18 13 17 16 15 17"
        stroke="url(#oc-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M16 24 C16 20 16 16 18 12 C19 9 22 9 22 12 C22 14 21 17 19 18"
        stroke="url(#oc-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <defs>
        <linearGradient id="oc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e0e8f0" />
          <stop offset="100%" stopColor="#c0ccd8" />
        </linearGradient>
      </defs>
      {/* Text */}
      <text
        x="28"
        y="20"
        fill="url(#silver-text)"
        fontSize="11"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.3"
      >
        OpenClaw.ai
      </text>
      <defs>
        <linearGradient id="silver-text" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#d0dbe8" />
          <stop offset="100%" stopColor="#a8b8c8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function OpenAILogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size * 3}
      height={size}
      viewBox="0 0 90 32"
      fill="none"
      role="img"
      aria-label="OpenAI.ai"
    >
      <title>OpenAI.ai</title>
      {/* OpenAI swirl icon simplified */}
      <g transform="translate(2, 4)">
        <path
          d="M12 2C7.029 2 3 6.03 3 11c0 2.387.945 4.557 2.482 6.163L4 22l5.123-1.462A8.945 8.945 0 0 0 12 21c4.971 0 9-4.03 9-9s-4.029-9-9-9z"
          fill="url(#oai-grad)"
          opacity="0.9"
        />
        <path
          d="M12 6.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z"
          fill="#0a0a0a"
          opacity="0.8"
        />
        <defs>
          <linearGradient id="oai-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#b0c0d0" />
          </linearGradient>
        </defs>
      </g>
      <text
        x="30"
        y="20"
        fill="url(#silver-oai)"
        fontSize="11"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.3"
      >
        OpenAI.ai
      </text>
      <defs>
        <linearGradient id="silver-oai" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#d0dbe8" />
          <stop offset="100%" stopColor="#a8b8c8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ChatGPTLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size * 3.2}
      height={size}
      viewBox="0 0 96 32"
      fill="none"
      role="img"
      aria-label="ChatGPT.ai"
    >
      <title>ChatGPT.ai</title>
      <g transform="translate(2, 5)">
        <circle cx="11" cy="11" r="9" fill="url(#gpt-circ)" opacity="0.9" />
        <path
          d="M11 5a6 6 0 0 1 5.196 9H5.804A6 6 0 0 1 11 5z"
          fill="#0a0a0a"
          opacity="0.4"
        />
        <path
          d="M7 11h8M11 7v8"
          stroke="#0a0a0a"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
        <defs>
          <linearGradient id="gpt-circ" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#a8bac8" />
          </linearGradient>
        </defs>
      </g>
      <text
        x="30"
        y="20"
        fill="url(#silver-gpt)"
        fontSize="11"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.3"
      >
        ChatGPT.ai
      </text>
      <defs>
        <linearGradient id="silver-gpt" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#d0dbe8" />
          <stop offset="100%" stopColor="#a8b8c8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function GithubLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size * 2.8}
      height={size}
      viewBox="0 0 84 32"
      fill="none"
      role="img"
      aria-label="GitHub"
    >
      <title>GitHub</title>
      <g transform="translate(2, 4)">
        <path
          d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z"
          fill="url(#gh-grad)"
        />
        <defs>
          <linearGradient id="gh-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#b0c0d0" />
          </linearGradient>
        </defs>
      </g>
      <text
        x="34"
        y="20"
        fill="url(#silver-gh)"
        fontSize="11"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
        letterSpacing="0.3"
      >
        GitHub
      </text>
      <defs>
        <linearGradient id="silver-gh" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#d0dbe8" />
          <stop offset="100%" stopColor="#a8b8c8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function PlayStoreBadge() {
  return (
    <a
      href="https://play.google.com/store"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get it on Google Play"
      className="inline-flex items-center gap-3 px-5 py-3 min-w-[160px] rounded-xl border border-white/20 bg-black hover:scale-105 transition-all duration-200 hover:border-white/30 hover:brightness-110"
    >
      {/* Official Google Play icon - 4 colored triangles */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        role="img"
        aria-label="Google Play"
      >
        <title>Google Play</title>
        {/* top-left cyan */}
        <path d="M3 1.5L13.5 12L3 22.5V1.5z" fill="#00d4aa" />
        {/* bottom-left green */}
        <path d="M3 22.5L16.5 15.5L13.5 12L3 22.5z" fill="#5ef86b" />
        {/* top-right yellow */}
        <path d="M3 1.5L13.5 12L16.5 8.5L3 1.5z" fill="#ffca28" />
        {/* center-right red */}
        <path d="M13.5 12L16.5 8.5L21 10.8L16.5 15.5L13.5 12z" fill="#f04747" />
      </svg>
      <div className="text-left">
        <div className="text-[9px] text-white/70 leading-none mb-0.5 tracking-wide uppercase">
          GET IT ON
        </div>
        <div className="text-sm font-bold leading-none text-white">
          Google Play
        </div>
      </div>
    </a>
  );
}

function AppStoreBadge() {
  return (
    <a
      href="https://apps.apple.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download on the App Store"
      className="inline-flex items-center gap-3 px-5 py-3 min-w-[160px] rounded-xl border border-white/20 bg-black hover:scale-105 transition-all duration-200 hover:border-white/30 hover:brightness-110"
    >
      {/* Official Apple logo */}
      <svg
        width="24"
        height="28"
        viewBox="0 0 814 1000"
        fill="none"
        role="img"
        aria-label="App Store"
      >
        <title>App Store</title>
        <path
          d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 405.8 0 304.8 0 212.7c0-130.3 84.3-199.2 167.5-199.2 58.6 0 107.4 43.4 143.8 43.4 34.4 0 92.5-46.1 159.3-46.1 25.4 0 108.2 4.5 179.7 77 0 0 10.2 10.9 10.2 10.9zm-88.8-219.7c0 71.4-36.4 154.5-79.4 204.7-42.8 49.3-100.7 91.1-168.7 91.1-7.7 0-15.4-.6-23.2-1.3 0-1.3-.3-3.2-.3-4.5 0-72.7 36.4-152.9 81.7-204.7 43.5-49.3 115.4-93.7 181-93.7 7.7 0 15.4.6 23.1 1.3.3 2.4 1.9 5.8 1.9 7.2l-16.1-.1z"
          fill="#ffffff"
        />
      </svg>
      <div className="text-left">
        <div className="text-[9px] text-white/70 leading-none mb-0.5 tracking-wide">
          Download on the
        </div>
        <div className="text-sm font-bold leading-none text-white">
          App Store
        </div>
      </div>
    </a>
  );
}

interface EmailSubscribeFormProps {
  placeholder: string;
  subscribeLabel: string;
  successMsg: string;
  errorMsg: string;
}

function EmailSubscribeForm({
  placeholder,
  subscribeLabel,
  successMsg,
  errorMsg,
}: EmailSubscribeFormProps) {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "success" | "error">(
    "idle",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setStatus("idle");
          }}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all duration-200"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap"
          style={{
            background: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)",
            color: "#fff",
          }}
        >
          {subscribeLabel}
        </button>
      </form>
      {status === "success" && (
        <p className="mt-3 text-sm text-cyan-400 text-center">✓ {successMsg}</p>
      )}
      {status === "error" && (
        <p className="mt-3 text-sm text-red-400 text-center">{errorMsg}</p>
      )}
    </div>
  );
}

export function PartnerSection() {
  const { t } = useLanguage();

  return (
    <section className="relative py-16 overflow-hidden">
      <DotsBackground />
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main brand title */}
        <div className="mb-8">
          <h2
            className="text-4xl sm:text-5xl font-black tracking-tight mb-2"
            style={{
              background:
                "linear-gradient(180deg, #ffffff 0%, #e0eaf4 40%, #a8bcc8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ClawPro.ai
          </h2>
          <p className="text-sm text-white/40 tracking-widest uppercase font-medium">
            Powered by the world's best
          </p>
        </div>

        {/* Partner logos row */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
          <div className="flex items-center opacity-70 hover:opacity-100 transition-opacity duration-200">
            <OpenClawLogo size={30} />
          </div>
          <div className="w-px h-6 bg-white/10 hidden sm:block" />
          <div className="flex items-center opacity-70 hover:opacity-100 transition-opacity duration-200">
            <OpenAILogo size={30} />
          </div>
          <div className="w-px h-6 bg-white/10 hidden sm:block" />
          <div className="flex items-center opacity-70 hover:opacity-100 transition-opacity duration-200">
            <ChatGPTLogo size={30} />
          </div>
          <div className="w-px h-6 bg-white/10 hidden sm:block" />
          <div className="flex items-center opacity-70 hover:opacity-100 transition-opacity duration-200">
            <GithubLogo size={30} />
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
          <span className="text-xs text-white/30 uppercase tracking-widest font-medium px-2">
            Available on
          </span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
        </div>

        {/* App store badges */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <PlayStoreBadge />
          <AppStoreBadge />
        </div>

        {/* Email Subscribe */}
        <div className="mt-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
            <span className="text-xs text-white/30 uppercase tracking-widest font-medium px-2">
              {t.partner.stayUpdated}
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
          </div>
          <p className="text-sm text-white/50 mb-4">
            {t.partner.stayUpdatedDesc}
          </p>
          <EmailSubscribeForm
            placeholder={t.partner.emailPlaceholder}
            subscribeLabel={t.partner.subscribe}
            successMsg={t.partner.successMsg}
            errorMsg={t.partner.errorMsg}
          />
        </div>
      </div>
    </section>
  );
}
