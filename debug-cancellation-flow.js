// Simulate the SMS cancellation flow to find the issue
function simulateCancellationSMSFlow() {
  console.log('🧪 Simulating Cancellation SMS Flow...');
  
  // Appointment data from your example
  const appointment = {
    _id: '68cfcf2bfa12672fbc50e8a5',
    patientappointmentemail: 'tristandivider8@gmail.com',
    patientappointmentfirstname: 'Velasco',
    patientambherappointmentdate: '2025-10-03',
    patientambherappointmenttime: '2:00 PM',
    patientambherappointmentlocationaddress: '#032 Subic Street, Olongapo',
    patientambherappointmentstatus: 'Cancelled'
  };
  
  const clinicType = 'ambher';
  
  console.log('📋 Appointment Data:');
  console.log('  ID:', appointment._id);
  console.log('  Email:', appointment.patientappointmentemail);
  console.log('  Patient:', appointment.patientappointmentfirstname);
  console.log('  Status:', appointment.patientambherappointmentstatus);
  
  // Simulate the SMS controller logic
  console.log('\n🔍 SMS Controller Logic Simulation:');
  
  // Step 1: Check appointment ID and clinic type
  if (!appointment._id || !clinicType) {
    console.log('❌ ISSUE: Missing appointment ID or clinic type');
    return;
  }
  console.log('✅ Step 1: Appointment ID and clinic type present');
  
  // Step 2: Check if appointment exists
  if (!appointment) {
    console.log('❌ ISSUE: Appointment not found');
    return;
  }
  console.log('✅ Step 2: Appointment found');
  
  // Step 3: Simulate patient demographic lookup
  console.log('\n📧 Step 3: Patient demographic lookup by email...');
  console.log('  Looking for patient with email:', appointment.patientappointmentemail);
  
  // This is where the issue might be - if the patient demographic record doesn't exist
  // or doesn't have a contact number, the SMS will fail
  
  // Step 4: Check clinic-specific details
  const isAmbher = clinicType.toLowerCase() === 'ambher';
  const clinicName = isAmbher ? 'Ambher Optical' : 'Bautista Eye Center';
  const appointmentDate = isAmbher ? appointment.patientambherappointmentdate : appointment.patientbautistaappointmentdate;
  const appointmentTime = isAmbher ? appointment.patientambherappointmenttime : appointment.patientbautistaappointmenttime;
  const appointmentLocation = isAmbher ? appointment.patientambherappointmentlocationaddress : appointment.patientbautistaappointmentlocationaddress;
  
  console.log('\n🏥 Step 4: Clinic-specific details:');
  console.log('  Clinic:', clinicName);
  console.log('  Date:', appointmentDate);
  console.log('  Time:', appointmentTime);
  console.log('  Location:', appointmentLocation);
  
  // Check for missing data
  if (!appointmentDate || !appointmentTime) {
    console.log('❌ POTENTIAL ISSUE: Missing appointment date or time');
    if (!appointmentDate) console.log('  Missing: appointmentDate');
    if (!appointmentTime) console.log('  Missing: appointmentTime');
  } else {
    console.log('✅ Step 4: All clinic-specific details present');
  }
  
  // Step 5: Simulate message creation
  const patientFirstName = appointment.patientappointmentfirstname || 'Patient';
  const message = `Appointment Cancelled

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
  
  console.log('\n📝 Step 5: Message created');
  console.log('  Message length:', message.length);
  console.log('  First 100 chars:', message.substring(0, 100) + '...');
  
  console.log('\n🎯 ANALYSIS COMPLETE');
  console.log('\n💡 MOST LIKELY ISSUES:');
  console.log('1. Patient demographic record not found for email:', appointment.patientappointmentemail);
  console.log('2. Patient demographic record exists but missing contact number');
  console.log('3. Contact number format issue (invalid format)');
  console.log('4. iProg API issue specifically with cancellation messages');
  console.log('5. Network timeout during SMS sending (credits deducted but message fails)');
  
  console.log('\n🔧 DEBUGGING STEPS:');
  console.log('1. Check if patient demographic exists for email: tristandivider8@gmail.com');
  console.log('2. Verify the patient has a valid contact number');
  console.log('3. Compare decline vs cancel SMS logs in server console');
  console.log('4. Test with a different appointment that has confirmed patient data');
}

// Run the simulation
simulateCancellationSMSFlow();