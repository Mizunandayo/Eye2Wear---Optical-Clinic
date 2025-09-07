// Test order completion SMS flow

class iPragSMS {
  constructor() {
    this.apiToken = 'test-token';
    this.baseUrl = 'https://sms.iprogtech.com/api/v1';
  }

  formatPhoneNumber(phone) {
    const cleaned = phone.toString().replace(/\D/g, '');
    
    if (cleaned.length === 10 && cleaned.startsWith('9')) {
      return `63${cleaned}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('09')) {
      return `63${cleaned.substring(1)}`;
    } else if (cleaned.length === 12 && cleaned.startsWith('63')) {
      return cleaned;
    }
    
    return cleaned;
  }

  async sendBulkSMS(phoneNumbers, message, smsProvider = 0) {
    try {
      if (!this.apiToken) {
        throw new Error('iProg API token not configured');
      }

      const formattedPhones = phoneNumbers.map(phone => this.formatPhoneNumber(phone));
      const phoneNumbersString = formattedPhones.join(',');
      
      console.log('📱 Bulk SMS Details:', {
        original_phones: phoneNumbers,
        formatted_phones: formattedPhones,
        phone_numbers_string: phoneNumbersString,
        message_length: message.length,
        provider: smsProvider,
        api_token_configured: !!this.apiToken
      });

      console.log('📱 Full message:', message);

      // Simulate the request (don't actually send to avoid charges)
      console.log('📡 Would send to:', `${this.baseUrl}/sms_messages/send_bulk`);
      
      return {
        success: true,
        messageIds: ['test-msg-123'],
        totalSent: 1,
        status: 'Sent',
        provider: 'iProg'
      };

    } catch (error) {
      console.error('❌ iProg bulk SMS failed:', error.message);
      return {
        success: false,
        error: error.message,
        status: 'Failed',
        provider: 'iProg'
      };
    }
  }
}

// Test the order completion flow
async function testOrderCompletionSMS() {
  const iprogClient = new iPragSMS();
  
  // Test data similar to what would be sent for order completion
  const testPhone = "09454361502";
  const testMessage = `Order Status Update

Hello John,

Your order has been completed. Thank you for choosing us!

📦 Order ID: AMB001234
📊 Status: Completed
🏥 Clinic: Ambher Optical

If you have any questions, please don't hesitate to contact us.

Thank you,
Ambher Optical`;

  console.log('=== Testing Order Completion SMS Flow ===');
  console.log('Test phone number:', testPhone);
  console.log('Formatted phone number:', iprogClient.formatPhoneNumber(testPhone));
  
  const result = await iprogClient.sendBulkSMS([testPhone], testMessage);
  console.log('SMS Result:', result);
}

testOrderCompletionSMS();
