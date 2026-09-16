import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly commentTextArea: Locator;
  readonly placeOrderBtn: Locator;

  // Form Thanh toán (Payment)
  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payAndConfirmBtn: Locator;

  // Xác nhận đơn hàng & Download Invoice
  readonly orderPlacedHeading: Locator;
  readonly downloadInvoiceBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.commentTextArea = page.locator('textarea[name="message"]');
    this.placeOrderBtn = page.getByRole('link', { name: 'Place Order' });

    this.nameOnCardInput = page.locator('input[name="name_on_card"]');
    this.cardNumberInput = page.locator('input[name="card_number"]');
    this.cvcInput = page.locator('input[name="cvc"]');
    this.expiryMonthInput = page.locator('input[name="expiry_month"]');
    this.expiryYearInput = page.locator('input[name="expiry_year"]');
    this.payAndConfirmBtn = page.getByRole('button', { name: 'Pay and Confirm Order' });

    this.orderPlacedHeading = page.getByRole('heading', { name: 'ORDER PLACED!' });
    this.downloadInvoiceBtn = page.getByRole('link', { name: 'Download Invoice' });
  }

  async enterCommentAndPlaceOrder(comment: string) {
    await this.commentTextArea.fill(comment);
    await this.placeOrderBtn.click();
  }

  async fillPaymentDetailsAndConfirm(paymentInfo: {
    nameOnCard: string;
    cardNumber: string;
    cvc: string;
    expiryMonth: string;
    expiryYear: string;
  }) {
    await this.nameOnCardInput.fill(paymentInfo.nameOnCard);
    await this.cardNumberInput.fill(paymentInfo.cardNumber);
    await this.cvcInput.fill(paymentInfo.cvc);
    await this.expiryMonthInput.fill(paymentInfo.expiryMonth);
    await this.expiryYearInput.fill(paymentInfo.expiryYear);
    await this.payAndConfirmBtn.click();
  }

  async verifyOrderPlaced() {
    await expect(this.orderPlacedHeading).toBeVisible();
  }

  // Hàm xử lý download file Invoice PDF
  async downloadInvoice(): Promise<string> {
    // Lắng nghe sự kiện download trong Playwright
    const downloadPromise = this.page.waitForEvent('download');
    await this.downloadInvoiceBtn.click();
    const download = await downloadPromise;

    // Lưu file vào thư mục temporary hoặc lấy suggested filename
    const fileName = download.suggestedFilename();
    await download.saveAs(`downloads/${fileName}`);
    return fileName;
  }
}