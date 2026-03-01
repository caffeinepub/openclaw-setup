import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Menu, Moon, Shield, Sun, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { MembershipTier, useMyMembership } from "../hooks/useMembership";
import { useIsAdmin } from "../hooks/useQueries";

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
}

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Setup", href: "#setup" },
  { label: "Config", href: "#config" },
  { label: "Docs", href: "#docs" },
  { label: "Changelog", href: "#changelog" },
];

export function Navbar({ isDark, toggleTheme, onAdminClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { login, clear, identity, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const { data: myMembership } = useMyMembership();

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
            ? "backdrop-blur-xl bg-background/85 border-b border-border shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
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
              <div className="relative">
                <img
                  src="/assets/generated/openclaw-logo-transparent.dim_256x256.png"
                  alt="OpenClaw"
                  className="w-9 h-9 object-contain"
                />
                <div className="absolute inset-0 bg-cyan rounded-full opacity-20 blur-md" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-cyan">
                OpenClaw
              </span>
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
                  Admin
                </Button>
              )}
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
                    variant="outline"
                    size="sm"
                    onClick={clear}
                    className="border-cyan/30 text-cyan hover:bg-cyan/10 hover:border-cyan/60"
                  >
                    <LogOut className="w-4 h-4 mr-1.5" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="bg-cyan text-background hover:bg-cyan-bright font-semibold shadow-glow-sm"
                >
                  <LogIn className="w-4 h-4 mr-1.5" />
                  {isLoggingIn ? "Connecting..." : "Login"}
                </Button>
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
                    {isDark ? "Light Mode" : "Dark Mode"}
                  </button>
                  {identity ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clear}
                      className="flex-1 border-cyan/30 text-cyan"
                    >
                      <LogOut className="w-4 h-4 mr-1.5" /> Logout
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={login}
                      disabled={isLoggingIn}
                      className="flex-1 bg-cyan text-background"
                    >
                      <LogIn className="w-4 h-4 mr-1.5" /> Login
                    </Button>
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
