import {
  BookOpen,
  Bug,
  Github,
  MessageCircle,
  Sparkles,
  Twitter,
} from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative border-t border-border bg-card/50"
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

      {/* Walking Claw Robot — strictly follows border */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <style>{`
              @keyframes footerLogoShimmer {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
              }
              @keyframes footerLogoFloat {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-3px); }
              }
              @keyframes footerLogoGlow {
                0%, 100% { filter: drop-shadow(0 0 5px rgba(0,198,255,0.55)) drop-shadow(0 0 12px rgba(124,58,237,0.3)); }
                50% { filter: drop-shadow(0 0 12px rgba(0,198,255,0.9)) drop-shadow(0 0 26px rgba(124,58,237,0.6)) drop-shadow(0 0 40px rgba(245,158,11,0.35)); }
              }
            `}</style>
            <div className="flex items-center gap-3 mb-3">
              <div
                style={{
                  animation:
                    "footerLogoFloat 3s ease-in-out infinite, footerLogoGlow 3s ease-in-out infinite",
                  display: "inline-flex",
                  alignItems: "baseline",
                  gap: "1px",
                }}
              >
                <span
                  className="font-black leading-none select-none"
                  style={{
                    fontSize: "1.5rem",
                    background:
                      "linear-gradient(90deg, #a8bcc8 0%, #00c6ff 12%, #ffffff 28%, #f59e0b 44%, #7c3aed 60%, #00c6ff 76%, #ffffff 90%, #a8bcc8 100%)",
                    backgroundSize: "300% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    animation: "footerLogoShimmer 3s linear infinite",
                  }}
                >
                  ClawPro
                </span>
                <span
                  className="font-bold leading-none select-none"
                  style={{
                    fontSize: "0.8rem",
                    background:
                      "linear-gradient(90deg, #f59e0b 0%, #00c6ff 50%, #a78bfa 100%)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    animation: "footerLogoShimmer 2.5s linear infinite",
                  }}
                >
                  .ai
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The world's most advanced AI claw system — automate, integrate,
              and dominate with ClawPro.
            </p>
          </div>

          {/* Links */}
          <div>
            <style>{`
              @keyframes footerSepShift {
                0%   { background-position: 0% 50%; opacity: 0.55; }
                50%  { background-position: 100% 50%; opacity: 1; }
                100% { background-position: 0% 50%; opacity: 0.55; }
              }
              @keyframes footerBarPulse {
                0%, 100% { transform: scaleY(1); opacity: 0.7; }
                50% { transform: scaleY(1.6); opacity: 1; }
              }
              @keyframes footerIconGlow {
                0%, 100% { filter: drop-shadow(0 0 3px currentColor); }
                50% { filter: drop-shadow(0 0 8px currentColor) drop-shadow(0 0 16px currentColor); }
              }
            `}</style>
            <h3 className="font-semibold text-sm mb-4 text-foreground">
              Resources
            </h3>
            <ul className="space-y-0">
              {[
                {
                  icon: BookOpen,
                  label: "Documentation",
                  href: "#docs",
                  grad: "linear-gradient(90deg, #00c6ff, #0072ff, #00c6ff)",
                  iconColor: "#00c6ff",
                  delay: "0s",
                },
                {
                  icon: Github,
                  label: "GitHub",
                  href: "https://github.com/clawpro/clawpro",
                  grad: "linear-gradient(90deg, #c0ccd8, #ffffff, #a8b8c8, #ffffff, #c0ccd8)",
                  iconColor: "#d0dce8",
                  delay: "0.4s",
                },
                {
                  icon: MessageCircle,
                  label: "Discord Community",
                  href: "#",
                  grad: "linear-gradient(90deg, #7c3aed, #a855f7, #7c3aed)",
                  iconColor: "#a855f7",
                  delay: "0.8s",
                },
                {
                  icon: Twitter,
                  label: "Twitter / X",
                  href: "https://x.com/clawpro",
                  grad: "linear-gradient(90deg, #1da1f2, #38bdf8, #1da1f2)",
                  iconColor: "#38bdf8",
                  delay: "1.2s",
                },
                {
                  icon: Bug,
                  label: "Bug Reports",
                  href: "https://github.com/clawpro/clawpro/issues",
                  grad: "linear-gradient(90deg, #f59e0b, #fbbf24, #f97316, #fbbf24, #f59e0b)",
                  iconColor: "#f59e0b",
                  delay: "1.6s",
                },
              ].map(({ icon: Icon, label, href, grad, iconColor, delay }) => (
                <li key={label} className="relative">
                  <div
                    style={{
                      height: "1.5px",
                      background: grad,
                      backgroundSize: "200% 100%",
                      animation: "footerSepShift 3s ease-in-out infinite",
                      animationDelay: delay,
                      boxShadow: `0 0 5px ${iconColor}88, 0 0 10px ${iconColor}44`,
                      borderRadius: "1px",
                    }}
                  />
                  <a
                    href={href}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-all py-2 px-1 group"
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    onClick={
                      href.startsWith("#")
                        ? (e) => {
                            e.preventDefault();
                            document
                              .querySelector(href)
                              ?.scrollIntoView({ behavior: "smooth" });
                          }
                        : undefined
                    }
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "3px",
                        height: "16px",
                        borderRadius: "2px",
                        background: grad,
                        backgroundSize: "100% 200%",
                        animation: "footerBarPulse 3s ease-in-out infinite",
                        animationDelay: delay,
                        flexShrink: 0,
                        boxShadow: `0 0 6px ${iconColor}99`,
                      }}
                    />
                    <Icon
                      className="w-3.5 h-3.5 flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                      style={{
                        color: iconColor,
                        animation: "footerIconGlow 3s ease-in-out infinite",
                        animationDelay: delay,
                      }}
                    />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {label}
                    </span>
                  </a>
                </li>
              ))}
              <li>
                <div
                  style={{
                    height: "1.5px",
                    background:
                      "linear-gradient(90deg, #00c6ff, #7c3aed, #f59e0b, #00c6ff)",
                    backgroundSize: "300% 100%",
                    animation: "footerSepShift 4s ease-in-out infinite",
                    boxShadow:
                      "0 0 6px rgba(0,198,255,0.5), 0 0 12px rgba(124,58,237,0.3)",
                    borderRadius: "1px",
                  }}
                />
              </li>
            </ul>
          </div>

          {/* Status */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-foreground">
              Platform Status
            </h3>
            <div className="space-y-2">
              {[
                { label: "API", status: "Operational" },
                { label: "Cloud Sync", status: "Operational" },
                { label: "Plugin Registry", status: "Operational" },
              ].map(({ label, status }) => (
                <div
                  key={label}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="flex items-center gap-1.5 text-green-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>© {year} ClawPro.ai — All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <Sparkles
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{
                color: "#f59e0b",
                filter: "drop-shadow(0 0 4px #f59e0b)",
              }}
            />
            Powered by{" "}
            <a
              href="https://andri.id"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background:
                  "linear-gradient(90deg, #00c6ff, #f59e0b, #a78bfa, #00c6ff)",
                backgroundSize: "300% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "footerLogoShimmer 3s linear infinite",
                fontWeight: 700,
                letterSpacing: "0.01em",
                textDecoration: "none",
                transition: "filter 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.filter =
                  "drop-shadow(0 0 8px rgba(0,198,255,0.7))";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.filter = "none";
              }}
            >
              andri.id
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
