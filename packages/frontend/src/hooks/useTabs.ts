import { useState, useCallback, useMemo } from "react";

interface Tab {
  id: string;
  label: string;
  component: React.ComponentType<any>;
}

interface UseTabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

/**
 * Custom hook for tab management
 */
export const useTabs = ({ tabs, defaultTab }: UseTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");

  const activeTabData = useMemo(() => {
    return tabs.find((tab) => tab.id === activeTab);
  }, [tabs, activeTab]);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  return {
    activeTab,
    activeTabData,
    handleTabChange,
    tabs,
  };
};

/**
 * Custom hook for settings page tabs
 */
export const useSettingsTabs = () => {
  const tabs: Tab[] = [
    { id: "general", label: "General", component: () => null },
    { id: "security", label: "Security", component: () => null },
    { id: "integrations", label: "Integrations", component: () => null },
    { id: "advanced", label: "Advanced", component: () => null },
  ];

  return useTabs({ tabs, defaultTab: "general" });
};
