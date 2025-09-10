import dotenv from 'dotenv';
import iPragSMS from './utils/iprogSMS.js';

// Load environment variables
dotenv.config();

// Test clinic-specific SMS credits directly (bypassing HTTP)
async function testSmsCreditsDirectly() {
  console.log('🧪 Testing SMS Credits Directly (no HTTP)...\n');

  try {
    // Test Ambher Optical SMS credits
    console.log('📋 Testing Ambher Optical SMS credits:');
    const ambherClient = iPragSMS.createForAmbher();
    console.log('   API Token (first 10 chars):', ambherClient.apiToken ? ambherClient.apiToken.substring(0, 10) + '...' : 'None');
    
    const ambherResult = await ambherClient.checkSmsCredits();
    console.log('   Result:', ambherResult);
    console.log('   Success:', ambherResult.success);
    console.log('   Balance:', ambherResult.balance);
    console.log('   Provider:', ambherResult.provider);

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test Bautista Eye Center SMS credits
    console.log('\n📋 Testing Bautista Eye Center SMS credits:');
    const bautistaClient = iPragSMS.createForBautista();
    console.log('   API Token (first 10 chars):', bautistaClient.apiToken ? bautistaClient.apiToken.substring(0, 10) + '...' : 'None');
    
    const bautistaResult = await bautistaClient.checkSmsCredits();
    console.log('   Result:', bautistaResult);
    console.log('   Success:', bautistaResult.success);
    console.log('   Balance:', bautistaResult.balance);
    console.log('   Provider:', bautistaResult.provider);

    // Compare results
    if (ambherResult.success && bautistaResult.success) {
      console.log('\n🎯 COMPARISON:');
      console.log('   Ambher Optical Balance:', ambherResult.balance, 'credits');
      console.log('   Bautista Eye Center Balance:', bautistaResult.balance, 'credits');
      
      if (ambherResult.balance !== bautistaResult.balance) {
        console.log('   ✅ SUCCESS! Different balances detected - clinic-specific tokens are working!');
      } else {
        console.log('   ⚠️  WARNING: Same balances detected - this might indicate an issue.');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Stack:', error.stack);
  }

  console.log('\n✅ Direct SMS Credits test completed!');
}

testSmsCreditsDirectly().catch(console.error);
