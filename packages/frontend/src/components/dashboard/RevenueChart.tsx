"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Minus, DollarSign, Users } from "lucide-react";
import { RevenueChartProps, TIME_RANGE_OPTIONS } from "../../types/dashboard";

const RevenueChart: React.FC<RevenueChartProps> = ({
  revenueData,
  timeRange,
  onTimeRangeChange,
  loading,
  error,
}) => {
  // Process data for chart display
  const chartData = useMemo(() => {
    if (!revenueData || !revenueData.dataPoints) return [];

    // Sort by timestamp and limit to recent data points
    return revenueData.dataPoints
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-30); // Show last 30 data points
  }, [revenueData]);

  // Calculate trend
  const trend = useMemo(() => {
    if (chartData.length < 2) return "stable";
    
    const firstHalf = chartData.slice(0, Math.floor(chartData.length / 2));
    const secondHalf = chartData.slice(Math.floor(chartData.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, d) => sum + d.revenue, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.revenue, 0) / secondHalf.length;
    
    const change = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    if (change > 5) return "up";
    if (change < -5) return "down";
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
        return "Wzrost przychodów";
      case "down":
        return "Spadek przychodów";
      default:
        return "Stabilny";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
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
            <div className="text-red-600 mb-2">Błąd ładowania wykresu przychodów</div>
            <div className="text-sm text-gray-500">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!revenueData || chartData.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-gray-500 mb-2">Brak danych o przychodach</div>
            <div className="text-sm text-gray-400">Nie znaleziono danych o przychodach dla wybranego typu łodzi</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxRevenue = Math.max(...chartData.map(d => d.revenue));
  const minRevenue = Math.min(...chartData.map(d => d.revenue));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Trendy przychodów</span>
            {getTrendIcon()}
            <span className={`text-sm ${getTrendColor()}`}>({getTrendText()})</span>
          </CardTitle>
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Okres" />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart Visualization */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="h-48 relative">
            {/* Chart Bars */}
            <div className="flex items-end justify-between h-full space-x-1">
              {chartData.map((point, index) => {
                const height = ((point.revenue - minRevenue) / (maxRevenue - minRevenue)) * 100;
                const isRecent = index >= chartData.length - 5; // Highlight recent data
                
                return (
                  <div
                    key={point.timestamp.toString()}
                    className={`flex-1 transition-all duration-200 ${
                      isRecent ? 'bg-green-500' : 'bg-green-300'
                    } rounded-t`}
                    style={{ height: `${Math.max(height, 5)}%` }}
                    title={`${new Date(point.timestamp).toLocaleDateString()}: ${point.revenue.toLocaleString()} €`}
                  />
                );
              })}
            </div>
            
            {/* X-axis labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>{chartData[0] ? new Date(chartData[0].timestamp).toLocaleDateString() : ''}</span>
              <span>{chartData[chartData.length - 1] ? new Date(chartData[chartData.length - 1].timestamp).toLocaleDateString() : ''}</span>
            </div>
          </div>
        </div>

        {/* Chart Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Łączny przychód</div>
            <div className="text-lg font-bold text-green-600">
              {revenueData.totalRevenue.toLocaleString()} €
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Średni przychód</div>
            <div className="text-lg font-bold text-blue-600">
              {revenueData.averageRevenue.toLocaleString()} €
            </div>
          </div>
        </div>

        {/* Revenue Details */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Łączne rezerwacje</div>
            <div className="text-lg font-bold text-purple-600">
              {revenueData.totalBookings}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Średnia marża</div>
            <div className="text-lg font-bold text-orange-600">
              {revenueData.averageProfitMargin}%
            </div>
          </div>
        </div>

        {/* Revenue Analysis */}
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <div className="text-sm font-medium text-green-900">
            Analiza przychodów
          </div>
          <div className="mt-2 text-sm text-green-700">
            {trend === "up" && "Przychody rosną - pozytywny trend biznesowy"}
            {trend === "down" && "Przychody spadają - wymagana analiza przyczyn"}
            {trend === "stable" && "Przychody są stabilne - przewidywalny biznes"}
          </div>
          <div className="mt-2 text-xs text-green-600">
            Średnia wartość rezerwacji: {chartData.length > 0 ? Math.round(chartData.reduce((sum, d) => sum + d.averageBookingValue, 0) / chartData.length).toLocaleString() : 0} € | 
            Średnia marża: {revenueData.averageProfitMargin}%
          </div>
        </div>

        {/* Profit Margin Chart */}
        <div className="mt-4">
          <div className="text-sm font-medium text-muted-foreground mb-2">Marża zysku</div>
          <div className="h-16 bg-gray-50 rounded p-2">
            <div className="flex items-end justify-between h-full space-x-1">
              {chartData.slice(-10).map((point, index) => {
                const marginHeight = point.profitMargin;
                
                return (
                  <div
                    key={point.timestamp.toString()}
                    className="flex-1 bg-orange-400 rounded-t"
                    style={{ height: `${Math.max(marginHeight, 5)}%` }}
                    title={`Marża: ${point.profitMargin}%`}
                  />
                );
              })}
            </div>
          </div>
          <div className="text-center mt-1 text-xs text-gray-500">
            Średnia marża: {revenueData.averageProfitMargin}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
