"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CronLogsMonitor from "./CronLogsMonitor";
import SystemLogsMonitor from "./SystemLogsMonitor";
import { CronJobLog, CronJob, SystemLog } from "@/src/types/logs";

interface LogsMonitorProps {
  onRefresh: () => void;
  loading: boolean;
}

const LogsMonitor: React.FC<LogsMonitorProps> = ({ onRefresh, loading }) => {
  const [cronLogs, setCronLogs] = useState<CronJobLog[]>([]);
  const [cronJobs, setCronJobs] = useState<CronJob[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      // Fetch cron logs
      const cronLogsResponse = await fetch(
        "http://localhost:8080/admin/logs/cron"
      );
      if (cronLogsResponse.ok) {
        const cronData = await cronLogsResponse.json();
        setCronLogs(cronData.cronJobs || []);
      }

      // Fetch cron jobs configuration
      const cronJobsResponse = await fetch(
        "http://localhost:8080/admin/cron/jobs"
      );
      if (cronJobsResponse.ok) {
        const jobsData = await cronJobsResponse.json();
        setCronJobs(jobsData.jobs || []);
      }

      // Fetch system logs
      const systemLogsResponse = await fetch(
        "http://localhost:8080/admin/logs/system"
      );
      if (systemLogsResponse.ok) {
        const logsData = await systemLogsResponse.json();
        setSystemLogs(logsData.logs || []);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      // Don't set mock data - let the error state handle it
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleRefresh = () => {
    fetchLogs();
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="cron" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cron">Cron Jobs</TabsTrigger>
          <TabsTrigger value="system">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="cron" className="space-y-4">
          <CronLogsMonitor
            cronLogs={cronLogs}
            cronJobs={cronJobs}
            onRefresh={handleRefresh}
            loading={logsLoading}
          />
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <SystemLogsMonitor
            logs={systemLogs}
            onRefresh={handleRefresh}
            loading={logsLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogsMonitor;
