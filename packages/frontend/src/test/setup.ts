import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Global mocks
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  })),
  useSearchParams: vi.fn(() => ({
    get: vi.fn(),
  })),
  usePathname: vi.fn(() => "/"),
}));

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) =>
    React.createElement("img", { src, alt, ...props }),
}));

// Mock image loading to always succeed for Avatar components
Object.defineProperty(HTMLImageElement.prototype, "complete", {
  get: () => true,
});

Object.defineProperty(HTMLImageElement.prototype, "naturalHeight", {
  get: () => 100,
});

Object.defineProperty(HTMLImageElement.prototype, "naturalWidth", {
  get: () => 100,
});

// Mock image onload event
HTMLImageElement.prototype.addEventListener = vi.fn((event, callback) => {
  if (event === "load" && typeof callback === "function") {
    // Simulate successful image load
    setTimeout(() => {
      try {
        callback();
      } catch (error) {
        // Ignore errors from mock callbacks
      }
    }, 0);
  }
});

// Mock environment variables
vi.stubGlobal("process", {
  ...process,
  env: {
    ...process.env,
    NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
    NODE_ENV: "test",
  },
  listeners: vi.fn(() => []),
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
});
