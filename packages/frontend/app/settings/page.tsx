"use client";

import React from "react";
import DashboardLayout from "@/src/components/dashboard/DashboardLayout";
import GeneralSettings from "@/src/components/settings/GeneralSettings";
import SecuritySettings from "@/src/components/settings/SecuritySettings";
import IntegrationSettings from "@/src/components/settings/IntegrationSettings";
import AdvancedSettings from "@/src/components/settings/AdvancedSettings";
import { useSettingsPage } from "@/src/hooks/useSettingsPage";
import { useAuth } from "@/src/components/auth/AuthProvider";
import AuthGuard from "@/src/components/auth/AuthGuard";
import { createDashboardUser } from "@/src/lib/user-utils";

export default function SettingsPage() {
  const { user } = useAuth();

  const {
    activeTab,
    handleTabChange,
    mockConfig,
    settingsComponents,
    handleConfigUpdate,
    handleSecurityUpdate,
    handlePolicyTest,
    handleIPRestrictionUpdate,
    handleIntegrationUpdate,
    handleIntegrationTest,
    handleWebhookUpdate,
    handleAdvancedUpdate,
    handlePerformanceTest,
    handleFeatureFlagToggle,
  } = useSettingsPage();

  const dashboardUser = createDashboardUser(user);

  if (!dashboardUser) {
    return null;
  }

  return (
    <AuthGuard requireAuth={true}>
      <DashboardLayout user={dashboardUser} currentPath="/settings">
        <div className="space-y-6">
          {/* Settings Tabs */}
          <div className="space-y-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {settingsComponents.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Active Tab Content */}
            <div className="mt-6">
              {activeTab === "general" && (
                <GeneralSettings
                  config={mockConfig}
                  onConfigUpdate={handleConfigUpdate}
                  loading={false}
                />
              )}
              {activeTab === "security" && (
                <SecuritySettings
                  securityConfig={{} as any}
                  onSecurityUpdate={handleSecurityUpdate}
                  onPolicyTest={handlePolicyTest}
                  onIPRestrictionUpdate={handleIPRestrictionUpdate}
                  loading={false}
                />
              )}
              {activeTab === "integrations" && (
                <IntegrationSettings
                  integrations={{} as any}
                  onIntegrationUpdate={handleIntegrationUpdate}
                  onIntegrationTest={handleIntegrationTest}
                  onWebhookUpdate={handleWebhookUpdate}
                  loading={false}
                />
              )}
              {activeTab === "advanced" && (
                <AdvancedSettings
                  advancedConfig={{} as any}
                  onAdvancedUpdate={handleAdvancedUpdate}
                  onPerformanceTest={handlePerformanceTest}
                  onFeatureFlagToggle={handleFeatureFlagToggle}
                  loading={false}
                />
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
