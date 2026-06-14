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

    // 収納タブへ移動
    await page.click('#nav-garage');
    await page.waitForSelector('#screen-garage.active', { state: 'attached', timeout: 5000 });
});

test('平面図カードが最上部に表示される', async ({ page }) => {
    // garage-floorplan-card が存在すること
    const card = page.locator('#garage-floorplan-card');
    await expect(card).toBeAttached({ timeout: 3000 });

    // 「ガレージ平面図」ヘッダーが表示されること
    await expect(card.locator('.garage-floorplan-header')).toBeAttached();

    // カードが収納エリアグリッド（garage-map-visual）より上にあること
    const cardBox  = await card.boundingBox();
    const gridBox  = await page.locator('#garage-map-visual').boundingBox();
    expect(cardBox).not.toBeNull();
    expect(gridBox).not.toBeNull();
    if (cardBox && gridBox) {
        expect(cardBox.y).toBeLessThan(gridBox.y);
    }
});

test('平面図画像が heimenzu.jpeg を参照している', async ({ page }) => {
    const img = page.locator('#garage-floorplan-img');
    await expect(img).toBeAttached({ timeout: 3000 });

    const src = await img.getAttribute('src');
    expect(src).toContain('heimenzu');
});

test('平面図画像が object-fit:contain で表示される', async ({ page }) => {
    const img = page.locator('#garage-floorplan-img');
    await expect(img).toBeAttached({ timeout: 3000 });

    const objectFit = await img.evaluate(el => getComputedStyle(el).objectFit);
    expect(objectFit).toBe('contain');
});

test('オーバーレイレイヤー（将来拡張用）が存在する', async ({ page }) => {
    // 拡張ポイントとなる #floorplan-overlay-layer が存在すること
    await expect(page.locator('#floorplan-overlay-layer')).toBeAttached({ timeout: 3000 });
});

test('タップで拡大モーダルが開く', async ({ page }) => {
    const wrap  = page.locator('#garage-floorplan-wrap');
    const modal = page.locator('#floorplan-modal');

    await expect(wrap).toBeAttached({ timeout: 3000 });
    await expect(modal).not.toHaveClass(/open/);

    await wrap.click();
    await expect(modal).toHaveClass(/open/, { timeout: 3000 });
});

test('モーダルに ✕ 閉じるボタンが表示される', async ({ page }) => {
    await page.locator('#garage-floorplan-wrap').click();
    const modal = page.locator('#floorplan-modal');
    await expect(modal).toHaveClass(/open/, { timeout: 3000 });

    const closeBtn = page.locator('.floorplan-modal-close-btn');
    await expect(closeBtn).toBeAttached();

    // ✕ ボタンの位置が右上（x > viewport/2）であること
    const vp  = page.viewportSize();
    const box = await closeBtn.boundingBox();
    expect(box).not.toBeNull();
    if (box && vp) {
        expect(box.x).toBeGreaterThan(vp.width / 2);
        expect(box.y).toBeLessThan(100);
    }
});

test('✕ ボタンをタップして閉じる', async ({ page }) => {
    await page.locator('#garage-floorplan-wrap').click();
    const modal = page.locator('#floorplan-modal');
    await expect(modal).toHaveClass(/open/, { timeout: 3000 });

    await page.locator('.floorplan-modal-close-btn').click();
    await expect(modal).not.toHaveClass(/open/, { timeout: 3000 });

    // 収納画面に戻っていること
    await expect(page.locator('#screen-garage')).toHaveClass(/active/);
});

test('モーダルの背景タップで閉じる', async ({ page }) => {
    await page.locator('#garage-floorplan-wrap').click();
    const modal = page.locator('#floorplan-modal');
    await expect(modal).toHaveClass(/open/, { timeout: 3000 });

    // 左端（背景部分）をタップ
    const vp = page.viewportSize();
    await page.mouse.click(5, (vp?.height ?? 812) / 2);
    await expect(modal).not.toHaveClass(/open/, { timeout: 3000 });
});

test('画像の下に収納エリア一覧が表示される', async ({ page }) => {
    // garage-map-visual と garage-areas が存在すること
    await expect(page.locator('#garage-map-visual')).toBeAttached({ timeout: 3000 });
    await expect(page.locator('#garage-areas')).toBeAttached();

    // 平面図カードより下に配置されていること
    const floorplanY = (await page.locator('#garage-floorplan-card').boundingBox())?.y ?? 0;
    const gridY      = (await page.locator('#garage-map-visual').boundingBox())?.y ?? 0;
    expect(gridY).toBeGreaterThan(floorplanY);
});
