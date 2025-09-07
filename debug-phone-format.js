// Debug phone number formatting for SMS delivery issue

function formatPhoneNumber(phone) {
  // Remove all non-digit characters
  const cleaned = phone.toString().replace(/\D/g, '');
  
  console.log(`Original: ${phone} -> Cleaned: ${cleaned} (length: ${cleaned.length})`);
  
  // For Philippine numbers, format as 63XXXXXXXXX (without + prefix to match iProg utility)
  if (cleaned.length === 10 && cleaned.startsWith('9')) {
    const formatted = `63${cleaned}`;
    console.log(`Format applied: 10 digits starting with 9 -> ${formatted}`);
    return formatted;
  } else if (cleaned.length === 11 && cleaned.startsWith('09')) {
    const formatted = `63${cleaned.substring(1)}`;
    console.log(`Format applied: 11 digits starting with 09 -> ${formatted}`);
    return formatted;
  } else if (cleaned.length === 12 && cleaned.startsWith('63')) {
    console.log(`Format applied: Already in correct format -> ${cleaned}`);
    return cleaned;
  } else if (cleaned.length === 13 && cleaned.startsWith('+63')) {
    const formatted = cleaned.substring(1); // Remove + prefix
    console.log(`Format applied: 13 digits starting with +63 -> ${formatted}`);
    return formatted;
  } else if (cleaned.length === 13 && cleaned.startsWith('63')) {
    const formatted = cleaned.substring(0, 12); // Remove extra digit if any
    console.log(`Format applied: 13 digits starting with 63 -> ${formatted}`);
    return formatted;
  }
  
  // Default: return cleaned digits
  console.log(`Format applied: Default (no special formatting) -> ${cleaned}`);
  return cleaned;
}

// Test the specific phone number mentioned
const testNumber = "09454361502";
console.log("\n=== Testing phone number formatting ===");
console.log(`Testing number: ${testNumber}`);
const formatted = formatPhoneNumber(testNumber);
console.log(`Final formatted number: ${formatted}`);
console.log(`Expected format: 639454361502`);
console.log(`Match expected: ${formatted === '639454361502'}`);

// Test other variations
console.log("\n=== Testing other variations ===");
const variations = [
  "9454361502",
  "+639454361502", 
  "639454361502",
  "09454361502"
];

variations.forEach(variation => {
  console.log(`\nTesting: ${variation}`);
  const result = formatPhoneNumber(variation);
  console.log(`Result: ${result}`);
});
