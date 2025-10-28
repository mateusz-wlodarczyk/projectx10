"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, TrendingDown, Minus, Calendar, Users } from "lucide-react";
import {
  AvailabilityChartProps,
  TIME_RANGE_OPTIONS,
} from "../../types/dashboard";

const AvailabilityChart: React.FC<AvailabilityChartProps> = ({
  availabilityData,
  timeRange,
  onTimeRangeChange,
  loading,
  error,
}) => {
  // Process data for chart display
  const chartData = useMemo(() => {
    if (!availabilityData || !availabilityData.dataPoints) return [];

    // Sort by timestamp and limit to recent data points
    return availabilityData.dataPoints
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
      .slice(-30); // Show last 30 data points
  }, [availabilityData]);

  // Calculate trend
  const trend = useMemo(() => {
    if (chartData.length < 2) return "stable";

    const firstHalf = chartData.slice(0, Math.floor(chartData.length / 2));
    const secondHalf = chartData.slice(Math.floor(chartData.length / 2));

    const firstAvg =
      firstHalf.reduce((sum, d) => sum + d.availabilityRate, 0) /
      firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, d) => sum + d.availabilityRate, 0) /
      secondHalf.length;

    const change = secondAvg - firstAvg;

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
        return "Wzrost dostępności";
      case "down":
        return "Spadek dostępności";
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
            <div className="text-red-600 mb-2">
              Błąd ładowania wykresu dostępności
            </div>
            <div className="text-sm text-gray-500">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!availabilityData || chartData.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-gray-500 mb-2">Brak danych o dostępności</div>
            <div className="text-sm text-gray-400">
              Nie znaleziono danych o dostępności dla wybranego typu łodzi
            </div>
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
            <Calendar className="h-5 w-5" />
            <span>Trendy dostępności</span>
            {getTrendIcon()}
            <span className={`text-sm ${getTrendColor()}`}>
              ({getTrendText()})
            </span>
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
                const height = point.availabilityRate;
                const isRecent = index >= chartData.length - 5; // Highlight recent data

                return (
                  <div
                    key={point.timestamp.toString()}
                    className={`flex-1 transition-all duration-200 ${
                      isRecent ? "bg-blue-500" : "bg-blue-300"
                    } rounded-t`}
                    style={{ height: `${Math.max(height, 5)}%` }}
                    title={`${new Date(point.timestamp).toLocaleDateString()}: ${point.availabilityRate}% dostępności`}
                  />
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>
                {chartData[0]
                  ? new Date(chartData[0].timestamp).toLocaleDateString()
                  : ""}
              </span>
              <span>
                {chartData[chartData.length - 1]
                  ? new Date(
                      chartData[chartData.length - 1].timestamp
                    ).toLocaleDateString()
                  : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Chart Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Średnia dostępność
            </div>
            <div className="text-lg font-bold text-blue-600">
              {availabilityData.averageAvailability}%
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Średnie obłożenie
            </div>
            <div className="text-lg font-bold text-orange-600">
              {availabilityData.averageOccupancy}%
            </div>
          </div>
        </div>

        {/* Availability Insights */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm font-medium text-blue-900">
            Analiza dostępności
          </div>
          <div className="mt-2 text-sm text-blue-700">
            {trend === "up" && "Dostępność rośnie - więcej łodzi dostępnych"}
            {trend === "down" && "Dostępność spada - mniej łodzi dostępnych"}
            {trend === "stable" && "Dostępność jest stabilna"}
          </div>
          <div className="mt-2 text-xs text-blue-600">
            Łączna liczba łodzi: {availabilityData.totalBoats} | Średnie
            obłożenie: {availabilityData.averageOccupancy}%
          </div>
        </div>

        {/* Occupancy Chart */}
        <div className="mt-4">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            Obłożenie vs Dostępność
          </div>
          <div className="h-24 bg-gray-50 rounded p-2">
            <div className="flex items-end justify-between h-full space-x-1">
              {chartData.slice(-10).map((point, index) => {
                const availabilityHeight = point.availabilityRate;
                const occupancyHeight = point.occupancyRate;

                return (
                  <div
                    key={point.timestamp.toString()}
                    className="flex-1 flex flex-col justify-end space-y-1"
                  >
                    <div
                      className="bg-orange-400 rounded-t"
                      style={{ height: `${Math.max(occupancyHeight, 5)}%` }}
                      title={`Obłożenie: ${point.occupancyRate}%`}
                    />
                    <div
                      className="bg-blue-400 rounded-t"
                      style={{ height: `${Math.max(availabilityHeight, 5)}%` }}
                      title={`Dostępność: ${point.availabilityRate}%`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-center space-x-4 mt-2 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-400 rounded"></div>
              <span>Obłożenie</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-400 rounded"></div>
              <span>Dostępność</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilityChart;
