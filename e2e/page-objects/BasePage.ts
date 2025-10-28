import { Page, Locator } from '@playwright/test'

export class BasePage {
  protected page: Page

  constructor(page: Page) {
    this.page = page
  }

  // Common locators
  get loadingSpinner(): Locator {
    return this.page.locator('[data-testid="loading-spinner"]')
  }

  get errorMessage(): Locator {
    return this.page.locator('[data-testid="error-message"]')
  }

  get successMessage(): Locator {
    return this.page.locator('[data-testid="success-message"]')
  }

  // Common actions
  async waitForLoadingToFinish(): Promise<void> {
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 })
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle')
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `e2e/screenshots/${name}.png` })
  }

  // Navigation helpers
  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path)
    await this.waitForPageLoad()
  }

  // Form helpers
  async fillInput(selector: string, value: string): Promise<void> {
    const input = this.page.locator(selector)
    await input.clear()
    await input.fill(value)
  }

  async clickButton(selector: string): Promise<void> {
    await this.page.locator(selector).click()
  }

  // Assertion helpers
  async expectToBeVisible(selector: string): Promise<void> {
    await this.page.locator(selector).waitFor({ state: 'visible' })
  }

  async expectToHaveText(selector: string, text: string): Promise<void> {
    await this.page.locator(selector).waitFor({ state: 'visible' })
    await this.page.locator(selector).textContent()
  }
}
