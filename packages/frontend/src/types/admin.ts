// Core Admin Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  status: "active" | "inactive" | "pending" | "suspended";
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  profile: UserProfile;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  nickname?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  timezone: string;
  language: string;
  notifications: NotificationSettings;
  preferences: UserPreferences;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
  category: string;
}

export interface SystemConfig {
  general: {
    siteName: string;
    siteDescription: string;
    defaultLanguage: string;
    defaultTimezone: string;
    maintenanceMode: boolean;
  };
  security: {
    sessionTimeout: number;
    passwordPolicy: PasswordPolicy;
    twoFactorAuth: boolean;
    loginAttempts: number;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    emailTemplates: EmailTemplate[];
  };
  sync: {
    autoSync: boolean;
    syncInterval: number;
    maxConcurrentJobs: number;
    retryAttempts: number;
  };
  backup: {
    autoBackup: boolean;
    backupInterval: number;
    retentionDays: number;
    backupLocation: string;
  };
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxAge: number;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  isActive: boolean;
}

export interface SyncJob {
  id: string;
  type: "daily" | "weekly" | "monthly" | "manual";
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
  estimatedDuration?: string;
  results?: {
    boatsProcessed: number;
    newBoats: number;
    updatedBoats: number;
    deletedBoats: number;
    errors: number;
  };
  error?: string;
  createdBy: string;
}

export interface LogEntry {
  id: string;
  level: "debug" | "info" | "warn" | "error" | "fatal";
  message: string;
  timestamp: Date;
  source: string;
  userId?: string;
  action?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  lastSync?: Date;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface UserPreferences {
  theme: string;
  dateFormat: string;
}

// Component Interface Types
export interface AdminHeaderProps {
  metrics: SystemMetrics;
  onRefresh: () => void;
  loading: boolean;
}

export interface UserManagementProps {
  users: User[];
  loading: boolean;
}

export interface SystemSettingsProps {
  settings: SystemConfig;
  onSettingsUpdate: (settings: SystemConfig) => void;
  onBackup: () => void;
  onRestore: (backupFile: File) => void;
  onReset: () => void;
  loading: boolean;
}

export interface SyncOperationsProps {
  syncJobs: SyncJob[];
  onSyncTrigger: (jobType: string) => void;
  onJobCancel: (jobId: string) => void;
  onJobRetry: (jobId: string) => void;
  loading: boolean;
}

export interface AdminLogsProps {
  logs: LogEntry[];
  onLogFilter: (filter: LogFilter) => void;
  onLogExport: (format: string) => void;
  onLogLevelChange: (level: string) => void;
  loading: boolean;
}

export interface RoleManagementProps {
  roles: Role[];
  permissions: Permission[];
  onRoleCreate: (role: CreateRoleRequest) => void;
  onRoleUpdate: (role: UpdateRoleRequest) => void;
  onRoleDelete: (roleId: string) => void;
  onPermissionUpdate: (permission: Permission) => void;
  loading: boolean;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: string;
  profile: Partial<UserProfile>;
}

export interface UpdateUserRequest {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  role?: string;
  status?: string;
  profile?: Partial<UserProfile>;
}

export interface LogFilter {
  level?: string;
  source?: string;
  userId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissions: string[];
}

export interface UpdateRoleRequest {
  id: string;
  name?: string;
  description?: string;
  permissions?: string[];
}
