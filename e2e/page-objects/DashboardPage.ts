import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export class DashboardPage extends BasePage {
  // Locators
  get welcomeMessage(): Locator {
    return this.page.locator('[data-testid="welcome-message"]')
  }

  get boatsList(): Locator {
    return this.page.locator('[data-testid="boats-list"]')
  }

  get searchInput(): Locator {
    return this.page.locator('[data-testid="search-input"]')
  }

  get filterButton(): Locator {
    return this.page.locator('[data-testid="filter-button"]')
  }

  get logoutButton(): Locator {
    return this.page.locator('[data-testid="logout-button"]')
  }

  // Actions
  async searchBoats(query: string): Promise<void> {
    await this.searchInput.fill(query)
    await this.page.keyboard.press('Enter')
    await this.waitForLoadingToFinish()
  }

  async logout(): Promise<void> {
    await this.logoutButton.click()
    await this.waitForPageLoad()
  }

  async openFilter(): Promise<void> {
    await this.filterButton.click()
  }

  // Assertions
  async expectBoatsToBeVisible(): Promise<void> {
    await this.boatsList.waitFor({ state: 'visible' })
  }

  async expectWelcomeMessage(text: string): Promise<void> {
    await this.welcomeMessage.waitFor({ state: 'visible' })
    await this.welcomeMessage.textContent()
  }
}
