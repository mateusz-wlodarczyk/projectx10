import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  // Locators
  get emailInput(): Locator {
    return this.page.locator('[data-testid="email-input"]')
  }

  get passwordInput(): Locator {
    return this.page.locator('[data-testid="password-input"]')
  }

  get loginButton(): Locator {
    return this.page.locator('[data-testid="login-button"]')
  }

  get registerLink(): Locator {
    return this.page.locator('[data-testid="register-link"]')
  }

  get forgotPasswordLink(): Locator {
    return this.page.locator('[data-testid="forgot-password-link"]')
  }

  // Actions
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.loginButton.click()
    await this.waitForPageLoad()
  }

  async navigateToRegister(): Promise<void> {
    await this.registerLink.click()
  }

  async navigateToForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click()
  }
}
