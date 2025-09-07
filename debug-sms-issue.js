// Debug script to check the specific issue with order completion SMS

// The issue might be in how the phone number is retrieved and processed in order completion SMS vs promotional SMS

console.log('=== Debugging Order Completion SMS vs Promotional SMS ===');

// Let's trace the differences:

console.log('\n1. PROMOTIONAL SMS FLOW:');
console.log('   - Gets ALL patients from PatientDemographic model');
console.log('   - Uses: PatientDemographic.find({ patientcontactnumber: { $exists: true, $ne: null } })');
console.log('   - Phone number source: patient.patientcontactnumber directly');
console.log('   - Formats all phone numbers for bulk SMS');
console.log('   - Uses sendBulkSMS([phoneNumbers], message)');

console.log('\n2. ORDER COMPLETION SMS FLOW:');
console.log('   - Gets specific order from PatientOrderAmbher/PatientOrderBautista');
console.log('   - First tries: order.patientcontactnumber');  
console.log('   - Then tries PatientDemographic lookup by email/name');
console.log('   - Phone number source: patientDemographic.patientcontactnumber OR order.patientcontactnumber');
console.log('   - Formats single phone number');
console.log('   - Uses sendBulkSMS([singlePhoneNumber], message)');

console.log('\n3. POTENTIAL ISSUE:');
console.log('   - Phone number format difference between order table vs patient demographics table');
console.log('   - Different validation/filtering logic');

// Test the specific phone number format from database
const testNumber = "09454361502";

function formatPhoneNumber(phone) {
  const cleaned = phone.toString().replace(/\D/g, '');
  console.log(`   Raw: "${phone}" -> Cleaned: "${cleaned}" (length: ${cleaned.length})`);
  
  if (cleaned.length === 10 && cleaned.startsWith('9')) {
    return `63${cleaned}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('09')) {
    return `63${cleaned.substring(1)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('63')) {
    return cleaned;
  }
  return cleaned;
}

console.log('\n4. TESTING PHONE NUMBER FORMATS:');
console.log('Your specific number: "09454361502"');
const formatted = formatPhoneNumber(testNumber);
console.log(`Formatted result: "${formatted}"`);

// Test with potential variations that might be in the database
const variations = [
  "09454361502",      // Standard format
  "+639454361502",    // With plus
  "639454361502",     // Already formatted  
  "9454361502",       // Without 0
  " 09454361502 ",    // With spaces
  "09-454-361-502",   // With dashes
];

console.log('\n5. TESTING VARIOUS DATABASE FORMATS:');
variations.forEach(variant => {
  const result = formatPhoneNumber(variant);
  console.log(`"${variant}" -> "${result}"`);
});

console.log('\n6. NEXT STEPS TO DEBUG:');
console.log('   - Check what phone number format is actually stored in order table');
console.log('   - Check what phone number format is in patient demographics table');
console.log('   - Compare the exact API calls between promotional and order completion');
console.log('   - Verify iProg API logs for both message types');
