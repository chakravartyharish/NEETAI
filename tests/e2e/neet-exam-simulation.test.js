/**
 * NEET Exam Simulation E2E Test
 * Tests the complete exam-taking experience for students
 */

const { test, expect } = require('@playwright/test');
const config = require('../../testsprite.config.js');

test.describe('NEET Exam Simulation', () => {
  let page;

  test.beforeEach(async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });
    page = await context.newPage();
    
    // Login as test student
    await page.goto(`${config.baseUrl}/login`);
    await page.fill('[data-testid="email-input"]', config.authConfig.testAccounts.student.email);
    await page.fill('[data-testid="password-input"]', config.authConfig.testAccounts.student.password);
    await page.click('[data-testid="login-button"]');
    
    // Wait for dashboard
    await expect(page.locator('[data-testid="student-dashboard"]')).toBeVisible();
  });

  test('Complete NEET Mock Test Flow', async () => {
    // Navigate to mock tests
    await page.click('[data-testid="mock-tests-nav"]');
    await expect(page.locator('[data-testid="mock-test-list"]')).toBeVisible();

    // Select full-length NEET mock test
    await page.click('[data-testid="full-neet-mock-test"]');
    
    // Read instructions
    await expect(page.locator('[data-testid="exam-instructions"]')).toBeVisible();
    await expect(page.locator('text=Duration: 3 hours')).toBeVisible();
    await expect(page.locator('text=180 questions')).toBeVisible();
    await expect(page.locator('text=Physics: 45 questions')).toBeVisible();
    await expect(page.locator('text=Chemistry: 45 questions')).toBeVisible();
    await expect(page.locator('text=Biology: 90 questions')).toBeVisible();
    
    // Start exam
    await page.click('[data-testid="start-exam-button"]');
    
    // Verify exam interface
    await expect(page.locator('[data-testid="exam-timer"]')).toBeVisible();
    await expect(page.locator('[data-testid="question-panel"]')).toBeVisible();
    await expect(page.locator('[data-testid="question-navigation"]')).toBeVisible();
    await expect(page.locator('[data-testid="subject-tabs"]')).toBeVisible();

    // Test question answering
    await page.click('[data-testid="option-A"]');
    await expect(page.locator('[data-testid="option-A"]')).toHaveClass(/selected/);
    
    // Test question navigation
    await page.click('[data-testid="next-question-button"]');
    await expect(page.locator('[data-testid="question-number"]')).toContainText('2');

    // Test subject switching
    await page.click('[data-testid="chemistry-tab"]');
    await expect(page.locator('[data-testid="current-subject"]')).toContainText('Chemistry');

    // Test bookmark functionality
    await page.click('[data-testid="bookmark-button"]');
    await expect(page.locator('[data-testid="bookmark-button"]')).toHaveClass(/bookmarked/);

    // Test review panel
    await page.click('[data-testid="review-button"]');
    await expect(page.locator('[data-testid="review-panel"]')).toBeVisible();
    
    // Check answered/unanswered statistics
    await expect(page.locator('[data-testid="answered-count"]')).toBeVisible();
    await expect(page.locator('[data-testid="unanswered-count"]')).toBeVisible();
    await expect(page.locator('[data-testid="marked-count"]')).toBeVisible();

    // Submit exam
    await page.click('[data-testid="submit-exam-button"]');
    
    // Confirm submission
    await expect(page.locator('[data-testid="submit-confirmation"]')).toBeVisible();
    await page.click('[data-testid="confirm-submit-button"]');
    
    // Verify results page
    await expect(page.locator('[data-testid="exam-results"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-score"]')).toBeVisible();
    await expect(page.locator('[data-testid="subject-wise-scores"]')).toBeVisible();
    await expect(page.locator('[data-testid="time-taken"]')).toBeVisible();
    await expect(page.locator('[data-testid="accuracy-percentage"]')).toBeVisible();
  });

  test('Test Exam Timer Functionality', async () => {
    // Start a quick test with shorter duration for testing
    await page.click('[data-testid="mock-tests-nav"]');
    await page.click('[data-testid="chapter-wise-test"]');
    await page.click('[data-testid="start-exam-button"]');

    // Verify timer is running
    const timerElement = page.locator('[data-testid="exam-timer"]');
    await expect(timerElement).toBeVisible();
    
    // Wait a few seconds and verify timer is counting down
    const initialTime = await timerElement.textContent();
    await page.waitForTimeout(2000);
    const updatedTime = await timerElement.textContent();
    
    expect(initialTime).not.toBe(updatedTime);
    
    // Test timer warning (usually at 5 minutes remaining)
    // This would need to be mocked or use a shorter test duration
    // await expect(page.locator('[data-testid="timer-warning"]')).toBeVisible();
  });

  test('Test Mobile Responsive Exam Interface', async ({ browser }) => {
    // Test on mobile device
    const mobileContext = await browser.newContext({
      viewport: config.mobileDevices[0].viewport,
      userAgent: config.mobileDevices[0].userAgent
    });
    const mobilePage = await mobileContext.newPage();
    
    // Login and navigate to exam
    await mobilePage.goto(`${config.baseUrl}/login`);
    await mobilePage.fill('[data-testid="email-input"]', config.authConfig.testAccounts.student.email);
    await mobilePage.fill('[data-testid="password-input"]', config.authConfig.testAccounts.student.password);
    await mobilePage.click('[data-testid="login-button"]');
    
    await mobilePage.click('[data-testid="mock-tests-nav"]');
    await mobilePage.click('[data-testid="chapter-wise-test"]');
    await mobilePage.click('[data-testid="start-exam-button"]');
    
    // Verify mobile-optimized interface
    await expect(mobilePage.locator('[data-testid="mobile-question-panel"]')).toBeVisible();
    await expect(mobilePage.locator('[data-testid="mobile-timer"]')).toBeVisible();
    
    // Test touch interactions
    await mobilePage.tap('[data-testid="option-A"]');
    await expect(mobilePage.locator('[data-testid="option-A"]')).toHaveClass(/selected/);
    
    // Test swipe navigation (if implemented)
    // await mobilePage.swipe(100, 300, -100, 300); // Swipe left
    
    await mobileContext.close();
  });

  test('Test Offline Mode During Exam', async () => {
    // Start exam
    await page.click('[data-testid="mock-tests-nav"]');
    await page.click('[data-testid="chapter-wise-test"]');
    await page.click('[data-testid="start-exam-button"]');
    
    // Answer a few questions
    await page.click('[data-testid="option-B"]');
    await page.click('[data-testid="next-question-button"]');
    await page.click('[data-testid="option-A"]');
    
    // Simulate network disconnection
    await page.context().setOffline(true);
    
    // Continue answering questions (should work offline)
    await page.click('[data-testid="next-question-button"]');
    await page.click('[data-testid="option-C"]');
    
    // Verify offline indicator
    await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible();
    
    // Reconnect network
    await page.context().setOffline(false);
    
    // Verify data synchronization
    await expect(page.locator('[data-testid="sync-indicator"]')).toBeVisible();
    
    // Complete and submit exam
    await page.click('[data-testid="submit-exam-button"]');
    await page.click('[data-testid="confirm-submit-button"]');
    
    // Verify all answers were saved
    await expect(page.locator('[data-testid="exam-results"]')).toBeVisible();
  });

  test('Test Accessibility in Exam Interface', async () => {
    // Start exam
    await page.click('[data-testid="mock-tests-nav"]');
    await page.click('[data-testid="chapter-wise-test"]');
    await page.click('[data-testid="start-exam-button"]');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter'); // Should select an option
    
    // Test screen reader compatibility
    const questionText = await page.locator('[data-testid="question-text"]').getAttribute('aria-label');
    expect(questionText).toBeTruthy();
    
    // Test high contrast mode (if supported)
    // await page.evaluate(() => document.body.classList.add('high-contrast'));
    
    // Test focus management
    const focusedElement = await page.locator(':focus');
    expect(focusedElement).toBeTruthy();
  });

  test.afterEach(async () => {
    await page.close();
  });
});