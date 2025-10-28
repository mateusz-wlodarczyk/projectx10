"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Database,
  Zap,
  BarChart3,
  Monitor,
  Flag,
  TestTube,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Server,
  Shield,
  HardDrive,
  Wifi,
  Code,
  Calendar,
  Globe,
} from "lucide-react";
import { BACKEND_URL } from "@/src/config/urls";

interface LogEntry {
  id: number;
  timestamp: string;
  level: "info" | "warning" | "error" | "debug";
  message: string;
  service: string;
  request_id: string;
  method?: string;
  path?: string;
  status_code?: number;
  duration?: string;
  database?: string;
  user?: string;
  bucket?: string;
  file_path?: string;
  file_size?: string;
  channel?: string;
  user_id?: string;
  function_name?: string;
  execution_time?: string;
  memory_used?: string;
  job_name?: string;
  status?: string;
  pool_size?: number;
  active_connections?: number;
}

interface CronJob {
  id: number;
  jobname: string;
  status: "succeeded" | "failed" | "running";
  start_time: string;
  end_time: string;
  return_message: string;
  duration: string;
}

interface SupabaseLogs {
  edgeLogs: { logs: LogEntry[]; total: number; message: string };
  postgresLogs: { logs: LogEntry[]; total: number; message: string };
  postgrestLogs: { logs: LogEntry[]; total: number; message: string };
  poolerLogs: { logs: LogEntry[]; total: number; message: string };
  authLogs: { logs: LogEntry[]; total: number; message: string };
  storageLogs: { logs: LogEntry[]; total: number; message: string };
  realtimeLogs: { logs: LogEntry[]; total: number; message: string };
  edgeFunctionsLogs: { logs: LogEntry[]; total: number; message: string };
  pgcronLogs: { logs: LogEntry[]; total: number; message: string };
}

interface AdvancedSettingsProps {
  advancedConfig: any;
  onAdvancedUpdate: (config: any) => void;
  onPerformanceTest: () => void;
  onFeatureFlagToggle: (flag: string, enabled: boolean) => void;
  loading: boolean;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  advancedConfig,
  onAdvancedUpdate,
  onPerformanceTest,
  onFeatureFlagToggle,
  loading,
}) => {
  const [supabaseLogs, setSupabaseLogs] = React.useState<SupabaseLogs | null>(
    null
  );
  const [logsLoading, setLogsLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<string>("all");

  const logTypes = [
    { id: "all", label: "All Logs", icon: Monitor },
    { id: "edge", label: "Edge", icon: Globe },
    { id: "postgres", label: "PostgreSQL", icon: Database },
    { id: "postgrest", label: "PostgREST", icon: Server },
    { id: "pooler", label: "Pooler", icon: Zap },
    { id: "auth", label: "Auth", icon: Shield },
    { id: "storage", label: "Storage", icon: HardDrive },
    { id: "realtime", label: "Realtime", icon: Wifi },
    { id: "edge-functions", label: "Edge Functions", icon: Code },
    { id: "pgcron", label: "pg_cron", icon: Calendar },
  ];

  const fetchAllLogs = async () => {
    setLogsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/admin/logs/all`);
      const data = await response.json();
      setSupabaseLogs(data.logs || null);
    } catch (error) {
      console.error("Error fetching all logs:", error);
    } finally {
      setLogsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAllLogs();
  }, []);

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      case "debug":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "succeeded":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "running":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getLogsForTab = () => {
    if (!supabaseLogs) return [];

    if (activeTab === "all") {
      const allLogs: LogEntry[] = [];
      Object.values(supabaseLogs).forEach((logGroup) => {
        allLogs.push(...logGroup.logs);
      });
      return allLogs.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    }

    const logKey = `${activeTab}Logs` as keyof SupabaseLogs;
    return supabaseLogs[logKey]?.logs || [];
  };

  const getTotalLogsCount = () => {
    if (!supabaseLogs) return 0;

    if (activeTab === "all") {
      return Object.values(supabaseLogs).reduce(
        (sum, logGroup) => sum + logGroup.total,
        0
      );
    }

    const logKey = `${activeTab}Logs` as keyof SupabaseLogs;
    return supabaseLogs[logKey]?.total || 0;
  };

  const getUnavailableMessage = () => {
    if (!supabaseLogs) return "";

    if (activeTab === "all") {
      return "Logi Supabase są obecnie niedostępne przez API. Dostęp do logów wymaga dodatkowej konfiguracji webhooków lub zewnętrznych usług logowania.";
    }

    const logKey = `${activeTab}Logs` as keyof SupabaseLogs;
    return supabaseLogs[logKey]?.message || "";
  };

  const renderLogEntry = (log: LogEntry) => {
    const IconComponent =
      logTypes.find((t) => t.id === log.service)?.icon || Monitor;

    return (
      <div key={log.id} className="border rounded-lg p-3 bg-gray-50">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <IconComponent className="h-4 w-4 text-gray-600" />
            <Badge className={getLogLevelColor(log.level)}>
              {log.level.toUpperCase()}
            </Badge>
            <Badge variant="outline">{log.service}</Badge>
            {log.status_code && (
              <Badge
                variant="outline"
                className={
                  log.status_code >= 400 ? "text-red-600" : "text-green-600"
                }
              >
                {log.status_code}
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(log.timestamp)}
          </span>
        </div>

        <p className="text-sm text-gray-700 mb-2">{log.message}</p>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>ID: {log.request_id}</span>
          {log.method && <span>Method: {log.method}</span>}
          {log.path && <span>Path: {log.path}</span>}
          {log.duration && <span>Duration: {log.duration}</span>}
          {log.database && <span>DB: {log.database}</span>}
          {log.user && <span>User: {log.user}</span>}
          {log.bucket && <span>Bucket: {log.bucket}</span>}
          {log.file_path && <span>File: {log.file_path}</span>}
          {log.file_size && <span>Size: {log.file_size}</span>}
          {log.channel && <span>Channel: {log.channel}</span>}
          {log.user_id && <span>User ID: {log.user_id}</span>}
          {log.function_name && <span>Function: {log.function_name}</span>}
          {log.execution_time && <span>Exec Time: {log.execution_time}</span>}
          {log.memory_used && <span>Memory: {log.memory_used}</span>}
          {log.job_name && <span>Job: {log.job_name}</span>}
          {log.status && <span>Status: {log.status}</span>}
          {log.pool_size && (
            <span>
              Pool: {log.active_connections}/{log.pool_size}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Advanced Settings
          </h2>
          <p className="text-muted-foreground">
            Logi Supabase - obecnie niedostępne przez API
          </p>
        </div>
        <Button onClick={fetchAllLogs} disabled={logsLoading} variant="outline">
          <RefreshCw
            className={`h-4 w-4 mr-2 ${logsLoading ? "animate-spin" : ""}`}
          />
          Refresh Logs
        </Button>
      </div>

      {/* Supabase Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Supabase Logs</span>
            <Badge variant="outline" className="ml-2">
              {getTotalLogsCount()} total entries
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg">
            {logTypes.map((logType) => {
              const IconComponent = logType.icon;
              return (
                <button
                  key={logType.id}
                  onClick={() => setActiveTab(logType.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-1 ${
                    activeTab === logType.id
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{logType.label}</span>
                </button>
              );
            })}
          </div>

          {/* Logs Display */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                {activeTab === "all"
                  ? "All Logs"
                  : `${logTypes.find((t) => t.id === activeTab)?.label} Logs`}
              </h3>
              <Badge variant="outline">{getLogsForTab().length} entries</Badge>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {logsLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Loading logs...
                  </p>
                </div>
              ) : getLogsForTab().length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Dane są obecnie niedostępne
                  </p>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    {getUnavailableMessage()}
                  </p>
                </div>
              ) : (
                getLogsForTab().map((log) => renderLogEntry(log))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedSettings;
