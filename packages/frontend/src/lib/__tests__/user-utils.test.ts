import { describe, it, expect, vi } from "vitest";
import {
  createDashboardUser,
  generateAvatarFallback,
  getUserDisplayName,
} from "../user-utils";
import { User, DashboardUser } from "../user-utils";
import { getMockUser } from "../mock-data";

// Mock the getMockUser function
vi.mock("../mock-data", () => ({
  getMockUser: vi.fn(() => ({
    id: "mock-user-1",
    email: "mock@example.com",
    firstName: "Mock",
    lastName: "User",
    avatar: undefined,
    emailVerified: true,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    lastLoginAt: new Date("2023-01-01"),
  })),
}));

describe("user-utils", () => {
  const mockUser: User = {
    id: "test-user-1",
    email: "test@example.com",
    firstName: "John",
    lastName: "Doe",
    avatar: "https://example.com/avatar.jpg",
    emailVerified: true,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    lastLoginAt: new Date("2023-01-01"),
  };

  const mockUserWithoutNames: User = {
    ...mockUser,
    firstName: undefined,
    lastName: undefined,
  };

  describe("createDashboardUser", () => {
    it("should transform a valid user to DashboardUser", () => {
      const result = createDashboardUser(mockUser);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        avatar: mockUser.avatar,
        emailVerified: mockUser.emailVerified,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
        lastLoginAt: mockUser.lastLoginAt,
      });
    });

    it("should handle user without firstName and lastName", () => {
      const result = createDashboardUser(mockUserWithoutNames);

      expect(result.firstName).toBe("");
      expect(result.lastName).toBe("");
    });

    it("should return mock user when user is null", () => {
      const result = createDashboardUser(null);

      expect(result).toBeDefined();
      expect(result.id).toBe("mock-user-1");
      expect(result.email).toBe("mock@example.com");
    });

    it("should return mock user when user is undefined", () => {
      const result = createDashboardUser(undefined);

      expect(result).toBeDefined();
      expect(result.id).toBe("mock-user-1");
      expect(result.email).toBe("mock@example.com");
    });
  });

  describe("generateAvatarFallback", () => {
    it("should generate fallback from firstName and lastName", () => {
      const result = generateAvatarFallback(mockUser);

      expect(result).toBe("JD");
    });

    it("should generate fallback from email when names are missing", () => {
      const result = generateAvatarFallback(mockUserWithoutNames);

      expect(result).toBe("TE"); // First letters of "test@example.com"
    });

    it("should handle email with dots", () => {
      const userWithDots = {
        ...mockUserWithoutNames,
        email: "john.doe.smith@example.com",
      };

      const result = generateAvatarFallback(userWithDots);

      expect(result).toBe("JO"); // First 2 characters of "john.doe.smith"
    });

    it("should limit fallback to 2 characters", () => {
      const userWithLongEmail = {
        ...mockUserWithoutNames,
        email: "a@example.com",
      };

      const result = generateAvatarFallback(userWithLongEmail);

      expect(result).toBe("A");
    });
  });

  describe("getUserDisplayName", () => {
    it("should return full name when firstName and lastName are available", () => {
      const result = getUserDisplayName(mockUser);

      expect(result).toBe("John Doe");
    });

    it("should return email when names are missing", () => {
      const result = getUserDisplayName(mockUserWithoutNames);

      expect(result).toBe(mockUserWithoutNames.email);
    });

    it("should return email when firstName is missing", () => {
      const userWithoutFirstName = {
        ...mockUser,
        firstName: undefined,
      };

      const result = getUserDisplayName(userWithoutFirstName);

      expect(result).toBe(userWithoutFirstName.email);
    });

    it("should return email when lastName is missing", () => {
      const userWithoutLastName = {
        ...mockUser,
        lastName: undefined,
      };

      const result = getUserDisplayName(userWithoutLastName);

      expect(result).toBe(userWithoutLastName.email);
    });
  });
});
