/**
 * Authentication service for handling login operations
 */
export class AuthService {
  private static readonly API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  /**
   * Authenticates a user with email and password
   */
  static async login(email: string, password: string) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  /**
   * Stores user session data in localStorage
   */
  static storeSession(user: any, session: any): void {
    if (typeof window === "undefined") {
      console.warn("AuthService: Cannot store session on server side");
      return;
    }

    try {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("session", JSON.stringify(session));
    } catch (error) {
      console.error("Failed to store session:", error);
      throw new Error("Failed to store session data");
    }
  }

  /**
   * Redirects to dashboard after successful login
   */
  static redirectToDashboard(): void {
    if (typeof window !== "undefined") {
      window.location.href = "/dashboard";
    }
  }

  /**
   * Handles complete login flow
   */
  static async handleLogin(email: string, password: string): Promise<void> {
    const data = await this.login(email, password);
    this.storeSession(data.user, data.session);
    this.redirectToDashboard();
  }
}
