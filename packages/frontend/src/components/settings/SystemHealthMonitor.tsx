"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Settings,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface HealthMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  responseTime: number;
}

interface SystemAlert {
  id: string;
  level: "info" | "warning" | "critical" | "emergency";
  title: string;
  message: string;
  component: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

interface SystemHealthMonitorProps {
  metrics: HealthMetrics;
  alerts: SystemAlert[];
  onAlertDismiss: (alertId: string) => void;
  onRefresh: () => void;
  onAlertSettings: () => void;
  loading: boolean;
}

const SystemHealthMonitor: React.FC<SystemHealthMonitorProps> = ({
  metrics,
  alerts,
  onAlertDismiss,
  onRefresh,
  onAlertSettings,
  loading,
}) => {
  const getAlertColor = (level: string) => {
    switch (level) {
      case "info":
        return "bg-blue-100 text-blue-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-orange-100 text-orange-800";
      case "emergency":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMetricColor = (
    value: number,
    thresholds: { warning: number; critical: number }
  ) => {
    if (value >= thresholds.critical) return "text-red-600";
    if (value >= thresholds.warning) return "text-yellow-600";
    return "text-green-600";
  };

  const getMetricIcon = (
    value: number,
    thresholds: { warning: number; critical: number }
  ) => {
    if (value >= thresholds.critical)
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (value >= thresholds.warning)
      return <TrendingUp className="h-4 w-4 text-yellow-500" />;
    return <TrendingDown className="h-4 w-4 text-green-500" />;
  };

  const criticalAlerts = alerts.filter(
    (alert) => alert.level === "critical" || alert.level === "emergency"
  );
  const unacknowledgedAlerts = alerts.filter((alert) => !alert.acknowledged);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            System Health Monitor
          </h2>
          <p className="text-muted-foreground">
            Real-time system health monitoring and alerting
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={onAlertSettings}
            disabled={loading}
          >
            <Settings className="h-4 w-4 mr-2" />
            Alert Settings
          </Button>
          <Button variant="outline" onClick={onRefresh} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Alert Summary */}
      {(criticalAlerts.length > 0 || unacknowledgedAlerts.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Active Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {criticalAlerts.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Critical Alerts
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {unacknowledgedAlerts.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Unacknowledged
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {alerts.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Alerts
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            {getMetricIcon(metrics.cpuUsage, { warning: 70, critical: 90 })}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getMetricColor(metrics.cpuUsage, { warning: 70, critical: 90 })}`}
            >
              {metrics.cpuUsage}%
            </div>
            <Progress value={metrics.cpuUsage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.cpuUsage < 70
                ? "Normal"
                : metrics.cpuUsage < 90
                  ? "High"
                  : "Critical"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            {getMetricIcon(metrics.memoryUsage, { warning: 80, critical: 95 })}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getMetricColor(metrics.memoryUsage, { warning: 80, critical: 95 })}`}
            >
              {metrics.memoryUsage}%
            </div>
            <Progress value={metrics.memoryUsage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.memoryUsage < 80
                ? "Normal"
                : metrics.memoryUsage < 95
                  ? "High"
                  : "Critical"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            {getMetricIcon(metrics.diskUsage, { warning: 85, critical: 95 })}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getMetricColor(metrics.diskUsage, { warning: 85, critical: 95 })}`}
            >
              {metrics.diskUsage}%
            </div>
            <Progress value={metrics.diskUsage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.diskUsage < 85
                ? "Normal"
                : metrics.diskUsage < 95
                  ? "High"
                  : "Critical"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Network Latency
            </CardTitle>
            {getMetricIcon(metrics.networkLatency, {
              warning: 50,
              critical: 100,
            })}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getMetricColor(metrics.networkLatency, { warning: 50, critical: 100 })}`}
            >
              {metrics.networkLatency}ms
            </div>
            <Progress
              value={Math.min(metrics.networkLatency, 100)}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.networkLatency < 50
                ? "Good"
                : metrics.networkLatency < 100
                  ? "Slow"
                  : "Poor"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            {getMetricIcon(metrics.responseTime, {
              warning: 200,
              critical: 500,
            })}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getMetricColor(metrics.responseTime, { warning: 200, critical: 500 })}`}
            >
              {metrics.responseTime}ms
            </div>
            <Progress
              value={Math.min(metrics.responseTime / 5, 100)}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.responseTime < 200
                ? "Fast"
                : metrics.responseTime < 500
                  ? "Slow"
                  : "Very Slow"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-lg font-semibold text-green-600">
                Healthy
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {alert.level === "emergency" && (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                      {alert.level === "critical" && (
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                      )}
                      {alert.level === "warning" && (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      )}
                      {alert.level === "info" && (
                        <AlertTriangle className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{alert.title}</span>
                        <Badge className={getAlertColor(alert.level)}>
                          {alert.level.toUpperCase()}
                        </Badge>
                        {alert.acknowledged && (
                          <Badge className="bg-gray-100 text-gray-800">
                            ACKNOWLEDGED
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {alert.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {alert.timestamp.toLocaleString()} • {alert.component}
                      </p>
                    </div>
                  </div>
                  {!alert.acknowledged && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAlertDismiss(alert.id)}
                    >
                      Dismiss
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Uptime */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>System Uptime</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-sm text-muted-foreground">
                Uptime (30 days)
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">15d 8h</div>
              <div className="text-sm text-muted-foreground">
                Current Uptime
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">2</div>
              <div className="text-sm text-muted-foreground">
                Incidents (30 days)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealthMonitor;
