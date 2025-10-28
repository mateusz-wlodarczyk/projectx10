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
import {
  Database,
  Mail,
  MessageSquare,
  HardDrive,
  BarChart3,
  Webhook,
  TestTube,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

interface IntegrationConfig {
  database: {
    connectionPoolSize: number;
    queryTimeout: number;
    backupEnabled: boolean;
    backupInterval: number;
    replicationEnabled: boolean;
  };
  email: {
    provider: "smtp" | "sendgrid" | "ses" | "mailgun";
    apiKey: string;
    fromAddress: string;
    fromName: string;
    templates: EmailTemplate[];
  };
  sms: {
    provider: "twilio" | "aws_sns" | "messagebird";
    apiKey: string;
    fromNumber: string;
    templates: SMSTemplate[];
  };
  storage: {
    provider: "local" | "s3" | "gcs" | "azure";
    bucket: string;
    region: string;
    accessKey: string;
    secretKey: string;
    cdnEnabled: boolean;
  };
  analytics: {
    provider: "google" | "mixpanel" | "amplitude" | "custom";
    trackingId: string;
    apiKey: string;
    eventsEnabled: boolean;
    userTracking: boolean;
  };
  webhooks: WebhookConfig[];
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  isActive: boolean;
}

interface SMSTemplate {
  id: string;
  name: string;
  message: string;
  variables: string[];
  isActive: boolean;
}

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  enabled: boolean;
  retryAttempts: number;
  timeout: number;
}

interface IntegrationSettingsProps {
  integrations: IntegrationConfig;
  onIntegrationUpdate: (config: IntegrationConfig) => void;
  onIntegrationTest: (service: string) => void;
  onWebhookUpdate: (webhooks: WebhookConfig[]) => void;
  loading: boolean;
}

const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({
  integrations,
  onIntegrationUpdate,
  onIntegrationTest,
  onWebhookUpdate,
  loading,
}) => {
  const [localConfig, setLocalConfig] = React.useState<IntegrationConfig>(integrations);
  const [testResults, setTestResults] = React.useState<Record<string, { status: 'success' | 'error' | 'pending', message: string }>>({});

  const handleConfigChange = (
    section: keyof IntegrationConfig,
    field: string,
    value: any
  ) => {
    const updatedConfig = {
      ...localConfig,
      [section]: {
        ...localConfig[section],
        [field]: value,
      },
    };
    setLocalConfig(updatedConfig);
  };

  const handleNestedConfigChange = (
    section: keyof IntegrationConfig,
    subsection: string,
    field: string,
    value: any
  ) => {
    const updatedConfig = {
      ...localConfig,
      [section]: {
        ...localConfig[section],
        [subsection]: {
          ...(localConfig[section] as any)[subsection],
          [field]: value,
        },
      },
    };
    setLocalConfig(updatedConfig);
  };

  const handleSave = () => {
    onIntegrationUpdate(localConfig);
  };

  const handleReset = () => {
    setLocalConfig(integrations);
  };

  const handleTest = async (service: string) => {
    setTestResults(prev => ({ ...prev, [service]: { status: 'pending', message: 'Testing...' } }));
    
    try {
      await onIntegrationTest(service);
      setTestResults(prev => ({ ...prev, [service]: { status: 'success', message: 'Connection successful' } }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, [service]: { status: 'error', message: 'Connection failed' } }));
    }
  };

  const getTestIcon = (service: string) => {
    const result = testResults[service];
    if (!result) return null;
    
    switch (result.status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-500 animate-pulse" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Integration Settings
          </h2>
          <p className="text-muted-foreground">
            External service integrations and API configurations
          </p>
        </div>
      </div>

      {/* Supabase Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Supabase Integration</span>
            <Badge variant="secondary" className="ml-auto">
              Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Project ID</Label>
              <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                vcuzudiuwzsguzomizqa
              </div>
            </div>
            <div className="space-y-2">
              <Label>Region</Label>
              <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                us-east-1
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Database URL</Label>
            <div className="p-3 bg-gray-50 rounded-md font-mono text-sm break-all">
              postgresql://postgres:[password]@db.vcuzudiuwzsguzomizqa.supabase.co:5432/postgres
            </div>
          </div>
          <div className="space-y-2">
            <Label>API URL</Label>
            <div className="p-3 bg-gray-50 rounded-md font-mono text-sm break-all">
              https://vcuzudiuwzsguzomizqa.supabase.co
            </div>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-700">Connection successful</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationSettings;