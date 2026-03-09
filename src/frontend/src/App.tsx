import { Toaster } from "@/components/ui/sonner";
import { useCallback, useEffect, useState } from "react";
import { MembershipTier } from "./backend.d";
import { CreateAccountModal } from "./components/CreateAccountModal";
import { CryptoMarketPage } from "./components/CryptoMarketPage";
import { DotsBackground } from "./components/DotsBackground";
import { Footer } from "./components/Footer";
import { MemberDashboard } from "./components/MemberDashboard";
import { Navbar } from "./components/Navbar";
import { PublicLeaderboardPage } from "./components/PublicLeaderboardPage";
import { PublicProfilePage } from "./components/PublicProfilePage";
import { TierLandingPage } from "./components/TierLandingPage";
import { AdminPanel } from "./components/sections/AdminPanel";
import { AvailableWorldwideSection } from "./components/sections/AvailableWorldwideSection";
import { ChangelogSection } from "./components/sections/ChangelogSection";
import { ConfigSection } from "./components/sections/ConfigSection";
import { DocsSection } from "./components/sections/DocsSection";
import { FeaturesSection } from "./components/sections/FeaturesSection";
import { HeroSection } from "./components/sections/HeroSection";
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

function isLeaderboardHash(hash: string): boolean {
  return hash === "#/leaderboard";
}

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showCryptoMarket, setShowCryptoMarket] = useState(false);
  const [showTierLanding, setShowTierLanding] = useState(false);
  const [tierLandingTier, setTierLandingTier] = useState<MembershipTier>(
    MembershipTier.silver,
  );
  const [autoOpenPaymentTier, setAutoOpenPaymentTier] =
    useState<MembershipTier | null>(null);
  const [publicProfileHandle, setPublicProfileHandle] = useState<string | null>(
    () => extractPublicProfileHandle(window.location.hash),
  );
  const [showPublicLeaderboard, setShowPublicLeaderboard] = useState<boolean>(
    () => isLeaderboardHash(window.location.hash),
  );
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [prefillHandle, setPrefillHandle] = useState("");
  const [prefillFullName, setPrefillFullName] = useState("");

  const { data: isAdmin } = useIsAdmin();
  const { identity } = useInternetIdentity();

  const handleHashChange = useCallback(() => {
    const hash = window.location.hash;
    const handle = extractPublicProfileHandle(hash);
    setPublicProfileHandle(handle);
    setShowPublicLeaderboard(isLeaderboardHash(hash));
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [handleHashChange]);

  const closePublicProfile = useCallback(() => {
    window.location.hash = "";
    setPublicProfileHandle(null);
  }, []);

  const closePublicLeaderboard = useCallback(() => {
    window.location.hash = "";
    setShowPublicLeaderboard(false);
  }, []);

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

  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = "dark";
  }, []);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <DotsBackground fixed />

      <Navbar
        isDark={isDark}
        toggleTheme={toggleTheme}
        onAdminClick={() => setShowAdmin(true)}
        onCreateAccountClick={() => setShowCreateAccount(true)}
        onDashboardClick={identity ? () => setShowDashboard(true) : undefined}
        onMarketsClick={() => setShowCryptoMarket(true)}
      />

      <main>
        <HeroSection
          onOpenCreateAccount={(h, n) => {
            setPrefillHandle(h);
            setPrefillFullName(n);
            setShowCreateAccount(true);
          }}
        />
        <AvailableWorldwideSection />
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

      <Footer />

      {showAdmin && isAdmin && (
        <AdminPanel onClose={() => setShowAdmin(false)} />
      )}

      {showDashboard && (
        <MemberDashboard onClose={() => setShowDashboard(false)} />
      )}

      {showCryptoMarket && (
        <CryptoMarketPage onClose={() => setShowCryptoMarket(false)} />
      )}

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

      {publicProfileHandle && (
        <PublicProfilePage
          handle={publicProfileHandle}
          onClose={closePublicProfile}
        />
      )}

      {showPublicLeaderboard && (
        <PublicLeaderboardPage onClose={closePublicLeaderboard} />
      )}

      <CreateAccountModal
        open={showCreateAccount}
        onClose={() => setShowCreateAccount(false)}
        prefillHandle={prefillHandle}
        prefillFullName={prefillFullName}
      />

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
