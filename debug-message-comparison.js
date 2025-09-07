// Create a test to compare promotional SMS vs order completion SMS with the same phone number

const testPhoneNumber = "09454361502";
const formattedPhone = "639454361502";

console.log('=== DIRECT COMPARISON TEST ===');
console.log('Testing with phone number:', testPhoneNumber);
console.log('Expected formatted:', formattedPhone);

// Test message similar to what order completion would send
const orderCompletionMessage = `Order Status Update

Hello Customer,

Your order has been completed. Thank you for choosing us!

📦 Order ID: TEST001
📊 Status: Completed  
🏥 Clinic: Test Clinic

If you have any questions, please don't hesitate to contact us.

Thank you,
Test Clinic`;

// Test message similar to promotional SMS
const promotionalMessage = `Test Promotion

Check out our latest offers!

From: Test Clinic`;

console.log('\n=== MESSAGE COMPARISON ===');
console.log('Order completion message length:', orderCompletionMessage.length);
console.log('Promotional message length:', promotionalMessage.length);

// The issue might be in the message content length or special characters
if (orderCompletionMessage.length > 1600) {
  console.log('⚠️  WARNING: Order completion message exceeds SMS limit!');
}

console.log('\n=== POTENTIAL ISSUES IDENTIFIED ===');

// Check for problematic characters in order completion message
const problematicChars = /[^\u0020-\u007F]/g; // Non-printable ASCII characters
const orderProblematic = orderCompletionMessage.match(problematicChars);
const promoProblematic = promotionalMessage.match(problematicChars);

if (orderProblematic) {
  console.log('⚠️  Order completion message contains non-ASCII characters:', orderProblematic);
}

if (promoProblematic) {
  console.log('⚠️  Promotional message contains non-ASCII characters:', promoProblematic);
}

// Check for emoji/special characters that might cause issues
const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;

const orderEmojis = orderCompletionMessage.match(emojiRegex);
const promoEmojis = promotionalMessage.match(emojiRegex);

if (orderEmojis) {
  console.log('📱 Order completion message contains emojis:', orderEmojis);
}

if (promoEmojis) {
  console.log('📱 Promotional message contains emojis:', promoEmojis);
}

console.log('\n=== RECOMMENDED FIXES ===');
console.log('1. Try sending order completion SMS without emojis');
console.log('2. Reduce message length if over 160 characters per SMS segment');
console.log('3. Use plain ASCII text for better compatibility');
console.log('4. Test with exact same message format as promotional SMS');

// Create a simplified order completion message
const simplifiedOrderMessage = `Order Status Update

Hello Customer,

Your order has been completed. Thank you for choosing us!

Order ID: TEST001
Status: Completed
Clinic: Test Clinic

Thank you,
Test Clinic`;

console.log('\n=== SIMPLIFIED MESSAGE TEST ===');
console.log('Simplified message length:', simplifiedOrderMessage.length);
console.log('Contains emojis:', !!simplifiedOrderMessage.match(emojiRegex));
console.log('Contains non-ASCII:', !!simplifiedOrderMessage.match(problematicChars));
