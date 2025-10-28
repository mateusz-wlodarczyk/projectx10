import { describe, it, expect, vi } from "vitest";

describe("Test Setup Verification", () => {
  it("should run basic test", () => {
    expect(1 + 1).toBe(2);
  });

  it("should have access to vi mock utilities", () => {
    const mockFn = vi.fn();
    mockFn("test");
    expect(mockFn).toHaveBeenCalledWith("test");
  });
});
