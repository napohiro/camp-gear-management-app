# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: basic.spec.js >> ガレージ平面図が収納画面に表示される
- Location: tests\basic.spec.js:60:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#screen-garage').locator('text=ガレージ平面図')
Expected: visible
Error: strict mode violation: locator('#screen-garage').locator('text=ガレージ平面図') resolved to 2 elements:
    1) <div>🗺 ガレージ平面図</div> aka getByText('🗺 ガレージ平面図')
    2) <div>— ガレージ平面図 —</div> aka getByText('— ガレージ平面図 —')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#screen-garage').locator('text=ガレージ平面図')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]: 🏠 ガレージ収納マップ
  - text: 🏕️
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]: 🏠 ガレージ収納マップ
      - generic [ref=e7]: エリアをタップすると収納中のギアが表示されます
    - generic [ref=e8]:
      - generic [ref=e9]: 🗺 ガレージ平面図
      - generic [ref=e11] [cursor=pointer]:
        - text: 📷 平面図画像が見つかりません
        - generic [ref=e12]: public/garage-map.jpg を追加してください
    - generic [ref=e13]:
      - generic [ref=e14]: — ガレージ平面図 —
      - generic [ref=e15]:
        - generic [ref=e16] [cursor=pointer]:
          - generic [ref=e17]: 🗄️
          - generic [ref=e18]: 棚A
          - generic [ref=e19]: 1点
        - generic [ref=e20] [cursor=pointer]:
          - generic [ref=e21]: 🗄️
          - generic [ref=e22]: 棚B
          - generic [ref=e23]: 3点
        - generic [ref=e24] [cursor=pointer]:
          - generic [ref=e25]: 📦
          - generic [ref=e26]: 右奥
          - generic [ref=e27]: 2点
        - generic [ref=e28] [cursor=pointer]:
          - generic [ref=e29]: 🪝
          - generic [ref=e30]: 左壁側
          - generic [ref=e31]: 2点
        - generic [ref=e32] [cursor=pointer]:
          - generic [ref=e33]: 🧺
          - generic [ref=e34]: 床置きエリア
          - generic [ref=e35]: 2点
        - generic [ref=e36] [cursor=pointer]:
          - generic [ref=e37]: 📋
          - generic [ref=e38]: その他
          - generic [ref=e39]: 5点
    - generic [ref=e40]:
      - generic [ref=e42] [cursor=pointer]:
        - generic [ref=e43]:
          - generic [ref=e44]: 🗄️
          - generic [ref=e45]:
            - generic [ref=e46]: 棚A
            - generic [ref=e47]: 上段・下段
        - generic [ref=e48]:
          - generic [ref=e49]: 1点
          - generic [ref=e50]: ›
      - generic [ref=e52] [cursor=pointer]:
        - generic [ref=e53]:
          - generic [ref=e54]: 🗄️
          - generic [ref=e55]:
            - generic [ref=e56]: 棚B
            - generic [ref=e57]: 中段・下段
        - generic [ref=e58]:
          - generic [ref=e59]: 3点
          - generic [ref=e60]: ›
      - generic [ref=e62] [cursor=pointer]:
        - generic [ref=e63]:
          - generic [ref=e64]: 📦
          - generic [ref=e65]:
            - generic [ref=e66]: 右奥
            - generic [ref=e67]: 大型・重量物
        - generic [ref=e68]:
          - generic [ref=e69]: 2点
          - generic [ref=e70]: ›
      - generic [ref=e72] [cursor=pointer]:
        - generic [ref=e73]:
          - generic [ref=e74]: 🪝
          - generic [ref=e75]:
            - generic [ref=e76]: 左壁側
            - generic [ref=e77]: 壁掛け・フック
        - generic [ref=e78]:
          - generic [ref=e79]: 2点
          - generic [ref=e80]: ›
      - generic [ref=e82] [cursor=pointer]:
        - generic [ref=e83]:
          - generic [ref=e84]: 🧺
          - generic [ref=e85]:
            - generic [ref=e86]: 床置きエリア
            - generic [ref=e87]: 大型・ランタン類
        - generic [ref=e88]:
          - generic [ref=e89]: 2点
          - generic [ref=e90]: ›
      - generic [ref=e92] [cursor=pointer]:
        - generic [ref=e93]:
          - generic [ref=e94]: 📋
          - generic [ref=e95]:
            - generic [ref=e96]: その他
            - generic [ref=e97]: エリア未設定
        - generic [ref=e98]:
          - generic [ref=e99]: 5点
          - generic [ref=e100]: ›
  - generic [ref=e101]:
    - generic [ref=e102] [cursor=pointer]:
      - generic [ref=e103]: 🏕️
      - generic [ref=e104]: ホーム
    - generic [ref=e105] [cursor=pointer]:
      - generic [ref=e106]: 🎒
      - generic [ref=e107]: ギア
    - generic [ref=e108] [cursor=pointer]:
      - generic [ref=e109]: ✅
      - generic [ref=e110]: チェック
    - generic [ref=e111] [cursor=pointer]:
      - generic [ref=e112]: 📄
      - generic [ref=e113]: 取説
    - generic [ref=e114] [cursor=pointer]:
      - generic [ref=e115]: 🏠
      - generic [ref=e116]: 収納
```

# Test source

```ts
  1  | // @ts-check
  2  | const { test, expect } = require('@playwright/test');
  3  | 
  4  | test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |     // localStorageを初期状態にしてデフォルトギアを読み込む
  7  |     await page.evaluate(() => {
  8  |         localStorage.clear();
  9  |     });
  10 |     await page.reload();
  11 |     await page.waitForSelector('#screen-home', { state: 'visible' });
  12 | });
  13 | 
  14 | test('ギア一覧の内容が持ち物チェックに反映される', async ({ page }) => {
  15 |     // 持ち物チェック画面に遷移
  16 |     await page.click('#nav-checklist');
  17 |     await page.waitForSelector('#screen-checklist', { state: 'visible' });
  18 | 
  19 |     // デフォルトギアのギア名がチェックリストに表示されていること
  20 |     const checkItems = page.locator('#checklist-items .check-text');
  21 |     const count = await checkItems.count();
  22 |     expect(count).toBeGreaterThan(0);
  23 | 
  24 |     // デフォルトギアの1つ「サーカスST」が存在すること
  25 |     const texts = await checkItems.allTextContents();
  26 |     const hasCircusST = texts.some(t => t.includes('サーカスST'));
  27 |     expect(hasCircusST).toBeTruthy();
  28 | 
  29 |     // カテゴリヘッダーが表示されていること（テント）
  30 |     const catHeaders = page.locator('#checklist-items .cat-header');
  31 |     const catCount = await catHeaders.count();
  32 |     expect(catCount).toBeGreaterThan(0);
  33 | });
  34 | 
  35 | test('日付入力がスマホ幅からはみ出さない', async ({ page }) => {
  36 |     await page.click('#nav-checklist');
  37 |     await page.waitForSelector('#screen-checklist', { state: 'visible' });
  38 | 
  39 |     const viewport = page.viewportSize();
  40 |     const viewportWidth = viewport?.width ?? 375;
  41 | 
  42 |     // trip-date input の右端が viewport 幅を超えていないこと
  43 |     const dateInput = page.locator('#trip-date');
  44 |     const dateBox = await dateInput.boundingBox();
  45 |     expect(dateBox).not.toBeNull();
  46 |     if (dateBox) {
  47 |         expect(dateBox.x + dateBox.width).toBeLessThanOrEqual(viewportWidth + 1);
  48 |         expect(dateBox.x).toBeGreaterThanOrEqual(0);
  49 |     }
  50 | 
  51 |     // trip-dest input も同様
  52 |     const destInput = page.locator('#trip-dest');
  53 |     const destBox = await destInput.boundingBox();
  54 |     expect(destBox).not.toBeNull();
  55 |     if (destBox) {
  56 |         expect(destBox.x + destBox.width).toBeLessThanOrEqual(viewportWidth + 1);
  57 |     }
  58 | });
  59 | 
  60 | test('ガレージ平面図が収納画面に表示される', async ({ page }) => {
  61 |     // 収納タブに遷移
  62 |     await page.click('#nav-garage');
  63 |     await page.waitForSelector('#screen-garage', { state: 'visible' });
  64 | 
  65 |     // 平面図カードが存在すること
  66 |     const floorplanWrap = page.locator('#garage-floorplan-wrap');
  67 |     await expect(floorplanWrap).toBeVisible();
  68 | 
  69 |     // 「ガレージ平面図」ラベルが表示されていること
> 70 |     await expect(page.locator('#screen-garage').locator('text=ガレージ平面図')).toBeVisible();
     |                                                                          ^ Error: expect(locator).toBeVisible() failed
  71 | });
  72 | 
  73 | test('画像タップで拡大モーダルが開く', async ({ page }) => {
  74 |     await page.click('#nav-garage');
  75 |     await page.waitForSelector('#screen-garage', { state: 'visible' });
  76 | 
  77 |     // モーダルが最初は非表示
  78 |     const modal = page.locator('#floorplan-modal');
  79 |     await expect(modal).not.toHaveClass(/open/);
  80 | 
  81 |     // 平面図をタップ
  82 |     await page.click('#garage-floorplan-wrap');
  83 | 
  84 |     // モーダルが開くこと
  85 |     await expect(modal).toHaveClass(/open/);
  86 | 
  87 |     // モーダルをタップして閉じる
  88 |     await modal.click();
  89 |     await expect(modal).not.toHaveClass(/open/);
  90 | });
  91 | 
```