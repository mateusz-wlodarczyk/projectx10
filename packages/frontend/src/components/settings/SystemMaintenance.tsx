"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Wrench,
  Database,
  HardDrive,
  FileText,
  Download,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Play,
  Pause,
} from "lucide-react";

interface MaintenanceOperation {
  id: string;
  name: string;
  description: string;
  category: "database" | "cache" | "storage" | "logs" | "backup" | "system";
  estimatedDuration: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  requiresConfirmation: boolean;
  lastExecuted?: Date;
  status: "available" | "running" | "completed" | "failed";
}

interface SystemMaintenanceProps {
  maintenanceOps: MaintenanceOperation[];
  onMaintenanceExecute: (operation: string) => void;
  onSystemDiagnostic: () => void;
  onBackupCreate: () => void;
  onCacheClear: (type: string) => void;
  loading: boolean;
}

const SystemMaintenance: React.FC<SystemMaintenanceProps> = ({
  maintenanceOps,
  onMaintenanceExecute,
  onSystemDiagnostic,
  onBackupCreate,
  onCacheClear,
  loading,
}) => {
  const [selectedOperation, setSelectedOperation] = React.useState<string>("");
  const [operationProgress, setOperationProgress] = React.useState<
    Record<string, number>
  >({});
  const [operationStatus, setOperationStatus] = React.useState<
    Record<string, string>
  >({});

  const mockOperations: MaintenanceOperation[] = [
    {
      id: "db-vacuum",
      name: "Database Vacuum",
      description: "Clean up and optimize database storage",
      category: "database",
      estimatedDuration: "5-10 minutes",
      riskLevel: "low",
      requiresConfirmation: false,
      status: "available",
    },
    {
      id: "db-reindex",
      name: "Database Reindex",
      description: "Rebuild database indexes for better performance",
      category: "database",
      estimatedDuration: "15-30 minutes",
      riskLevel: "medium",
      requiresConfirmation: true,
      status: "available",
    },
    {
      id: "cache-clear",
      name: "Clear Cache",
      description: "Clear all cached data",
      category: "cache",
      estimatedDuration: "1-2 minutes",
      riskLevel: "low",
      requiresConfirmation: false,
      status: "available",
    },
    {
      id: "log-rotate",
      name: "Log Rotation",
      description: "Rotate and compress log files",
      category: "logs",
      estimatedDuration: "2-5 minutes",
      riskLevel: "low",
      requiresConfirmation: false,
      status: "available",
    },
    {
      id: "backup-full",
      name: "Full System Backup",
      description: "Create a complete system backup",
      category: "backup",
      estimatedDuration: "30-60 minutes",
      riskLevel: "medium",
      requiresConfirmation: true,
      status: "available",
    },
    {
      id: "system-restart",
      name: "System Restart",
      description: "Restart the application server",
      category: "system",
      estimatedDuration: "2-5 minutes",
      riskLevel: "high",
      requiresConfirmation: true,
      status: "available",
    },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-blue-100 text-blue-800";
      case "running":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "database":
        return <Database className="h-4 w-4" />;
      case "cache":
        return <HardDrive className="h-4 w-4" />;
      case "storage":
        return <HardDrive className="h-4 w-4" />;
      case "logs":
        return <FileText className="h-4 w-4" />;
      case "backup":
        return <Download className="h-4 w-4" />;
      case "system":
        return <Wrench className="h-4 w-4" />;
      default:
        return <Wrench className="h-4 w-4" />;
    }
  };

  const handleExecuteOperation = async (operation: MaintenanceOperation) => {
    if (operation.requiresConfirmation) {
      const confirmed = window.confirm(
        `Are you sure you want to execute "${operation.name}"? This operation has a ${operation.riskLevel} risk level.`
      );
      if (!confirmed) return;
    }

    setOperationStatus((prev) => ({ ...prev, [operation.id]: "running" }));
    setOperationProgress((prev) => ({ ...prev, [operation.id]: 0 }));

    // Simulate operation progress
    const interval = setInterval(() => {
      setOperationProgress((prev) => {
        const current = prev[operation.id] || 0;
        if (current >= 100) {
          clearInterval(interval);
          setOperationStatus((prev) => ({
            ...prev,
            [operation.id]: "completed",
          }));
          return prev;
        }
        return { ...prev, [operation.id]: current + 10 };
      });
    }, 500);

    try {
      await onMaintenanceExecute(operation.id);
    } catch (error) {
      clearInterval(interval);
      setOperationStatus((prev) => ({ ...prev, [operation.id]: "failed" }));
    }
  };

  const handleSystemDiagnostic = async () => {
    console.log("Running system diagnostic...");
    await onSystemDiagnostic();
  };

  const handleBackupCreate = async () => {
    console.log("Creating system backup...");
    await onBackupCreate();
  };

  const handleCacheClear = async (type: string) => {
    console.log(`Clearing ${type} cache...`);
    await onCacheClear(type);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            System Maintenance
          </h2>
          <p className="text-muted-foreground">
            System maintenance tools and operational controls
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleSystemDiagnostic}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Run Diagnostic
          </Button>
          <Button
            variant="outline"
            onClick={handleBackupCreate}
            disabled={loading}
          >
            <Download className="h-4 w-4 mr-2" />
            Create Backup
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              variant="outline"
              onClick={() => handleCacheClear("all")}
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear All Cache</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleCacheClear("user")}
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear User Cache</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleCacheClear("system")}
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear System Cache</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Operations */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockOperations.map((operation) => (
              <div
                key={operation.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(operation.category)}
                    <div>
                      <h3 className="font-medium">{operation.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {operation.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRiskColor(operation.riskLevel)}>
                      {operation.riskLevel.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(operation.status)}>
                      {operation.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Estimated Duration: {operation.estimatedDuration}</span>
                  {operation.lastExecuted && (
                    <span>
                      Last Executed: {operation.lastExecuted.toLocaleString()}
                    </span>
                  )}
                </div>

                {operationStatus[operation.id] === "running" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{operationProgress[operation.id] || 0}%</span>
                    </div>
                    <Progress value={operationProgress[operation.id] || 0} />
                  </div>
                )}

                {operationStatus[operation.id] === "completed" && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">
                      Operation completed successfully
                    </span>
                  </div>
                )}

                {operationStatus[operation.id] === "failed" && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">Operation failed</span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleExecuteOperation(operation)}
                    disabled={
                      operationStatus[operation.id] === "running" || loading
                    }
                  >
                    {operationStatus[operation.id] === "running" ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Execute
                      </>
                    )}
                  </Button>
                  {operation.requiresConfirmation && (
                    <Badge variant="outline" className="text-xs">
                      Requires Confirmation
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2.3s</div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">45%</div>
              <div className="text-sm text-muted-foreground">CPU Usage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">67%</div>
              <div className="text-sm text-muted-foreground">Memory Usage</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Emergency Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="font-medium text-red-800">
                  Emergency Procedures
                </h3>
              </div>
              <p className="text-sm text-red-700 mb-4">
                These operations should only be used in emergency situations and
                may cause system downtime.
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const confirmed = window.confirm(
                      "Are you sure you want to restart the system? This will cause temporary downtime."
                    );
                    if (confirmed) {
                      console.log("Emergency system restart initiated");
                    }
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Emergency Restart
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const confirmed = window.confirm(
                      "Are you sure you want to enter maintenance mode? This will disable public access."
                    );
                    if (confirmed) {
                      console.log("Emergency maintenance mode activated");
                    }
                  }}
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Emergency Maintenance
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMaintenance;
