"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { WeeklyPriceChartProps } from "../../types/dashboard";

const WeeklyPriceChart: React.FC<WeeklyPriceChartProps> = ({
  priceData,
  selectedWeek,
  onWeekChange,
  loading,
  error,
}) => {
  // Process data for chart display
  const chartData = useMemo(() => {
    if (!priceData || !priceData.weeks) return [];

    // Sort by week and limit to recent data points
    return priceData.weeks
      .sort((a, b) => a.week - b.week)
      .slice(-20); // Show last 20 weeks
  }, [priceData]);

  // Calculate trend
  const trend = useMemo(() => {
    if (chartData.length < 2) return "stable";
    
    const firstHalf = chartData.slice(0, Math.floor(chartData.length / 2));
    const secondHalf = chartData.slice(Math.floor(chartData.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, d) => sum + d.averagePrice, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.averagePrice, 0) / secondHalf.length;
    
    const change = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    if (change > 2) return "up";
    if (change < -2) return "down";
    return "stable";
  }, [chartData]);

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendText = () => {
    switch (trend) {
      case "up":
        return "Wzrost";
      case "down":
        return "Spadek";
      default:
        return "Stabilny";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-red-600 mb-2">Błąd ładowania wykresu cen</div>
            <div className="text-sm text-gray-500">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!priceData || chartData.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-gray-500 mb-2">Brak danych o cenach</div>
            <div className="text-sm text-gray-400">Nie znaleziono danych o cenach dla wybranego typu łodzi</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>Trendy cen tygodniowych</span>
            {getTrendIcon()}
            <span className="text-sm text-muted-foreground">({getTrendText()})</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={selectedWeek.toString()} onValueChange={(value) => onWeekChange(parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Tydzień" />
              </SelectTrigger>
              <SelectContent>
                {chartData.map((week) => (
                  <SelectItem key={week.week} value={week.week.toString()}>
                    Tydzień {week.week}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart Visualization */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="h-48 relative">
            {/* Chart Bars */}
            <div className="flex items-end justify-between h-full space-x-1">
              {chartData.map((point, index) => {
                const height = ((point.averagePrice - priceData.minPrice) / (priceData.maxPrice - priceData.minPrice)) * 100;
                const isSelected = point.week === selectedWeek;
                const isRecent = index >= chartData.length - 5; // Highlight recent data
                
                return (
                  <div
                    key={point.week}
                    className={`flex-1 cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'bg-blue-500' 
                        : isRecent 
                        ? 'bg-blue-400 hover:bg-blue-500' 
                        : 'bg-blue-300 hover:bg-blue-400'
                    } rounded-t`}
                    style={{ height: `${Math.max(height, 5)}%` }}
                    onClick={() => onWeekChange(point.week)}
                    title={`Tydzień ${point.week}: ${point.averagePrice.toLocaleString()} €`}
                  />
                );
              })}
            </div>
            
            {/* X-axis labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Tydzień {chartData[0]?.week || 1}</span>
              <span>Tydzień {chartData[chartData.length - 1]?.week || 52}</span>
            </div>
          </div>
        </div>

        {/* Chart Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Min</div>
            <div className="text-lg font-bold text-red-600">
              {priceData.minPrice.toLocaleString()} €
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Średnia</div>
            <div className="text-lg font-bold text-blue-600">
              {priceData.averagePrice.toLocaleString()} €
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Max</div>
            <div className="text-lg font-bold text-green-600">
              {priceData.maxPrice.toLocaleString()} €
            </div>
          </div>
        </div>

        {/* Selected Week Details */}
        {selectedWeek && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-900">
              Tydzień {selectedWeek} - Szczegóły
            </div>
            <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Średnia cena:</span>
                <span className="ml-2 font-medium">
                  {chartData.find(d => d.week === selectedWeek)?.averagePrice.toLocaleString()} €
                </span>
              </div>
              <div>
                <span className="text-blue-700">Liczba łodzi:</span>
                <span className="ml-2 font-medium">
                  {chartData.find(d => d.week === selectedWeek)?.boatCount}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyPriceChart;
