// Manual test for debugging the order status update issue
// Run this in browser console to test the automatic status update

// Test the date comparison logic
window.testOrderStatusUpdate = function() {
  console.log('🧪 Testing Order Status Update System...');
  
  // Import the utility (adjust path as needed)
  import('./utils/orderStatusUpdater.js').then(module => {
    const { isPickupDateToday, checkAndUpdateOrderStatus, updateAmbherOrderStatus } = module;
    
    // Test date logic
    console.log('📅 Testing date logic:');
    
    // Test today's date in various formats
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    console.log(`Today: ${today}`);
    console.log(`isPickupDateToday('${today}'): ${isPickupDateToday(today)}`);
    console.log(`isPickupDateToday('2025-08-29'): ${isPickupDateToday('2025-08-29')}`);
    console.log(`isPickupDateToday('Later'): ${isPickupDateToday('Later')}`);
    console.log(`isPickupDateToday('Now'): ${isPickupDateToday('Now')}`);
    
    // Test with mock order data
    const mockOrder = {
      patientorderambherid: 160,
      patientorderambherstatus: 'Pending',
      patientorderambherproductchosenpickupdate: '2025-08-29', // Today's date
      patientorderambherproductname: 'Test Product'
    };
    
    console.log('📦 Testing with mock order:', mockOrder);
    
    // Mock update function for testing
    const mockUpdateFunction = async (orderId, updateData) => {
      console.log(`🔧 Mock update called for order ${orderId}:`, updateData);
      return { success: true };
    };
    
    // Test the check and update function
    checkAndUpdateOrderStatus([mockOrder], 'ambher', mockUpdateFunction)
      .then(updatedOrders => {
        console.log('✅ Test completed. Updated orders:', updatedOrders);
      })
      .catch(error => {
        console.error('❌ Test failed:', error);
      });
      
  }).catch(error => {
    console.error('Failed to import module:', error);
  });
};

// Test the API endpoint directly
window.testApiCall = async function() {
  console.log('🔧 Testing API call directly...');
  
  const testData = {
    patientorderambherstatus: 'Ready for Pickup',
    changedBy: 'Test-System'
  };
  
  try {
    const response = await fetch('/api/patientorderambher/160', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('currentusertoken')}`
      },
      body: JSON.stringify(testData)
    });
    
    console.log(`📡 Response status: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ API call successful:', result);
    } else {
      const errorText = await response.text();
      console.error('❌ API call failed:', errorText);
    }
  } catch (error) {
    console.error('❌ API call error:', error);
  }
};

console.log('🧪 Test functions loaded. Run window.testOrderStatusUpdate() or window.testApiCall() to debug.');
