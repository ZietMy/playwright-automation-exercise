import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { generateRandomUser } from '../utils/aiDataGenerator';

test.describe('Feature: User Authentication (Signup & Login)', () => {
  let homePage: HomePage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);

    await homePage.navigateTo('/');
    await homePage.handleConsentModal();
    await homePage.clickSignupLogin();
  });

  // 1. Positive: Đăng ký thành công bằng Gemini AI Data
  test('TC01_01 - [Positive] Register new user successfully with Gemini AI Data', async ({ page }) => {
    const testUser = await generateRandomUser();

    await loginPage.fillInitialSignup(testUser.name, testUser.email);
    await loginPage.fillAccountDetails(testUser);
    await loginPage.verifyAccountCreated();

    await expect(page.getByText(`Logged in as ${testUser.name}`)).toBeVisible();
  });

  // 2. Negative: Đăng ký với Email đã tồn tại
  test('TC01_02 - [Negative] Register with existing email displays error', async () => {
    // Sử dụng một email cố định đã từng tạo trên trang automationexercise.com
    const existingEmail = 'test1409@gmail.com';
    const name = 'Testing';

    await loginPage.fillInitialSignup(name, existingEmail);
    await loginPage.verifySignupError('Email Address already exist!');
  });

  // 3. Positive: Đăng nhập thành công với tài khoản đúng
  test('TC01_03 - [Positive] Login with correct email and password', async ({ page }) => {
    // Lưu ý: Đổi thông tin email/pass này thành tài khoản thực tế bạn đã tạo thành công
    const validEmail = 'qa_gemini_test@example.com'; 
    const validPassword = 'Password123!';

    await loginPage.login(validEmail, validPassword);
    // Nếu tài khoản tồn tại, hệ thống đăng nhập thành công
    // Nếu chưa tạo tài khoản này, có thể dùng tài khoản tạo từ TC01_01
  });

  // 4. Negative: Đăng nhập sai Mật khẩu
  test('TC01_04 - [Negative] Login with incorrect password displays error', async () => {
    await loginPage.login('qa_gemini_test@example.com', 'WrongPassword123!');
    await loginPage.verifyLoginError('Your email or password is incorrect!');
  });

  // 5. Negative: Đăng nhập với Email không tồn tại
  test('TC01_05 - [Negative] Login with non-existent email displays error', async () => {
    const nonExistentEmail = `not_found_${Date.now()}@example.com`;
    await loginPage.login(nonExistentEmail, 'Password123!');
    await loginPage.verifyLoginError('Your email or password is incorrect!');
  });
});