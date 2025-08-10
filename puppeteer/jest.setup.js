/**
 * Jest Setup for Estopia E2E Tests
 * Global configuration and utilities
 */

const { configureToMatchImageSnapshot } = require('jest-image-snapshot');
const path = require('path');

// Configure image snapshot matching
const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customDiffConfig: {
    threshold: 0.2,
  },
  customSnapshotsDir: path.join(__dirname, 'screenshots', 'snapshots'),
  customDiffDir: path.join(__dirname, 'screenshots', 'diffs'),
});

expect.extend({ toMatchImageSnapshot });

// Global test timeout
jest.setTimeout(60000);

// Global setup for all tests
beforeAll(async () => {
  // Set up page defaults
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  
  // Log console messages from the page
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`🔴 Page Error: ${msg.text()}`);
    }
  });
  
  // Log page errors
  page.on('pageerror', error => {
    console.log(`🚨 JavaScript Error: ${error.message}`);
  });
  
  // Log network failures
  page.on('requestfailed', request => {
    console.log(`🌐 Request Failed: ${request.url()} - ${request.failure().errorText}`);
  });
});

// Global cleanup
afterAll(async () => {
  // Any cleanup needed
});

// Helper function to wait for network idle
global.waitForNetworkIdle = async (timeout = 2000) => {
  await page.waitForLoadState('networkidle', { timeout });
};

// Helper function to take named screenshots
global.takeScreenshot = async (name) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = path.join(__dirname, 'screenshots', `${name}-${timestamp}.png`);
  await page.screenshot({ 
    path: filename, 
    fullPage: true 
  });
  console.log(`📸 Screenshot saved: ${filename}`);
  return filename;
};