import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly proceedToCheckoutBtn: Locator;
  readonly registerLoginModalLink: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('#cart_info_table tbody tr');
    this.proceedToCheckoutBtn = page.getByText('Proceed To Checkout');
    this.registerLoginModalLink = page.getByRole('link', { name: 'Register / Login' });
  }

  async verifyProductInCart(productName: string) {
    const item = this.page.locator('#cart_info_table').getByText(productName);
    await expect(item).toBeVisible();
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutBtn.click();
  }
}