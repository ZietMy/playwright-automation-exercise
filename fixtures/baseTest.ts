import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    // Đăng ký route chặn quảng cáo tự động cho mọi trang
    await page.route('**/*google*/**', route => route.abort());
    await page.route('**/*pagead*/**', route => route.abort());
    await page.route('**/*doubleclick*/**', route => route.abort());

    // Chuyển giao page đã được cấu hình cho test case sử dụng
    await use(page);
  },
});

export { expect } from '@playwright/test';