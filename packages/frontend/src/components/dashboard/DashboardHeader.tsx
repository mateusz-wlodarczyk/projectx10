"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Anchor } from "lucide-react";
import { DashboardHeaderProps } from "../../types/dashboard";

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  summary,
  loading,
}) => {
  const formatLastUpdate = (date: Date | string) => {
    // Ensure we have a Date object
    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return "Brak danych";
    }

    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };


  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
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
            <Anchor className="h-5 w-5" />
            <span>Dashboard Analytics</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <div className="text-sm font-medium">Ostatnia aktualizacja</div>
            <div className="text-sm text-muted-foreground">
              {summary ? formatLastUpdate(summary.lastUpdate) : "Brak danych"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardHeader;
