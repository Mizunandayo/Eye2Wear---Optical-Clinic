import axios from 'axios';
import process from 'process';

class iPragSMS {
  constructor() {
    this.apiToken = process.env.IPROG_API_TOKEN;
    this.baseUrl = 'https://sms.iprogtech.com/api/v1';
    
    if (!this.apiToken) {
      console.warn('⚠️  iProg API token not configured. SMS sending will be disabled.');
    }
  }

  /**
   * Send SMS using iProg SMS API
   * @param {string} phoneNumber - Recipient's phone number  
   * @param {string} message - Message content
   * @param {number} smsProvider - SMS Provider (0 or 1), default: 0
   * @returns {Promise<Object>} SMS sending result
   */
  async sendSMS(phoneNumber, message, smsProvider = 0) {
    try {
      if (!this.apiToken) {
        throw new Error('iProg API token not configured');
      }

      // Format phone number for Philippines
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      // Prepare request payload
      const payload = {
        api_token: this.apiToken,
        phone_number: formattedPhone,
        message: message,
        sms_provider: smsProvider
      };

      console.log(`📱 Sending SMS via iProg to: ${formattedPhone}`);
      
      // Send SMS request
      const response = await axios.post(`${this.baseUrl}/sms_messages`, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });

      if (response.data.status === 200) {
        console.log(`✅ SMS sent successfully via iProg: ${response.data.message_id}`);
        return {
          success: true,
          messageId: response.data.message_id,
          status: 'Sent',
          provider: 'iProg',
          response: response.data
        };
      } else {
        throw new Error(`iProg API returned status ${response.data.status}: ${response.data.message}`);
      }

    } catch (error) {
      console.error('❌ iProg SMS sending failed:', error.message);
      
      return {
        success: false,
        error: error.message,
        status: 'Failed',
        provider: 'iProg'
      };
    }
  }

  /**
   * Format phone number for Philippines SMS
   * @param {string} phone - Raw phone number
   * @returns {string} Formatted phone number
   */
  formatPhoneNumber(phone) {
    // Remove all non-digit characters
    const cleaned = phone.toString().replace(/\D/g, '');
    
    // Handle Philippine number formats
    if (cleaned.length === 10 && cleaned.startsWith('9')) {
      // 9XXXXXXXXX -> 639XXXXXXXXX
      return `63${cleaned}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('09')) {
      // 09XXXXXXXXX -> 639XXXXXXXXX  
      return `63${cleaned.substring(1)}`;
    } else if (cleaned.length === 12 && cleaned.startsWith('63')) {
      // Already in correct format
      return cleaned;
    } else if (cleaned.length === 13 && cleaned.startsWith('63')) {
      // Remove extra digit if any
      return cleaned.substring(0, 12);
    }
    
    // Default: return as-is if can't determine format
    console.warn(`⚠️  Unusual phone number format: ${phone}, using as-is`);
    return cleaned;
  }

  /**
   * Test iProg SMS configuration
   * @returns {Promise<Object>} Configuration test result
   */
  async testConfiguration() {
    try {
      if (!this.apiToken) {
        return {
          success: false,
          message: 'iProg API token not configured'
        };
      }

      // Test with a dummy request to check if API token is valid
      const testPayload = {
        api_token: this.apiToken,
        phone_number: '639123456789', // Test number
        message: 'API Configuration Test - Please ignore this message',
        sms_provider: 0
      };

      const response = await axios.post(`${this.baseUrl}/sms_messages`, testPayload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000,
        validateStatus: () => true // Accept all status codes
      });

      if (response.data.status === 200) {
        return {
          success: true,
          message: 'iProg SMS configuration is valid',
          testMessageId: response.data.message_id
        };
      } else {
        return {
          success: false,
          message: `iProg API test failed: ${response.data.message || 'Unknown error'}`,
          statusCode: response.data.status
        };
      }

    } catch (error) {
      return {
        success: false,
        message: `iProg API connection failed: ${error.message}`,
        error: error
      };
    }
  }

  /**
   * Get SMS provider status and configuration
   * @returns {Object} Provider status information
   */
  getProviderInfo() {
    return {
      provider: 'iProg SMS',
      configured: !!this.apiToken,
      baseUrl: this.baseUrl,
      features: [
        'Philippines SMS delivery',
        'Multiple SMS providers (0 or 1)',
        'Queue-based message processing',
        'Message tracking with ID'
      ]
    };
  }
}

export default iPragSMS;
