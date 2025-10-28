import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap } from "lucide-react";

interface CTASectionProps {
  onGetStarted: () => void;
  onTestLogin: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onGetStarted, onTestLogin }) => {
  return (
    <div className="mt-20 text-center" data-testid="cta-section">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8">
          <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Business?
          </h3>
          <p className="text-gray-600 mb-6">
            Join yacht rental companies worldwide who trust BoatsAnalytics
            for their data-driven decision making.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onGetStarted}
              data-testid="start-trial-button"
            >
              Start Your Free Trial
            </Button>
            <Button
              size="lg"
              variant="destructive"
              onClick={onTestLogin}
              className="bg-red-600 hover:bg-red-700 text-white"
              data-testid="test-login-cta-button"
            >
              TEST LOGIN
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
