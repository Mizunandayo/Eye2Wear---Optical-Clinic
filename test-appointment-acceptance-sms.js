// Test script for appointment acceptance SMS functionality
// This script tests the new appointment acceptance SMS feature

import fetch from 'node-fetch';

// Test configuration
const API_BASE_URL = 'http://localhost:3000';
const TEST_APPOINTMENT_ID = 'YOUR_TEST_APPOINTMENT_ID'; // Replace with actual appointment ID
const TEST_CLINIC_TYPE = 'ambher'; // or 'bautista'

async function testAppointmentAcceptanceSMS() {
  console.log('🧪 Testing Appointment Acceptance SMS...');
  
  try {
    // Test the appointment acceptance SMS endpoint
    const response = await fetch(`${API_BASE_URL}/api/sms/appointment-acceptance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        appointmentId: TEST_APPOINTMENT_ID,
        clinicType: TEST_CLINIC_TYPE
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ SMS sent successfully!');
      console.log('📱 Response:', result);
    } else {
      console.log('❌ SMS failed to send');
      console.log('💥 Error:', result);
    }
    
  } catch (error) {
    console.error('🚨 Test failed with error:', error.message);
  }
}

async function testAppointmentUpdate() {
  console.log('🧪 Testing Appointment Status Update (which should trigger SMS)...');
  
  try {
    // Test updating appointment status to "Accepted" (which should trigger SMS)
    const response = await fetch(`${API_BASE_URL}/api/patientappointments/appointments/${TEST_APPOINTMENT_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        [`patient${TEST_CLINIC_TYPE}appointmentstatus`]: 'Accepted',
        [`patient${TEST_CLINIC_TYPE}appointmentstatushistory`]: {
          changedBy: 'Test Admin'
        }
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Appointment updated successfully!');
      console.log('📋 Response:', result);
      console.log('🔔 Check console logs for SMS sending activity...');
    } else {
      console.log('❌ Appointment update failed');
      console.log('💥 Error:', result);
    }
    
  } catch (error) {
    console.error('🚨 Test failed with error:', error.message);
  }
}

// Instructions for running the test
console.log(`
📋 APPOINTMENT ACCEPTANCE SMS TEST INSTRUCTIONS:

1. First, create a test appointment with valid patient data
2. Update TEST_APPOINTMENT_ID above with the actual appointment ObjectId
3. Update TEST_CLINIC_TYPE to either 'ambher' or 'bautista'
4. Make sure your server is running on ${API_BASE_URL}
5. Run this script: node test-appointment-acceptance-sms.js

🔍 WHAT THIS TEST DOES:
- Tests the new /api/sms/appointment-acceptance endpoint directly
- Tests appointment status update that should trigger SMS automatically
- Verifies that SMS is sent when appointment status changes to 'Accepted'

⚠️  REQUIREMENTS:
- Valid appointment ID in the database
- Patient demographic data with valid phone number
- SMS service (iProg) credentials configured
- Server running with all dependencies
`);

// Uncomment the line below to run the test (after updating TEST_APPOINTMENT_ID)
// testAppointmentAcceptanceSMS();
// testAppointmentUpdate();