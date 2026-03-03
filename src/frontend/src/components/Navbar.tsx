import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Shield,
  Sun,
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
  onDashboardClick: () => void;
  onBlogClick: () => void;
  onForumClick: () => void;
  onCreateAccountClick: () => void;
}

export function Navbar({
  isDark,
  toggleTheme,
  onAdminClick,
  onDashboardClick,
  onBlogClick,
  onForumClick,
  onCreateAccountClick,
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
    { label: t.nav.config, href: "#config" },
    { label: t.nav.docs, href: "#docs" },
    { label: t.nav.changelog, href: "#changelog" },
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
              <img
                src="/assets/generated/clawpro-logo-glowing-transparent.dim_600x150.png"
                alt="ClawPro"
                className="h-12 w-auto object-contain"
                style={{
                  filter:
                    "drop-shadow(0 0 10px rgba(0, 198, 255, 0.7)) drop-shadow(0 0 20px rgba(220, 38, 38, 0.5)) drop-shadow(0 0 35px rgba(0, 114, 255, 0.4))",
                  animation: "logoGlow 3s ease-in-out infinite alternate",
                }}
              />
              <style>{`
                @keyframes logoGlow {
                  0% { filter: drop-shadow(0 0 8px rgba(0,198,255,0.6)) drop-shadow(0 0 16px rgba(220,38,38,0.4)); }
                  100% { filter: drop-shadow(0 0 18px rgba(0,198,255,0.9)) drop-shadow(0 0 32px rgba(220,38,38,0.7)) drop-shadow(0 0 48px rgba(0,114,255,0.5)); }
                }
              `}</style>
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
              <button
                type="button"
                onClick={() => {
                  setIsMobileOpen(false);
                  onBlogClick();
                }}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-cyan transition-colors rounded-md hover:bg-accent/50 flex items-center gap-1.5"
                data-ocid="nav.blog.link"
              >
                <BookOpen className="w-3.5 h-3.5" />
                {t.nav.blog}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileOpen(false);
                  onForumClick();
                }}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-violet-400 transition-colors rounded-md hover:bg-accent/50 flex items-center gap-1.5"
                data-ocid="nav.forum.link"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                {t.nav.forum}
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
                      className={`border ${MEMBERSHIP_BADGE[myMembership.tier].className}`}
                    >
                      {MEMBERSHIP_BADGE[myMembership.tier].label}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDashboardClick}
                    className={`flex items-center gap-1.5 font-medium ${
                      myMembership
                        ? myMembership.tier === MembershipTier.silver
                          ? "text-slate-300 hover:text-slate-200 hover:bg-slate-500/10"
                          : myMembership.tier === MembershipTier.gold
                            ? "text-amber-300 hover:text-amber-200 hover:bg-amber-500/10"
                            : "text-violet-300 hover:text-violet-200 hover:bg-violet-500/10"
                        : "text-cyan hover:text-cyan hover:bg-cyan/10"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {t.dashboard.navButton}
                  </Button>
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
              <button
                type="button"
                onClick={() => {
                  setIsMobileOpen(false);
                  onBlogClick();
                }}
                className="w-full text-left px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-cyan hover:bg-accent/50 rounded-md transition-colors flex items-center gap-2"
                data-ocid="nav.blog.link"
              >
                <BookOpen className="w-4 h-4" />
                {t.nav.blog}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileOpen(false);
                  onForumClick();
                }}
                className="w-full text-left px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-violet-400 hover:bg-accent/50 rounded-md transition-colors flex items-center gap-2"
                data-ocid="nav.forum.link"
              >
                <MessageSquare className="w-4 h-4" />
                {t.nav.forum}
              </button>
              <div className="pt-2 border-t border-border space-y-2">
                {identity && myMembership && (
                  <div className="px-1 pb-1">
                    <Badge
                      className={`border ${MEMBERSHIP_BADGE[myMembership.tier].className}`}
                    >
                      Membership: {MEMBERSHIP_BADGE[myMembership.tier].label}
                    </Badge>
                  </div>
                )}
                {/* Language Switcher in mobile */}
                <div className="px-1 pb-1">
                  <LanguageSwitcher />
                </div>
                {identity && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsMobileOpen(false);
                      onDashboardClick();
                    }}
                    className={`w-full justify-start ${
                      myMembership
                        ? myMembership.tier === MembershipTier.silver
                          ? "text-slate-300 hover:bg-slate-500/10"
                          : myMembership.tier === MembershipTier.gold
                            ? "text-amber-300 hover:bg-amber-500/10"
                            : "text-violet-300 hover:bg-violet-500/10"
                        : "text-cyan hover:bg-cyan/10"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 mr-1.5" />
                    {t.dashboard.navButton}
                  </Button>
                )}
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clear}
                      className="flex-1 border-cyan/30 text-cyan"
                    >
                      <LogOut className="w-4 h-4 mr-1.5" /> {t.nav.logout}
                    </Button>
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
