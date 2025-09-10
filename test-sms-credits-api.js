import dotenv from 'dotenv';
import axios from 'axios';
import process from 'process';

// Load environment variables
dotenv.config();

async function testSmsCreditsAPI() {
  console.log('🧪 Testing SMS Credits API with clinic-specific tokens...\n');

  const apiUrl = process.env.VITE_API_URL || 'http://localhost:3000';
  
  try {
    // Test Ambher Optical credits
    console.log('📋 Testing Ambher Optical SMS credits:');
    const ambherResponse = await axios.get(`${apiUrl}/api/sms/credits?clinic=Ambher Optical`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('   Response:', ambherResponse.data);
    console.log('   Balance:', ambherResponse.data.balance);

    // Test Bautista Eye Center credits
    console.log('\n📋 Testing Bautista Eye Center SMS credits:');
    const bautistaResponse = await axios.get(`${apiUrl}/api/sms/credits?clinic=Bautista Eye Center`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('   Response:', bautistaResponse.data);
    console.log('   Balance:', bautistaResponse.data.balance);

    // Test default (no clinic specified)
    console.log('\n📋 Testing default SMS credits (no clinic):');
    const defaultResponse = await axios.get(`${apiUrl}/api/sms/credits`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('   Response:', defaultResponse.data);
    console.log('   Balance:', defaultResponse.data.balance);

  } catch (error) {
    console.error('❌ Error testing SMS credits API:', error.response?.data || error.message);
  }

  console.log('\n✅ SMS Credits API test completed!');
}

// Run the test
testSmsCreditsAPI().catch(console.error);
