# iProg SMS Provider Update - October 2025

## 🎉 What's New

**iProg SMS API** has been fully integrated with a new service provider that **supports all networks**!

### Key Changes

- **New SMS Provider Parameter**: `sms_provider: 2`
- **Default Provider Updated**: Changed from `0` to `2`
- **Network Support**: The new provider (option `2`) supports all Philippine mobile networks

## 📝 Update Details

### Date: October 6, 2025

iProg SMS announced full integration with their new service provider that supports all networks. To use this new provider, we must include `"sms_provider": 2` in all SMS API requests.

## 🔧 Changes Made

### File: `utils/iprogSMS.js`

Updated the following methods to use `sms_provider: 2` as default:

1. **`sendSMS()` method**
   - Changed default from `smsProvider = 0` to `smsProvider = 2`
   - Updated JSDoc to reflect new options: `(0, 1, or 2)`
   - Added note: "default: 2 (new provider supporting all networks)"

2. **`sendBulkSMS()` method**
   - Changed default from `smsProvider = 0` to `smsProvider = 2`
   - Updated JSDoc to reflect new options: `(0, 1, or 2)`
   - Added note: "default: 2 (new provider supporting all networks)"

3. **`testConfiguration()` method**
   - Changed test payload from `sms_provider: 0` to `sms_provider: 2`
   - Added comment: "Use new provider supporting all networks"

4. **`getProviderInfo()` method**
   - Updated features list to reflect new provider options
   - Changed from: `'Multiple SMS providers (0 or 1)'`
   - Changed to: `'Multiple SMS providers (0, 1, or 2 - new provider supports all networks)'`

## 📊 SMS Provider Options

| Provider Value | Description | Network Support |
|----------------|-------------|-----------------|
| `0` | Original provider | Limited networks |
| `1` | Secondary provider | Limited networks |
| `2` | **New provider (Default)** | ✅ **All networks** |

## 🚀 Implementation

### All SMS requests now automatically use the new provider:

```javascript
// Single SMS (Order Status, etc.)
await iprogClient.sendSMS(phoneNumber, message);
// Uses sms_provider: 2 by default

// Bulk SMS (Promotional Messages)
await iprogClient.sendBulkSMS(phoneNumbers, message);
// Uses sms_provider: 2 by default
```

### Manual Override (if needed):

```javascript
// Force use of older provider
await iprogClient.sendSMS(phoneNumber, message, 0);

// Or use provider 1
await iprogClient.sendSMS(phoneNumber, message, 1);

// Explicitly use new provider (same as default)
await iprogClient.sendSMS(phoneNumber, message, 2);
```

## 📖 API Documentation Reference

Official iProg SMS API Documentation: https://sms.iprogtech.com/api/v1/documentation

### Example API Request with New Provider:

```javascript
POST https://sms.iprogtech.com/api/v1/sms_messages

{
    "api_token": "your_api_token_here",
    "phone_number": "639123456789",
    "message": "Your message here",
    "sms_provider": 2
}
```

### Example Response:

```json
{
    "status": 200,
    "message": "Your SMS message has been successfully added to the queue and will be processed shortly.",
    "message_id": "iSms-XHYBk"
}
```

## ✅ Benefits of New Provider

1. **Universal Network Support**: Works with all Philippine mobile networks
2. **Better Delivery Rates**: Improved message delivery success
3. **No Network Restrictions**: No need to worry about recipient's network
4. **Backward Compatible**: Old providers (0 and 1) still available if needed

## 🔍 Testing

All SMS functionality has been updated to use the new provider by default:

- ✅ Order Status SMS
- ✅ Appointment Reminders
- ✅ Promotional Messages
- ✅ Wishlist Notifications
- ✅ OTP Messages

## 📞 Support

If you experience any issues with SMS delivery:

1. Check that your iProg API token is valid
2. Verify SMS credits balance
3. Check SMS delivery status via iProg dashboard
4. Contact iProg support if persistent issues occur

## 🏥 Clinic-Specific Configuration

The system uses separate iProg API tokens for each clinic:

- **Ambher Optical**: Uses `AMBHER_IPROG_API_TOKEN`
- **Bautista Eye Center**: Uses `BAUTISTA_IPROG_API_TOKEN`

Both clinics will automatically benefit from the new provider supporting all networks.

## 📅 Migration Status

- **Updated**: October 7, 2025
- **Default Provider**: Now using `sms_provider: 2`
- **Status**: ✅ Complete - All SMS methods updated
- **Backward Compatibility**: ✅ Maintained - Old providers still available

---

**Note**: This update is transparent to all existing code. All SMS functionality continues to work exactly as before, but now with improved network support.
