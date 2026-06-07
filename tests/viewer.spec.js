// @ts-check
const { test, expect } = require('@playwright/test');

// 1x1px 透明PNG (テスト用)
const TINY_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForSelector('#screen-home.active', { state: 'attached', timeout: 10000 });
});

// ================================================================
// PDF VIEWER
// ================================================================
test('PDFビューワー：開いたら戻るボタンが表示される', async ({ page }) => {
    await page.evaluate(() => {
        window.openPDFViewer('public/manuals/circus_st.pdf', 'サーカスST 取扱説明書');
    });
    const modal = page.locator('#pdf-viewer-modal');
    await expect(modal).toHaveClass(/open/, { timeout: 3000 });

    // ヘッダーに戻るボタンとタイトルが表示されること
    await expect(page.locator('.pdf-back-btn')).toBeAttached();
    await expect(page.locator('#pdf-viewer-title')).toHaveText('サーカスST 取扱説明書');
});

test('PDFビューワー：戻るボタンで閉じて元の画面へ戻る', async ({ page }) => {
    // 取説一覧へ移動してからPDFを開く
    await page.click('#nav-pdf-list');
    await page.waitForSelector('#screen-pdf-list.active', { state: 'attached', timeout: 5000 });

    // JS経由でPDFビューワーを開く
    await page.evaluate(() => {
        window.openPDFViewer('public/manuals/circus_st.pdf', 'テスト取扱説明書');
    });
    const modal = page.locator('#pdf-viewer-modal');
    await expect(modal).toHaveClass(/open/, { timeout: 3000 });

    // ← 戻るをクリック
    await page.click('.pdf-back-btn');
    await expect(modal).not.toHaveClass(/open/, { timeout: 3000 });

    // 取説一覧画面に戻っていること
    await expect(page.locator('#screen-pdf-list')).toHaveClass(/active/);
});

test('PDFビューワー：取説一覧から「開く」ボタンでPDFビューワーが起動する', async ({ page }) => {
    await page.click('#nav-pdf-list');
    await page.waitForSelector('#screen-pdf-list.active', { state: 'attached', timeout: 5000 });

    // 「開く」ボタンをクリック（PDF登録済みのカードに存在）
    const openBtns = page.locator('.pdf-btn:not([disabled])');
    const count = await openBtns.count();
    if (count > 0) {
        await openBtns.first().click();
        const modal = page.locator('#pdf-viewer-modal');
        await expect(modal).toHaveClass(/open/, { timeout: 3000 });
        // 戻ってPDFリストに戻れること
        await page.click('.pdf-back-btn');
        await expect(modal).not.toHaveClass(/open/, { timeout: 3000 });
        await expect(page.locator('#screen-pdf-list')).toHaveClass(/active/);
    }
});

// ================================================================
// IMAGE VIEWER
// ================================================================
test('画像ビューワー：開いたら✕ボタンが左上に表示される', async ({ page }) => {
    await page.evaluate((src) => {
        window.openImageViewer(src, 'テスト画像');
    }, TINY_PNG);

    const overlay = page.locator('.img-viewer-overlay');
    await expect(overlay).toBeAttached({ timeout: 3000 });

    // ✕ボタンが存在すること
    const closeBtn = page.locator('.img-viewer-close-btn');
    await expect(closeBtn).toBeAttached();

    // ✕ボタンの位置が左上（x < 60px）であること
    const box = await closeBtn.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
        expect(box.x).toBeLessThan(60);
        expect(box.y).toBeLessThan(80);
    }
});

test('画像ビューワー：✕ボタンをタップして閉じる', async ({ page }) => {
    await page.evaluate((src) => {
        window.openImageViewer(src, 'テスト画像');
    }, TINY_PNG);

    const overlay = page.locator('.img-viewer-overlay');
    await expect(overlay).toBeAttached({ timeout: 3000 });

    await page.locator('.img-viewer-close-btn').click();
    await expect(overlay).not.toBeAttached({ timeout: 3000 });
});

test('画像ビューワー：背景タップで閉じる', async ({ page }) => {
    await page.evaluate((src) => {
        window.openImageViewer(src, 'テスト画像');
    }, TINY_PNG);

    const overlay = page.locator('.img-viewer-overlay');
    await expect(overlay).toBeAttached({ timeout: 3000 });

    // オーバーレイの端（左端・中段）をタップ → 背景クリック
    const vp = page.viewportSize();
    await page.mouse.click(5, (vp?.height ?? 812) / 2);
    await expect(overlay).not.toBeAttached({ timeout: 3000 });
});

// ================================================================
// EXTERNAL URL MODAL
// ================================================================
test('外部URLモーダル：アプリへ戻る案内が表示される', async ({ page }) => {
    await page.evaluate(() => {
        window.openExtUrl('https://www.dropbox.com/test');
    });
    const modal = page.locator('#ext-url-modal');
    await expect(modal).toHaveClass(/open/, { timeout: 3000 });

    // 「アプリへ戻る」の文言が含まれること
    await expect(page.locator('#ext-url-modal').locator('text=アプリへ戻る').first()).toBeAttached();
    // 「開く」ボタンと「キャンセル」ボタンが存在すること
    await expect(page.locator('.ext-url-proceed-btn')).toBeAttached();
    await expect(page.locator('.ext-url-cancel-btn')).toBeAttached();
});

test('外部URLモーダル：キャンセルで閉じる', async ({ page }) => {
    await page.evaluate(() => {
        window.openExtUrl('https://drive.google.com/test');
    });
    const modal = page.locator('#ext-url-modal');
    await expect(modal).toHaveClass(/open/, { timeout: 3000 });

    await page.click('.ext-url-cancel-btn');
    await expect(modal).not.toHaveClass(/open/, { timeout: 3000 });
});

test('外部URLモーダル：背景タップで閉じる', async ({ page }) => {
    await page.evaluate(() => {
        window.openExtUrl('https://onedrive.live.com/test');
    });
    const modal = page.locator('#ext-url-modal');
    await expect(modal).toHaveClass(/open/, { timeout: 3000 });

    // モーダル背景（上端）をクリック
    await modal.click({ position: { x: 187, y: 20 } });
    await expect(modal).not.toHaveClass(/open/, { timeout: 3000 });
});
