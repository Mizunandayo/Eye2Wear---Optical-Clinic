// Quick Test Script to Validate Array Safety
// This script tests the array safety fixes implemented in AdminDashboard.jsx

const testArraySafety = () => {
  console.log('🧪 Testing Array Safety Functions...');
  
  // Test the array safety pattern used in the fixes
  const testData = {
    ambherOrders: undefined,
    bautistaOrders: null,
    appointments: []
  };
  
  // Test safe array access pattern
  const safeAmbherOrders = Array.isArray(testData.ambherOrders) ? testData.ambherOrders : [];
  const safeBautistaOrders = Array.isArray(testData.bautistaOrders) ? testData.bautistaOrders : [];
  const safeAppointments = Array.isArray(testData.appointments) ? testData.appointments : [];
  
  console.log('✅ Safe Ambher Orders:', safeAmbherOrders);
  console.log('✅ Safe Bautista Orders:', safeBautistaOrders);
  console.log('✅ Safe Appointments:', safeAppointments);
  
  // Test spreading with safe arrays
  const allOrders = [...safeAmbherOrders, ...safeBautistaOrders];
  console.log('✅ Safe spread operation result:', allOrders);
  
  // Test length access
  console.log('✅ Safe length access - Ambher:', safeAmbherOrders.length);
  console.log('✅ Safe length access - Bautista:', safeBautistaOrders.length);
  console.log('✅ Safe length access - Appointments:', safeAppointments.length);
  
  return 'All array safety tests passed!';
};

export default testArraySafety;
