// @ts-check
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // localStorageを初期状態にしてデフォルトギアを読み込む
    await page.evaluate(() => {
        localStorage.clear();
    });
    await page.reload();
    await page.waitForSelector('#screen-home', { state: 'visible' });
});

test('ギア一覧の内容が持ち物チェックに反映される', async ({ page }) => {
    // 持ち物チェック画面に遷移
    await page.click('#nav-checklist');
    await page.waitForSelector('#screen-checklist', { state: 'visible' });

    // デフォルトギアのギア名がチェックリストに表示されていること
    const checkItems = page.locator('#checklist-items .check-text');
    const count = await checkItems.count();
    expect(count).toBeGreaterThan(0);

    // デフォルトギアの1つ「サーカスST」が存在すること
    const texts = await checkItems.allTextContents();
    const hasCircusST = texts.some(t => t.includes('サーカスST'));
    expect(hasCircusST).toBeTruthy();

    // カテゴリヘッダーが表示されていること（テント）
    const catHeaders = page.locator('#checklist-items .cat-header');
    const catCount = await catHeaders.count();
    expect(catCount).toBeGreaterThan(0);
});

test('日付入力がスマホ幅からはみ出さない', async ({ page }) => {
    await page.click('#nav-checklist');
    await page.waitForSelector('#screen-checklist', { state: 'visible' });

    const viewport = page.viewportSize();
    const viewportWidth = viewport?.width ?? 375;

    // trip-date input の右端が viewport 幅を超えていないこと
    const dateInput = page.locator('#trip-date');
    const dateBox = await dateInput.boundingBox();
    expect(dateBox).not.toBeNull();
    if (dateBox) {
        expect(dateBox.x + dateBox.width).toBeLessThanOrEqual(viewportWidth + 1);
        expect(dateBox.x).toBeGreaterThanOrEqual(0);
    }

    // trip-dest input も同様
    const destInput = page.locator('#trip-dest');
    const destBox = await destInput.boundingBox();
    expect(destBox).not.toBeNull();
    if (destBox) {
        expect(destBox.x + destBox.width).toBeLessThanOrEqual(viewportWidth + 1);
    }
});

test('ガレージ平面図が収納画面に表示される', async ({ page }) => {
    // 収納タブに遷移
    await page.click('#nav-garage');
    await page.waitForSelector('#screen-garage', { state: 'visible' });

    // 平面図カードが存在すること
    const floorplanWrap = page.locator('#garage-floorplan-wrap');
    await expect(floorplanWrap).toBeVisible();

    // 「ガレージ平面図」ラベルが表示されていること
    await expect(page.locator('#screen-garage').locator('text=ガレージ平面図')).toBeVisible();
});

test('画像タップで拡大モーダルが開く', async ({ page }) => {
    await page.click('#nav-garage');
    await page.waitForSelector('#screen-garage', { state: 'visible' });

    // モーダルが最初は非表示
    const modal = page.locator('#floorplan-modal');
    await expect(modal).not.toHaveClass(/open/);

    // 平面図をタップ
    await page.click('#garage-floorplan-wrap');

    // モーダルが開くこと
    await expect(modal).toHaveClass(/open/);

    // モーダルをタップして閉じる
    await modal.click();
    await expect(modal).not.toHaveClass(/open/);
});
