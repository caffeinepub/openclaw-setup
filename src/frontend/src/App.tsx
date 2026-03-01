import { Toaster } from "@/components/ui/sonner";
import { useCallback, useEffect, useState } from "react";
import { MembershipTier } from "./backend.d";
import { Footer } from "./components/Footer";
import { MemberDashboard } from "./components/MemberDashboard";
import { Navbar } from "./components/Navbar";
import { PublicProfilePage } from "./components/PublicProfilePage";
import { TierLandingPage } from "./components/TierLandingPage";
import { AdminPanel } from "./components/sections/AdminPanel";
import { ChangelogSection } from "./components/sections/ChangelogSection";
import { ConfigSection } from "./components/sections/ConfigSection";
import { DocsSection } from "./components/sections/DocsSection";
import { FeaturesSection } from "./components/sections/FeaturesSection";
import { HeroSection } from "./components/sections/HeroSection";
import { LogoMarqueeSection } from "./components/sections/LogoMarqueeSection";
import { PartnerSection } from "./components/sections/PartnerSection";
import { PricingSection } from "./components/sections/PricingSection";
import { SetupSection } from "./components/sections/SetupSection";
import { StatsSection } from "./components/sections/StatsSection";
import { WorkWithEverythingSection } from "./components/sections/WorkWithEverythingSection";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsAdmin } from "./hooks/useQueries";

function extractPublicProfileHandle(hash: string): string | null {
  if (!hash.startsWith("#/u/")) return null;
  const handle = hash.slice(4).trim();
  return handle.length > 0 ? handle : null;
}

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showTierLanding, setShowTierLanding] = useState(false);
  const [tierLandingTier, setTierLandingTier] = useState<MembershipTier>(
    MembershipTier.silver,
  );
  const [autoOpenPaymentTier, setAutoOpenPaymentTier] =
    useState<MembershipTier | null>(null);
  const [publicProfileHandle, setPublicProfileHandle] = useState<string | null>(
    () => extractPublicProfileHandle(window.location.hash),
  );
  const { data: isAdmin } = useIsAdmin();
  const { identity } = useInternetIdentity();

  // Hash-based routing for public profiles
  const handleHashChange = useCallback(() => {
    const handle = extractPublicProfileHandle(window.location.hash);
    setPublicProfileHandle(handle);
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [handleHashChange]);

  const closePublicProfile = useCallback(() => {
    window.location.hash = "";
    setPublicProfileHandle(null);
  }, []);

  // Apply dark mode class to html element
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
      html.style.colorScheme = "dark";
    } else {
      html.classList.remove("dark");
      html.style.colorScheme = "light";
    }
  }, [isDark]);

  // Default to dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = "dark";
  }, []);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <Navbar
        isDark={isDark}
        toggleTheme={toggleTheme}
        onAdminClick={() => setShowAdmin(true)}
        onDashboardClick={() => setShowDashboard(true)}
      />

      {/* Main Content */}
      <main>
        <HeroSection />
        <LogoMarqueeSection />
        <FeaturesSection />
        <WorkWithEverythingSection
          onGetStarted={(tier) => {
            setAutoOpenPaymentTier(tier);
            document
              .getElementById("pricing")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        />
        <PricingSection
          onExploreTier={(tier) => {
            setTierLandingTier(tier);
            setShowTierLanding(true);
          }}
          autoOpenTier={autoOpenPaymentTier}
          onAutoOpenConsumed={() => setAutoOpenPaymentTier(null)}
        />
        <SetupSection />
        <ConfigSection />
        <DocsSection />
        <ChangelogSection />
        <StatsSection />
        <PartnerSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Admin Panel (modal) */}
      {showAdmin && isAdmin && (
        <AdminPanel onClose={() => setShowAdmin(false)} />
      )}

      {/* Member Dashboard (modal) */}
      {showDashboard && identity && (
        <MemberDashboard onClose={() => setShowDashboard(false)} />
      )}

      {/* Tier Landing Page */}
      {showTierLanding && (
        <TierLandingPage
          tier={tierLandingTier}
          onClose={() => setShowTierLanding(false)}
          onPurchase={() => {
            setShowTierLanding(false);
            setTimeout(
              () =>
                document
                  .querySelector("#pricing")
                  ?.scrollIntoView({ behavior: "smooth" }),
              100,
            );
          }}
        />
      )}

      {/* Public Profile Page (hash-based overlay) */}
      {publicProfileHandle && (
        <PublicProfilePage
          handle={publicProfileHandle}
          onClose={closePublicProfile}
        />
      )}

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "oklch(0.12 0.015 240)",
            border: "1px solid oklch(1 0 0 / 10%)",
            color: "oklch(0.94 0.02 210)",
          },
        }}
      />
    </div>
  );
}
