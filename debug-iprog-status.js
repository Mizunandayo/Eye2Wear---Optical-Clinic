// Check iProg delivery status for both decline and cancel messages
async function checkIprogDeliveryStatus() {
  console.log('🔍 CHECKING IPROG DELIVERY STATUS');
  console.log('=======================================');
  
  const declineMessageId = 'iSms-y6anWU';  // Working decline SMS
  const cancelMessageId = 'iSms-iJOAoZ';   // Not working cancel SMS
  
  console.log('\n📱 Checking Decline SMS Status (WORKING)');
  console.log('Message ID:', declineMessageId);
  console.log('------------------------------------------');
  
  try {
    const declineStatusResponse = await fetch(`http://localhost:3000/api/sms/status/${declineMessageId}`);
    
    if (declineStatusResponse.ok) {
      const declineStatus = await declineStatusResponse.json();
      console.log('✅ Decline Status Result:', JSON.stringify(declineStatus, null, 2));
    } else {
      const declineError = await declineStatusResponse.text();
      console.log('❌ Decline Status Error:', declineError);
    }
  } catch (error) {
    console.log('❌ Decline Status Network Error:', error.message);
  }
  
  console.log('\n📱 Checking Cancel SMS Status (NOT WORKING)');
  console.log('Message ID:', cancelMessageId);
  console.log('---------------------------------------------');
  
  try {
    const cancelStatusResponse = await fetch(`http://localhost:3000/api/sms/status/${cancelMessageId}`);
    
    if (cancelStatusResponse.ok) {
      const cancelStatus = await cancelStatusResponse.json();
      console.log('✅ Cancel Status Result:', JSON.stringify(cancelStatus, null, 2));
      
      // Analyze the status
      if (cancelStatus.success) {
        console.log('\n🔍 CANCEL STATUS ANALYSIS:');
        
        if (cancelStatus.deliveryStatus) {
          console.log('  Delivery Status:', cancelStatus.deliveryStatus);
          
          if (cancelStatus.deliveryStatus === 'delivered') {
            console.log('  🎯 iProg says DELIVERED but patient didn\'t receive!');
            console.log('  🚨 Possible issues:');
            console.log('     - Phone number formatting issue');
            console.log('     - Network carrier blocking SMS');
            console.log('     - Patient\'s phone settings');
          } else if (cancelStatus.deliveryStatus === 'failed') {
            console.log('  🎯 iProg reports FAILED delivery');
            console.log('  🚨 This explains why SMS not received');
          } else {
            console.log('  🎯 Status:', cancelStatus.deliveryStatus);
          }
        }
        
        if (cancelStatus.errorMessage) {
          console.log('  Error Message:', cancelStatus.errorMessage);
        }
      }
    } else {
      const cancelError = await cancelStatusResponse.text();
      console.log('❌ Cancel Status Error:', cancelError);
    }
  } catch (error) {
    console.log('❌ Cancel Status Network Error:', error.message);
  }
  
  console.log('\n💡 COMPARISON SUMMARY:');
  console.log('=======================');
  console.log('Both messages got iProg message IDs, but delivery status may differ.');
  console.log('If cancel shows "failed" delivery, that explains the issue.');
  console.log('If both show "delivered", then issue is with phone/carrier.');
}

// Also check the patient demographic data
async function checkPatientData() {
  console.log('\n👤 CHECKING PATIENT DEMOGRAPHIC DATA');
  console.log('=====================================');
  
  try {
    // Check if we can find this patient in the database
    const response = await fetch('http://localhost:3000/api/sms/diagnose-phone-issue');
    
    if (response.ok) {
      const phoneData = await response.json();
      console.log('📞 Phone Diagnosis:', JSON.stringify(phoneData, null, 2));
      
      // Look for our specific email
      const targetEmail = 'tristandivider8@gmail.com';
      console.log(`\n🔍 Looking for patient: ${targetEmail}`);
      
      if (phoneData.validPatients) {
        const targetPatient = phoneData.validPatients.find(p => 
          p.patientprimaryemail === targetEmail
        );
        
        if (targetPatient) {
          console.log('✅ Patient found in valid patients:');
          console.log('  Name:', targetPatient.patientfirstname, targetPatient.patientlastname);
          console.log('  Phone:', targetPatient.patientcontactnumber);
          console.log('  Email:', targetPatient.patientprimaryemail);
        } else {
          console.log('❌ Patient NOT found in valid patients list');
          console.log('🚨 This could be the issue!');
        }
      }
      
      if (phoneData.invalidPatients) {
        const invalidPatient = phoneData.invalidPatients.find(p => 
          p.patientprimaryemail === targetEmail
        );
        
        if (invalidPatient) {
          console.log('⚠️  Patient found in INVALID patients:');
          console.log('  Issue:', invalidPatient.issue || 'Unknown issue');
          console.log('  Phone:', invalidPatient.patientcontactnumber);
        }
      }
    } else {
      console.log('❌ Failed to get phone diagnosis');
    }
  } catch (error) {
    console.log('❌ Patient data check error:', error.message);
  }
}

// Run both checks
async function runFullDiagnostic() {
  await checkIprogDeliveryStatus();
  await checkPatientData();
  
  console.log('\n🎯 FINAL DIAGNOSTIC SUMMARY:');
  console.log('==============================');
  console.log('1. Both decline and cancel get iProg message IDs');
  console.log('2. Credits are deducted for both');
  console.log('3. Check delivery status comparison above');
  console.log('4. Verify patient data exists and is valid');
  console.log('5. If patient data is invalid, that explains the issue');
  console.log('6. If patient data is valid but delivery fails, it\'s an iProg/carrier issue');
}

runFullDiagnostic();