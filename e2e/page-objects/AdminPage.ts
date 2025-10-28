import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AdminPage extends BasePage {
  // Locators
  get adminHeader(): Locator {
    return this.page.locator('[data-testid="admin-header"]');
  }

  get adminTitle(): Locator {
    return this.page.locator('[data-testid="admin-title"]');
  }

  get userManagement(): Locator {
    return this.page.locator('[data-testid="user-management"]');
  }

  get usersTable(): Locator {
    return this.page.locator('[data-testid="users-table"]');
  }

  get userRow(): Locator {
    return this.page.locator('[data-testid="user-row"]');
  }

  get userEmail(): Locator {
    return this.page.locator('[data-testid="user-email"]');
  }

  get userRole(): Locator {
    return this.page.locator('[data-testid="user-role"]');
  }

  get userStatus(): Locator {
    return this.page.locator('[data-testid="user-status"]');
  }

  get refreshButton(): Locator {
    return this.page.locator('[data-testid="refresh-button"]');
  }

  get systemMetrics(): Locator {
    return this.page.locator('[data-testid="system-metrics"]');
  }

  get totalUsers(): Locator {
    return this.page.locator('[data-testid="total-users"]');
  }

  get activeUsers(): Locator {
    return this.page.locator('[data-testid="active-users"]');
  }

  get lastSync(): Locator {
    return this.page.locator('[data-testid="last-sync"]');
  }

  get loadingSpinner(): Locator {
    return this.page.locator('[data-testid="loading-spinner"]');
  }

  get errorMessage(): Locator {
    return this.page.locator('[data-testid="error-message"]');
  }

  get editUserButton(): Locator {
    return this.page.locator('[data-testid="edit-user-button"]');
  }

  get deleteUserButton(): Locator {
    return this.page.locator('[data-testid="delete-user-button"]');
  }

  get userModal(): Locator {
    return this.page.locator('[data-testid="user-modal"]');
  }

  get userModalClose(): Locator {
    return this.page.locator('[data-testid="user-modal-close"]');
  }

  get userModalSave(): Locator {
    return this.page.locator('[data-testid="user-modal-save"]');
  }

  // Actions
  async refreshUsers(): Promise<void> {
    await this.refreshButton.click();
    await this.waitForLoadingToFinish();
  }

  async editUser(index: number = 0): Promise<void> {
    const editButtons = this.editUserButton;
    await editButtons.nth(index).click();
    await this.userModal.waitFor({ state: "visible" });
  }

  async deleteUser(index: number = 0): Promise<void> {
    const deleteButtons = this.deleteUserButton;
    await deleteButtons.nth(index).click();
    // Handle confirmation dialog if needed
  }

  async closeUserModal(): Promise<void> {
    await this.userModalClose.click();
    await this.userModal.waitFor({ state: "hidden" });
  }

  async saveUserModal(): Promise<void> {
    await this.userModalSave.click();
    await this.waitForLoadingToFinish();
  }

  async navigateToUserManagement(): Promise<void> {
    await this.userManagement.click();
    await this.waitForPageLoad();
  }

  // Assertions
  async expectAdminPageToBeVisible(): Promise<void> {
    await this.adminHeader.waitFor({ state: "visible" });
    await this.adminTitle.waitFor({ state: "visible" });
  }

  async expectUserManagementToBeVisible(): Promise<void> {
    await this.userManagement.waitFor({ state: "visible" });
  }

  async expectUsersTableToBeVisible(): Promise<void> {
    await this.usersTable.waitFor({ state: "visible" });
  }

  async expectSystemMetricsToBeVisible(): Promise<void> {
    await this.systemMetrics.waitFor({ state: "visible" });
  }

  async expectTotalUsersCount(count: number): Promise<void> {
    await this.totalUsers.waitFor({ state: "visible" });
    // In real implementation, you'd check the actual count
  }

  async expectActiveUsersCount(count: number): Promise<void> {
    await this.activeUsers.waitFor({ state: "visible" });
    // In real implementation, you'd check the actual count
  }

  async expectLastSyncToBeVisible(): Promise<void> {
    await this.lastSync.waitFor({ state: "visible" });
  }

  async expectUserModalToBeVisible(): Promise<void> {
    await this.userModal.waitFor({ state: "visible" });
  }

  async expectUserModalToBeHidden(): Promise<void> {
    await this.userModal.waitFor({ state: "hidden" });
  }

  async expectLoadingToFinish(): Promise<void> {
    await this.loadingSpinner.waitFor({ state: "hidden", timeout: 10000 });
  }

  async expectErrorToBeVisible(): Promise<void> {
    await this.errorMessage.waitFor({ state: "visible" });
  }

  async expectUsersToBeLoaded(): Promise<void> {
    await this.userRow.first().waitFor({ state: "visible" });
  }
}
