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
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  RefreshCw,
  Play,
  Square,
  RotateCcw,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Database,
  BarChart3,
} from "lucide-react";
import { SyncOperationsProps, SyncJob } from "../../types/admin";

const SyncOperations: React.FC<SyncOperationsProps> = ({
  syncJobs,
  onSyncTrigger,
  onJobCancel,
  onJobRetry,
  loading,
}) => {
  const [isTriggerDialogOpen, setIsTriggerDialogOpen] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState<string>("");
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [scheduledJob, setScheduledJob] = useState({
    type: "",
    schedule: "",
    enabled: true,
  });
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock sync jobs data for development
  const mockSyncJobs: SyncJob[] = [
    {
      id: "1",
      type: "daily",
      status: "completed",
      progress: 100,
      startedAt: new Date("2024-01-15T08:00:00Z"),
      completedAt: new Date("2024-01-15T08:45:00Z"),
      estimatedDuration: "45 minutes",
      results: {
        boatsProcessed: 15420,
        newBoats: 127,
        updatedBoats: 2341,
        deletedBoats: 23,
        errors: 0,
      },
      createdBy: "system",
    },
    {
      id: "2",
      type: "weekly",
      status: "running",
      progress: 67,
      startedAt: new Date("2024-01-15T10:00:00Z"),
      estimatedDuration: "2 hours",
      createdBy: "admin",
    },
    {
      id: "3",
      type: "manual",
      status: "failed",
      progress: 23,
      startedAt: new Date("2024-01-15T09:30:00Z"),
      estimatedDuration: "30 minutes",
      error: "Connection timeout to external API",
      createdBy: "admin",
    },
  ];

  const displayedJobs = mockSyncJobs;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "running":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "running":
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "cancelled":
        return <Square className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDuration = (startTime: Date, endTime?: Date) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) {
      return `${diffMins}m`;
    }
    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;
    return `${diffHours}h ${remainingMins}m`;
  };

  const handleTriggerSync = () => {
    if (selectedJobType) {
      onSyncTrigger(selectedJobType);
      setIsTriggerDialogOpen(false);
      setSelectedJobType("");
    }
  };

  const handleCancelJob = (jobId: string) => {
    if (confirm("Are you sure you want to cancel this job?")) {
      onJobCancel(jobId);
    }
  };

  const handleRetryJob = (jobId: string) => {
    onJobRetry(jobId);
  };

  const handleScheduleJob = () => {
    console.log("Scheduling job:", scheduledJob);
    setIsScheduleDialogOpen(false);
    setScheduledJob({ type: "", schedule: "", enabled: true });
  };

  const handleBulkOperation = (operation: string) => {
    const selectedJobs = displayedJobs.filter(
      (job) => job.status === "running"
    );
    console.log(`Bulk ${operation}:`, selectedJobs);
  };

  // Auto-refresh effect
  React.useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      console.log("Auto-refreshing sync jobs...");
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Sync Operations
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoRefresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="autoRefresh" className="text-sm text-gray-600">
                Auto-refresh
              </label>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsScheduleDialogOpen(true)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkOperation("cancel")}
              disabled={
                displayedJobs.filter((job) => job.status === "running")
                  .length === 0
              }
            >
              <Square className="h-4 w-4 mr-2" />
              Cancel All
            </Button>
            <Dialog
              open={isTriggerDialogOpen}
              onOpenChange={setIsTriggerDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Play className="h-4 w-4 mr-2" />
                  Trigger Sync
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Trigger Sync Operation</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sync Type</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={selectedJobType}
                      onChange={(e) => setSelectedJobType(e.target.value)}
                    >
                      <option value="">Select sync type...</option>
                      <option value="daily">Daily Sync</option>
                      <option value="weekly">Weekly Sync</option>
                      <option value="monthly">Monthly Sync</option>
                      <option value="manual">Manual Sync</option>
                    </select>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>Daily Sync:</strong> Updates boat data and
                      availability
                    </p>
                    <p>
                      <strong>Weekly Sync:</strong> Full data synchronization
                      and cleanup
                    </p>
                    <p>
                      <strong>Monthly Sync:</strong> Archive old data and
                      optimize database
                    </p>
                    <p>
                      <strong>Manual Sync:</strong> Custom synchronization
                      process
                    </p>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsTriggerDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleTriggerSync}
                    disabled={!selectedJobType}
                  >
                    Trigger Sync
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Sync Jobs Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Results</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-gray-400" />
                      <span className="font-medium capitalize">{job.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(job.status)}
                      <Badge className={getStatusBadgeColor(job.status)}>
                        {job.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{job.progress}%</span>
                        <span className="text-gray-500">
                          {job.estimatedDuration}
                        </span>
                      </div>
                      <Progress value={job.progress} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {job.startedAt
                          ? formatDuration(job.startedAt, job.completedAt)
                          : "-"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {job.startedAt
                          ? new Intl.DateTimeFormat("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }).format(job.startedAt)
                          : "-"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {job.results ? (
                      <div className="text-sm space-y-1">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="h-3 w-3 text-gray-400" />
                          <span>
                            {job.results.boatsProcessed.toLocaleString()} boats
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          +{job.results.newBoats} new,{" "}
                          {job.results.updatedBoats} updated
                        </div>
                        {job.results.errors > 0 && (
                          <div className="text-xs text-red-500">
                            {job.results.errors} errors
                          </div>
                        )}
                      </div>
                    ) : job.error ? (
                      <div className="text-sm text-red-600 max-w-xs truncate">
                        {job.error}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {job.status === "running" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelJob(job.id)}
                        >
                          <Square className="h-3 w-3" />
                        </Button>
                      )}
                      {job.status === "failed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRetryJob(job.id)}
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Sync Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Successful Syncs</p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    displayedJobs.filter((job) => job.status === "completed")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Failed Syncs</p>
                <p className="text-2xl font-bold text-red-600">
                  {
                    displayedJobs.filter((job) => job.status === "failed")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Running Jobs</p>
                <p className="text-2xl font-bold text-blue-600">
                  {
                    displayedJobs.filter((job) => job.status === "running")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Job Dialog */}
        <Dialog
          open={isScheduleDialogOpen}
          onOpenChange={setIsScheduleDialogOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Schedule Sync Job</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Type</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={scheduledJob.type}
                  onChange={(e) =>
                    setScheduledJob({ ...scheduledJob, type: e.target.value })
                  }
                >
                  <option value="">Select job type...</option>
                  <option value="daily">Daily Sync</option>
                  <option value="weekly">Weekly Sync</option>
                  <option value="monthly">Monthly Sync</option>
                  <option value="custom">Custom Sync</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Schedule</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={scheduledJob.schedule}
                  onChange={(e) =>
                    setScheduledJob({
                      ...scheduledJob,
                      schedule: e.target.value,
                    })
                  }
                >
                  <option value="">Select schedule...</option>
                  <option value="every_hour">Every Hour</option>
                  <option value="every_6_hours">Every 6 Hours</option>
                  <option value="daily_midnight">Daily at Midnight</option>
                  <option value="daily_6am">Daily at 6 AM</option>
                  <option value="weekly_sunday">Weekly on Sunday</option>
                  <option value="monthly_1st">Monthly on 1st</option>
                  <option value="custom">Custom Cron</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={scheduledJob.enabled}
                  onChange={(e) =>
                    setScheduledJob({
                      ...scheduledJob,
                      enabled: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <label htmlFor="enabled" className="text-sm">
                  Enable immediately
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsScheduleDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleScheduleJob}
                disabled={!scheduledJob.type || !scheduledJob.schedule}
              >
                Schedule Job
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SyncOperations;
