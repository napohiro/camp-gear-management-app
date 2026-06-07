// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    timeout: 30000,
    use: {
        baseURL: 'http://localhost:3333',
        viewport: { width: 375, height: 812 },
    },
    webServer: {
        command: 'npx serve . -p 3333',
        url: 'http://localhost:3333',
        reuseExistingServer: !process.env.CI,
        timeout: 15000,
    },
    projects: [
        { name: 'chromium', use: { ...devices['iPhone 13'] } },
    ],
});
