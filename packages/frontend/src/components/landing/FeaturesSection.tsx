import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Shield } from "lucide-react";

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Comprehensive dashboards with interactive charts, trend analysis, and predictive insights to optimize your yacht rental business.",
      color: "text-blue-600",
    },
    {
      icon: Users,
      title: "User Management",
      description:
        "Role-based access control with admin, manager, and user roles. Secure authentication and comprehensive user management.",
      color: "text-green-600",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with encrypted data storage, audit logging, and compliance with industry standards.",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="mt-20" data-testid="features-section">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
        Why Choose BoatsAnalytics?
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} data-testid="feature-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
                <span>{feature.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
