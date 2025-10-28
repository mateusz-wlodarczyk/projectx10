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
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  HardDrive,
  Mail,
  MessageSquare,
  RefreshCw,
  Server,
  Shield,
  Wifi,
} from "lucide-react";

interface SystemHealthStatus {
  overall: "healthy" | "warning" | "critical" | "unknown";
  components: {
    database: ComponentHealth;
    cache: ComponentHealth;
    storage: ComponentHealth;
    email: ComponentHealth;
    sms: ComponentHealth;
    integrations: ComponentHealth;
  };
  metrics: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkLatency: number;
    responseTime: number;
  };
  alerts: SystemAlert[];
  lastChecked: Date;
}

interface ComponentHealth {
  status: "healthy" | "warning" | "critical" | "unknown";
  message: string;
  responseTime?: number;
  lastChecked: Date;
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

interface SettingsHeaderProps {
  systemHealth: SystemHealthStatus;
  onHealthCheck: () => void;
  onAlertAcknowledge: (alertId: string) => void;
  onEmergencyMode: () => void;
  loading: boolean;
  currentTime: string;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  systemHealth,
  onHealthCheck,
  onAlertAcknowledge,
  onEmergencyMode,
  loading,
  currentTime,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "critical":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">
            Comprehensive system configuration and settings management
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={onHealthCheck}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Health Check</span>
          </Button>
          <Button
            variant="destructive"
            onClick={onEmergencyMode}
            className="flex items-center space-x-2"
          >
            <Shield className="h-4 w-4" />
            <span>Emergency Mode</span>
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            {getStatusIcon(systemHealth.overall)}
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(systemHealth.overall)}>
                {systemHealth.overall.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Last checked: {currentTime || "Loading..."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemHealth.metrics.cpuUsage}%
            </div>
            <p className="text-xs text-muted-foreground">
              {systemHealth.metrics.cpuUsage < 70 ? "Normal" : "High"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemHealth.metrics.memoryUsage}%
            </div>
            <p className="text-xs text-muted-foreground">
              {systemHealth.metrics.memoryUsage < 80 ? "Normal" : "High"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemHealth.metrics.responseTime}ms
            </div>
            <p className="text-xs text-muted-foreground">
              {systemHealth.metrics.responseTime < 200 ? "Good" : "Slow"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Component Status */}
      <Card>
        <CardHeader>
          <CardTitle>Component Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(systemHealth.components).map(([key, component]) => (
              <div key={key} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {key === "database" && (
                    <Database className="h-5 w-5 text-muted-foreground" />
                  )}
                  {key === "cache" && (
                    <Server className="h-5 w-5 text-muted-foreground" />
                  )}
                  {key === "storage" && (
                    <HardDrive className="h-5 w-5 text-muted-foreground" />
                  )}
                  {key === "email" && (
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  )}
                  {key === "sms" && (
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  )}
                  {key === "integrations" && (
                    <Wifi className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium capitalize">
                      {key}
                    </span>
                    <Badge className={getStatusColor(component.status)}>
                      {component.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {component.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      {systemHealth.alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Critical Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemHealth.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={
                          alert.level === "critical"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {alert.level.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{alert.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {alert.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {alert.timestamp.toLocaleString()}
                    </p>
                  </div>
                  {!alert.acknowledged && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAlertAcknowledge(alert.id)}
                    >
                      Acknowledge
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SettingsHeader;
