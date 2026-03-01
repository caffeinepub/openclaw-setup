import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { AdminPanel } from "./components/sections/AdminPanel";
import { ChangelogSection } from "./components/sections/ChangelogSection";
import { ConfigSection } from "./components/sections/ConfigSection";
import { DocsSection } from "./components/sections/DocsSection";
import { FeaturesSection } from "./components/sections/FeaturesSection";
import { HeroSection } from "./components/sections/HeroSection";
import { PricingSection } from "./components/sections/PricingSection";
import { SetupSection } from "./components/sections/SetupSection";
import { StatsSection } from "./components/sections/StatsSection";
import { useIsAdmin } from "./hooks/useQueries";

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const { data: isAdmin } = useIsAdmin();

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
      />

      {/* Main Content */}
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <SetupSection />
        <ConfigSection />
        <DocsSection />
        <ChangelogSection />
        <StatsSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Admin Panel (modal) */}
      {showAdmin && isAdmin && (
        <AdminPanel onClose={() => setShowAdmin(false)} />
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
