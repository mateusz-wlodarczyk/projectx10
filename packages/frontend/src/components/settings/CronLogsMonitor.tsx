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
  Clock,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  Calendar,
  Database,
} from "lucide-react";
import { CronJobLog, CronJob } from "@/src/types/logs";

interface CronLogsMonitorProps {
  cronLogs: CronJobLog[];
  cronJobs: CronJob[];
  onRefresh: () => void;
  loading: boolean;
}

const CronLogsMonitor: React.FC<CronLogsMonitorProps> = ({
  cronLogs,
  cronJobs,
  onRefresh,
  loading,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "succeeded":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "running":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "succeeded":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "running":
        return <Play className="h-4 w-4 text-blue-500" />;
      case "cancelled":
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatSchedule = (schedule: string) => {
    // Convert cron format to human readable
    const parts = schedule.split(" ");
    if (parts.length === 5) {
      const [minute, hour, day, month, weekday] = parts;
      if (minute === "0" && hour === "2" && day === "*" && month === "*" && weekday === "*") {
        return "Daily at 2:00 AM";
      }
      if (minute === "0" && hour === "3" && day === "*" && month === "*" && weekday === "0") {
        return "Weekly on Sunday at 3:00 AM";
      }
    }
    return schedule;
  };

  const getJobStats = () => {
    const totalJobs = cronJobs.length;
    const activeJobs = cronJobs.filter(job => job.active).length;
    const recentLogs = cronLogs.slice(0, 10);
    const successRate = recentLogs.length > 0 
      ? Math.round((recentLogs.filter(log => log.status === 'succeeded').length / recentLogs.length) * 100)
      : 0;

    return { totalJobs, activeJobs, successRate };
  };

  const stats = getJobStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Cron Jobs Monitor
          </h2>
          <p className="text-muted-foreground">
            Monitor scheduled tasks and their execution history
          </p>
        </div>
        <Button variant="outline" onClick={onRefresh} disabled={loading}>
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Job Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeJobs} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              Last 10 executions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Executions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cronLogs.length}</div>
            <p className="text-xs text-muted-foreground">
              Total logged runs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Job Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Job Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cronJobs.map((job) => (
              <div
                key={job.jobid}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{job.jobname}</h3>
                    <Badge className={job.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {job.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {job.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                    <span>Schedule: {formatSchedule(job.schedule)}</span>
                    <span>Database: {job.database}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Job ID: {job.jobid}</div>
                  <div className="text-xs text-muted-foreground">
                    {job.nodename}:{job.nodeport}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Execution History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Executions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cronLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No execution logs available
              </div>
            ) : (
              cronLogs.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {getStatusIcon(log.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{log.jobname}</span>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {log.return_message}
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                        <span>
                          Started: {new Date(log.start_time).toLocaleString()}
                        </span>
                        <span>Duration: {log.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div>Job ID: {log.id}</div>
                    <div>
                      Ended: {new Date(log.end_time).toLocaleString()}
                    </div>
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

export default CronLogsMonitor;
