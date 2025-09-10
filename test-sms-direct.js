import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

async function testDirectly() {
  console.log('🧪 Testing SMS Credits API directly...\n');

  try {
    // Test simple health check first
    console.log('📋 Testing server health:');
    const healthResponse = await fetch('http://localhost:3000/api/sms/test');
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('   ✅ Server is responding:', healthData.success);
    } else {
      console.log('   ❌ Health check failed:', healthResponse.status);
    }

    // Test Ambher Optical SMS credits
    console.log('\n📋 Testing Ambher Optical SMS credits:');
    const ambherUrl = 'http://localhost:3000/api/sms/credits?clinic=Ambher%20Optical';
    console.log('   URL:', ambherUrl);
    
    const ambherResponse = await fetch(ambherUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const ambherText = await ambherResponse.text();
    console.log('   Status:', ambherResponse.status);
    console.log('   Response:', ambherText);

    // Test Bautista Eye Center SMS credits
    console.log('\n📋 Testing Bautista Eye Center SMS credits:');
    const bautistaUrl = 'http://localhost:3000/api/sms/credits?clinic=Bautista%20Eye%20Center';
    console.log('   URL:', bautistaUrl);
    
    const bautistaResponse = await fetch(bautistaUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const bautistaText = await bautistaResponse.text();
    console.log('   Status:', bautistaResponse.status);
    console.log('   Response:', bautistaText);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Stack:', error.stack);
  }

  console.log('\n✅ Test completed!');
}

testDirectly().catch(console.error);
