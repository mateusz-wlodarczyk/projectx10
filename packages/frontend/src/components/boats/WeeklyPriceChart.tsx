"use client";

import React, { useMemo } from 'react';
import { PriceChartData } from '@/src/types/boat-detail';

interface WeeklyPriceChartProps {
  priceData: PriceChartData;
  selectedWeek: number;
  onWeekChange: (week: number) => void;
  loading: boolean;
  error: string | null;
}

export default function WeeklyPriceChart({ 
  priceData, 
  selectedWeek, 
  onWeekChange, 
  loading, 
  error 
}: WeeklyPriceChartProps) {
  
  // Process data for chart display
  const chartData = useMemo(() => {
    if (!priceData || !priceData.weeks) return [];

    // Group data by week and get the latest price for each week
    const weeklyData = priceData.weeks.reduce((acc, point) => {
      if (!acc[point.week] || new Date(point.timestamp) > new Date(acc[point.week].timestamp)) {
        acc[point.week] = point;
      }
      return acc;
    }, {} as Record<number, typeof priceData.weeks[0]>);

    return Object.values(weeklyData).sort((a, b) => a.week - b.week);
  }, [priceData]);

  // Get week range for display
  const weekRange = useMemo(() => {
    if (chartData.length === 0) return { min: 1, max: 53 };
    const weeks = chartData.map(d => d.week);
    return { min: Math.min(...weeks), max: Math.max(...weeks) };
  }, [chartData]);

  // Generate week options
  const weekOptions = useMemo(() => {
    const options = [];
    for (let week = weekRange.min; week <= weekRange.max; week++) {
      if (chartData.some(d => d.week === week)) {
        options.push(week);
      }
    }
    return options;
  }, [chartData, weekRange]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
        <div className="h-8 bg-gray-200 rounded w-32 mt-4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">Błąd ładowania wykresu</div>
        <div className="text-sm text-gray-500">{error}</div>
      </div>
    );
  }

  if (!priceData || chartData.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-2">Brak danych cenowych</div>
        <div className="text-sm text-gray-400">Nie znaleziono danych cenowych dla tej łodzi</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chart Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Ceny w czasie
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Tydzień:</span>
          <select
            value={selectedWeek}
            onChange={(e) => onWeekChange(parseInt(e.target.value))}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            {weekOptions.map(week => (
              <option key={week} value={week}>
                Tydzień {week}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Price Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-xs text-blue-600 font-medium">Min</div>
          <div className="text-lg font-bold text-blue-900">
            {priceData.minPrice?.toLocaleString()} €
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-xs text-green-600 font-medium">Średnia</div>
          <div className="text-lg font-bold text-green-900">
            {Math.round(priceData.avgPrice)?.toLocaleString()} €
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-3">
          <div className="text-xs text-red-600 font-medium">Max</div>
          <div className="text-lg font-bold text-red-900">
            {priceData.maxPrice?.toLocaleString()} €
          </div>
        </div>
      </div>

      {/* Simple Chart Visualization */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="h-48 relative">
          {/* Chart Bars */}
          <div className="flex items-end justify-between h-full space-x-1">
            {chartData.slice(0, 20).map((point, index) => {
              const height = ((point.price - priceData.minPrice) / (priceData.maxPrice - priceData.minPrice)) * 100;
              const isSelected = point.week === selectedWeek;
              
              return (
                <div
                  key={point.week}
                  className={`flex-1 cursor-pointer transition-all duration-200 ${
                    isSelected ? 'bg-blue-500' : 'bg-blue-300 hover:bg-blue-400'
                  } rounded-t`}
                  style={{ height: `${Math.max(height, 5)}%` }}
                  onClick={() => onWeekChange(point.week)}
                  title={`Tydzień ${point.week}: ${point.price.toLocaleString()} €`}
                />
              );
            })}
          </div>
          
          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Tydzień {chartData[0]?.week || 1}</span>
            <span>Tydzień {chartData[chartData.length - 1]?.week || 53}</span>
          </div>
        </div>
      </div>

      {/* Trend Indicator */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">Trend cen:</span>
        <div className={`flex items-center space-x-1 ${
          priceData.trends.isIncreasing ? 'text-green-600' :
          priceData.trends.isDecreasing ? 'text-red-600' :
          'text-gray-600'
        }`}>
          <span className="text-sm font-medium">
            {priceData.trends.isIncreasing ? '↗ Wzrost' :
             priceData.trends.isDecreasing ? '↘ Spadek' :
             '→ Stabilny'}
          </span>
          <span className="text-xs">
            ({priceData.trends.changePercentage > 0 ? '+' : ''}{priceData.trends.changePercentage.toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* Selected Week Details */}
      {selectedWeek && (
        <div className="bg-blue-50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Szczegóły tygodnia {selectedWeek}
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Liczba pomiarów:</span>
              <span className="text-blue-900">
                {priceData.weeks.filter(p => p.week === selectedWeek).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Zakres cen:</span>
              <span className="text-blue-900">
                {(() => {
                  const weekData = priceData.weeks.filter(p => p.week === selectedWeek);
                  const prices = weekData.map(p => p.price);
                  return `${Math.min(...prices).toLocaleString()} - ${Math.max(...prices).toLocaleString()} €`;
                })()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
