"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Settings,
  Save,
  Download,
  Upload,
  RotateCcw,
  Shield,
  Bell,
  Database,
  Globe,
  AlertTriangle,
} from "lucide-react";
import { SystemSettingsProps, SystemConfig } from "../../types/admin";

const SystemSettings: React.FC<SystemSettingsProps> = ({
  settings,
  onSettingsUpdate,
  onBackup,
  onRestore,
  onReset,
  loading,
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    general: {
      siteName: "Boats Analytics",
      siteDescription: "Yacht booking analytics platform",
      defaultLanguage: "en",
      defaultTimezone: "UTC",
      maintenanceMode: false,
    },
    security: {
      sessionTimeout: 3600,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxAge: 90,
      },
      twoFactorAuth: false,
      loginAttempts: 5,
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      emailTemplates: [],
    },
    sync: {
      autoSync: true,
      syncInterval: 24,
      maxConcurrentJobs: 3,
      retryAttempts: 3,
    },
    backup: {
      autoBackup: true,
      backupInterval: 24,
      retentionDays: 30,
      backupLocation: "/backups",
    },
  });

  const handleGeneralUpdate = (field: string, value: any) => {
    setSystemConfig({
      ...systemConfig,
      general: {
        ...systemConfig.general,
        [field]: value,
      },
    });
  };

  const handleSecurityUpdate = (field: string, value: any) => {
    setSystemConfig({
      ...systemConfig,
      security: {
        ...systemConfig.security,
        [field]: value,
      },
    });
  };

  const handlePasswordPolicyUpdate = (field: string, value: any) => {
    setSystemConfig({
      ...systemConfig,
      security: {
        ...systemConfig.security,
        passwordPolicy: {
          ...systemConfig.security.passwordPolicy,
          [field]: value,
        },
      },
    });
  };

  const handleNotificationsUpdate = (field: string, value: any) => {
    setSystemConfig({
      ...systemConfig,
      notifications: {
        ...systemConfig.notifications,
        [field]: value,
      },
    });
  };

  const handleSyncUpdate = (field: string, value: any) => {
    setSystemConfig({
      ...systemConfig,
      sync: {
        ...systemConfig.sync,
        [field]: value,
      },
    });
  };

  const handleBackupUpdate = (field: string, value: any) => {
    setSystemConfig({
      ...systemConfig,
      backup: {
        ...systemConfig.backup,
        [field]: value,
      },
    });
  };

  const handleSave = () => {
    onSettingsUpdate(systemConfig);
  };

  const handleBackupClick = () => {
    onBackup();
  };

  const handleReset = () => {
    if (
      confirm("Are you sure you want to reset all settings to default values?")
    ) {
      onReset();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Settings
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleBackupClick}>
              <Download className="h-4 w-4 mr-2" />
              Backup
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="sync" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Sync
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Backup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Site Configuration</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={systemConfig.general.siteName}
                      onChange={(e) =>
                        handleGeneralUpdate("siteName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultLanguage">Default Language</Label>
                    <Select
                      value={systemConfig.general.defaultLanguage}
                      onValueChange={(value) =>
                        handleGeneralUpdate("defaultLanguage", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={systemConfig.general.siteDescription}
                    onChange={(e) =>
                      handleGeneralUpdate("siteDescription", e.target.value)
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultTimezone">Default Timezone</Label>
                  <Select
                    value={systemConfig.general.defaultTimezone}
                    onValueChange={(value) =>
                      handleGeneralUpdate("defaultTimezone", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">
                        Eastern Time
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time
                      </SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="maintenanceMode"
                    checked={systemConfig.general.maintenanceMode}
                    onCheckedChange={(checked) =>
                      handleGeneralUpdate("maintenanceMode", checked)
                    }
                  />
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Authentication Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">
                      Session Timeout (seconds)
                    </Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={systemConfig.security.sessionTimeout}
                      onChange={(e) =>
                        handleSecurityUpdate(
                          "sessionTimeout",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                    <Input
                      id="loginAttempts"
                      type="number"
                      value={systemConfig.security.loginAttempts}
                      onChange={(e) =>
                        handleSecurityUpdate(
                          "loginAttempts",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="twoFactorAuth"
                    checked={systemConfig.security.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      handleSecurityUpdate("twoFactorAuth", checked)
                    }
                  />
                  <Label htmlFor="twoFactorAuth">
                    Enable Two-Factor Authentication
                  </Label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password Policy</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minLength">Minimum Length</Label>
                    <Input
                      id="minLength"
                      type="number"
                      value={systemConfig.security.passwordPolicy.minLength}
                      onChange={(e) =>
                        handlePasswordPolicyUpdate(
                          "minLength",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAge">Max Age (days)</Label>
                    <Input
                      id="maxAge"
                      type="number"
                      value={systemConfig.security.passwordPolicy.maxAge}
                      onChange={(e) =>
                        handlePasswordPolicyUpdate(
                          "maxAge",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireUppercase"
                      checked={
                        systemConfig.security.passwordPolicy.requireUppercase
                      }
                      onCheckedChange={(checked) =>
                        handlePasswordPolicyUpdate("requireUppercase", checked)
                      }
                    />
                    <Label htmlFor="requireUppercase">
                      Require Uppercase Letters
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireLowercase"
                      checked={
                        systemConfig.security.passwordPolicy.requireLowercase
                      }
                      onCheckedChange={(checked) =>
                        handlePasswordPolicyUpdate("requireLowercase", checked)
                      }
                    />
                    <Label htmlFor="requireLowercase">
                      Require Lowercase Letters
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireNumbers"
                      checked={
                        systemConfig.security.passwordPolicy.requireNumbers
                      }
                      onCheckedChange={(checked) =>
                        handlePasswordPolicyUpdate("requireNumbers", checked)
                      }
                    />
                    <Label htmlFor="requireNumbers">Require Numbers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireSpecialChars"
                      checked={
                        systemConfig.security.passwordPolicy.requireSpecialChars
                      }
                      onCheckedChange={(checked) =>
                        handlePasswordPolicyUpdate(
                          "requireSpecialChars",
                          checked
                        )
                      }
                    />
                    <Label htmlFor="requireSpecialChars">
                      Require Special Characters
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Channels</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="emailEnabled"
                      checked={systemConfig.notifications.emailEnabled}
                      onCheckedChange={(checked) =>
                        handleNotificationsUpdate("emailEnabled", checked)
                      }
                    />
                    <Label htmlFor="emailEnabled">Email Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="smsEnabled"
                      checked={systemConfig.notifications.smsEnabled}
                      onCheckedChange={(checked) =>
                        handleNotificationsUpdate("smsEnabled", checked)
                      }
                    />
                    <Label htmlFor="smsEnabled">SMS Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="pushEnabled"
                      checked={systemConfig.notifications.pushEnabled}
                      onCheckedChange={(checked) =>
                        handleNotificationsUpdate("pushEnabled", checked)
                      }
                    />
                    <Label htmlFor="pushEnabled">Push Notifications</Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sync" className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Synchronization Settings
                </h3>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoSync"
                    checked={systemConfig.sync.autoSync}
                    onCheckedChange={(checked) =>
                      handleSyncUpdate("autoSync", checked)
                    }
                  />
                  <Label htmlFor="autoSync">Enable Auto Sync</Label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="syncInterval">Sync Interval (hours)</Label>
                    <Input
                      id="syncInterval"
                      type="number"
                      value={systemConfig.sync.syncInterval}
                      onChange={(e) =>
                        handleSyncUpdate(
                          "syncInterval",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxConcurrentJobs">
                      Max Concurrent Jobs
                    </Label>
                    <Input
                      id="maxConcurrentJobs"
                      type="number"
                      value={systemConfig.sync.maxConcurrentJobs}
                      onChange={(e) =>
                        handleSyncUpdate(
                          "maxConcurrentJobs",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retryAttempts">Retry Attempts</Label>
                  <Input
                    id="retryAttempts"
                    type="number"
                    value={systemConfig.sync.retryAttempts}
                    onChange={(e) =>
                      handleSyncUpdate(
                        "retryAttempts",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Backup Settings</h3>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoBackup"
                    checked={systemConfig.backup.autoBackup}
                    onCheckedChange={(checked) =>
                      handleBackupUpdate("autoBackup", checked)
                    }
                  />
                  <Label htmlFor="autoBackup">Enable Auto Backup</Label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="backupInterval">
                      Backup Interval (hours)
                    </Label>
                    <Input
                      id="backupInterval"
                      type="number"
                      value={systemConfig.backup.backupInterval}
                      onChange={(e) =>
                        handleBackupUpdate(
                          "backupInterval",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retentionDays">Retention Days</Label>
                    <Input
                      id="retentionDays"
                      type="number"
                      value={systemConfig.backup.retentionDays}
                      onChange={(e) =>
                        handleBackupUpdate(
                          "retentionDays",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupLocation">Backup Location</Label>
                  <Input
                    id="backupLocation"
                    value={systemConfig.backup.backupLocation}
                    onChange={(e) =>
                      handleBackupUpdate("backupLocation", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;
