// Utility for automatically updating order status when pickup date matches current date
import moment from 'moment-timezone';

/**
 * Check if the pickup date matches today's date in Philippines timezone
 * @param {string} pickupDate - The chosen pickup date string
 * @returns {boolean} - True if pickup date is today
 */
export const isPickupDateToday = (pickupDate) => {
  if (!pickupDate || pickupDate === 'Later' || pickupDate === 'Now') {
    return false;
  }

  try {
    // Get current date in Philippines timezone
    const todayPhilippines = moment.tz('Asia/Manila').format('YYYY-MM-DD');
    
    // Parse the pickup date (handle various formats)
    let pickupDateFormatted;
    if (typeof pickupDate === 'string') {
      // If it's already in YYYY-MM-DD format
      if (pickupDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        pickupDateFormatted = pickupDate;
      } else {
        // Parse other date formats
        pickupDateFormatted = moment(pickupDate).format('YYYY-MM-DD');
      }
    } else {
      // Handle Date objects
      pickupDateFormatted = moment(pickupDate).format('YYYY-MM-DD');
    }
    
    console.log(`🔍 Date comparison: Today=${todayPhilippines}, Pickup=${pickupDateFormatted}, Match=${todayPhilippines === pickupDateFormatted}`);
    
    return todayPhilippines === pickupDateFormatted;
  } catch (error) {
    console.error('Error parsing pickup date:', error);
    return false;
  }
};

/**
 * Update order status bidirectionally based on pickup date
 * - If pickup date is today AND status is Pending → Change to "Ready for Pickup"
 * - If pickup date is NOT today AND status is "Ready for Pickup" → Change to "Pending"
 * @param {Array} orders - Array of orders to check
 * @param {string} clinic - 'ambher' or 'bautista'
 * @param {Function} updateCallback - Function to call when status needs updating
 * @returns {Array} - Updated orders array
 */
export const checkAndUpdateOrderStatus = async (orders, clinic, updateCallback) => {
  if (!Array.isArray(orders)) {
    console.warn('⚠️ Orders is not an array:', orders);
    return orders;
  }

  if (orders.length === 0) {
    console.log('📦 No orders to check');
    return orders;
  }

  console.log(`🔍 Checking ${orders.length} ${clinic} orders for bidirectional status updates...`);

  const updatedOrders = [];
  
  for (const order of orders) {
    let needsUpdate = false;
    let updatedOrder = { ...order };
    let newStatus = null;

    // Check if order needs status update based on pickup date
    const isAmbher = clinic === 'ambher';
    const currentStatus = isAmbher ? order.patientorderambherstatus : order.patientorderbautistastatus;
    const pickupDate = isAmbher ? order.patientorderambherproductchosenpickupdate : order.patientorderbautistaproductchosenpickupdate;
    const orderIdField = isAmbher ? 'patientorderambherid' : 'patientorderbautistaid';
    const orderId = order[orderIdField];

    console.log(`📋 Checking Order ${orderId}: Status="${currentStatus}", PickupDate="${pickupDate}"`);

    const isPickupToday = isPickupDateToday(pickupDate);

    // Bidirectional status logic
    if (currentStatus === 'Pending' && isPickupToday) {
      // Forward: Pending → Ready for Pickup (pickup date is today)
      needsUpdate = true;
      newStatus = 'Ready for Pickup';
      console.log(`🔄 Order ${orderId} → "Ready for Pickup" (pickup date is today)`);
    } else if (currentStatus === 'Ready for Pickup' && !isPickupToday) {
      // Reverse: Ready for Pickup → Pending (pickup date is NOT today)
      needsUpdate = true;
      newStatus = 'Pending';
      console.log(`🔄 Order ${orderId} → "Pending" (pickup date is not today)`);
    }

    if (needsUpdate) {
      if (isAmbher) {
        updatedOrder.patientorderambherstatus = newStatus;
      } else {
        updatedOrder.patientorderbautistastatus = newStatus;
      }
    }

    // If update is needed, call the API
    if (needsUpdate && updateCallback) {
      try {        
        await updateCallback(orderId, {
          [isAmbher ? 'patientorderambherstatus' : 'patientorderbautistastatus']: newStatus,
          changedBy: 'Auto-System' // Indicate this was an automatic update
        });

        console.log(`✅ Order ${orderId} status updated to "${newStatus}"`);
      } catch (error) {
        console.error(`❌ Failed to update order ${orderId}:`, error);
        // If API call fails, keep original order
        updatedOrder = order;
      }
    }

    updatedOrders.push(updatedOrder);
  }

  const updatedCount = updatedOrders.filter((order, index) => {
    const isAmbher = clinic === 'ambher';
    const originalStatus = isAmbher ? orders[index].patientorderambherstatus : orders[index].patientorderbautistastatus;
    const newStatus = isAmbher ? order.patientorderambherstatus : order.patientorderbautistastatus;
    return originalStatus !== newStatus;
  }).length;

  if (updatedCount > 0) {
    console.log(`🎉 Successfully updated ${updatedCount} orders with automatic status changes`);
  } else {
    console.log(`📝 No orders needed status updates`);
  }

  return updatedOrders;
};

/**
 * API call to update Ambher order status
 * @param {number} orderId - Order ID
 * @param {object} updateData - Data to update
 * @returns {Promise} - API response
 */
export const updateAmbherOrderStatus = async (orderId, updateData) => {
  console.log(`🔧 Updating Ambher Order ${orderId} with data:`, updateData);
  
  const response = await fetch(`/api/patientorderambher/${orderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('currentusertoken')}`
    },
    body: JSON.stringify(updateData)
  });

  console.log(`📡 API Response for Order ${orderId}: Status ${response.status}`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ API Error for Order ${orderId}:`, errorText);
    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log(`✅ Successfully updated Order ${orderId}:`, result);
  return result;
};

/**
 * API call to update Bautista order status
 * @param {number} orderId - Order ID
 * @param {object} updateData - Data to update
 * @returns {Promise} - API response
 */
export const updateBautistaOrderStatus = async (orderId, updateData) => {
  console.log(`🔧 Updating Bautista Order ${orderId} with data:`, updateData);
  
  const response = await fetch(`/api/patientorderbautista/${orderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('currentusertoken')}`
    },
    body: JSON.stringify(updateData)
  });

  console.log(`📡 API Response for Order ${orderId}: Status ${response.status}`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ API Error for Order ${orderId}:`, errorText);
    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log(`✅ Successfully updated Order ${orderId}:`, result);
  return result;
};
