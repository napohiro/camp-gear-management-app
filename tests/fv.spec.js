// @ts-check
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
});

test('初回表示でFV画像が表示される', async ({ page }) => {
    const fv = page.locator('#fv-overlay');
    await expect(fv).toBeVisible({ timeout: 10000 });

    const img = page.locator('#fv-overlay .fv-img');
    await expect(img).toBeVisible({ timeout: 5000 });
    await expect(img).toHaveAttribute('src', 'public/fv.png');
});

test('FVをタップするとホーム画面に入る', async ({ page }) => {
    await page.waitForSelector('#fv-overlay:not(.hidden)', { state: 'attached', timeout: 10000 });

    // FV全体をタップ
    await page.locator('#fv-overlay').click();

    // FVが非表示になる
    await expect(page.locator('#fv-overlay')).toBeHidden({ timeout: 5000 });

    // ホーム画面が表示される
    await expect(page.locator('#screen-home')).toBeVisible({ timeout: 5000 });
});

test('下部ナビはFVでは非表示', async ({ page }) => {
    await page.waitForSelector('#fv-overlay:not(.hidden)', { state: 'attached', timeout: 10000 });

    const bottomNav = page.locator('.bottom-nav');
    await expect(bottomNav).toBeHidden({ timeout: 5000 });
});

test('ホーム画面では下部ナビが表示される', async ({ page }) => {
    await page.waitForSelector('#fv-overlay:not(.hidden)', { state: 'attached', timeout: 10000 });

    // FVをタップしてアプリへ
    await page.locator('#fv-overlay').click();
    await expect(page.locator('#fv-overlay')).toBeHidden({ timeout: 5000 });

    const bottomNav = page.locator('.bottom-nav');
    await expect(bottomNav).toBeVisible({ timeout: 5000 });
});
