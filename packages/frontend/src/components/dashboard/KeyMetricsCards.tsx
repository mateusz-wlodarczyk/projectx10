"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Anchor, Euro, Calendar, Percent, Users } from "lucide-react";
import { KeyMetricsCardsProps, KeyMetric } from "../../types/dashboard";

const KeyMetricsCards: React.FC<KeyMetricsCardsProps> = ({
  metrics,
  onMetricClick,
  loading,
  error,
}) => {
  const getIcon = (iconName: string) => {
    const iconMap = {
      anchor: Anchor,
      euro: Euro,
      "trending-up": TrendingUp,
      calendar: Calendar,
      percent: Percent,
      users: Users,
    };
    
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || TrendingUp;
    return <IconComponent className="h-4 w-4" />;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case "increase":
        return "text-green-600";
      case "decrease":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === "€") {
      return `${value.toLocaleString()} ${unit}`;
    }
    if (unit === "%") {
      return `${value}${unit}`;
    }
    return `${value.toLocaleString()} ${unit}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-red-600 mb-2">Błąd ładowania metryk</div>
            <div className="text-sm text-gray-500">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics || metrics.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-gray-500 mb-2">Brak danych metryk</div>
            <div className="text-sm text-gray-400">Nie znaleziono metryk dla wybranego typu łodzi</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric: KeyMetric) => (
        <Card
          key={metric.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onMetricClick(metric)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className="flex items-center space-x-1">
                {getIcon(metric.icon)}
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    metric.color === "green"
                      ? "border-green-200 text-green-700"
                      : metric.color === "red"
                      ? "border-red-200 text-red-700"
                      : metric.color === "blue"
                      ? "border-blue-200 text-blue-700"
                      : metric.color === "purple"
                      ? "border-purple-200 text-purple-700"
                      : metric.color === "orange"
                      ? "border-orange-200 text-orange-700"
                      : metric.color === "teal"
                      ? "border-teal-200 text-teal-700"
                      : "border-gray-200 text-gray-700"
                  }`}
                >
                  {metric.color}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {formatValue(metric.value, metric.unit)}
              </div>
              <div className="flex items-center space-x-2">
                {getTrendIcon(metric.trend)}
                <span className={`text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                  {metric.change > 0 ? "+" : ""}{metric.change}%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs poprzedni okres
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KeyMetricsCards;
