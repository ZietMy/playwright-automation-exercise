import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

test.describe('User Registration Flow', () => {
  let homePage: HomePage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);

    // 1. Mở trang chủ và xử lý consent modal nếu có
    await homePage.navigateTo('/');
    await homePage.handleConsentModal();
  });

  test('TC02 - Full User Registration Process Successfully', async ({ page }) => {
    // 2. Chuyển sang màn hình Signup/Login
    await homePage.clickSignupLogin();
    await expect(loginPage.newUserHeader).toBeVisible();

    // 3. Tạo dữ liệu dynamic tránh trùng lặp email khi chạy lại test
    const timestamp = Date.now();
    const testUser = {
      name: 'test',
      email: `test_${timestamp}@example.com`,
      password: 'Password123!',
      day: '15',
      month: 'May',
      year: '1995',
      firstName: 'Playwright',
      lastName: 'Tester',
      company: 'ABD Company',
      address: '123 Testing Street',
      country: 'United States',
      state: 'California',
      city: 'San Jose',
      zipcode: '95101',
      mobile: '1234567890'
    };

    // 4. Bước 1: Điền Form Signup ban đầu
    await loginPage.fillInitialSignup(testUser.name, testUser.email);

    // 5. Bước 2: Điền chi tiết thông tin tài khoản và địa chỉ
    await loginPage.fillAccountDetails(testUser);

    // 6. Bước 3: Verify đăng ký thành công và nhấn Continue
    await loginPage.verifyAccountCreated();

    // 7. Verify hệ thống đã đăng nhập thành công (hiển thị "Logged in as name")
    await expect(page.getByText(`Logged in as ${testUser.name}`)).toBeVisible();
  });
});