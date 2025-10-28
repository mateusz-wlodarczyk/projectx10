"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, BarChart3, Lightbulb, Calendar, Target } from "lucide-react";
import { SummaryStatsProps, SummaryStat } from "../../types/dashboard";

const SummaryStats: React.FC<SummaryStatsProps> = ({
  stats,
  onStatClick,
  loading,
  error,
}) => {
  const getCategoryIcon = (category: string) => {
    const iconMap = {
      performance: BarChart3,
      market: Target,
      seasonal: Calendar,
      insight: Lightbulb,
    };
    
    const IconComponent = iconMap[category as keyof typeof iconMap] || BarChart3;
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "performance":
        return "bg-blue-50 border-blue-200 text-blue-900";
      case "market":
        return "bg-green-50 border-green-200 text-green-900";
      case "seasonal":
        return "bg-orange-50 border-orange-200 text-orange-900";
      case "insight":
        return "bg-purple-50 border-purple-200 text-purple-900";
      default:
        return "bg-gray-50 border-gray-200 text-gray-900";
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "performance":
        return "bg-blue-100 text-blue-800";
      case "market":
        return "bg-green-100 text-green-800";
      case "seasonal":
        return "bg-orange-100 text-orange-800";
      case "insight":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "performance":
        return "Wydajność";
      case "market":
        return "Rynek";
      case "seasonal":
        return "Sezonowość";
      case "insight":
        return "Wgląd";
      default:
        return "Inne";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-red-600 mb-2">Błąd ładowania statystyk</div>
            <div className="text-sm text-gray-500">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats || stats.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-gray-500 mb-2">Brak danych statystycznych</div>
            <div className="text-sm text-gray-400">Nie znaleziono statystyk dla wybranego typu łodzi</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>Kluczowe statystyki i wglądy</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat: SummaryStat) => (
            <div
              key={stat.id}
              className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                stat.actionable ? "hover:border-blue-300" : ""
              } ${getCategoryColor(stat.category)}`}
              onClick={() => stat.actionable && onStatClick(stat)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getCategoryIcon(stat.category)}
                    <h3 className="font-medium">{stat.title}</h3>
                    <Badge className={`text-xs ${getCategoryBadgeColor(stat.category)}`}>
                      {getCategoryLabel(stat.category)}
                    </Badge>
                    {stat.actionable && (
                      <Badge variant="outline" className="text-xs">
                        Akcyjny
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg font-bold">{stat.value}</span>
                    {getTrendIcon(stat.trend)}
                  </div>
                  
                  <p className="text-sm opacity-80">{stat.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Category Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-900 mb-3">Podsumowanie kategorii</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["performance", "market", "seasonal", "insight"].map((category) => {
              const count = stats.filter(s => s.category === category).length;
              return (
                <div key={category} className="text-center">
                  <div className="text-lg font-bold text-gray-700">{count}</div>
                  <div className="text-xs text-gray-500">{getCategoryLabel(category)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actionable Stats */}
        {stats.filter(s => s.actionable).length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-900 mb-2">
              Statystyki wymagające działania
            </div>
            <div className="text-sm text-blue-700">
              {stats.filter(s => s.actionable).length} z {stats.length} statystyk wymaga Twojej uwagi
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryStats;
