import { Toaster } from "@/components/ui/sonner";
import { useCallback, useEffect, useState } from "react";
import { MembershipTier } from "./backend.d";
import { AdminDashboardPanel } from "./components/AdminDashboardPanel";
import { CreateAccountModal } from "./components/CreateAccountModal";
import { CryptoMarketPage } from "./components/CryptoMarketPage";
import { Footer } from "./components/Footer";
import { LoginModal } from "./components/LoginModal";
import { MemberDashboard } from "./components/MemberDashboard";
import { Navbar } from "./components/Navbar";
import { PublicLeaderboardPage } from "./components/PublicLeaderboardPage";
import { PublicProfilePage } from "./components/PublicProfilePage";
import { StarBackground } from "./components/StarBackground";
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
import { RoadmapSection } from "./components/sections/RoadmapSection";
import { SetInActionsSection } from "./components/sections/SetInActionsSection";
import { SetupSection } from "./components/sections/SetupSection";
import { StatsSection } from "./components/sections/StatsSection";
import { WorkWithEverythingSection } from "./components/sections/WorkWithEverythingSection";
import { WorksWithLogoSlide } from "./components/sections/WorksWithLogoSlide";
import { useMyUserAccount } from "./hooks/useForumQueries";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsAdmin } from "./hooks/useQueries";
import { LanguageProvider } from "./i18n/LanguageContext";

function extractPublicProfileHandle(hash: string): string | null {
  if (!hash.startsWith("#/u/")) return null;
  const handle = hash.slice(4).trim();
  return handle.length > 0 ? handle : null;
}

function isLeaderboardHash(hash: string): boolean {
  return hash === "#/leaderboard";
}

function AppInner() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
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
  const [showLogin, setShowLogin] = useState(false);
  const [localAccount, setLocalAccount] = useState<{
    handle: string;
    fullName: string;
    email?: string;
    phone?: string;
  } | null>(() => {
    try {
      const s = localStorage.getItem("clawpro_logged_in_user");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });
  const [prefillHandle, setPrefillHandle] = useState("");
  const [prefillFullName, setPrefillFullName] = useState("");

  const { data: isAdmin } = useIsAdmin();
  const { identity } = useInternetIdentity();
  const { data: userAccount } = useMyUserAccount();

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
    document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = "dark";
  }, []);

  const handleDashboardClick = () => {
    if (localAccount || (identity && userAccount)) {
      setShowDashboard(true);
    } else {
      setShowLogin(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <StarBackground fixed />

      <Navbar
        onAdminClick={() => setShowAdmin(true)}
        onAdminDashboardClick={() => setShowAdminDashboard(true)}
        onCreateAccountClick={() => setShowCreateAccount(true)}
        onLoginClick={() => setShowLogin(true)}
        onDashboardClick={handleDashboardClick}
        onMarketsClick={() => setShowCryptoMarket(true)}
        onLogout={() => {
          setLocalAccount(null);
          localStorage.removeItem("clawpro_logged_in_user");
        }}
      />

      <main>
        <HeroSection
          onOpenCreateAccount={(h, n) => {
            setPrefillHandle(h);
            setPrefillFullName(n);
            setShowCreateAccount(true);
          }}
          isLoggedIn={!!localAccount || !!(identity && userAccount)}
          onGoToDashboard={() => setShowDashboard(true)}
        />
        <WorksWithLogoSlide />
        <AvailableWorldwideSection />
        {/* Setup & Download moved here, directly below the world map */}
        <SetupSection />
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
        <SetInActionsSection />
        <ConfigSection />
        <DocsSection />
        <ChangelogSection />
        <StatsSection />
        <PartnerSection />
        <RoadmapSection />
      </main>

      <Footer />

      {showAdmin && isAdmin && (
        <AdminPanel onClose={() => setShowAdmin(false)} />
      )}

      {showAdminDashboard && (
        <AdminDashboardPanel onClose={() => setShowAdminDashboard(false)} />
      )}

      {showDashboard && (
        <MemberDashboard
          onClose={() => setShowDashboard(false)}
          localAccount={localAccount}
          onTopUp={(tier) => {
            setShowDashboard(false);
            setTierLandingTier(tier);
            setShowTierLanding(true);
          }}
        />
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

      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={(account) => {
          localStorage.setItem(
            "clawpro_logged_in_user",
            JSON.stringify(account),
          );
          setLocalAccount(account);
          setShowLogin(false);
          setShowDashboard(true);
        }}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowCreateAccount(true);
        }}
      />
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

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}
