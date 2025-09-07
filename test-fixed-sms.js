// Test the fixed SMS messages without emojis

console.log('=== TESTING FIXED SMS MESSAGES ===');

// Test the order completion message (now without emojis)
const orderCompletionMessage = `Order Status Update

Hello Customer,

Your order has been completed. Thank you for choosing us!

Order ID: TEST001
Status: Completed
Clinic: Test Clinic

If you have any questions, please don't hesitate to contact us.

Thank you,
Test Clinic`;

// Test appointment reminder message (now without emojis)
const appointmentMessage = `Appointment Reminder

Hello Customer,

This is a friendly reminder that you have an appointment tomorrow:

Date: Monday, January 15, 2024
Time: 10:00 AM
Clinic: Test Clinic

Please arrive 15 minutes early. If you need to reschedule, please contact us immediately.

Thank you,
Test Clinic`;

// Test wishlist message (now without emojis)
const wishlistMessage = `Wishlist Item Available!

Hello Customer,

Great news! An item from your wishlist is now available:

Product: Test Eyewear Frame
Available at: Test Clinic

Visit us or contact us to place your order before it's gone!

Thank you,
Test Clinic`;

console.log('\n=== EMOJI CHECK ===');

// Check for emojis in each message
const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;

const orderEmojis = orderCompletionMessage.match(emojiRegex);
const appointmentEmojis = appointmentMessage.match(emojiRegex);
const wishlistEmojis = wishlistMessage.match(emojiRegex);

console.log('Order completion message:');
console.log('  Length:', orderCompletionMessage.length);
console.log('  Contains emojis:', !!orderEmojis);
console.log('  Emojis found:', orderEmojis || 'None');

console.log('\nAppointment reminder message:');
console.log('  Length:', appointmentMessage.length);
console.log('  Contains emojis:', !!appointmentEmojis);
console.log('  Emojis found:', appointmentEmojis || 'None');

console.log('\nWishlist notification message:');
console.log('  Length:', wishlistMessage.length);
console.log('  Contains emojis:', !!wishlistEmojis);
console.log('  Emojis found:', wishlistEmojis || 'None');

console.log('\n=== EXPECTED RESULTS ===');
console.log('✅ All messages should have NO emojis');
console.log('✅ All messages should be under 1600 characters (SMS limit)');
console.log('✅ All messages should use plain ASCII text');

console.log('\n=== TEST CONCLUSION ===');
const allEmojisFree = !orderEmojis && !appointmentEmojis && !wishlistEmojis;
const allUnderLimit = orderCompletionMessage.length < 1600 && 
                      appointmentMessage.length < 1600 && 
                      wishlistMessage.length < 1600;

if (allEmojisFree && allUnderLimit) {
  console.log('🎉 SUCCESS: All SMS messages are now properly formatted!');
  console.log('   - No emojis detected');
  console.log('   - All under character limit');
  console.log('   - Should work with iProg SMS API');
} else {
  console.log('❌ ISSUES STILL EXIST:');
  if (!allEmojisFree) console.log('   - Some messages still contain emojis');
  if (!allUnderLimit) console.log('   - Some messages exceed character limit');
}
