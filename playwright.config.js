/**
 * Playwright Configuration for NEETAI Platform
 * E2E testing configuration optimized for EdTech application
 */

const { defineConfig, devices } = require('@playwright/test');
const config = require('./testsprite.config.js');

module.exports = defineConfig({
  // Test directory
  testDir: './tests/e2e',
  
  // Test timeout
  timeout: config.testConfig.timeout,
  
  // Expect timeout for assertions
  expect: {
    timeout: 10000
  },
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? config.testConfig.retries : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : config.testConfig.workers,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'test-results/playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['line']
  ],
  
  // Global test settings
  use: {
    // Base URL
    baseURL: config.baseUrl,
    
    // Browser settings
    headless: process.env.CI ? true : false,
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Action timeout
    actionTimeout: 10000,
    
    // Navigation timeout
    navigationTimeout: 15000,
  },

  // Test projects for different browsers and devices
  projects: [
    // Desktop browsers
    {
      name: 'chromium-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
    },
    {
      name: 'firefox-desktop',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 }
      },
    },
    {
      name: 'webkit-desktop',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 }
      },
    },

    // Mobile devices (Popular in India)
    {
      name: 'mobile-chrome-android',
      use: { 
        ...devices['Galaxy S9+'],
        viewport: config.mobileDevices[1].viewport // Samsung Galaxy M32
      },
    },
    {
      name: 'mobile-xiaomi',
      use: {
        ...devices['Pixel 5'],
        viewport: config.mobileDevices[0].viewport, // Xiaomi Redmi Note 12
        userAgent: config.mobileDevices[0].userAgent
      },
    },
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 13'],
        viewport: config.mobileDevices[3].viewport
      },
    },

    // Network condition testing
    {
      name: 'slow-3g',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        // Simulate slow 3G network
        launchOptions: {
          args: [
            '--throttling-flag=3g',
            '--throttling-percent=50'
          ]
        }
      },
    }
  ],

  // Web server configuration
  webServer: {
    command: 'npm run dev',
    port: 3001,
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes to start the dev server
  },

  // Output directories
  outputDir: config.testConfig.reportDir,
  
  // Global setup/teardown
  globalSetup: './tests/setup/global-setup.js',
  globalTeardown: './tests/setup/global-teardown.js',
});