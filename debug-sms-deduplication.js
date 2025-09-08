// Debug script to test SMS deduplication for order completion
// This script simulates the duplicate SMS request scenario

console.log('=== Testing SMS Deduplication for Order Completion ===\n');

const testOrderCompletion = async () => {
  const apiUrl = 'http://localhost:3000';
  const testOrderId = 1; // Use a real order ID from your database
  const orderType = 'ambher'; // or 'bautista'
  
  console.log(`Testing duplicate SMS requests for Order ${testOrderId} (${orderType})`);
  
  // Simulate the first SMS request
  console.log('\n1️⃣ Sending FIRST SMS request...');
  const firstRequest = {
    orderId: testOrderId,
    orderType: orderType,
    newStatus: 'Completed',
    timestamp: Date.now(),
    requestId: `complete-${testOrderId}-${Date.now()}`
  };
  
  try {
    const response1 = await fetch(`${apiUrl}/api/sms/order-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(firstRequest)
    });
    
    const result1 = await response1.json();
    console.log('First request response:', result1);
    
    // Wait a short moment and send the second request (simulating duplicate)
    console.log('\n2️⃣ Sending SECOND SMS request (should be blocked)...');
    await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
    
    const secondRequest = {
      orderId: testOrderId,
      orderType: orderType,
      newStatus: 'Completed',
      timestamp: Date.now(),
      requestId: `complete-${testOrderId}-${Date.now()}`
    };
    
    const response2 = await fetch(`${apiUrl}/api/sms/order-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(secondRequest)
    });
    
    const result2 = await response2.json();
    console.log('Second request response:', result2);
    
    // Analyze results
    console.log('\n📊 ANALYSIS:');
    console.log(`First request success: ${result1.success}`);
    console.log(`Second request blocked: ${!result2.success && result2.duplicatePrevented}`);
    
    if (result1.success && !result2.success && result2.duplicatePrevented) {
      console.log('✅ DEDUPLICATION WORKING: First SMS sent, second SMS blocked');
    } else {
      console.log('❌ DEDUPLICATION ISSUE: Both requests might have gone through');
    }
    
  } catch (error) {
    console.error('Error testing SMS deduplication:', error);
  }
};

// Run the test
testOrderCompletion();
