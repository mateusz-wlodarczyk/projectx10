"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Download,
  Filter,
  Search,
  Calendar,
  User,
  AlertCircle,
  Info,
  AlertTriangle,
  XCircle,
  Bug,
  Eye,
  Trash2,
} from "lucide-react";
import { AdminLogsProps, LogEntry, LogFilter } from "../../types/admin";

const AdminLogs: React.FC<AdminLogsProps> = ({
  logs,
  onLogFilter,
  onLogExport,
  onLogLevelChange,
  loading,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [realTimeMode, setRealTimeMode] = useState(false);
  const [logLevel, setLogLevel] = useState<string>("info");
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
    end: new Date(),
  });
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock logs data for development
  const mockLogs: LogEntry[] = [
    {
      id: "1",
      level: "info",
      message: "User john.doe@example.com logged in successfully",
      timestamp: new Date("2024-01-15T10:30:00Z"),
      source: "auth",
      userId: "1",
      action: "login",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    {
      id: "2",
      level: "error",
      message: "Failed to sync boat data from external API",
      timestamp: new Date("2024-01-15T10:25:00Z"),
      source: "sync",
      action: "sync_boats",
      details: {
        error: "Connection timeout",
        apiUrl: "https://api.boats.com/data",
        retryAttempt: 3,
      },
    },
    {
      id: "3",
      level: "warn",
      message: "High memory usage detected on server",
      timestamp: new Date("2024-01-15T10:20:00Z"),
      source: "system",
      details: {
        memoryUsage: "85%",
        threshold: "80%",
      },
    },
    {
      id: "4",
      level: "debug",
      message: "Processing boat availability update",
      timestamp: new Date("2024-01-15T10:15:00Z"),
      source: "boats",
      action: "update_availability",
      details: {
        boatId: "12345",
        availability: "available",
      },
    },
    {
      id: "5",
      level: "info",
      message: "System backup completed successfully",
      timestamp: new Date("2024-01-15T09:45:00Z"),
      source: "backup",
      action: "backup_complete",
      details: {
        backupSize: "2.3 GB",
        duration: "15 minutes",
      },
    },
  ];

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === "all" || log.level === selectedLevel;
    const matchesSource =
      selectedSource === "all" || log.source === selectedSource;

    return matchesSearch && matchesLevel && matchesSource;
  });

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "debug":
        return "bg-gray-100 text-gray-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      case "warn":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "fatal":
        return "bg-red-200 text-red-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "debug":
        return <Bug className="h-4 w-4 text-gray-600" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-600" />;
      case "warn":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "fatal":
        return <XCircle className="h-4 w-4 text-red-700" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(timestamp);
  };

  const handleLogClick = (log: LogEntry) => {
    setSelectedLog(log);
    setIsDetailDialogOpen(true);
  };

  const handleExport = (format: string) => {
    onLogExport(format);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedLevel("all");
    setSelectedSource("all");
    setDateRange({
      start: new Date(Date.now() - 24 * 60 * 60 * 1000),
      end: new Date(),
    });
  };

  const handleRealTimeToggle = () => {
    setRealTimeMode(!realTimeMode);
    console.log("Real-time mode:", !realTimeMode);
  };

  const handleLogLevelChange = (level: string) => {
    setLogLevel(level);
    onLogLevelChange(level);
  };

  // Real-time logs effect
  React.useEffect(() => {
    if (!realTimeMode) return;

    const interval = setInterval(() => {
      console.log("Fetching new logs...");
      // In real implementation, this would fetch new logs from API
    }, 2000);

    return () => clearInterval(interval);
  }, [realTimeMode]);

  // Auto-scroll to bottom in real-time mode
  React.useEffect(() => {
    if (realTimeMode) {
      const logContainer = document.getElementById("logs-container");
      if (logContainer) {
        logContainer.scrollTop = logContainer.scrollHeight;
      }
    }
  }, [filteredLogs, realTimeMode]);

  const getUniqueSources = () => {
    return Array.from(new Set(mockLogs.map((log) => log.source)));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Admin Logs
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="realTimeMode"
                checked={realTimeMode}
                onChange={handleRealTimeToggle}
                className="rounded"
              />
              <label htmlFor="realTimeMode" className="text-sm text-gray-600">
                Real-time
              </label>
            </div>
            <Select value={logLevel} onValueChange={handleLogLevelChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debug">Debug</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="fatal">Fatal</SelectItem>
              </SelectContent>
            </Select>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Export Logs</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Export Format</label>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleExport("csv")}
                      >
                        CSV
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleExport("json")}
                      >
                        JSON
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleExport("pdf")}
                      >
                        PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="debug">Debug</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warn">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="fatal">Fatal</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedSource} onValueChange={setSelectedSource}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {getUniqueSources().map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleClearFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">From:</label>
            <input
              type="datetime-local"
              value={dateRange.start.toISOString().slice(0, 16)}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: new Date(e.target.value) })
              }
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">To:</label>
            <input
              type="datetime-local"
              value={dateRange.end.toISOString().slice(0, 16)}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: new Date(e.target.value) })
              }
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Page Size:</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(parseInt(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div
          className="border rounded-lg"
          id="logs-container"
          style={{ maxHeight: "600px", overflowY: "auto" }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Level</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow
                  key={log.id}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getLevelIcon(log.level)}
                      <Badge className={getLevelBadgeColor(log.level)}>
                        {log.level}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-mono">
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.source}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <p className="text-sm truncate">{log.message}</p>
                      {log.details && (
                        <p className="text-xs text-gray-500">
                          {Object.keys(log.details).length} details available
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {log.userId ? (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{log.userId}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {log.action ? (
                      <Badge variant="secondary">{log.action}</Badge>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLogClick(log)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Log Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Log Details</DialogTitle>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Level</label>
                    <div className="flex items-center space-x-2 mt-1">
                      {getLevelIcon(selectedLog.level)}
                      <Badge className={getLevelBadgeColor(selectedLog.level)}>
                        {selectedLog.level}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Source</label>
                    <p className="text-sm mt-1">{selectedLog.source}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Timestamp</label>
                  <p className="text-sm mt-1 font-mono">
                    {selectedLog.timestamp.toISOString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded border">
                    {selectedLog.message}
                  </p>
                </div>
                {selectedLog.action && (
                  <div>
                    <label className="text-sm font-medium">Action</label>
                    <p className="text-sm mt-1">{selectedLog.action}</p>
                  </div>
                )}
                {selectedLog.userId && (
                  <div>
                    <label className="text-sm font-medium">User ID</label>
                    <p className="text-sm mt-1">{selectedLog.userId}</p>
                  </div>
                )}
                {selectedLog.ipAddress && (
                  <div>
                    <label className="text-sm font-medium">IP Address</label>
                    <p className="text-sm mt-1 font-mono">
                      {selectedLog.ipAddress}
                    </p>
                  </div>
                )}
                {selectedLog.userAgent && (
                  <div>
                    <label className="text-sm font-medium">User Agent</label>
                    <p className="text-sm mt-1 break-all">
                      {selectedLog.userAgent}
                    </p>
                  </div>
                )}
                {selectedLog.details && (
                  <div>
                    <label className="text-sm font-medium">Details</label>
                    <pre className="text-sm mt-1 p-3 bg-gray-50 rounded border overflow-auto">
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AdminLogs;
