// @ts-check
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    // FVオーバーレイを閉じてアプリへ入る
    await page.waitForSelector('#fv-overlay:not(.hidden)', { state: 'attached', timeout: 10000 });
    await page.evaluate(() => enterApp());
    await page.waitForSelector('#fv-overlay.hidden', { state: 'attached', timeout: 5000 });
});

test('ギア一覧の内容が持ち物チェックに反映される', async ({ page }) => {
    await page.click('#nav-checklist');
    await page.waitForSelector('#screen-checklist.active', { state: 'attached', timeout: 5000 });

    // ギア名がチェックリストに表示されていること
    const checkItems = page.locator('#checklist-items .check-text');
    await expect(checkItems.first()).toBeAttached({ timeout: 5000 });
    const count = await checkItems.count();
    expect(count).toBeGreaterThan(0);

    // カテゴリヘッダーが表示されていること
    const catHeaders = page.locator('#checklist-items .cat-header');
    await expect(catHeaders.first()).toBeAttached({ timeout: 5000 });

    // デフォルトギア「サーカスST」が含まれること
    const texts = await checkItems.allTextContents();
    expect(texts.some(t => t.includes('サーカスST'))).toBeTruthy();
});

test('日付入力がスマホ幅からはみ出さない', async ({ page }) => {
    await page.click('#nav-checklist');
    await page.waitForSelector('#screen-checklist.active', { state: 'attached', timeout: 5000 });

    const viewport = page.viewportSize();
    const viewportWidth = viewport?.width ?? 375;

    // trip-date の右端が viewport 幅内に収まること
    const dateInput = page.locator('#trip-date');
    const dateBox = await dateInput.boundingBox();
    expect(dateBox).not.toBeNull();
    if (dateBox) {
        expect(dateBox.x).toBeGreaterThanOrEqual(0);
        expect(dateBox.x + dateBox.width).toBeLessThanOrEqual(viewportWidth + 1);
    }

    // trip-dest も同様
    const destInput = page.locator('#trip-dest');
    const destBox = await destInput.boundingBox();
    expect(destBox).not.toBeNull();
    if (destBox) {
        expect(destBox.x + destBox.width).toBeLessThanOrEqual(viewportWidth + 1);
    }
});

test('ガレージ平面図が収納画面に表示される', async ({ page }) => {
    await page.click('#nav-garage');
    await page.waitForSelector('#screen-garage.active', { state: 'attached', timeout: 5000 });

    // 平面図 wrapper が DOM にあること
    const floorplanWrap = page.locator('#garage-floorplan-wrap');
    await expect(floorplanWrap).toBeAttached({ timeout: 5000 });

    // 「ガレージ平面図」ラベルが存在すること
    await expect(page.locator('#screen-garage').locator('text=ガレージ平面図').first()).toBeAttached({ timeout: 5000 });
});

test('画像タップで拡大モーダルが開く', async ({ page }) => {
    await page.click('#nav-garage');
    await page.waitForSelector('#screen-garage.active', { state: 'attached', timeout: 5000 });

    const modal = page.locator('#floorplan-modal');
    // 初期状態は open クラスなし
    await expect(modal).not.toHaveClass(/open/, { timeout: 3000 });

    // 平面図エリアをタップ → モーダルが開く
    await page.locator('#garage-floorplan-wrap').click();
    await expect(modal).toHaveClass(/open/, { timeout: 3000 });

    // モーダル背景（左端）をタップ → 閉じる
    const vp = page.viewportSize();
    await page.mouse.click(5, (vp?.height ?? 812) / 2);
    await expect(modal).not.toHaveClass(/open/, { timeout: 3000 });
});
