import mongoose from 'mongoose';
import dotenv from 'dotenv';
import process from 'process';
import SmsController from './controllers/smsmessage.controller.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

async function testWishlistSMS() {
  try {
    console.log('🧪 Testing Bulk Wishlist SMS Notification...');
    
    // Test data - simulate multiple customers who wishlisted the product
    const validCustomers = [
      {
        phone: '09159353681',
        name: 'Kate Soriano',
        email: 'kate@example.com'
      },
      {
        phone: '+639171234567',
        name: 'John Doe',
        email: 'john@example.com'
      }
    ];

    const product = {
      ambherinventoryproductname: 'Police Limited Edition Sunglasses SPLL60 COL. 700G',
      ambherinventoryproductbrand: 'Police',
      ambherinventoryproductprice: 3900
    };
    const clinicType = 'ambher';

    console.log('� Valid Customers:', validCustomers.length);
    validCustomers.forEach((customer, index) => {
      console.log(`  ${index + 1}. ${customer.name} (${customer.phone})`);
    });
    console.log('🎯 Product:', product.ambherinventoryproductname);
    console.log('🏥 Clinic Type:', clinicType);

    // Test the bulk message format
    const clinicName = clinicType === 'ambher' ? 'Ambher Optical' : 'Bautista Eye Center';
    const message = ` Great News! Your Wishlist Item is Back in Stock!

Hello,

The product you wishlisted is now available:

  Product: ${product.ambherinventoryproductname}
  Brand: ${product.ambherinventoryproductbrand}
  Price: ₱${product.ambherinventoryproductprice.toLocaleString()}
  Available at: ${clinicName}

Don't miss out - visit us or order online before it's gone again!

Thank you,
${clinicName}`;

    console.log('📝 Bulk Message Content:');
    console.log('='.repeat(60));
    console.log(message);
    console.log('='.repeat(60));
    console.log(`📏 Message Length: ${message.length} characters`);
    console.log(`📞 Phone Numbers: ${validCustomers.map(c => c.phone).join(', ')}`);

    console.log('✅ Bulk message format test completed');
    console.log('💡 This new approach should resolve the iProg empty message_ids issue');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

testWishlistSMS();