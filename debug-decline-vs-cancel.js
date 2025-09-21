// Debug test to compare decline vs cancel SMS behavior
async function debugDeclineVsCancelSMS() {
  console.log('🔍 DEBUGGING: Decline vs Cancel SMS Issue');
  console.log('====================================================');
  
  const appointmentId = '68cfcf2bfa12672fbc50e8a5';
  const clinicType = 'ambher';
  
  console.log('\n📋 Testing with appointment:');
  console.log('  ID:', appointmentId);
  console.log('  Clinic:', clinicType);
  console.log('  Email: tristandivider8@gmail.com');
  
  console.log('\n🧪 PART 1: Testing Decline SMS Endpoint (WORKING)');
  console.log('-----------------------------------------------');
  
  try {
    const declineResponse = await fetch('http://localhost:3000/api/sms/appointment-decline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appointmentId: appointmentId,
        clinicType: clinicType
      })
    });
    
    console.log('📊 Decline Response Status:', declineResponse.status);
    console.log('📊 Decline Response OK:', declineResponse.ok);
    
    if (declineResponse.ok) {
      const declineResult = await declineResponse.json();
      console.log('✅ Decline SMS Result:', JSON.stringify(declineResult, null, 2));
    } else {
      const declineError = await declineResponse.text();
      console.log('❌ Decline SMS Error:', declineError);
    }
  } catch (error) {
    console.log('❌ Decline SMS Network Error:', error.message);
  }
  
  console.log('\n🧪 PART 2: Testing Cancel SMS Endpoint (NOT WORKING)');
  console.log('----------------------------------------------------');
  
  try {
    const cancelResponse = await fetch('http://localhost:3000/api/sms/appointment-cancellation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appointmentId: appointmentId,
        clinicType: clinicType
      })
    });
    
    console.log('📊 Cancel Response Status:', cancelResponse.status);
    console.log('📊 Cancel Response OK:', cancelResponse.ok);
    
    if (cancelResponse.ok) {
      const cancelResult = await cancelResponse.json();
      console.log('✅ Cancel SMS Result:', JSON.stringify(cancelResult, null, 2));
      
      // Analyze the results
      if (cancelResult.success) {
        console.log('\n🔍 CANCEL SMS ANALYSIS:');
        console.log('  API Reports: SUCCESS');
        console.log('  Message ID:', cancelResult.messageId);
        console.log('  iProg Message ID:', cancelResult.iprogMessageId);
        console.log('  Status:', cancelResult.status || 'N/A');
        
        if (cancelResult.iprogMessageId) {
          console.log('  💡 iProg API was called (credits deducted)');
          console.log('  ❓ But SMS not received by patient');
          console.log('  🚨 POSSIBLE ISSUES:');
          console.log('     1. iProg API accepts request but fails to deliver');
          console.log('     2. Patient phone number issue');
          console.log('     3. Message content issue');
          console.log('     4. Network timeout after credit deduction');
        }
      } else {
        console.log('❌ Cancel SMS failed:', cancelResult.message);
      }
    } else {
      const cancelError = await cancelResponse.text();
      console.log('❌ Cancel SMS Error:', cancelError);
    }
  } catch (error) {
    console.log('❌ Cancel SMS Network Error:', error.message);
  }
  
  console.log('\n🔍 PART 3: Message Content Comparison');
  console.log('------------------------------------');
  
  // Simulate the message creation logic from both methods
  const patientFirstName = 'Velasco';
  const appointmentDate = '2025-10-03';
  const appointmentTime = '2:00 PM';
  const clinicName = 'Ambher Optical';
  const appointmentLocation = '#032 Subic Street, Olongapo';
  
  const declineMessage = `Appointment Declined

Dear ${patientFirstName},

We regret to inform you that your appointment request has been DECLINED.

Original Request Details:
Date: ${appointmentDate}
Time: ${appointmentTime}
Clinic: ${clinicName}
Location: ${appointmentLocation}

We apologize for any inconvenience. Please feel free to request a different appointment date/time that may better suit our availability.

You can book a new appointment through our system or contact us directly for assistance.

Thank you for your understanding.

${clinicName}`;

  const cancelMessage = `Appointment Cancelled

Dear ${patientFirstName},

We regret to inform you that your confirmed appointment has been CANCELLED due to unforeseen circumstances.

Cancelled Appointment Details:
Date: ${appointmentDate}
Time: ${appointmentTime}
Clinic: ${clinicName}
Location: ${appointmentLocation}

We sincerely apologize for any inconvenience this may cause. Please feel free to reschedule your appointment at your convenience.

You can book a new appointment through our system or contact us directly for immediate assistance.

Thank you for your understanding.

${clinicName}`;

  console.log('📝 DECLINE Message (WORKING):');
  console.log('  Length:', declineMessage.length, 'characters');
  console.log('  Line breaks:', (declineMessage.match(/\n/g) || []).length);
  console.log('  Special chars:', [...declineMessage].filter(char => char.charCodeAt(0) > 127).length);
  
  console.log('\n📝 CANCEL Message (NOT WORKING):');
  console.log('  Length:', cancelMessage.length, 'characters');
  console.log('  Line breaks:', (cancelMessage.match(/\n/g) || []).length);
  console.log('  Special chars:', [...cancelMessage].filter(char => char.charCodeAt(0) > 127).length);
  
  console.log('\n📊 Message Differences:');
  console.log('  Length difference:', Math.abs(declineMessage.length - cancelMessage.length), 'characters');
  
  console.log('\n🎯 DEBUGGING CONCLUSIONS:');
  console.log('============================================');
  console.log('1. If server is not running: Both will fail with network error');
  console.log('2. If server is running and decline works but cancel fails:');
  console.log('   - Check if patient demographic exists for tristandivider8@gmail.com');
  console.log('   - Verify patient has valid contact number');
  console.log('   - Check server logs for SMS controller errors');
  console.log('   - Compare iProg API responses for decline vs cancel');
  console.log('3. If both return success but only decline SMS is received:');
  console.log('   - iProg API issue specific to cancel message content');
  console.log('   - Phone number formatting issue');
  console.log('   - Message length/content filtering by iProg');
  
  console.log('\n💡 NEXT STEPS:');
  console.log('1. Run this test with server running');
  console.log('2. Check server console logs during test');
  console.log('3. Verify patient demographic data exists');
  console.log('4. Compare iProg API responses');
}

// Run the debug test
debugDeclineVsCancelSMS();