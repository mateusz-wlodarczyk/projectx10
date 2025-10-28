import React from "react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onTestLogin: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGetStarted,
  onSignIn,
  onTestLogin,
}) => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-testid="hero-section">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6" data-testid="main-title">
          Welcome to <span className="text-blue-600">BoatsAnalytics</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto" data-testid="main-description">
          Comprehensive yacht booking analytics and business insights. Track
          bookings, monitor trends, analyze promotions, and make data-driven
          decisions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="h-10"
            onClick={onGetStarted}
            data-testid="get-started-button"
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-10"
            onClick={onSignIn}
            data-testid="sign-in-button"
          >
            Sign In
          </Button>
          <Button
            size="lg"
            variant="destructive"
            className="h-10 bg-red-600 hover:bg-red-700 text-white"
            onClick={onTestLogin}
            data-testid="test-login-button"
          >
            TEST
          </Button>
        </div>
      </div>
    </main>
  );
};
