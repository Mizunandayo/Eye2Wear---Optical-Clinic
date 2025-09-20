// Test script to verify admin authentication fix
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

async function testAdminAuth() {
  try {
    console.log('🧪 Testing Admin Authentication Fix...\n');
    
    // Test admin login
    console.log('1. Testing admin login...');
    const loginResponse = await axios.post(`${API_BASE}/adminaccounts/login`, {
      adminemail: 'test@admin.com', // Replace with actual admin email
      adminpassword: 'testpassword' // Replace with actual admin password
    });
    
    console.log('✅ Admin login successful');
    console.log('Token structure:', JSON.stringify(loginResponse.data, null, 2));
    
    const token = loginResponse.data.jsontoken;
    
    // Test accessing owner accounts with admin token
    console.log('\n2. Testing admin access to owner accounts...');
    const ownerResponse = await axios.get(`${API_BASE}/owneraccounts`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Admin can access owner accounts');
    console.log(`Found ${ownerResponse.data.length} owner accounts`);
    
    // Test accessing admin accounts with admin token
    console.log('\n3. Testing admin access to admin accounts...');
    const adminResponse = await axios.get(`${API_BASE}/adminaccounts`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Admin can access admin accounts');
    console.log(`Found ${adminResponse.data.length} admin accounts`);
    
    console.log('\n🎉 All tests passed! Admin authentication is now working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

// Run the test
testAdminAuth();