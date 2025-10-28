export interface CronJobLog {
  id: number;
  jobname: string;
  status: 'succeeded' | 'failed' | 'running' | 'cancelled';
  start_time: string;
  end_time: string;
  return_message: string;
  duration: string;
}

export interface CronJob {
  jobid: number;
  schedule: string;
  command: string;
  nodename: string;
  nodeport: number;
  database: string;
  username: string;
  active: boolean;
  jobname: string;
  description: string;
}

export interface SystemLog {
  id: number;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug' | 'critical';
  message: string;
  service: string;
  request_id: string;
}

export interface CronLogsResponse {
  cronJobs: CronJobLog[];
  total: number;
}

export interface SystemLogsResponse {
  logs: SystemLog[];
  total: number;
}

export interface CronJobsResponse {
  jobs: CronJob[];
  total: number;
}

export interface LogsMonitorProps {
  cronLogs: CronJobLog[];
  systemLogs: SystemLog[];
  cronJobs: CronJob[];
  onRefresh: () => void;
  loading: boolean;
}
