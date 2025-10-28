import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSettingsPage } from "../useSettingsPage";

// Mock the dependencies
vi.mock("../useTabs", () => ({
  useSettingsTabs: vi.fn(() => ({
    activeTab: "general",
    handleTabChange: vi.fn(),
    tabs: [],
  })),
}));

vi.mock("../../../lib/SettingsHandlers", () => ({
  createSettingsHandlers: vi.fn(() => ({
    handleConfigUpdate: vi.fn(),
    handleSecurityUpdate: vi.fn(),
    handlePolicyTest: vi.fn(),
    handleIPRestrictionUpdate: vi.fn(),
    handleIntegrationUpdate: vi.fn(),
    handleIntegrationTest: vi.fn(),
    handleWebhookUpdate: vi.fn(),
    handleAdvancedUpdate: vi.fn(),
    handlePerformanceTest: vi.fn(),
    handleFeatureFlagToggle: vi.fn(),
  })),
}));

// Mock the settings components
vi.mock(
  "../../../components/settings/GeneralSettings",
  () => ({ default: "GeneralSettings" })
);
vi.mock(
  "../../../components/settings/SecuritySettings",
  () => ({ default: "SecuritySettings" })
);
vi.mock(
  "../../../components/settings/IntegrationSettings",
  () => ({ default: "IntegrationSettings" })
);
vi.mock(
  "../../../components/settings/AdvancedSettings",
  () => ({ default: "AdvancedSettings" })
);

describe("useSettingsPage", () => {
  it("should return all required properties", () => {
    const { result } = renderHook(() => useSettingsPage());

    expect(result.current).toHaveProperty("activeTab");
    expect(result.current).toHaveProperty("handleTabChange");
    expect(result.current).toHaveProperty("tabs");
    expect(result.current).toHaveProperty("mockConfig");
    expect(result.current).toHaveProperty("settingsComponents");
    expect(result.current).toHaveProperty("handleConfigUpdate");
    expect(result.current).toHaveProperty("handleSecurityUpdate");
    expect(result.current).toHaveProperty("handlePolicyTest");
    expect(result.current).toHaveProperty("handleIPRestrictionUpdate");
    expect(result.current).toHaveProperty("handleIntegrationUpdate");
    expect(result.current).toHaveProperty("handleIntegrationTest");
    expect(result.current).toHaveProperty("handleWebhookUpdate");
    expect(result.current).toHaveProperty("handleAdvancedUpdate");
    expect(result.current).toHaveProperty("handlePerformanceTest");
    expect(result.current).toHaveProperty("handleFeatureFlagToggle");
  });

  it("should return mock config with correct structure", () => {
    const { result } = renderHook(() => useSettingsPage());

    expect(result.current.mockConfig).toEqual({
      site: {
        name: "Boats Analytics",
        description: "Comprehensive boat analytics platform",
        logo: "https://example.com/logo.png",
        favicon: "https://example.com/favicon.ico",
        domain: "boatsanalytics.com",
        environment: "production",
      },
    });
  });

  it("should return settings components with correct structure", () => {
    const { result } = renderHook(() => useSettingsPage());

    expect(result.current.settingsComponents).toHaveLength(4);
    expect(result.current.settingsComponents[0]).toEqual({
      id: "general",
      label: "General",
      component: expect.any(Function),
    });
    expect(result.current.settingsComponents[1]).toEqual({
      id: "security",
      label: "Security",
      component: expect.any(Function),
    });
    expect(result.current.settingsComponents[2]).toEqual({
      id: "integrations",
      label: "Integrations",
      component: expect.any(Function),
    });
    expect(result.current.settingsComponents[3]).toEqual({
      id: "advanced",
      label: "Advanced",
      component: expect.any(Function),
    });
  });

  it("should include all settings handlers", () => {
    const { result } = renderHook(() => useSettingsPage());

    expect(typeof result.current.handleConfigUpdate).toBe("function");
    expect(typeof result.current.handleSecurityUpdate).toBe("function");
    expect(typeof result.current.handlePolicyTest).toBe("function");
    expect(typeof result.current.handleIPRestrictionUpdate).toBe("function");
    expect(typeof result.current.handleIntegrationUpdate).toBe("function");
    expect(typeof result.current.handleIntegrationTest).toBe("function");
    expect(typeof result.current.handleWebhookUpdate).toBe("function");
    expect(typeof result.current.handleAdvancedUpdate).toBe("function");
    expect(typeof result.current.handlePerformanceTest).toBe("function");
    expect(typeof result.current.handleFeatureFlagToggle).toBe("function");
  });
});
