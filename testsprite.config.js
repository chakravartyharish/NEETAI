/**
 * TestSprite MCP Server Configuration for NEETAI Platform
 * Comprehensive testing setup for Indian EdTech application
 */

module.exports = {
  // Project Configuration
  projectName: 'NEETAI',
  projectPath: '/home/harish/Desktop/NEETAI',
  baseUrl: 'http://localhost:3001',
  
  // Environment Configuration
  environments: {
    development: {
      url: 'http://localhost:3001',
      database: 'development',
      apiKey: process.env.TESTSPRITE_DEV_API_KEY
    },
    staging: {
      url: process.env.STAGING_URL,
      database: 'staging',
      apiKey: process.env.TESTSPRITE_STAGING_API_KEY
    },
    production: {
      url: process.env.PRODUCTION_URL,
      database: 'production',
      apiKey: process.env.TESTSPRITE_PROD_API_KEY
    }
  },

  // Browser Configuration for Indian Market
  browsers: [
    { name: 'chrome', version: 'latest' },
    { name: 'firefox', version: 'latest' },
    { name: 'edge', version: 'latest' },
    { name: 'safari', version: 'latest' }, // For iOS users
  ],

  // Mobile Device Testing (Popular in India)
  mobileDevices: [
    {
      name: 'Xiaomi Redmi Note 12',
      viewport: { width: 393, height: 851 },
      userAgent: 'Android Chrome'
    },
    {
      name: 'Samsung Galaxy M32',
      viewport: { width: 412, height: 915 },
      userAgent: 'Android Chrome'
    },
    {
      name: 'OnePlus Nord CE 3',
      viewport: { width: 393, height: 873 },
      userAgent: 'Android Chrome'
    },
    {
      name: 'iPhone 13',
      viewport: { width: 390, height: 844 },
      userAgent: 'iOS Safari'
    }
  ],

  // Network Conditions (Indian Internet Speeds)
  networkConditions: [
    {
      name: 'Fast 4G',
      downloadThroughput: 4 * 1024 * 1024 / 8, // 4 Mbps
      uploadThroughput: 1 * 1024 * 1024 / 8,   // 1 Mbps
      latency: 50
    },
    {
      name: 'Slow 3G',
      downloadThroughput: 500 * 1024 / 8,      // 500 Kbps
      uploadThroughput: 500 * 1024 / 8,        // 500 Kbps
      latency: 400
    },
    {
      name: 'Regular 4G',
      downloadThroughput: 2 * 1024 * 1024 / 8, // 2 Mbps
      uploadThroughput: 1 * 1024 * 1024 / 8,   // 1 Mbps
      latency: 150
    }
  ],

  // Test Configuration
  testConfig: {
    timeout: 30000,
    retries: 2,
    workers: 4,
    reportDir: './test-results',
    screenshotDir: './test-results/screenshots',
    videoDir: './test-results/videos'
  },

  // AI Testing Configuration
  aiTesting: {
    mockAiResponses: true,
    testAiAccuracy: true,
    validatePersonalization: true,
    testMultilingualAi: true,
    languages: ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'mr', 'or']
  },

  // NEET-Specific Test Scenarios
  neetTestScenarios: {
    examSimulation: {
      duration: 180, // 3 hours in minutes
      questionsPerSubject: {
        physics: 45,
        chemistry: 45,
        biology: 90
      },
      negativeMarking: true
    },
    subjectAreas: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
    difficultyLevels: ['Easy', 'Medium', 'Hard'],
    yearRange: [1988, 2025]
  },

  // Authentication Testing
  authConfig: {
    testAccounts: {
      student: {
        email: 'test.student@neetai.com',
        phone: '+919876543210',
        password: 'TestPass123!'
      },
      teacher: {
        email: 'test.teacher@neetai.com',
        phone: '+919876543211',
        password: 'TeacherPass123!'
      },
      admin: {
        email: 'test.admin@neetai.com',
        phone: '+919876543212',
        password: 'AdminPass123!'
      }
    },
    otpMocking: true,
    socialLogins: ['google', 'facebook']
  },

  // Payment Testing (Indian Market)
  paymentConfig: {
    testMode: true,
    gateways: ['razorpay', 'payu', 'stripe'],
    methods: ['card', 'upi', 'netbanking', 'wallet'],
    currencies: ['INR'],
    testCards: {
      success: '4111111111111111',
      failure: '4000000000000002',
      insufficient: '4000000000009995'
    }
  },

  // Performance Benchmarks
  performanceBenchmarks: {
    pageLoad: 2000,        // 2 seconds max
    apiResponse: 500,      // 500ms max
    aiResponse: 3000,      // 3 seconds for AI responses
    imageLoad: 1500,       // 1.5 seconds for images
    firstContentfulPaint: 1200 // 1.2 seconds
  },

  // Accessibility Configuration
  accessibility: {
    standards: ['WCAG2.1AA'],
    testKeyboardNavigation: true,
    testScreenReader: true,
    testColorContrast: true,
    testFocusManagement: true
  },

  // Test Data Configuration
  testData: {
    sampleQuestions: './tests/fixtures/neet-questions.json',
    userProfiles: './tests/fixtures/user-profiles.json',
    mockResponses: './tests/fixtures/ai-responses.json',
    examData: './tests/fixtures/exam-patterns.json'
  },

  // Reporting Configuration
  reporting: {
    formats: ['html', 'json', 'junit'],
    includeScreenshots: true,
    includeVideos: true,
    generateCoverage: true,
    slackWebhook: process.env.SLACK_WEBHOOK_URL,
    emailNotifications: {
      enabled: true,
      recipients: ['dev-team@neetai.com'],
      onFailure: true,
      onSuccess: false
    }
  },

  // CI/CD Integration
  ci: {
    parallel: true,
    maxConcurrency: 4,
    failFast: false,
    generateArtifacts: true
  }
};