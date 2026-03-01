import {
  BookOpen,
  Bug,
  Github,
  Heart,
  MessageCircle,
  Twitter,
} from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="relative border-t border-border bg-card/50">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img
                src="/assets/generated/openclaw-logo-transparent.dim_256x256.png"
                alt="OpenClaw"
                className="w-8 h-8 object-contain"
              />
              <span className="font-display font-bold text-lg text-cyan">
                OpenClaw
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The ultimate claw configuration tool for developers and power
              users. Multi-platform, extensible, blockchain-powered.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-foreground">
              Resources
            </h3>
            <ul className="space-y-2.5">
              {[
                { icon: BookOpen, label: "Documentation", href: "#docs" },
                {
                  icon: Github,
                  label: "GitHub",
                  href: "https://github.com/openclaw/openclaw",
                },
                { icon: MessageCircle, label: "Discord Community", href: "#" },
                {
                  icon: Twitter,
                  label: "Twitter / X",
                  href: "https://x.com/openclaw",
                },
                {
                  icon: Bug,
                  label: "Bug Reports",
                  href: "https://github.com/openclaw/openclaw/issues",
                },
              ].map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-cyan transition-colors"
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
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </a>
                </li>
              ))}
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
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-glow-pulse" />
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>© {year} OpenClaw. Open source under MIT License.</p>
          <p className="flex items-center gap-1.5">
            Built with{" "}
            <Heart className="w-3.5 h-3.5 text-cyan fill-cyan animate-glow-pulse" />{" "}
            using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
