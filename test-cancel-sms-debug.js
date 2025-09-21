// Simple test to debug appointment cancellation SMS flow
async function testCancelAppointmentSMSFlow() {
  console.log('🧪 Testing Appointment Cancellation SMS Flow...');
  
  try {
    // Test 1: Check if the SMS API endpoint is reachable
    console.log('\n📡 Test 1: Testing SMS API endpoint...');
    
    const testResponse = await fetch('http://localhost:3000/api/sms/appointment-cancellation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        appointmentId: 'test_appointment_id',
        clinicType: 'bautista'
      })
    });
    
    console.log('📊 SMS API Response Status:', testResponse.status);
    const responseText = await testResponse.text();
    console.log('📝 SMS API Response:', responseText);
    
  } catch (error) {
    console.error('❌ Error testing SMS API:', error.message);
  }
  
  // Test 2: Check appointment status update logic
  console.log('\n📋 Test 2: Testing appointment status logic...');
  
  // Simulate appointment update data
  const updateData = {
    patientbautistaappointmentstatus: 'Cancelled'
  };
  
  const originalBautistaStatus = 'Accepted';
  const originalAmbherStatus = 'Pending';
  
  // Test the SMS trigger condition
  const shouldSendCancellationSMS = (
    (updateData.patientambherappointmentstatus === 'Cancelled' && originalAmbherStatus !== 'Cancelled') ||
    (updateData.patientbautistaappointmentstatus === 'Cancelled' && originalBautistaStatus !== 'Cancelled')
  );
  
  console.log('🎯 Status update data:', updateData);
  console.log('📊 Original Bautista status:', originalBautistaStatus);
  console.log('📊 Original Ambher status:', originalAmbherStatus);
  console.log('✅ Should send cancellation SMS:', shouldSendCancellationSMS);
  
  if (shouldSendCancellationSMS) {
    const clinicType = updateData.patientambherappointmentstatus === 'Cancelled' ? 'ambher' : 'bautista';
    console.log('🏥 Determined clinic type:', clinicType);
  }
  
  console.log('\n📝 Test completed. Check the logs above for any issues.');
}

// Run the test
testCancelAppointmentSMSFlow();