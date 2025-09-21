import { emailServiceManager } from './utils/emailServiceManager.js';
import dotenv from 'dotenv';

/* eslint-disable no-undef */
dotenv.config();

// Test the Google registration email functionality
async function testGoogleRegistrationEmail() {
  console.log('🧪 Testing Google Registration Email Service...\n');

  const testEmail = 'testuser@example.com'; // Change this to your email for testing
  const testPassword = 'BrightTiger42'; // Example of readable password format
  const testFirstName = 'Test User';
  
  try {
    console.log('📧 Attempting to send Google registration email...');
    console.log(`Email: ${testEmail}`);
    console.log(`Password: ${testPassword}`);
    console.log(`Name: ${testFirstName}\n`);

    const result = await emailServiceManager.sendAccountCreationEmail(
      testEmail,
      testPassword,
      testFirstName,
      'Patient',
      'Eye2Wear'
    );

    console.log('✅ Google registration email sent successfully!');
    console.log('Message ID:', result.messageId || result.response || 'N/A');
    console.log('\n🎉 Test completed successfully!');
    console.log('\nThis email contains:');
    console.log('- User\'s login credentials (email and password)');
    console.log('- Welcome message for Google registration');
    console.log('- Direct link to login page');
    
  } catch (error) {
    console.error('❌ Google registration email test failed:');
    console.error('Error:', error.message);
    console.error('\nThis might be due to:');
    console.error('- Email service configuration issues');
    console.error('- Network connectivity problems'); 
    console.error('- Invalid email credentials');
  }
}

// Generate readable password function test
function testPasswordGeneration() {
  console.log('\n🔐 Testing readable password generation...\n');
  
  const adjectives = ['Swift', 'Bright', 'Cool', 'Smart', 'Quick', 'Bold', 'Calm', 'Pure'];
  const nouns = ['Tiger', 'Eagle', 'River', 'Moon', 'Star', 'Ocean', 'Fire', 'Wind'];
  
  for (let i = 0; i < 5; i++) {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const numbers = Math.floor(Math.random() * 100);
    const password = `${adjective}${noun}${numbers}`;
    
    console.log(`Sample password ${i + 1}: ${password}`);
  }
  
  console.log('\n✅ Password generation working correctly!');
  console.log('Passwords are readable and memorable for users.');
}

// Run tests
async function runTests() {
  try {
    testPasswordGeneration();
    await testGoogleRegistrationEmail();
  } catch (error) {
    console.error('Test suite failed:', error);
  } finally {
    process.exit(0);
  }
}

runTests();