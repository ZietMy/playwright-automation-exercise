import {test, expect} from '@playwright/test';
import {HomePage} from '../pages/HomePage';

test.describe('Home Page Tests', () => {
    test('TC01 - Verify Home Page Load and Signup link is visible', async ({page}) => {
        const homePage = new HomePage(page);
        await homePage.navigateTo('/');
        await homePage.handleConsentModal();
        // kiẻm tra tiêu đề trang
        await expect(page).toHaveTitle(/Automation Exercise/);
        // click chuyển trang Login/Signup
        await homePage.clickSignupLogin();
        // xác nhận đã chuyển sang trang Login/Signup
        await expect(page).toHaveURL(/.*login/);
    });
});