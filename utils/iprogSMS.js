import axios from 'axios';
import process from 'process';

class iPragSMS {
  constructor(clinic = null, apiToken = null) {
    // Use provided API token or determine from clinic
    if (apiToken) {
      this.apiToken = apiToken;
    } else if (clinic) {
      this.apiToken = this.getApiTokenForClinic(clinic);
    } else {
      // Fallback to default (for backward compatibility)
      this.apiToken = process.env.IPROG_API_TOKEN || process.env.AMBHER_IPROG_API_TOKEN;
    }
    
    this.clinic = clinic;
    this.baseUrl = 'https://sms.iprogtech.com/api/v1';
    
    if (!this.apiToken) {
      console.warn('⚠️  iProg API token not configured. SMS sending will be disabled.');
    }
  }

  /**
   * Get the appropriate API token based on clinic
   * @param {string} clinic - Clinic name ('Ambher Optical' or 'Bautista Eye Center')
   * @returns {string} API token for the clinic
   */
  getApiTokenForClinic(clinic) {
    if (!clinic) return null;
    
    const normalizedClinic = clinic.toLowerCase().trim();
    
    if (normalizedClinic.includes('ambher')) {
      return process.env.AMBHER_IPROG_API_TOKEN;
    } else if (normalizedClinic.includes('bautista')) {
      return process.env.BAUTISTA_IPROG_API_TOKEN;
    }
    
    // Default fallback
    console.warn(`⚠️  Unknown clinic: ${clinic}, using Ambher token as fallback`);
    return process.env.AMBHER_IPROG_API_TOKEN;
  }

  /**
   * Send single SMS using iProg SMS API (for order status updates)
   * @param {string} phoneNumber - Recipient's phone number  
   * @param {string} message - Message content
   * @param {number} smsProvider - SMS Provider (0, 1, or 2), default: 2 (new provider supporting all networks)
   * @returns {Promise<Object>} SMS sending result
   */
  async sendSMS(phoneNumber, message, smsProvider = 2) {
    try {
      if (!this.apiToken) {
        throw new Error('iProg API token not configured');
      }

      // Format phone number for Philippines
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      console.log(`📱 Sending single SMS via iProg to: ${formattedPhone}`);
      console.log(`📝 Message: ${message.substring(0, 50)}...`);
      console.log(`� Using SMS Provider: ${smsProvider}`);
      
      // Send SMS request using query parameters (as per iProg API documentation)
      const response = await axios.post(`${this.baseUrl}/sms_messages`, {
        api_token: this.apiToken,
        phone_number: formattedPhone,
        message: message,
        sms_provider: smsProvider
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });

      if (response.data.status === 200) {
        console.log(`✅ Single SMS sent successfully via iProg: ${response.data.message_id}`);
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
      console.error('❌ iProg single SMS sending failed:', error.message);
      
      return {
        success: false,
        error: error.message,
        status: 'Failed',
        provider: 'iProg'
      };
    }
  }

  /**
   * Send bulk SMS using iProg SMS API (for promotional messages)
   * @param {Array<string>} phoneNumbers - Array of recipient phone numbers
   * @param {string} message - Message content
   * @param {number} smsProvider - SMS Provider (0, 1, or 2), default: 2 (new provider supporting all networks)
   * @returns {Promise<Object>} Bulk SMS sending result
   */
  async sendBulkSMS(phoneNumbers, message, smsProvider = 2) {
    try {
      if (!this.apiToken) {
        throw new Error('iProg API token not configured');
      }

      if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
        throw new Error('Phone numbers array is required and cannot be empty');
      }

      // Format all phone numbers for Philippines
      const formattedPhones = phoneNumbers.map(phone => this.formatPhoneNumber(phone));
      
      // Join phone numbers with comma for bulk SMS
      const phoneNumbersString = formattedPhones.join(',');
      
      // Prepare request payload for bulk SMS
      const payload = {
        api_token: this.apiToken,
        phone_number: phoneNumbersString,
        message: message,
        sms_provider: smsProvider
      };

      console.log(`📱 Sending bulk SMS via iProg to ${formattedPhones.length} recipients`);
      console.log(`🔍 Bulk SMS Request ID: BULK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
      console.log(`📋 Phone numbers: ${formattedPhones.join(', ')}`);
      console.log(`📝 Message length: ${message.length} characters`);
      
      // Send bulk SMS request using bulk endpoint
      const response = await axios.post(`${this.baseUrl}/sms_messages/send_bulk`, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout for bulk
      });

      console.log(`📡 iProg Bulk SMS Response Status: ${response.status}`);
      console.log(`📡 iProg Bulk SMS Response Data:`, response.data);

      if (response.data.status === 200) {
        // Parse message IDs from comma-separated string - handle empty strings properly
        let messageIds = [];
        if (response.data.message_ids && response.data.message_ids.trim() !== '') {
          messageIds = response.data.message_ids.split(',').filter(id => id.trim() !== '');
        }
        
        console.log(`✅ Bulk SMS sent successfully via iProg: ${messageIds.length} messages queued`);
        return {
          success: true,
          messageIds: messageIds,
          totalSent: messageIds.length,
          status: 'Sent',
          provider: 'iProg',
          response: response.data
        };
      } else {
        throw new Error(`iProg API returned status ${response.data.status}: ${response.data.message}`);
      }

    } catch (error) {
      console.error('❌ iProg bulk SMS sending failed:', error.message);
      
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
        sms_provider: 2 // Use new provider supporting all networks
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
   * Check SMS delivery status using iProg API
   * @param {string} messageId - iProg message ID to check
   * @returns {Promise<Object>} SMS status result
   */
  async checkSmsStatus(messageId) {
    try {
      if (!this.apiToken) {
        throw new Error('iProg API token not configured');
      }

      if (!messageId) {
        throw new Error('Message ID is required');
      }

      console.log(`📱 Checking SMS status for message ID: ${messageId}`);

      // Check SMS status using GET endpoint with query parameters
      const response = await axios.get(`${this.baseUrl}/sms_messages/status`, {
        params: {
          api_token: this.apiToken,
          message_id: messageId
        },
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      if (response.data.status === 200) {
        const messageStatus = response.data.message_status;
        console.log(`✅ SMS status retrieved: ${messageStatus} for message ${messageId}`);
        
        return {
          success: true,
          messageId: messageId,
          status: messageStatus,
          isDelivered: messageStatus === 'delivered',
          isPending: messageStatus === 'pending',
          isFailed: messageStatus === 'failed',
          provider: 'iProg',
          response: response.data
        };
      } else {
        throw new Error(`iProg API returned status ${response.data.status}: ${response.data.message || 'Unknown error'}`);
      }

    } catch (error) {
      console.error(`❌ Failed to check SMS status for ${messageId}:`, error.message);
      
      return {
        success: false,
        messageId: messageId,
        error: error.message,
        provider: 'iProg'
      };
    }
  }

  /**
   * Check SMS credits balance using iProg API
   * @returns {Promise<Object>} SMS credits balance result
   */
  async checkSmsCredits() {
    try {
      if (!this.apiToken) {
        throw new Error('iProg API token not configured');
      }

      console.log('💳 Checking SMS credits balance...');

      // Check SMS credits using GET endpoint with query parameters
      const response = await axios.get(`${this.baseUrl}/account/sms_credits`, {
        params: {
          api_token: this.apiToken
        },
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      console.log('📡 iProg Credits Response:', response.data);

      if (response.data.status === 'success') {
        const creditsBalance = response.data.data.load_balance;
        console.log(`✅ SMS credits retrieved: ${creditsBalance} credits remaining`);
        
        return {
          success: true,
          balance: creditsBalance,
          message: response.data.message,
          provider: 'iProg'
        };
      } else {
        throw new Error(`iProg API returned status ${response.data.status}: ${response.data.message}`);
      }

    } catch (error) {
      console.error('❌ Failed to check SMS credits:', error.message);
      
      return {
        success: false,
        error: error.message,
        provider: 'iProg',
        balance: null
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
      clinic: this.clinic || 'Default',
      baseUrl: this.baseUrl,
      endpoints: {
        singleSMS: `${this.baseUrl}/sms_messages`,
        bulkSMS: `${this.baseUrl}/sms_messages/send_bulk`,
        statusCheck: `${this.baseUrl}/sms_messages/status`,
        creditsCheck: `${this.baseUrl}/account/sms_credits`
      },
      features: [
        'Philippines SMS delivery',
        'Single SMS sending for order status updates',
        'Bulk SMS sending for promotional messages',
        'SMS delivery status checking',
        'SMS credits balance checking',
        'Multiple SMS providers (0, 1, or 2 - new provider supports all networks)',
        'Queue-based message processing',
        'Message tracking with unique IDs',
        'Clinic-specific API tokens'
      ]
    };
  }

  /**
   * Static method to create iProg client for Ambher Optical
   * @returns {iPragSMS} iProg client configured for Ambher
   */
  static createForAmbher() {
    return new iPragSMS('Ambher Optical');
  }

  /**
   * Static method to create iProg client for Bautista Eye Center
   * @returns {iPragSMS} iProg client configured for Bautista
   */
  static createForBautista() {
    return new iPragSMS('Bautista Eye Center');
  }

  /**
   * Static method to create iProg client for a specific clinic
   * @param {string} clinicName - Name of the clinic
   * @returns {iPragSMS} iProg client configured for the clinic
   */
  static createForClinic(clinicName) {
    return new iPragSMS(clinicName);
  }
}

export default iPragSMS;
