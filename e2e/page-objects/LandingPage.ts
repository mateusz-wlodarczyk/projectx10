import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LandingPage extends BasePage {
  // Locators
  get heroSection(): Locator {
    return this.page.locator('[data-testid="hero-section"]');
  }

  get getStartedButton(): Locator {
    return this.page.locator('[data-testid="get-started-button"]');
  }

  get signInButton(): Locator {
    return this.page.locator('[data-testid="sign-in-button"]');
  }

  get testLoginButton(): Locator {
    return this.page.locator('[data-testid="test-login-button"]');
  }

  get startTrialButton(): Locator {
    return this.page.locator('[data-testid="start-trial-button"]');
  }

  get testLoginCtaButton(): Locator {
    return this.page.locator('[data-testid="test-login-cta-button"]');
  }

  get featuresSection(): Locator {
    return this.page.locator('[data-testid="features-section"]');
  }

  get ctaSection(): Locator {
    return this.page.locator('[data-testid="cta-section"]');
  }

  get header(): Locator {
    return this.page.locator('[data-testid="header"]');
  }

  get footer(): Locator {
    return this.page.locator('[data-testid="footer"]');
  }

  get logo(): Locator {
    return this.page.locator('[data-testid="logo"]');
  }

  get mainTitle(): Locator {
    return this.page.locator('[data-testid="main-title"]');
  }

  get mainDescription(): Locator {
    return this.page.locator('[data-testid="main-description"]');
  }

  get featureCard(): Locator {
    return this.page.locator('[data-testid="feature-card"]');
  }

  // Actions
  async clickGetStarted(): Promise<void> {
    await this.getStartedButton.click();
    await this.waitForPageLoad();
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
    await this.waitForPageLoad();
  }

  async clickTestLogin(): Promise<void> {
    await this.testLoginButton.click();
    await this.waitForPageLoad();
  }

  async clickStartTrial(): Promise<void> {
    await this.startTrialButton.click();
    await this.waitForPageLoad();
  }

  async clickTestLoginCta(): Promise<void> {
    await this.testLoginCtaButton.click();
    await this.waitForPageLoad();
  }

  async scrollToFeatures(): Promise<void> {
    await this.featuresSection.scrollIntoViewIfNeeded();
  }

  async scrollToCta(): Promise<void> {
    await this.ctaSection.scrollIntoViewIfNeeded();
  }

  async scrollToFooter(): Promise<void> {
    await this.footer.scrollIntoViewIfNeeded();
  }

  // Assertions
  async expectLandingPageToBeVisible(): Promise<void> {
    await this.heroSection.waitFor({ state: "visible" });
    await this.mainTitle.waitFor({ state: "visible" });
  }

  async expectHeroSectionToBeVisible(): Promise<void> {
    await this.heroSection.waitFor({ state: "visible" });
  }

  async expectFeaturesSectionToBeVisible(): Promise<void> {
    await this.featuresSection.waitFor({ state: "visible" });
  }

  async expectCtaSectionToBeVisible(): Promise<void> {
    await this.ctaSection.waitFor({ state: "visible" });
  }

  async expectHeaderToBeVisible(): Promise<void> {
    await this.header.waitFor({ state: "visible" });
  }

  async expectFooterToBeVisible(): Promise<void> {
    await this.footer.waitFor({ state: "visible" });
  }

  async expectLogoToBeVisible(): Promise<void> {
    await this.logo.waitFor({ state: "visible" });
  }

  async expectMainTitleToContain(text: string): Promise<void> {
    await this.mainTitle.waitFor({ state: "visible" });
    await this.mainTitle.textContent();
  }

  async expectMainDescriptionToBeVisible(): Promise<void> {
    await this.mainDescription.waitFor({ state: "visible" });
  }

  async expectFeatureCardsToBeVisible(): Promise<void> {
    await this.featureCard.first().waitFor({ state: "visible" });
  }

  async expectGetStartedButtonToBeVisible(): Promise<void> {
    await this.getStartedButton.waitFor({ state: "visible" });
  }

  async expectSignInButtonToBeVisible(): Promise<void> {
    await this.signInButton.waitFor({ state: "visible" });
  }

  async expectTestLoginButtonToBeVisible(): Promise<void> {
    await this.testLoginButton.waitFor({ state: "visible" });
  }
}
