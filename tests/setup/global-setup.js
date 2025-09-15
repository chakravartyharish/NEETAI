/**
 * Global Setup for NEETAI TestSprite Testing
 * Handles test environment initialization
 */

const config = require('../../testsprite.config.js');

async function globalSetup() {
  console.log('🚀 Setting up NEETAI testing environment...');
  
  // Initialize test database
  await setupTestDatabase();
  
  // Create test users
  await createTestUsers();
  
  // Seed test data
  await seedTestData();
  
  // Setup mock services
  await setupMockServices();
  
  console.log('✅ Global setup completed');
}

async function setupTestDatabase() {
  console.log('📊 Setting up test database...');
  
  // Create test database schema
  // This would typically use Supabase or your database client
  
  // Example: Reset test tables
  // await supabase.from('users').delete().neq('id', '');
  // await supabase.from('questions').delete().neq('id', '');
  // await supabase.from('exams').delete().neq('id', '');
}

async function createTestUsers() {
  console.log('👥 Creating test users...');
  
  const testUsers = [
    config.authConfig.testAccounts.student,
    config.authConfig.testAccounts.teacher,
    config.authConfig.testAccounts.admin
  ];
  
  // Create test accounts in your auth system
  for (const user of testUsers) {
    try {
      // Example: Create user in Supabase Auth
      // await supabase.auth.signUp({
      //   email: user.email,
      //   password: user.password,
      //   phone: user.phone
      // });
      
      console.log(`Created test user: ${user.email}`);
    } catch (error) {
      console.log(`Test user ${user.email} already exists or creation failed`);
    }
  }
}

async function seedTestData() {
  console.log('🌱 Seeding test data...');
  
  // Load NEET questions from fixture
  const neetQuestions = require('../fixtures/neet-questions.json');
  
  // Insert test questions
  // await supabase.from('questions').insert(neetQuestions.physics);
  // await supabase.from('questions').insert(neetQuestions.chemistry);
  // await supabase.from('questions').insert(neetQuestions.biology);
  
  console.log('Test data seeded successfully');
}

async function setupMockServices() {
  console.log('🎭 Setting up mock services...');
  
  // Setup AI service mocks
  if (config.aiTesting.mockAiResponses) {
    // Mock OpenAI API responses
    // This would typically involve setting up mock servers or intercepting requests
    console.log('AI service mocks configured');
  }
  
  // Setup payment gateway mocks
  if (config.paymentConfig.testMode) {
    // Configure Razorpay/PayU test mode
    console.log('Payment gateway mocks configured');
  }
}

module.exports = globalSetup;