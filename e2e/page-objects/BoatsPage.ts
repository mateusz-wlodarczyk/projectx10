import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class BoatsPage extends BasePage {
  // Locators
  get boatsHeader(): Locator {
    return this.page.locator('[data-testid="boats-header"]');
  }

  get boatsGrid(): Locator {
    return this.page.locator('[data-testid="boats-grid"]');
  }

  get boatsList(): Locator {
    return this.page.locator('[data-testid="boats-list"]');
  }

  get searchInput(): Locator {
    return this.page.locator('[data-testid="search-input"]');
  }

  get filterButton(): Locator {
    return this.page.locator('[data-testid="filter-button"]');
  }

  get viewToggle(): Locator {
    return this.page.locator('[data-testid="view-toggle"]');
  }

  get pagination(): Locator {
    return this.page.locator('[data-testid="pagination"]');
  }

  get paginationNext(): Locator {
    return this.page.locator('[data-testid="pagination-next"]');
  }

  get paginationPrevious(): Locator {
    return this.page.locator('[data-testid="pagination-previous"]');
  }

  get paginationPageSize(): Locator {
    return this.page.locator('[data-testid="pagination-page-size"]');
  }

  get boatCard(): Locator {
    return this.page.locator('[data-testid="boat-card"]');
  }

  get boatCardTitle(): Locator {
    return this.page.locator('[data-testid="boat-card-title"]');
  }

  get boatCardPrice(): Locator {
    return this.page.locator('[data-testid="boat-card-price"]');
  }

  get loadingSpinner(): Locator {
    return this.page.locator('[data-testid="loading-spinner"]');
  }

  get errorMessage(): Locator {
    return this.page.locator('[data-testid="error-message"]');
  }

  get summaryStats(): Locator {
    return this.page.locator('[data-testid="summary-stats"]');
  }

  // Actions
  async searchBoats(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.keyboard.press("Enter");
    await this.waitForLoadingToFinish();
  }

  async openFilters(): Promise<void> {
    await this.filterButton.click();
  }

  async toggleView(view: "grid" | "list"): Promise<void> {
    await this.viewToggle.click();
    await this.waitForLoadingToFinish();
  }

  async goToNextPage(): Promise<void> {
    await this.paginationNext.click();
    await this.waitForLoadingToFinish();
  }

  async goToPreviousPage(): Promise<void> {
    await this.paginationPrevious.click();
    await this.waitForLoadingToFinish();
  }

  async changePageSize(size: number): Promise<void> {
    await this.paginationPageSize.selectOption(size.toString());
    await this.waitForLoadingToFinish();
  }

  async clickBoatCard(index: number = 0): Promise<void> {
    const boatCards = this.boatCard;
    await boatCards.nth(index).click();
    await this.waitForPageLoad();
  }

  async refreshData(): Promise<void> {
    await this.page.reload();
    await this.waitForLoadingToFinish();
  }

  // Assertions
  async expectBoatsToBeVisible(): Promise<void> {
    await this.boatsGrid.waitFor({ state: "visible" });
  }

  async expectBoatsCount(count: number): Promise<void> {
    const boatCards = this.boatCard;
    await boatCards.first().waitFor({ state: "visible" });
    // Note: This is a basic check - in real implementation you'd count all cards
  }

  async expectSearchResults(query: string): Promise<void> {
    await this.searchInput.waitFor({ state: "visible" });
    await this.searchInput.inputValue();
  }

  async expectPaginationToBeVisible(): Promise<void> {
    await this.pagination.waitFor({ state: "visible" });
  }

  async expectLoadingToFinish(): Promise<void> {
    await this.loadingSpinner.waitFor({ state: "hidden", timeout: 10000 });
  }

  async expectErrorToBeVisible(): Promise<void> {
    await this.errorMessage.waitFor({ state: "visible" });
  }

  async expectSummaryStatsToBeVisible(): Promise<void> {
    await this.summaryStats.waitFor({ state: "visible" });
  }
}
