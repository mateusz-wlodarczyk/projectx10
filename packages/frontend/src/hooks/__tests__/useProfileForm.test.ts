import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useProfileForm } from "../useProfileForm";
import { User } from "../../lib/user-utils";

// Mock the logger
vi.mock("../../lib/Logger", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useProfileForm Hook", () => {
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

  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSave.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial State", () => {
    it("should initialize with correct default state", () => {
      // Arrange & Act
      const { result } = renderHook(() =>
        useProfileForm({ user: mockUser, onSave: mockOnSave })
      );

      // Assert
      expect(result.current.formData).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
      expect(result.current.isEditing).toBe(false);
      expect(result.current.isSaving).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.isValid).toBe(true);
    });

    it("should initialize with empty form data when user is null", () => {
      // Arrange & Act
      const { result } = renderHook(() =>
        useProfileForm({ user: null, onSave: mockOnSave })
      );

      // Assert
      expect(result.current.formData).toEqual({
        firstName: "",
        lastName: "",
      });
      expect(result.current.isEditing).toBe(false);
      expect(result.current.isSaving).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.isValid).toBe(false);
    });

    it("should initialize with partial user data", () => {
      // Arrange
      const partialUser: User = {
        ...mockUser,
        firstName: "John",
        lastName: undefined,
      };

      // Act
      const { result } = renderHook(() =>
        useProfileForm({ user: partialUser, onSave: mockOnSave })
      );

      // Assert
      expect(result.current.formData).toEqual({
        firstName: "John",
        lastName: "",
      });
      expect(result.current.isValid).toBe(false);
    });
  });

  describe("Form Editing", () => {
    it("should start editing when handleEdit is called", () => {
      // Arrange
      const { result } = renderHook(() =>
        useProfileForm({ user: mockUser, onSave: mockOnSave })
      );

      // Act
      act(() => {
        result.current.handleEdit();
      });

      // Assert
      expect(result.current.isEditing).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it("should cancel editing and reset form data", () => {
      // Arrange
      const { result } = renderHook(() =>
        useProfileForm({ user: mockUser, onSave: mockOnSave })
      );

      // Start editing and modify data
      act(() => {
        result.current.handleEdit();
        result.current.handleInputChange("firstName", "Modified");
        result.current.handleInputChange("lastName", "Name");
      });

      expect(result.current.formData.firstName).toBe("Modified");

      // Act - Cancel editing
      act(() => {
        result.current.handleCancel();
      });

      // Assert
      expect(result.current.isEditing).toBe(false);
      expect(result.current.formData).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
      expect(result.current.error).toBeNull();
    });

    it("should handle cancel when user is null", () => {
      // Arrange
      const { result } = renderHook(() =>
        useProfileForm({ user: null, onSave: mockOnSave })
      );

      // Start editing and modify data
      act(() => {
        result.current.handleEdit();
        result.current.handleInputChange("firstName", "Test");
      });

      // Act - Cancel editing
      act(() => {
        result.current.handleCancel();
      });

      // Assert
      expect(result.current.isEditing).toBe(false);
      expect(result.current.formData).toEqual({
        firstName: "",
        lastName: "",
      });
    });
  });

  describe("Input Changes", () => {
    it("should update firstName when handleInputChange is called", () => {
      // Arrange
      const { result } = renderHook(() =>
        useProfileForm({ user: mockUser, onSave: mockOnSave })
      );

      // Act
      act(() => {
        result.current.handleInputChange("firstName", "Updated First Name");
      });

      // Assert
      expect(result.current.formData.firstName).toBe("Updated First Name");
      expect(result.current.formData.lastName).toBe("Doe"); // Should remain unchanged
    });

    it("should update lastName when handleInputChange is called", () => {
      // Arrange
      const { result } = renderHook(() =>
        useProfileForm({ user: mockUser, onSave: mockOnSave })
      );

      // Act
      act(() => {
        result.current.handleInputChange("lastName", "Updated Last Name");
      });

      // Assert
      expect(result.current.formData.lastName).toBe("Updated Last Name");
      expect(result.current.formData.firstName).toBe("John"); // Should remain unchanged
    });
  });

  describe("Form Validation", () => {
    it("should be valid when both firstName and lastName have values", () => {
      // Arrange
      const { result } = renderHook(() =>
        useProfileForm({ user: mockUser, onSave: mockOnSave })
      );

      // Assert
      expect(result.current.isValid).toBe(true);
    });

    it("should be invalid when firstName is empty", () => {
      // Arrange
      const { result } = renderHook(() =>
        useProfileForm({ user: mockUser, onSave: mockOnSave })
      );

      // Act
      act(() => {
        result.current.handleInputChange("firstName", "");
      });

      // Assert
      expect(result.current.isValid).toBe(false);
    });

    it("should be invalid when lastName is empty", () => {
      // Arrange
      const { result } = renderHook(() =>
        useProfileForm({ user: mockUser, onSave: mockOnSave })
      );

      // Act
      act(() => {
        result.current.handleInputChange("lastName", "");
      });

      // Assert
      expect(result.current.isValid).toBe(false);
    });

    it("should be invalid when both firstName and lastName are empty", () => {
      // Arrange
      const { result } = renderHook(() =>
        useProfileForm({ user: mockUser, onSave: mockOnSave })
      );

      // Act
      act(() => {
        result.current.handleInputChange("firstName", "");
        result.current.handleInputChange("lastName", "");
      });

      // Assert
      expect(result.current.isValid).toBe(false);
    });

    it("should be invalid when firstName or lastName contain only whitespace", () => {
      // Arrange
      const { result } = renderHook(() =>
        useProfileForm({ user: mockUser, onSave: mockOnSave })
      );

      // Act
      act(() => {
        result.current.handleInputChange("firstName", "   ");
        result.current.handleInputChange("lastName", "   ");
      });

      // Assert
      expect(result.current.isValid).toBe(false);
    });
  });

  describe("Form Submission", () => {
    it("should save form data successfully", async () => {
      // Arrange
      const { result } = renderHook(() =>
        useProfileForm({ user: mockUser, onSave: mockOnSave })
      );

      mockOnSave.mockResolvedValue(undefined);

      // Start editing and modify data
      act(() => {
        result.current.handleEdit();
        result.current.handleInputChange("firstName", "Updated First");
        result.current.handleInputChange("lastName", "Updated Last");
      });

      // Act
      await act(async () => {
        await result.current.handleSave();
      });

      // Assert
      expect(mockOnSave).toHaveBeenCalledWith({
        firstName: "Updated First",
        lastName: "Updated Last",
      });
      expect(result.current.isEditing).toBe(false);
      expect(result.current.isSaving).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("should handle save failure", async () => {
      // Arrange
      const { result } = renderHook(() =>
        useProfileForm({ user: mockUser, onSave: mockOnSave })
      );

      const saveError = new Error("Save failed");
      mockOnSave.mockRejectedValue(saveError);

      // Start editing
      act(() => {
        result.current.handleEdit();
      });

      // Act
      await act(async () => {
        await result.current.handleSave();
      });

      // Assert
      expect(result.current.error).toBe("Save failed");
      expect(result.current.isEditing).toBe(true); // Should remain in editing mode
      expect(result.current.isSaving).toBe(false);
    });

    it("should handle save with string error", async () => {
      // Arrange
      const { result } = renderHook(() =>
        useProfileForm({ user: mockUser, onSave: mockOnSave })
      );

      mockOnSave.mockRejectedValue("String error");

      // Start editing
      act(() => {
        result.current.handleEdit();
      });

      // Act
      await act(async () => {
        await result.current.handleSave();
      });

      // Assert
      expect(result.current.error).toBe("Failed to update profile.");
      expect(result.current.isEditing).toBe(true);
    });

    it("should not save when user is null", async () => {
      // Arrange
      const { result } = renderHook(() =>
        useProfileForm({ user: null, onSave: mockOnSave })
      );

      // Start editing
      act(() => {
        result.current.handleEdit();
      });

      // Act
      await act(async () => {
        await result.current.handleSave();
      });

      // Assert
      expect(mockOnSave).not.toHaveBeenCalled();
      expect(result.current.error).toBe("No user data available to save.");
      expect(result.current.isSaving).toBe(false);
    });

    it("should set saving state during save operation", async () => {
      // Arrange
      const { result } = renderHook(() =>
        useProfileForm({ user: mockUser, onSave: mockOnSave })
      );

      let resolveSave: () => void;
      const savePromise = new Promise<void>((resolve) => {
        resolveSave = resolve;
      });
      mockOnSave.mockReturnValue(savePromise);

      // Start editing
      act(() => {
        result.current.handleEdit();
      });

      // Act - Start save operation
      act(() => {
        result.current.handleSave();
      });

      // Assert - Should be in saving state
      expect(result.current.isSaving).toBe(true);

      // Complete save operation
      act(() => {
        resolveSave!();
      });

      await act(async () => {
        await savePromise;
      });

      // Assert - Should no longer be in saving state
      expect(result.current.isSaving).toBe(false);
    });
  });

  describe("User Updates", () => {
    it("should update form data when user prop changes", () => {
      // Arrange
      const { result, rerender } = renderHook(
        ({ user }) => useProfileForm({ user, onSave: mockOnSave }),
        {
          initialProps: { user: mockUser },
        }
      );

      // Act - Update user prop
      const updatedUser: User = {
        ...mockUser,
        firstName: "Updated",
        lastName: "User",
      };

      rerender({ user: updatedUser });

      // Assert
      expect(result.current.formData).toEqual({
        firstName: "Updated",
        lastName: "User",
      });
    });

    it("should not update form data when user changes during editing", () => {
      // Arrange
      const { result, rerender } = renderHook(
        ({ user }) => useProfileForm({ user, onSave: mockOnSave }),
        {
          initialProps: { user: mockUser },
        }
      );

      // Start editing and modify data
      act(() => {
        result.current.handleEdit();
        result.current.handleInputChange("firstName", "Modified");
      });

      // Act - Update user prop
      const updatedUser: User = {
        ...mockUser,
        firstName: "Updated",
        lastName: "User",
      };

      rerender({ user: updatedUser });

      // Assert - Form data should remain as modified
      expect(result.current.formData).toEqual({
        firstName: "Modified",
        lastName: "Doe",
      });
    });
  });
});
