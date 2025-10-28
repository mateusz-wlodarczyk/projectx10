"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

interface BoatAvailabilityData {
  available: boolean;
  nextAvailableDate?: Date | string;
  bookedDates: (Date | string)[];
  maintenanceDates: (Date | string)[];
  seasonalAvailability: {
    start: Date | string;
    end: Date | string;
  };
  lastUpdated: Date | string;
}

interface BoatAvailabilityProps {
  availability: BoatAvailabilityData;
  onDateSelect: (date: Date) => void;
  onAvailabilityCheck: () => void;
  selectedDate?: Date;
  loading: boolean;
}

const BoatAvailability: React.FC<BoatAvailabilityProps> = ({
  availability,
  onDateSelect,
  onAvailabilityCheck,
  selectedDate,
  loading,
}) => {
  const [selectedMonth, setSelectedMonth] = React.useState(new Date());

  // Helper function to safely convert date string to Date object
  const toDate = (date: Date | string): Date => {
    return typeof date === "string" ? new Date(date) : date;
  };

  const generateCalendarDays = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isBooked = availability.bookedDates.some(
        (bookedDate) =>
          toDate(bookedDate).toDateString() === date.toDateString()
      );
      const isMaintenance = availability.maintenanceDates.some(
        (maintenanceDate) =>
          toDate(maintenanceDate).toDateString() === date.toDateString()
      );
      const isPast = date < new Date();
      const isSelected =
        selectedDate && selectedDate.toDateString() === date.toDateString();

      days.push({
        date,
        day,
        isBooked,
        isMaintenance,
        isPast,
        isSelected,
        isAvailable: !isBooked && !isMaintenance && !isPast,
      });
    }

    return days;
  };

  const getAvailabilityStatus = () => {
    if (availability.available) {
      return {
        status: "Available",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      };
    } else if (availability.nextAvailableDate) {
      return {
        status: "Available Soon",
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      };
    } else {
      return {
        status: "Unavailable",
        color: "bg-red-100 text-red-800",
        icon: XCircle,
      };
    }
  };

  const availabilityStatus = getAvailabilityStatus();
  const StatusIcon = availabilityStatus.icon;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Availability</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Availability Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <StatusIcon className="h-5 w-5" />
            <span className="font-medium">Current Status</span>
          </div>
          <Badge className={availabilityStatus.color}>
            {availabilityStatus.status}
          </Badge>
        </div>

        {availability.nextAvailableDate && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-800">
              Next Available
            </div>
            <div className="text-sm text-blue-600">
              {toDate(availability.nextAvailableDate).toLocaleDateString()}
            </div>
          </div>
        )}

        <Separator />

        {/* Calendar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Availability Calendar</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSelectedMonth(
                    new Date(
                      selectedMonth.getFullYear(),
                      selectedMonth.getMonth() - 1
                    )
                  )
                }
              >
                ←
              </Button>
              <span className="text-sm font-medium min-w-32 text-center">
                {selectedMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSelectedMonth(
                    new Date(
                      selectedMonth.getFullYear(),
                      selectedMonth.getMonth() + 1
                    )
                  )
                }
              >
                →
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-xs font-medium text-center p-2 text-muted-foreground"
              >
                {day}
              </div>
            ))}

            {generateCalendarDays().map((dayData, index) => (
              <div
                key={index}
                className="aspect-square flex items-center justify-center"
              >
                {dayData ? (
                  <button
                    onClick={() =>
                      dayData.isAvailable && onDateSelect(dayData.date)
                    }
                    disabled={!dayData.isAvailable}
                    className={`w-full h-full text-xs rounded transition-colors ${
                      dayData.isSelected
                        ? "bg-blue-500 text-white"
                        : dayData.isBooked
                          ? "bg-red-100 text-red-600 cursor-not-allowed"
                          : dayData.isMaintenance
                            ? "bg-yellow-100 text-yellow-600 cursor-not-allowed"
                            : dayData.isPast
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "hover:bg-blue-100 text-gray-700"
                    }`}
                  >
                    {dayData.day}
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-100 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-100 rounded"></div>
              <span>Booked</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-100 rounded"></div>
              <span>Maintenance</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-100 rounded"></div>
              <span>Past</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Seasonal Availability */}
        <div className="space-y-3">
          <h3 className="font-medium">Seasonal Availability</h3>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm">
              <div className="flex justify-between">
                <span>Season Start:</span>
                <span>
                  {toDate(
                    availability.seasonalAvailability.start
                  ).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Season End:</span>
                <span>
                  {toDate(
                    availability.seasonalAvailability.end
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button onClick={onAvailabilityCheck} className="w-full">
            Check Availability
          </Button>
          <Button variant="outline" className="w-full">
            Request Custom Dates
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Last updated:{" "}
          {typeof availability.lastUpdated === "string"
            ? new Date(availability.lastUpdated).toLocaleString()
            : availability.lastUpdated.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default BoatAvailability;
