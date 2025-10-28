import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfileOverview } from "../ProfileOverview";
import { User } from "../../../lib/user-utils";

describe("ProfileOverview Component", () => {
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

  const mockUserUnverified: User = {
    ...mockUser,
    emailVerified: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render profile overview with complete user data", () => {
      // Act
      render(<ProfileOverview user={mockUser} />);

      // Assert
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
      expect(screen.getByText("1/1/2023")).toBeInTheDocument(); // Member since
      expect(screen.getByText("Verified")).toBeInTheDocument();
    });

    it("should render profile overview with partial user data", () => {
      // Act
      render(<ProfileOverview user={mockUserWithoutNames} />);

      // Assert
      expect(screen.getByText("Complete your profile")).toBeInTheDocument();
      expect(screen.getAllByText("test@example.com")).toHaveLength(2); // Email appears as display name and in email section
      expect(screen.getByText("1/1/2023")).toBeInTheDocument();
    });

    it("should render unverified email status", () => {
      // Act
      render(<ProfileOverview user={mockUserUnverified} />);

      // Assert
      expect(screen.getByText("Not Verified")).toBeInTheDocument();
    });
  });

  describe("Avatar", () => {
    it("should render avatar with fallback initials", () => {
      // Act
      render(<ProfileOverview user={mockUser} />);

      // Assert
      const avatarImage = screen.getByRole("img");
      expect(avatarImage).toBeInTheDocument();
      expect(avatarImage).toHaveAttribute("alt", "John Doe");
    });

    it("should render avatar fallback from email when names are missing", () => {
      // Act
      render(<ProfileOverview user={mockUserWithoutNames} />);

      // Assert
      const avatarImage = screen.getByRole("img");
      expect(avatarImage).toBeInTheDocument();
      expect(avatarImage).toHaveAttribute("alt", "test@example.com");
    });

    it("should render avatar with correct alt text", () => {
      // Act
      render(<ProfileOverview user={mockUser} />);

      // Assert
      const avatarImage = screen.getByAltText("John Doe");
      expect(avatarImage).toBeInTheDocument();
    });

    it("should render avatar with email alt text when names are missing", () => {
      // Act
      render(<ProfileOverview user={mockUserWithoutNames} />);

      // Assert
      const avatarImage = screen.getByAltText("test@example.com");
      expect(avatarImage).toBeInTheDocument();
    });
  });

  describe("User Information", () => {
    it("should display email correctly", () => {
      // Act
      render(<ProfileOverview user={mockUser} />);

      // Assert
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    it("should display member since date correctly", () => {
      // Act
      render(<ProfileOverview user={mockUser} />);

      // Assert
      expect(screen.getByText("1/1/2023")).toBeInTheDocument();
    });

    it("should handle missing createdAt date", () => {
      // Arrange
      const userWithoutCreatedAt = {
        ...mockUser,
        createdAt: undefined as any,
      };

      // Act
      render(<ProfileOverview user={userWithoutCreatedAt} />);

      // Assert
      expect(screen.getByText("Unknown")).toBeInTheDocument();
    });
  });

  describe("Email Verification Status", () => {
    it("should show verified badge for verified email", () => {
      // Act
      render(<ProfileOverview user={mockUser} />);

      // Assert
      const verifiedBadge = screen.getByText("Verified");
      expect(verifiedBadge).toBeInTheDocument();
      expect(verifiedBadge).toHaveClass("bg-primary");
    });

    it("should show not verified badge for unverified email", () => {
      // Act
      render(<ProfileOverview user={mockUserUnverified} />);

      // Assert
      const notVerifiedBadge = screen.getByText("Not Verified");
      expect(notVerifiedBadge).toBeInTheDocument();
      expect(notVerifiedBadge).toHaveClass("bg-destructive");
    });
  });

  describe("Styling", () => {
    it("should apply correct CSS classes to avatar", () => {
      // Act
      render(<ProfileOverview user={mockUser} />);

      // Assert
      const avatarImage = screen.getByRole("img");
      const avatar = avatarImage.closest('[class*="h-24"]');
      expect(avatar).toHaveClass("h-24", "w-24");
    });

    it("should apply correct CSS classes to name", () => {
      // Act
      render(<ProfileOverview user={mockUser} />);

      // Assert
      const name = screen.getByText("John Doe");
      expect(name).toHaveClass("text-xl", "font-semibold");
    });

    it("should apply correct CSS classes to email", () => {
      // Act
      render(<ProfileOverview user={mockUser} />);

      // Assert
      const email = screen.getByText("test@example.com");
      expect(email).toHaveClass("text-sm");
    });
  });

  describe("Layout", () => {
    it("should center avatar and user info", () => {
      // Act
      render(<ProfileOverview user={mockUser} />);

      // Assert
      const avatarContainer = screen
        .getByText("John Doe")
        .closest('[class*="flex flex-col items-center space-y-4"]');
      expect(avatarContainer).toHaveClass(
        "flex",
        "flex-col",
        "items-center",
        "space-y-4"
      );
    });

    it("should display information in correct order", () => {
      // Act
      render(<ProfileOverview user={mockUser} />);

      // Assert
      const container = screen
        .getByText("John Doe")
        .closest('[class*="flex flex-col items-center space-y-4"]');
      const children = Array.from(container?.children || []);

      // Avatar should be first, then name
      expect(children[0]).toContainElement(screen.getByRole("img"));
      expect(children[1]).toContainElement(screen.getByText("John Doe"));
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty avatar URL", () => {
      // Arrange
      const userWithEmptyAvatar = {
        ...mockUser,
        avatar: "",
      };

      // Act
      render(<ProfileOverview user={userWithEmptyAvatar} />);

      // Assert
      const avatarFallback = screen.getByText("JD");
      expect(avatarFallback).toBeInTheDocument();
    });

    it("should handle undefined avatar", () => {
      // Arrange
      const userWithUndefinedAvatar = {
        ...mockUser,
        avatar: undefined,
      };

      // Act
      render(<ProfileOverview user={userWithUndefinedAvatar} />);

      // Assert
      const avatarFallback = screen.getByText("JD");
      expect(avatarFallback).toBeInTheDocument();
    });

    it("should handle user with only firstName", () => {
      // Arrange
      const userWithOnlyFirstName = {
        ...mockUser,
        firstName: "John",
        lastName: undefined,
      };

      // Act
      render(<ProfileOverview user={userWithOnlyFirstName} />);

      // Assert
      expect(screen.getByText("Complete your profile")).toBeInTheDocument();
      const avatarImage = screen.getByRole("img");
      expect(avatarImage).toBeInTheDocument();
      expect(avatarImage).toHaveAttribute("alt", "test@example.com");
    });

    it("should handle user with only lastName", () => {
      // Arrange
      const userWithOnlyLastName = {
        ...mockUser,
        firstName: undefined,
        lastName: "Doe",
      };

      // Act
      render(<ProfileOverview user={userWithOnlyLastName} />);

      // Assert
      expect(screen.getByText("Complete your profile")).toBeInTheDocument();
      const avatarImage = screen.getByRole("img");
      expect(avatarImage).toBeInTheDocument();
      expect(avatarImage).toHaveAttribute("alt", "test@example.com");
    });
  });
});
