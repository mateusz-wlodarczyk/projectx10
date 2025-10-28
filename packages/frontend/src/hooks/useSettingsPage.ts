import { useMemo } from "react";
import { useSettingsTabs } from "@/src/hooks/useTabs";
import GeneralSettings from "@/src/components/settings/GeneralSettings";
import SecuritySettings from "@/src/components/settings/SecuritySettings";
import IntegrationSettings from "@/src/components/settings/IntegrationSettings";
import AdvancedSettings from "@/src/components/settings/AdvancedSettings";
import { createSettingsHandlers } from "@/src/lib/SettingsHandlers";

export const useSettingsPage = () => {
  const tabs = useSettingsTabs();

  // Mock configuration data
  const mockConfig = useMemo(
    () => ({
      site: {
        name: "Boats Analytics",
        description: "Comprehensive boat analytics platform",
        logo: "https://example.com/logo.png",
        favicon: "https://example.com/favicon.ico",
        domain: "boatsanalytics.com",
        environment: "production" as const,
      },
    }),
    []
  );

  const settingsComponents = useMemo(
    () => [
      { id: "general", label: "General", component: GeneralSettings },
      { id: "security", label: "Security", component: SecuritySettings },
      {
        id: "integrations",
        label: "Integrations",
        component: IntegrationSettings,
      },
      { id: "advanced", label: "Advanced", component: AdvancedSettings },
    ],
    []
  );

  // Use generic settings handlers to eliminate code duplication
  const settingsHandlers = createSettingsHandlers();

  return {
    ...tabs,
    mockConfig,
    settingsComponents,
    ...settingsHandlers,
  };
};
