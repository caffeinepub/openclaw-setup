import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Shield,
  Sun,
  TrendingUp,
  UserPlus,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { MembershipTier, useMyMembership } from "../hooks/useMembership";
import { useIsAdmin } from "../hooks/useQueries";
import { useLanguage } from "../i18n/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

const MEMBERSHIP_BADGE: Record<
  MembershipTier,
  { label: string; className: string }
> = {
  [MembershipTier.silver]: {
    label: "Silver",
    className:
      "bg-slate-500/20 text-slate-300 border-slate-500/40 text-[10px] py-0",
  },
  [MembershipTier.gold]: {
    label: "Gold",
    className:
      "bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px] py-0",
  },
  [MembershipTier.platinum]: {
    label: "Platinum",
    className:
      "bg-violet-500/20 text-violet-300 border-violet-500/40 text-[10px] py-0",
  },
};

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  onAdminClick: () => void;
  onCreateAccountClick: () => void;
  onDashboardClick?: () => void;
  onMarketsClick: () => void;
}

export function Navbar({
  isDark,
  toggleTheme,
  onAdminClick,
  onCreateAccountClick,
  onDashboardClick,
  onMarketsClick,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { login, clear, identity, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const { data: myMembership } = useMyMembership();
  const { t } = useLanguage();

  const NAV_LINKS = [
    { label: t.nav.home, href: "#hero" },
    { label: t.nav.features, href: "#features" },
    { label: t.nav.integrations, href: "#integrations" },
    { label: t.nav.pricing, href: "#pricing" },
    { label: t.nav.setup, href: "#setup" },
    { label: t.nav.docs, href: "#docs" },
  ];

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "backdrop-blur-xl bg-background/92 border-b border-border shadow-[0_2px_12px_rgba(0,0,0,0.15)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => handleNavClick("#hero")}
            >
              <style>{`
                @keyframes navLogoShimmer {
                  0% { background-position: -200% center; }
                  100% { background-position: 200% center; }
                }
                @keyframes navLogoFloat {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-2px); }
                }
                @keyframes navLogoGlow {
                  0%, 100% { filter: drop-shadow(0 0 5px rgba(0,198,255,0.55)) drop-shadow(0 0 12px rgba(124,58,237,0.3)); }
                  50% { filter: drop-shadow(0 0 12px rgba(0,198,255,0.9)) drop-shadow(0 0 26px rgba(124,58,237,0.6)) drop-shadow(0 0 40px rgba(245,158,11,0.35)); }
                }
              `}</style>
              <div
                style={{
                  animation:
                    "navLogoFloat 3s ease-in-out infinite, navLogoGlow 3s ease-in-out infinite",
                  display: "inline-flex",
                  alignItems: "baseline",
                  gap: "1px",
                }}
              >
                <span
                  className="font-black leading-none select-none"
                  style={{
                    fontSize: "1.35rem",
                    background:
                      "linear-gradient(90deg, #a8bcc8 0%, #00c6ff 12%, #ffffff 28%, #f59e0b 44%, #7c3aed 60%, #00c6ff 76%, #ffffff 90%, #a8bcc8 100%)",
                    backgroundSize: "300% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    animation: "navLogoShimmer 3s linear infinite",
                  }}
                >
                  ClawPro
                </span>
                <span
                  className="font-bold leading-none select-none"
                  style={{
                    fontSize: "0.75rem",
                    background:
                      "linear-gradient(90deg, #f59e0b 0%, #00c6ff 50%, #a78bfa 100%)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    animation: "navLogoShimmer 3s linear infinite",
                  }}
                >
                  .ai
                </span>
              </div>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  type="button"
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-cyan transition-colors rounded-md hover:bg-accent/50"
                >
                  {link.label}
                </button>
              ))}
              {/* Markets link */}
              <button
                type="button"
                onClick={onMarketsClick}
                data-ocid="nav.markets.button"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-emerald-400/80 hover:text-emerald-400 transition-colors rounded-md hover:bg-emerald-500/10"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Markets
              </button>
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-2">
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onAdminClick}
                  className="text-amber-400 hover:text-amber-300 hover:bg-amber-400/10"
                >
                  <Shield className="w-4 h-4 mr-1.5" />
                  {t.nav.admin}
                </Button>
              )}
              <LanguageSwitcher />
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-md text-muted-foreground hover:text-cyan hover:bg-accent/50 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
              {identity ? (
                <div className="flex items-center gap-2">
                  {myMembership && (
                    <Badge
                      className={`border ${
                        MEMBERSHIP_BADGE[myMembership.tier].className
                      }`}
                    >
                      {MEMBERSHIP_BADGE[myMembership.tier].label}
                    </Badge>
                  )}
                  {onDashboardClick && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onDashboardClick}
                      className="border-cyan/40 text-cyan hover:bg-cyan/10 font-semibold"
                      data-ocid="nav.dashboard.button"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-1.5" />
                      Dashboard
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clear}
                    className="border-cyan/30 text-cyan hover:bg-cyan/10 hover:border-cyan/60"
                  >
                    <LogOut className="w-4 h-4 mr-1.5" />
                    {t.nav.logout}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onCreateAccountClick}
                    className="border-cyan/40 text-cyan hover:bg-cyan/10 hover:border-cyan/70 font-semibold"
                    data-ocid="nav.create_account.button"
                  >
                    <UserPlus className="w-4 h-4 mr-1.5" />
                    {t.nav.createAccount}
                  </Button>
                  <Button
                    size="sm"
                    onClick={login}
                    disabled={isLoggingIn}
                    className="bg-cyan text-background hover:bg-cyan-bright font-semibold shadow-glow-sm"
                    data-ocid="nav.login.button"
                  >
                    <LogIn className="w-4 h-4 mr-1.5" />
                    {isLoggingIn ? t.nav.connecting : t.nav.login}
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Toggle menu"
            >
              {isMobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 backdrop-blur-xl bg-background/95 border-b border-border md:hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <button
                  type="button"
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="w-full text-left px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-cyan hover:bg-accent/50 rounded-md transition-colors"
                >
                  {link.label}
                </button>
              ))}
              {/* Markets mobile */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileOpen(false);
                  onMarketsClick();
                }}
                data-ocid="nav.markets.button"
                className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 rounded-md transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                Markets
              </button>
              <div className="pt-2 border-t border-border space-y-2">
                {identity && myMembership && (
                  <div className="px-1 pb-1">
                    <Badge
                      className={`border ${
                        MEMBERSHIP_BADGE[myMembership.tier].className
                      }`}
                    >
                      Membership: {MEMBERSHIP_BADGE[myMembership.tier].label}
                    </Badge>
                  </div>
                )}
                <div className="px-1 pb-1">
                  <LanguageSwitcher />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-cyan rounded-md hover:bg-accent/50 transition-colors"
                  >
                    {isDark ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                    {isDark ? t.nav.lightMode : t.nav.darkMode}
                  </button>
                  {identity ? (
                    <div className="flex-1 flex flex-col gap-2">
                      {onDashboardClick && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsMobileOpen(false);
                            onDashboardClick();
                          }}
                          className="w-full border-cyan/40 text-cyan"
                          data-ocid="nav.dashboard.button"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-1.5" />
                          Dashboard
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clear}
                        className="w-full border-cyan/30 text-cyan"
                      >
                        <LogOut className="w-4 h-4 mr-1.5" /> {t.nav.logout}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsMobileOpen(false);
                          onCreateAccountClick();
                        }}
                        className="w-full border-cyan/40 text-cyan"
                        data-ocid="nav.create_account.button"
                      >
                        <UserPlus className="w-4 h-4 mr-1.5" />{" "}
                        {t.nav.createAccount}
                      </Button>
                      <Button
                        size="sm"
                        onClick={login}
                        disabled={isLoggingIn}
                        className="w-full bg-cyan text-background"
                        data-ocid="nav.login.button"
                      >
                        <LogIn className="w-4 h-4 mr-1.5" /> {t.nav.login}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
