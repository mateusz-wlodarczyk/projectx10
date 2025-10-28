"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Activity, RefreshCw, Clock } from "lucide-react";
import { AdminHeaderProps, SystemMetrics } from "../../types/admin";

const AdminHeader: React.FC<AdminHeaderProps> = ({
  metrics,
  onRefresh,
  loading,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Overview
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={loading}
                data-testid="refresh-button"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Users */}
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">
                  {metrics.totalUsers.toLocaleString()}
                </p>
                <div className="flex items-center space-x-1">
                  <Badge variant="secondary" className="text-xs">
                    {metrics.activeUsers} active
                  </Badge>
                </div>
              </div>
            </div>

            {/* Last Sync */}
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Last Sync</p>
                <p className="text-sm font-medium">
                  {metrics.lastSync ? formatDate(metrics.lastSync) : "Never"}
                </p>
                <div className="flex items-center space-x-1">
                  <Badge variant="outline" className="text-xs">
                    Users data
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHeader;
