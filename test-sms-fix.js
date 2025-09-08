// Test SMS Order Status Fix
// This script tests both the numeric ID (correct) and ObjectId (fallback) scenarios

import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000';

async function testSmsOrderStatus() {
    console.log('🧪 Testing SMS Order Status Fix...\n');
    
    // Test 1: Using numeric order ID (should work now)
    console.log('Test 1: Using numeric order ID (264)');
    try {
        const response1 = await fetch(`${API_URL}/api/sms/order-status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId: 264, // Numeric ID (correct)
                orderType: 'ambher',
                newStatus: 'Ready for Pickup'
            })
        });
        
        const result1 = await response1.json();
        console.log('✅ Response status:', response1.status);
        console.log('📋 Response data:', result1);
    } catch (error) {
        console.error('❌ Test 1 failed:', error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 2: Using ObjectId (should fallback gracefully)
    console.log('Test 2: Using ObjectId (68bf31c01ecba8952a309ee8)');
    try {
        const response2 = await fetch(`${API_URL}/api/sms/order-status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId: "68bf31c01ecba8952a309ee8", // ObjectId string (fallback)
                orderType: 'ambher',
                newStatus: 'Ready for Pickup'
            })
        });
        
        const result2 = await response2.json();
        console.log('✅ Response status:', response2.status);
        console.log('📋 Response data:', result2);
    } catch (error) {
        console.error('❌ Test 2 failed:', error.message);
    }
    
    console.log('\n🏁 Test completed!');
}

// Run the test
testSmsOrderStatus().catch(console.error);
