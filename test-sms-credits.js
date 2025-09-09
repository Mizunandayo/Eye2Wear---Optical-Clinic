import iPragSMS from './utils/iprogSMS.js';

// Test SMS Credits functionality
const testSmsCredits = async () => {
  console.log('🧪 Testing SMS Credits functionality...');
  
  const iprogClient = new iPragSMS();
  
  // Test 1: Check SMS Credits
  console.log('\n📱 Test 1: Checking SMS Credits');
  const creditsResult = await iprogClient.checkSmsCredits();
  console.log('Credits Result:', creditsResult);
  
  if (creditsResult.success) {
    console.log(`✅ SMS Credits: ${creditsResult.balance} remaining`);
  } else {
    console.log(`❌ Failed to get credits: ${creditsResult.error}`);
  }
  
  // Test 2: Get Provider Info (should include credits endpoint)
  console.log('\n📱 Test 2: Provider Info');
  const providerInfo = iprogClient.getProviderInfo();
  console.log('Provider Info:', providerInfo);
  
  console.log('\n✅ SMS Credits testing completed!');
};

// Run the test
testSmsCredits().catch(console.error);
