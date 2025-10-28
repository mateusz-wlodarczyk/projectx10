import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HeroSection } from "../HeroSection";

describe("HeroSection Component", () => {
  const mockProps = {
    onGetStarted: vi.fn(),
    onSignIn: vi.fn(),
    onTestLogin: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render hero section with main heading", () => {
      // Act
      render(<HeroSection {...mockProps} />);

      // Assert
      expect(screen.getByText("Welcome to")).toBeInTheDocument();
      expect(screen.getByText("BoatsAnalytics")).toBeInTheDocument();
    });

    it("should render hero section with description", () => {
      // Act
      render(<HeroSection {...mockProps} />);

      // Assert
      expect(
        screen.getByText(
          /Comprehensive yacht booking analytics and business insights/i
        )
      ).toBeInTheDocument();
    });

    it("should render all action buttons", () => {
      // Act
      render(<HeroSection {...mockProps} />);

      // Assert
      expect(screen.getByTestId("get-started-button")).toBeInTheDocument();
      expect(screen.getByTestId("sign-in-button")).toBeInTheDocument();
      expect(screen.getByTestId("test-login-button")).toBeInTheDocument();
    });

    it("should render buttons with correct text", () => {
      // Act
      render(<HeroSection {...mockProps} />);

      // Assert
      expect(screen.getByText("Get Started")).toBeInTheDocument();
      expect(screen.getByText("Sign In")).toBeInTheDocument();
      expect(screen.getByText("TEST")).toBeInTheDocument();
    });
  });

  describe("Button Interactions", () => {
    it("should call onGetStarted when Get Started button is clicked", () => {
      // Arrange
      render(<HeroSection {...mockProps} />);
      const getStartedButton = screen.getByTestId("get-started-button");

      // Act
      fireEvent.click(getStartedButton);

      // Assert
      expect(mockProps.onGetStarted).toHaveBeenCalledTimes(1);
    });

    it("should call onSignIn when Sign In button is clicked", () => {
      // Arrange
      render(<HeroSection {...mockProps} />);
      const signInButton = screen.getByTestId("sign-in-button");

      // Act
      fireEvent.click(signInButton);

      // Assert
      expect(mockProps.onSignIn).toHaveBeenCalledTimes(1);
    });

    it("should call onTestLogin when TEST button is clicked", () => {
      // Arrange
      render(<HeroSection {...mockProps} />);
      const testButton = screen.getByTestId("test-login-button");

      // Act
      fireEvent.click(testButton);

      // Assert
      expect(mockProps.onTestLogin).toHaveBeenCalledTimes(1);
    });
  });

  describe("Styling", () => {
    it("should apply correct CSS classes to main heading", () => {
      // Act
      render(<HeroSection {...mockProps} />);

      // Assert
      const heading = screen.getByText("Welcome to");
      expect(heading).toHaveClass(
        "text-4xl",
        "md:text-6xl",
        "font-bold",
        "text-gray-900"
      );
    });

    it("should apply correct CSS classes to brand name", () => {
      // Act
      render(<HeroSection {...mockProps} />);

      // Assert
      const brandName = screen.getByText("BoatsAnalytics");
      expect(brandName).toHaveClass("text-blue-600");
    });

    it("should apply correct CSS classes to description", () => {
      // Act
      render(<HeroSection {...mockProps} />);

      // Assert
      const description = screen.getByText(
        /Comprehensive yacht booking analytics and business insights/i
      );
      expect(description).toHaveClass("text-xl", "text-gray-600");
    });

    it("should apply correct button variants", () => {
      // Act
      render(<HeroSection {...mockProps} />);

      // Assert
      const getStartedButton = screen.getByTestId("get-started-button");
      expect(getStartedButton).toHaveClass("bg-primary");

      const signInButton = screen.getByTestId("sign-in-button");
      expect(signInButton).toHaveClass("border", "border-input");

      const testButton = screen.getByTestId("test-login-button");
      expect(testButton).toHaveClass("bg-red-600", "hover:bg-red-700");
    });
  });

  describe("Layout", () => {
    it("should render buttons in correct order", () => {
      // Act
      render(<HeroSection {...mockProps} />);

      // Assert
      const buttons = screen.getAllByRole("button");
      expect(buttons[0]).toHaveTextContent("Get Started");
      expect(buttons[1]).toHaveTextContent("Sign In");
      expect(buttons[2]).toHaveTextContent("TEST");
    });

    it("should have responsive button layout", () => {
      // Act
      render(<HeroSection {...mockProps} />);

      // Assert
      const buttonContainer =
        screen.getByTestId("get-started-button").parentElement;
      expect(buttonContainer).toHaveClass("flex", "flex-col", "sm:flex-row");
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading structure", () => {
      // Act
      render(<HeroSection {...mockProps} />);

      // Assert
      const mainHeading = screen.getByRole("heading", { level: 1 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading).toHaveTextContent("Welcome to BoatsAnalytics");
    });

    it("should have clickable buttons", () => {
      // Act
      render(<HeroSection {...mockProps} />);

      // Assert
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(3);

      buttons.forEach((button) => {
        expect(button).not.toBeDisabled();
      });
    });
  });

  describe("Content", () => {
    it("should contain key marketing messages", () => {
      // Act
      render(<HeroSection {...mockProps} />);

      // Assert
      expect(screen.getByText(/Track bookings/i)).toBeInTheDocument();
      expect(screen.getByText(/monitor trends/i)).toBeInTheDocument();
      expect(screen.getByText(/analyze promotions/i)).toBeInTheDocument();
      expect(screen.getByText(/data-driven decisions/i)).toBeInTheDocument();
    });

    it("should have appropriate button sizes", () => {
      // Act
      render(<HeroSection {...mockProps} />);

      // Assert
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveClass("h-10", "px-8"); // size="lg"
      });
    });
  });
});
