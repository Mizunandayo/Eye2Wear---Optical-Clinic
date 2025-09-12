import dotenv from 'dotenv';
import process from 'process';
import iPragSMS from './utils/iprogSMS.js';

dotenv.config();

async function testSMSMethods() {
  try {
    console.log('🧪 Testing iProg SMS Methods...');
    
    // Test data - using the FIXED restock message (no special characters)
    const phoneNumber = '09159353681';
    const restockMessage = ` Great News! Your Wishlist Item is Back in Stock!

Hello,

The product you wishlisted is now available:

  Product: Police Limited Edition Sunglasses SPLL60 COL. 700G
  Brand: Police
  Price: PHP 3,900
  Available at: Ambher Optical

Don't miss out - visit us or order online before it's gone again!

Thank you,
Ambher Optical`;
    
    // Create Ambher SMS client
    const smsClient = iPragSMS.createForAmbher();
    
    console.log(`📝 Message Length: ${restockMessage.length} characters`);
    console.log('📝 Message Preview:');
    console.log(restockMessage.substring(0, 100) + '...');
    
    console.log('\n=== Testing Bulk SMS with Restock Message ===');
    const bulkRestockResult = await smsClient.sendBulkSMS([phoneNumber], restockMessage);
    console.log('Bulk SMS (Restock Message) Result:', bulkRestockResult);
    
    console.log('\n=== Testing Single SMS with Restock Message ===');
    const singleRestockResult = await smsClient.sendSMS(phoneNumber, restockMessage);
    console.log('Single SMS (Restock Message) Result:', singleRestockResult);
    
    console.log('\n✅ Restock message testing completed');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

testSMSMethods();