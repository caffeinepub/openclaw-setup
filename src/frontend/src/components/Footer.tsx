import {
  BookOpen,
  Bug,
  Github,
  Heart,
  MessageCircle,
  Twitter,
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { DotsBackground } from "./DotsBackground";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;
  const { t } = useLanguage();

  return (
    <footer className="relative border-t border-border bg-card/50 overflow-hidden">
      <DotsBackground />
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img
                src="/assets/generated/clawpro-logo-navbar-transparent.dim_480x120.png"
                alt="ClawPro"
                className="h-8 w-auto object-contain"
                style={{
                  filter:
                    "drop-shadow(0 0 6px rgba(220, 38, 38, 0.3)) drop-shadow(0 0 8px rgba(0, 212, 255, 0.2))",
                }}
              />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t.footer.description}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-foreground">
              {t.footer.resources}
            </h3>
            <ul className="space-y-2.5">
              {[
                {
                  icon: BookOpen,
                  label: t.footer.documentation,
                  href: "#docs",
                },
                {
                  icon: Github,
                  label: "GitHub",
                  href: "https://github.com/clawpro/clawpro",
                },
                {
                  icon: MessageCircle,
                  label: t.footer.discordCommunity,
                  href: "#",
                },
                {
                  icon: Twitter,
                  label: "Twitter / X",
                  href: "https://x.com/clawpro",
                },
                {
                  icon: Bug,
                  label: t.footer.bugReports,
                  href: "https://github.com/clawpro/clawpro/issues",
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
              {t.footer.platformStatus}
            </h3>
            <div className="space-y-2">
              {[
                { label: t.footer.api, status: t.footer.operational },
                { label: t.footer.cloudSync, status: t.footer.operational },
                {
                  label: t.footer.pluginRegistry,
                  status: t.footer.operational,
                },
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
          <p>
            © {year} {t.footer.copyright}
          </p>
          <p className="flex items-center gap-1.5">
            {t.footer.builtWith}{" "}
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
