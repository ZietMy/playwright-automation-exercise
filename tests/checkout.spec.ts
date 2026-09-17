import { test, expect } from '../fixtures/baseTest';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { generateRandomUser } from '../utils/aiDataGenerator';
import fs from 'fs';

test.describe('Feature: Cart & End-to-End Checkout with Invoice Download', () => {
  let homePage: HomePage;
  let loginPage: LoginPage;
  let productPage: ProductPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await homePage.navigateTo('/');
    await homePage.handleConsentModal();
  });

  // TC04_01: Thêm sản phẩm vào giỏ hàng và kiểm tra giao diện Giỏ hàng
  test('TC04_01 - [Positive] Add product to cart and verify cart details', async ({ page }) => {
    await productPage.goToProductsPage();
    
    // Hover vào sản phẩm đầu tiên và bấm Add to Cart
    const firstProduct = page.locator('.single-products').first();
    await firstProduct.hover();
    await page.locator('.add-to-cart').first().click();

    // Click View Cart ở popup modal
    await page.getByRole('link', { name: 'View Cart' }).click();

    // Verify sản phẩm đã nằm trong giỏ hàng
    const cartCount = await cartPage.getCartItemCount();
    expect(cartCount).toBeGreaterThan(0);
  });

  // TC05: Luồng E2E Đăng ký -> Mua hàng -> Thanh toán -> Download Invoice PDF
  test('TC05 - [Positive] E2E Complete Checkout Flow & Download Invoice PDF', async ({ page }) => {
    // 1. Tạo user ngẫu nhiên từ Gemini AI
    const testUser = await generateRandomUser();

    // 2. Đăng ký tài khoản người dùng mới
    await homePage.clickSignupLogin();
    await loginPage.fillInitialSignup(testUser.name, testUser.email);
    await loginPage.fillAccountDetails(testUser);
    await loginPage.verifyAccountCreated();
    await expect(page.getByText(`Logged in as ${testUser.name}`)).toBeVisible();

    // 3. Chọn và thêm sản phẩm vào giỏ hàng
    await productPage.goToProductsPage();
    const firstProduct = page.locator('.single-products').first();
    await firstProduct.hover();
    await page.locator('.add-to-cart').first().click();
    await page.getByRole('link', { name: 'View Cart' }).click();

    // 4. Tiến hành Checkout
    await cartPage.proceedToCheckout();

    // 5. Nhập ghi chú đơn hàng và nhấn Place Order
    await checkoutPage.enterCommentAndPlaceOrder('Please deliver during business hours.');

    // 6. Nhập thông tin thẻ thanh toán giả lập (Test Credit Card)
    await checkoutPage.fillPaymentDetailsAndConfirm({
      nameOnCard: testUser.name,
      cardNumber: '4111111111111111',
      cvc: '123',
      expiryMonth: '12',
      expiryYear: '2028',
    });

    // 7. Verify đơn hàng được tạo thành công
    await checkoutPage.verifyOrderPlaced();

    // 8. Tải hóa đơn Invoice PDF và kiểm tra file tải về thành công
    const downloadedFileName = await checkoutPage.downloadInvoice();
    console.log(`Invoice downloaded successfully: ${downloadedFileName}`);

    // Verify file thực sự đã tồn tại trong ổ cứng
    expect(fs.existsSync(`downloads/${downloadedFileName}`)).toBeTruthy();
  });
});