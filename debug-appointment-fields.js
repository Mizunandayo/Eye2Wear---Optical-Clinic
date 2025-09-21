// Debug script to examine the exact appointment data and patient lookup
// This will help us understand why decline works but cancel doesn't

async function debugAppointmentData() {
  console.log('🔍 DEBUGGING APPOINTMENT AND PATIENT DATA');
  console.log('============================================');
  
  const targetAppointmentId = '68cfcf2bfa12672fbc50e8a5';
  console.log('Target Appointment ID:', targetAppointmentId);
  
  // We need to connect to MongoDB to check the actual data
  console.log('\n📊 APPOINTMENT DATA ANALYSIS:');
  console.log('Examining appointment: ' + targetAppointmentId);
  console.log('Expected email: tristandivider8@gmail.com');
  
  console.log('\n🔍 FIELD DIFFERENCES TO CHECK:');
  console.log('1. appointment.patientappointmentemail vs appointment.patientambherappointmentemail');
  console.log('2. Patient lookup: PatientDemographic.findOne({ patientemail: email })');
  console.log('3. Patient email field: patientemail vs patientprimaryemail');
  
  console.log('\n💡 POSSIBLE ISSUES:');
  console.log('❌ Issue 1: Wrong email field in appointment (patientappointmentemail vs patientambherappointmentemail)');
  console.log('❌ Issue 2: Wrong patient lookup field (patientemail vs patientprimaryemail)');
  console.log('❌ Issue 3: Case sensitivity in email comparison');
  console.log('❌ Issue 4: null/undefined email values');
  
  console.log('\n🧪 TESTING HYPOTHESIS:');
  console.log('Both decline and cancel use same logic:');
  console.log('  appointment.patientappointmentemail -> PatientDemographic.findOne({ patientemail: email })');
  console.log('');
  console.log('But our appointment has:');
  console.log('  patientambherappointmentemail: "tristandivider8@gmail.com"');
  console.log('  patientappointmentemail: ??? (might be different or null)');
  
  console.log('\n🎯 SOLUTION NEEDED:');
  console.log('If cancel uses patientappointmentemail but appointment only has patientambherappointmentemail,');
  console.log('then cancel would lookup the wrong email and fail to find patient!');
  
  console.log('\n📝 VERIFICATION STEPS:');
  console.log('1. Check actual appointment document fields');
  console.log('2. Verify which email field decline vs cancel is using');
  console.log('3. Check PatientDemographic collection for email matching');
  console.log('4. Fix the email field mapping');
}

debugAppointmentData();

// Let's also analyze the code difference
console.log('\n📋 CODE ANALYSIS:');
console.log('=================');

console.log('\n🔍 DECLINE SMS Code Path:');
console.log('Lines 1185-1190 in smsmessage.controller.js:');
console.log('const patient = await PatientDemographic.findOne({');
console.log('  patientemail: appointment.patientappointmentemail');
console.log('});');

console.log('\n🔍 CANCEL SMS Code Path:');
console.log('Lines 1375-1380 in smsmessage.controller.js:');
console.log('const patient = await PatientDemographic.findOne({');
console.log('  patientemail: appointment.patientappointmentemail');
console.log('});');

console.log('\n💡 OBSERVATION: Both use the SAME lookup logic!');
console.log('This means the issue is NOT in the SMS controller logic.');
console.log('The issue might be:');
console.log('1. Different email values in the appointment document');
console.log('2. Timing issue - appointment email changes between decline and cancel');
console.log('3. Database query issue specific to cancel timing');

console.log('\n🚨 CRITICAL DISCOVERY:');
console.log('Our appointment has email: "tristandivider8@gmail.com"');
console.log('But we need to check if this is in:');
console.log('  - appointment.patientappointmentemail (used by SMS)');
console.log('  - appointment.patientambherappointmentemail (shown in data)');
console.log('If SMS looks for patientappointmentemail but appointment only has');
console.log('patientambherappointmentemail, the lookup will fail!');

console.log('\n🔧 POTENTIAL FIX:');
console.log('Update SMS controller to use clinic-specific email field:');
console.log('const emailField = isAmbher ? appointment.patientambherappointmentemail : appointment.patientbautistaappointmentemail;');
console.log('const patient = await PatientDemographic.findOne({ patientemail: emailField });');