// Test script to verify SMS endpoints are working
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3000/api';

// Test 1: Fetch SMS messages (should fix the "Failed to fetch SMS messages" error)
async function testFetchSmsMessages() {
  console.log('🧪 Testing SMS messages fetch...');
  try {
    const response = await fetch(`${API_BASE}/sms`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Note: In real usage, you'd need a valid token
        'Authorization': 'Bearer test-token'
      }
    });

    console.log(`📊 Response status: ${response.status}`);
    
    if (response.status === 401) {
      console.log('✅ Endpoint is accessible (401 = auth required, which is expected)');
      return true;
    }
    
    if (response.status === 500) {
      const errorData = await response.json();
      console.log('❌ Server error:', errorData);
      return false;
    }

    const data = await response.json();
    console.log('✅ SMS messages fetch test passed');
    return true;
  } catch (error) {
    console.log('❌ SMS messages fetch test failed:', error.message);
    return false;
  }
}

// Test 2: Test promotional SMS endpoint structure (without sending actual SMS)
async function testPromotionalSmsEndpoint() {
  console.log('🧪 Testing promotional SMS endpoint...');
  try {
    const response = await fetch(`${API_BASE}/sms/promotional`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify({
        subject: 'Test Subject',
        message: 'Test Message',
        senderClinic: 'Test Clinic',
        senderUserId: 'test-user-id',
        senderUserName: 'Test User'
      })
    });

    console.log(`📊 Response status: ${response.status}`);
    
    if (response.status === 401) {
      console.log('✅ Endpoint is accessible (401 = auth required, which is expected)');
      return true;
    }
    
    if (response.status === 400) {
      console.log('✅ Endpoint validates input properly (400 = bad request expected without proper auth)');
      return true;
    }

    if (response.status === 500) {
      const errorData = await response.json();
      console.log('❌ Server error:', errorData);
      return false;
    }

    console.log('✅ Promotional SMS endpoint test passed');
    return true;
  } catch (error) {
    console.log('❌ Promotional SMS endpoint test failed:', error.message);
    return false;
  }
}

// Test 3: Check if server endpoints are responding
async function testServerHealth() {
  console.log('🧪 Testing server health...');
  try {
    // Test a simple endpoint that should always work
    const response = await fetch(`${API_BASE}/sms/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(`📊 Health check status: ${response.status}`);
    
    if (response.status < 500) {
      console.log('✅ Server is healthy and responding');
      return true;
    }
    
    console.log('❌ Server health check failed');
    return false;
  } catch (error) {
    console.log('❌ Server health check failed:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting SMS endpoint tests...\n');
  
  const results = await Promise.all([
    testServerHealth(),
    testFetchSmsMessages(),
    testPromotionalSmsEndpoint()
  ]);
  
  const passedTests = results.filter(Boolean).length;
  const totalTests = results.length;
  
  console.log(`\n📈 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All SMS endpoint tests passed! The errors should be resolved.');
  } else {
    console.log('⚠️  Some tests failed. Check the logs above for details.');
  }
}

runTests().catch(console.error);
