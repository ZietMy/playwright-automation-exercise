import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly signupLoginBtn: Locator;
  readonly consentBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.signupLoginBtn = page.getByRole('link', { name: ' Signup / Login' });
    // Selector xử lý pop-up GDPR nếu có xuất hiện
    this.consentBtn = page.getByRole('button', { name: 'Consent' });
  }

  async handleConsentModal() {
    if (await this.consentBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.consentBtn.click();
    }
  }

  async clickSignupLogin() {
    await this.signupLoginBtn.click();
  }
}