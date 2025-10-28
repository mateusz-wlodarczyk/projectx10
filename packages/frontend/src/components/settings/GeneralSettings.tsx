"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GeneralConfig {
  site: {
    name: string;
    description: string;
    logo: string;
    favicon: string;
    domain: string;
    environment: "development" | "staging" | "production";
  };
}

interface GeneralSettingsProps {
  config: GeneralConfig;
  onConfigUpdate: (config: GeneralConfig) => void;
  loading: boolean;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  config,
  onConfigUpdate,
  loading,
}) => {
  const [localConfig, setLocalConfig] = React.useState<GeneralConfig>(config);

  const handleConfigChange = (
    section: keyof GeneralConfig,
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

  const handleSave = () => {
    onConfigUpdate(localConfig);
  };

  const handleReset = () => {
    setLocalConfig(config);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            General Settings
          </h2>
          <p className="text-muted-foreground">
            Core system settings and application configuration
          </p>
        </div>
      </div>

      {/* Site Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Site Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-lg font-medium mb-2">In Progress</h3>
            <p className="text-muted-foreground">
              General settings configuration is currently being developed.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettings;
