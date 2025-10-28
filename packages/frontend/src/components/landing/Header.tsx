import React from "react";
import { Button } from "@/components/ui/button";
import { Anchor } from "lucide-react";

interface HeaderProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onTestLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onGetStarted,
  onSignIn,
  onTestLogin,
}) => {
  return (
    <header className="bg-white shadow-sm" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-2">
            <Anchor className="h-8 w-8 text-blue-600" role="img" />
            <span className="text-2xl font-bold text-gray-900" data-testid="logo">
              BoatsAnalytics
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="bg-transparent"
              onClick={onSignIn}
              data-testid="header-sign-in-button"
            >
              Sign In
            </Button>
            <Button
              onClick={onGetStarted}
              data-testid="header-get-started-button"
            >
              Get Started
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              onClick={onTestLogin}
              data-testid="header-test-login-button"
            >
              TEST
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
