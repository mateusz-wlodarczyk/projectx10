"use client";

import React from "react";
import { Header } from "@/src/components/landing/Header";
import { HeroSection } from "@/src/components/landing/HeroSection";
import { FeaturesSection } from "@/src/components/landing/FeaturesSection";
import { CTASection } from "@/src/components/landing/CTASection";
import { Footer } from "@/src/components/landing/Footer";
import { useLandingNavigation } from "@/src/hooks/useNavigation";
import { TestAuthService } from "@/src/lib/TestAuthService";

export default function LandingPage() {
  const { goToRegister, goToLogin, goToDashboard } = useLandingNavigation();

  const handleTestLogin = () => {
    TestAuthService.createTestSession();
    goToDashboard();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" data-testid="landing-page">
      <Header
        onGetStarted={goToRegister}
        onSignIn={goToLogin}
        onTestLogin={handleTestLogin}
      />

      <HeroSection
        onGetStarted={goToRegister}
        onSignIn={goToLogin}
        onTestLogin={handleTestLogin}
      />

      <FeaturesSection />

      <CTASection onGetStarted={goToRegister} onTestLogin={handleTestLogin} />

      <Footer />
    </div>
  );
}
