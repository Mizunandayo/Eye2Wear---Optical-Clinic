// Test cancellation SMS with the specific appointment data
async function testSpecificCancellationSMS() {
  console.log('🧪 Testing Cancellation SMS with specific appointment data...');
  
  const appointmentId = '68cfcf2bfa12672fbc50e8a5';
  const clinicType = 'ambher'; // Since patientambherappointmentstatus is "Cancelled"
  
  try {
    // Test the SMS API endpoint directly
    console.log('\n📡 Testing SMS API endpoint for cancellation...');
    
    const response = await fetch('http://localhost:3000/api/sms/appointment-cancellation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        appointmentId: appointmentId,
        clinicType: clinicType
      })
    });
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response OK:', response.ok);
    
    const responseText = await response.text();
    console.log('📝 Response Body:', responseText);
    
    if (response.ok) {
      try {
        const responseJson = JSON.parse(responseText);
        console.log('✅ Parsed Response:', responseJson);
        
        if (responseJson.success) {
          console.log('🎉 SMS API reports success!');
          console.log('📱 Message ID:', responseJson.messageId);
          console.log('📱 iProg Message ID:', responseJson.iprogMessageId);
        } else {
          console.log('❌ SMS API reports failure:', responseJson.message);
        }
      } catch (parseError) {
        console.log('⚠️ Could not parse response as JSON');
      }
    } else {
      console.log('❌ HTTP Error:', response.status, response.statusText);
    }
    
  } catch (error) {
    console.error('❌ Network Error:', error.message);
    console.log('\n🔍 This suggests the server might not be running or the endpoint is not accessible');
    console.log('💡 Make sure your server is running on localhost:3000');
  }
  
  // Also test appointment lookup
  console.log('\n📋 Testing appointment lookup...');
  try {
    const appointmentResponse = await fetch(`http://localhost:3000/api/patientappointments/appointments/${appointmentId}`);
    
    if (appointmentResponse.ok) {
      const appointment = await appointmentResponse.json();
      console.log('✅ Appointment found:');
      console.log('  📧 Email:', appointment.patientappointmentemail);
      console.log('  👤 Name:', appointment.patientappointmentfirstname, appointment.patientappointmentlastname);
      console.log('  🏥 Ambher Status:', appointment.patientambherappointmentstatus);
      console.log('  🏥 Bautista Status:', appointment.patientbautistaappointmentstatus);
      
      // Check which clinic was cancelled
      if (appointment.patientambherappointmentstatus === 'Cancelled') {
        console.log('🎯 Ambher appointment was cancelled');
        console.log('  📅 Date:', appointment.patientambherappointmentdate);
        console.log('  ⏰ Time:', appointment.patientambherappointmenttime);
        console.log('  📍 Location:', appointment.patientambherappointmentlocationaddress);
      }
      
      if (appointment.patientbautistaappointmentstatus === 'Cancelled') {
        console.log('🎯 Bautista appointment was cancelled');
        console.log('  📅 Date:', appointment.patientbautistaappointmentdate);
        console.log('  ⏰ Time:', appointment.patientbautistaappointmenttime);
        console.log('  📍 Location:', appointment.patientbautistaappointmentlocationaddress);
      }
    } else {
      console.log('❌ Appointment not found:', appointmentResponse.status);
    }
  } catch (error) {
    console.log('❌ Error fetching appointment:', error.message);
  }
}

// Run the test
testSpecificCancellationSMS();