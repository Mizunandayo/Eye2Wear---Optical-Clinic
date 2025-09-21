// Direct database test to check patient demographic data
async function checkPatientDirectly() {
  console.log('🔍 DIRECT PATIENT DATABASE CHECK');
  console.log('==================================');
  
  const targetEmail = 'tristandivider8@gmail.com';
  console.log('Target email:', targetEmail);
  
  // Test the SMS diagnose endpoint
  try {
    const response = await fetch('http://localhost:3000/api/sms/diagnose-phone-issue', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n📊 Phone diagnosis results:');
      
      if (data.validPatients && data.validPatients.length > 0) {
        console.log(`✅ Found ${data.validPatients.length} valid patients`);
        
        // Look for our target patient
        const targetPatient = data.validPatients.find(patient => 
          patient.patientprimaryemail && 
          patient.patientprimaryemail.toLowerCase() === targetEmail.toLowerCase()
        );
        
        if (targetPatient) {
          console.log('\n🎯 TARGET PATIENT FOUND IN VALID LIST:');
          console.log('  Name:', targetPatient.patientfirstname, targetPatient.patientlastname);
          console.log('  Email:', targetPatient.patientprimaryemail);
          console.log('  Phone:', targetPatient.patientcontactnumber);
          console.log('  ✅ Patient data is VALID');
        } else {
          console.log('\n❌ TARGET PATIENT NOT FOUND in valid patients');
        }
      } else {
        console.log('❌ No valid patients found');
      }
      
      if (data.invalidPatients && data.invalidPatients.length > 0) {
        console.log(`\n⚠️  Found ${data.invalidPatients.length} invalid patients`);
        
        // Look for our target patient in invalid list
        const invalidTarget = data.invalidPatients.find(patient => 
          patient.patientprimaryemail && 
          patient.patientprimaryemail.toLowerCase() === targetEmail.toLowerCase()
        );
        
        if (invalidTarget) {
          console.log('\n🚨 TARGET PATIENT FOUND IN INVALID LIST:');
          console.log('  Name:', invalidTarget.patientfirstname, invalidTarget.patientlastname);
          console.log('  Email:', invalidTarget.patientprimaryemail);
          console.log('  Phone:', invalidTarget.patientcontactnumber);
          console.log('  Issue:', invalidTarget.issue || 'Unknown issue');
          console.log('  ❌ This explains why SMS fails!');
        }
      }
      
      // Additional analysis
      console.log('\n📊 SUMMARY ANALYSIS:');
      console.log('  Total valid patients:', data.validPatients?.length || 0);
      console.log('  Total invalid patients:', data.invalidPatients?.length || 0);
      
    } else {
      const errorText = await response.text();
      console.log('❌ API Error:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Network error:', error.message);
    console.log('🔍 Checking if server is running on http://localhost:3000...');
    
    // Try a simple health check
    try {
      const healthResponse = await fetch('http://localhost:3000/api/sms/test');
      console.log('Health check status:', healthResponse.status);
    } catch (healthError) {
      console.log('❌ Server not responding. Make sure server is running with: node server.js');
    }
  }
}

// Test a new cancel SMS to see server logs
async function testNewCancelSMS() {
  console.log('\n🧪 TESTING NEW CANCEL SMS');
  console.log('==========================');
  
  try {
    const response = await fetch('http://localhost:3000/api/sms/appointment-cancellation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        appointmentId: '68cfcf2bfa12672fbc50e8a5',
        clinicType: 'ambher'
      })
    });
    
    console.log('Cancel SMS Response Status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('Cancel SMS Result:', JSON.stringify(result, null, 2));
      
      if (result.success && result.iprogMessageId) {
        console.log('\n💡 NEW CANCEL SMS ANALYSIS:');
        console.log('  SMS Controller reports: SUCCESS');
        console.log('  iProg Message ID:', result.iprogMessageId);
        console.log('  Database Record ID:', result.messageId);
        console.log('  🔍 Check server terminal for detailed logs');
        console.log('  🔍 Look for patient lookup errors in server logs');
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Cancel SMS Error:', errorText);
    }
  } catch (error) {
    console.log('❌ Cancel SMS Network Error:', error.message);
  }
}

// Run both tests
async function runDiagnostic() {
  await checkPatientDirectly();
  await testNewCancelSMS();
  
  console.log('\n🎯 DIAGNOSTIC CONCLUSIONS:');
  console.log('===========================');
  console.log('1. If patient found in VALID list: iProg/network issue');
  console.log('2. If patient found in INVALID list: Patient data issue');
  console.log('3. If patient not found at all: Patient doesn\'t exist');
  console.log('4. Check server terminal for SMS controller error logs');
  console.log('5. Focus on patient demographic lookup in cancellation method');
}

runDiagnostic();