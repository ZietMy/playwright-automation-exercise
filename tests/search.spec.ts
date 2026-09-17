import { test, expect } from '../fixtures/baseTest';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';

test.describe('Feature: Product Search & Filter', () => {
  let homePage: HomePage;
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);

    await homePage.navigateTo('/');
    await homePage.handleConsentModal();
    await productPage.goToProductsPage();
  });

  // 1. Happy Path: Tìm kiếm theo từ khóa đúng
  test('TC03_01 - [Positive] Search with valid keyword returns relevant products', async () => {
    const keyword = 'Dress';
    await productPage.searchProduct(keyword);
    await productPage.verifySearchResultsContain(keyword);
  });

  // 2. Case Insensitive: Tìm kiếm không phân biệt chữ hoa/thường
  test('TC03_02 - [Positive] Search is case-insensitive', async () => {
    const keyword = 'dReSs';
    await productPage.searchProduct(keyword);
    await productPage.verifySearchResultsContain('dress');
  });

  // 3. Negative Case: Tìm kiếm từ khóa không tồn tại
  test('TC03_03 - [Negative] Search with non-existent keyword returns empty list', async () => {
    const invalidKeyword = 'NonExistentProduct12345XYZ';
    await productPage.searchProduct(invalidKeyword);
    await productPage.verifyNoProductsFound();
  });

  // 4. Edge Case: Tìm kiếm với từ khóa rỗng (Empty Search)
  test('TC03_04 - [Edge] Search with empty input displays all products or handles gracefully', async () => {
    await productPage.searchProduct('');
    const count = await productPage.getProductCount();
    // Đảm bảo không bị crash giao diện khi bấm search trống
    expect(count).toBeGreaterThan(0);
  });

  // 5. Boundary Case: Tìm kiếm với ký tự đặc biệt
  test('TC03_05 - [Edge] Search with special characters does not break the app', async () => {
    const specialChars = '<script>alert("test")</script>';
    await productPage.searchProduct(specialChars);
    await productPage.verifyNoProductsFound();
  });
});