"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RefreshCw,
  Search,
  Filter,
  AlertTriangle,
  Info,
  AlertCircle,
  Bug,
  Database,
  Server,
  Shield,
  Globe,
} from "lucide-react";
import { SystemLog } from "@/src/types/logs";

interface SystemLogsMonitorProps {
  logs: SystemLog[];
  onRefresh: () => void;
  loading: boolean;
}

const SystemLogsMonitor: React.FC<SystemLogsMonitorProps> = ({
  logs,
  onRefresh,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");

  const getLevelColor = (level: string) => {
    switch (level) {
      case "info":
        return "bg-blue-100 text-blue-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "debug":
        return "bg-gray-100 text-gray-800";
      case "critical":
        return "bg-red-200 text-red-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "debug":
        return <Bug className="h-4 w-4 text-gray-500" />;
      case "critical":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case "database":
        return <Database className="h-4 w-4 text-blue-500" />;
      case "auth":
        return <Shield className="h-4 w-4 text-green-500" />;
      case "api":
        return <Globe className="h-4 w-4 text-purple-500" />;
      case "system":
        return <Server className="h-4 w-4 text-orange-500" />;
      case "cache":
        return <Database className="h-4 w-4 text-indigo-500" />;
      default:
        return <Server className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || log.level === levelFilter;
    const matchesService = serviceFilter === "all" || log.service === serviceFilter;
    
    return matchesSearch && matchesLevel && matchesService;
  });

  const getLogStats = () => {
    const totalLogs = logs.length;
    const errorLogs = logs.filter(log => log.level === 'error' || log.level === 'critical').length;
    const warningLogs = logs.filter(log => log.level === 'warning').length;
    const infoLogs = logs.filter(log => log.level === 'info').length;
    
    return { totalLogs, errorLogs, warningLogs, infoLogs };
  };

  const stats = getLogStats();

  const uniqueServices = Array.from(new Set(logs.map(log => log.service)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            System Logs Monitor
          </h2>
          <p className="text-muted-foreground">
            Monitor system logs and application events
          </p>
        </div>
        <Button variant="outline" onClick={onRefresh} disabled={loading}>
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Log Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLogs}</div>
            <p className="text-xs text-muted-foreground">
              All log entries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.errorLogs}</div>
            <p className="text-xs text-muted-foreground">
              Critical issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.warningLogs}</div>
            <p className="text-xs text-muted-foreground">
              Potential issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Info</CardTitle>
            <Info className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.infoLogs}</div>
            <p className="text-xs text-muted-foreground">
              Normal operations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Level</label>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Service</label>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {uniqueServices.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Log Entries ({filteredLogs.length} of {logs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No logs match the current filters
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getLevelIcon(log.level)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={getLevelColor(log.level)}>
                        {log.level.toUpperCase()}
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        {getServiceIcon(log.service)}
                        <span>{log.service}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {log.request_id}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 mb-1">
                      {log.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemLogsMonitor;
