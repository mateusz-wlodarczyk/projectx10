import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "../Header";

describe("Header Component", () => {
  const mockProps = {
    onGetStarted: vi.fn(),
    onSignIn: vi.fn(),
    onTestLogin: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render header with logo and title", () => {
      // Act
      render(<Header {...mockProps} />);

      // Assert
      expect(screen.getByText("BoatsAnalytics")).toBeInTheDocument();
      expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument(); // Anchor icon
    });

    it("should render all navigation buttons", () => {
      // Act
      render(<Header {...mockProps} />);

      // Assert
      expect(screen.getByTestId("header-sign-in-button")).toBeInTheDocument();
      expect(
        screen.getByTestId("header-get-started-button")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("header-test-login-button")
      ).toBeInTheDocument();
    });

    it("should render buttons with correct text", () => {
      // Act
      render(<Header {...mockProps} />);

      // Assert
      expect(screen.getByText("Sign In")).toBeInTheDocument();
      expect(screen.getByText("Get Started")).toBeInTheDocument();
      expect(screen.getByText("TEST")).toBeInTheDocument();
    });
  });

  describe("Button Interactions", () => {
    it("should call onSignIn when Sign In button is clicked", () => {
      // Arrange
      render(<Header {...mockProps} />);
      const signInButton = screen.getByTestId("header-sign-in-button");

      // Act
      fireEvent.click(signInButton);

      // Assert
      expect(mockProps.onSignIn).toHaveBeenCalledTimes(1);
    });

    it("should call onGetStarted when Get Started button is clicked", () => {
      // Arrange
      render(<Header {...mockProps} />);
      const getStartedButton = screen.getByTestId("header-get-started-button");

      // Act
      fireEvent.click(getStartedButton);

      // Assert
      expect(mockProps.onGetStarted).toHaveBeenCalledTimes(1);
    });

    it("should call onTestLogin when TEST button is clicked", () => {
      // Arrange
      render(<Header {...mockProps} />);
      const testButton = screen.getByTestId("header-test-login-button");

      // Act
      fireEvent.click(testButton);

      // Assert
      expect(mockProps.onTestLogin).toHaveBeenCalledTimes(1);
    });
  });

  describe("Styling", () => {
    it("should apply correct CSS classes", () => {
      // Act
      render(<Header {...mockProps} />);

      // Assert
      const header = screen.getByRole("banner");
      expect(header).toHaveClass("bg-white", "shadow-sm");

      const logoContainer = screen.getByText("BoatsAnalytics").parentElement;
      expect(logoContainer).toHaveClass("flex", "items-center", "space-x-2");
    });

    it("should apply correct button variants", () => {
      // Act
      render(<Header {...mockProps} />);

      // Assert
      const signInButton = screen.getByTestId("header-sign-in-button");
      expect(signInButton).toHaveClass("bg-transparent");

      const getStartedButton = screen.getByTestId("header-get-started-button");
      expect(getStartedButton).toHaveClass("bg-primary");

      const testButton = screen.getByTestId("header-test-login-button");
      expect(testButton).toHaveClass("bg-red-600", "hover:bg-red-700");
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic structure", () => {
      // Act
      render(<Header {...mockProps} />);

      // Assert
      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("should have clickable buttons", () => {
      // Act
      render(<Header {...mockProps} />);

      // Assert
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(3);

      buttons.forEach((button) => {
        expect(button).not.toBeDisabled();
      });
    });
  });
});
