/* eslint-disable no-undef */
/* Test script for updated email controllers */
import dotenv from 'dotenv';
import { sendAccountCreationEmail, sendAccountDeletionEmail } from './utils/emailService.js';

dotenv.config();

const runEmailTests = async () => {
  console.log('Testing updated email controllers...');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  try {
    // Test account creation email
    console.log('\n--- Testing Account Creation Email ---');
    const testEmail = 'test@example.com';
    const testPassword = 'tempPassword123';
    
    const creationResult = await sendAccountCreationEmail(testEmail, testPassword, 'Patient');
    console.log('✅ Account creation email test passed:', creationResult.messageId);
    
    // Test account deletion email
    console.log('\n--- Testing Account Deletion Email ---');
    const deletionResult = await sendAccountDeletionEmail(testEmail, 'Patient');
    console.log('✅ Account deletion email test passed:', deletionResult.messageId);
    
    console.log('\n🎉 All email tests completed successfully!');
    console.log('The updated controllers should now handle production timeouts better with:');
    console.log('- Retry logic with exponential backoff');
    console.log('- Production-optimized SMTP settings');
    console.log('- Connection pooling and rate limiting');
    console.log('- Extended timeout values for production');
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.error('Error details:', error);
  }
};

// Run the tests
runEmailTests();

export { runEmailTests };