"use client";

import React, { useMemo } from 'react';
import { DiscountChartData } from '@/src/types/boat-detail';

interface DiscountChartProps {
  discountData: DiscountChartData;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  loading: boolean;
  error: string | null;
}

export default function DiscountChart({ 
  discountData, 
  timeRange, 
  onTimeRangeChange, 
  loading, 
  error 
}: DiscountChartProps) {
  
  // Process data for chart display
  const chartData = useMemo(() => {
    if (!discountData || !discountData.dataPoints) return [];

    // Sort by timestamp and limit to recent data points
    return discountData.dataPoints
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-30); // Show last 30 data points
  }, [discountData]);

  const timeRangeOptions = [
    { value: 'all', label: 'Wszystkie' },
    { value: 'week', label: 'Ostatni tydzień' },
    { value: 'month', label: 'Ostatni miesiąc' },
    { value: 'quarter', label: 'Ostatni kwartał' },
  ];

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
        <div className="text-red-600 mb-2">Błąd ładowania wykresu rabatów</div>
        <div className="text-sm text-gray-500">{error}</div>
      </div>
    );
  }

  if (!discountData || chartData.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-2">Brak danych o rabatach</div>
        <div className="text-sm text-gray-400">Nie znaleziono danych o rabatach dla tej łodzi</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chart Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Rabaty w czasie
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Zakres:</span>
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Discount Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-xs text-green-600 font-medium">Min</div>
          <div className="text-lg font-bold text-green-900">
            {discountData.minDiscount}%
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-xs text-blue-600 font-medium">Średnia</div>
          <div className="text-lg font-bold text-blue-900">
            {Math.round(discountData.avgDiscount)}%
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg p-3">
          <div className="text-xs text-orange-600 font-medium">Max</div>
          <div className="text-lg font-bold text-orange-900">
            {discountData.maxDiscount}%
          </div>
        </div>
      </div>

      {/* Simple Chart Visualization */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="h-48 relative">
          {/* Chart Bars */}
          <div className="flex items-end justify-between h-full space-x-1">
            {chartData.map((point, index) => {
              const height = ((point.discount - discountData.minDiscount) / (discountData.maxDiscount - discountData.minDiscount)) * 100;
              const isRecent = index >= chartData.length - 5; // Highlight recent data
              
              return (
                <div
                  key={point.timestamp}
                  className={`flex-1 transition-all duration-200 ${
                    isRecent ? 'bg-green-500' : 'bg-green-300'
                  } rounded-t`}
                  style={{ height: `${Math.max(height, 5)}%` }}
                  title={`${new Date(point.timestamp).toLocaleDateString()}: ${point.discount}% rabatu`}
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

      {/* Trend Indicator */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">Trend rabatów:</span>
        <div className={`flex items-center space-x-1 ${
          discountData.trends.isIncreasing ? 'text-green-600' :
          discountData.trends.isDecreasing ? 'text-red-600' :
          'text-gray-600'
        }`}>
          <span className="text-sm font-medium">
            {discountData.trends.isIncreasing ? '↗ Wzrost' :
             discountData.trends.isDecreasing ? '↘ Spadek' :
             '→ Stabilny'}
          </span>
          <span className="text-xs">
            ({discountData.trends.changePercentage > 0 ? '+' : ''}{discountData.trends.changePercentage.toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* Recent Discounts */}
      <div className="bg-green-50 rounded-lg p-3">
        <h4 className="text-sm font-medium text-green-900 mb-2">
          Ostatnie rabaty
        </h4>
        <div className="space-y-1 text-sm max-h-32 overflow-y-auto">
          {chartData.slice(-10).reverse().map((point, index) => (
            <div key={point.timestamp} className="flex justify-between">
              <span className="text-green-700">
                {new Date(point.timestamp).toLocaleDateString()}
              </span>
              <span className="text-green-900 font-medium">
                {point.discount}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Discount Range */}
      <div className="bg-gray-50 rounded-lg p-3">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Zakres rabatów
        </h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Najniższy rabat:</span>
            <span className="text-gray-900 font-medium">{discountData.minDiscount}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Najwyższy rabat:</span>
            <span className="text-gray-900 font-medium">{discountData.maxDiscount}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Różnica:</span>
            <span className="text-gray-900 font-medium">
              {discountData.maxDiscount - discountData.minDiscount}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
