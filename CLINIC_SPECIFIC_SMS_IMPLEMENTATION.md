# Clinic-Specific SMS API Integration

## Overview
The SMS functionality has been updated to support clinic-specific iProg API tokens. Each clinic (Ambher Optical and Bautista Eye Center) now uses its own dedicated API token for SMS operations.

## Environment Variables
The following environment variables have been configured in `.env`:

```properties
# iProg SMS Configuration (Philippines SMS Provider)
AMBHER_IPROG_API_TOKEN=416d1b4e71650364ac3f07145d683b0074ef38ed
BAUTISTA_IPROG_API_TOKEN=fac3e6efb16babf0988e04b8c1b36a31d6fe3e0a
```

## Changes Made

### 1. Updated iPragSMS Class (`utils/iprogSMS.js`)
- **Enhanced Constructor**: Now accepts optional `clinic` parameter and `apiToken` parameter
- **Clinic Token Resolution**: Added `getApiTokenForClinic()` method to determine appropriate API token based on clinic name
- **Static Factory Methods**: Added convenience methods for creating clinic-specific clients:
  - `iPragSMS.createForAmbher()` - Creates client for Ambher Optical
  - `iPragSMS.createForBautista()` - Creates client for Bautista Eye Center  
  - `iPragSMS.createForClinic(clinicName)` - Creates client for any clinic

### 2. Updated SMS Controller (`controllers/smsmessage.controller.js`)
- **Helper Function**: Added `getClinicSMSClient(clinicName)` to get appropriate client for each clinic
- **Promotional SMS**: Updated to use clinic-specific client based on `senderClinic`
- **Order Status SMS**: Updated to use clinic-specific client based on clinic determined from order type
- **Appointment Reminders**: Updated to use clinic-specific client based on appointment clinic

### 3. Updated SMS Scheduler (`utils/smsScheduler.js`)
- **Helper Function**: Added `getClinicSMSClient(clinicName)` for scheduled SMS operations
- **Backward Compatibility**: Maintains default client for fallback scenarios

## Clinic Determination Logic

### For Order Status SMS
```javascript
const clinicName = orderType === 'ambher' ? 'Ambher Optical' : 'Bautista Eye Center';
const clinicSmsClient = getClinicSMSClient(clinicName);
```

### For Promotional SMS
```javascript
const { senderClinic } = req.body; // Received from frontend
const clinicSmsClient = getClinicSMSClient(senderClinic);
```

### For Appointment Reminders
```javascript
const clinicName = appointment.cliniclocationid?.cliniclocationname || appointment.appointmentclinic;
const clinicSmsClient = getClinicSMSClient(clinicName);
```

## API Token Mapping
The system automatically maps clinic names to appropriate API tokens:

| Clinic Name Pattern | API Token Used |
|-------------------|----------------|
| Contains "ambher" (case-insensitive) | `AMBHER_IPROG_API_TOKEN` |
| Contains "bautista" (case-insensitive) | `BAUTISTA_IPROG_API_TOKEN` |
| Unknown/Unspecified | `AMBHER_IPROG_API_TOKEN` (fallback) |

## Testing
A test file has been created (`test-clinic-sms.js`) to verify the clinic-specific functionality:

```bash
node test-clinic-sms.js
```

This test verifies:
- ✅ Ambher Optical client uses correct API token
- ✅ Bautista Eye Center client uses correct API token
- ✅ Generic clinic creation works correctly
- ✅ Unknown clinic defaults to Ambher token
- ✅ Environment variables are properly loaded

## Backward Compatibility
The system maintains backward compatibility by:
- Keeping default iProg client for existing code that doesn't specify clinic
- Providing fallback to Ambher token when clinic is unknown
- Preserving all existing API endpoints and functionality

## SMS Operations Affected
All SMS operations now use clinic-specific tokens:

1. **Promotional SMS** - Uses sender clinic from request
2. **Order Status Updates** - Uses clinic determined from order type (ambher/bautista)
3. **Order Completion SMS** - Uses clinic from order context
4. **Appointment Reminders** - Uses clinic from appointment record
5. **Pickup Notifications** - Uses clinic from order context
6. **Wishlist Notifications** - Uses clinic context

## Benefits
- **Separate Billing**: Each clinic's SMS usage is tracked separately
- **Better Organization**: SMS costs and analytics can be separated by clinic
- **Reliability**: If one clinic's token has issues, the other clinic remains unaffected
- **Scalability**: Easy to add more clinics in the future by adding new tokens

## Future Enhancements
- Add SMS analytics dashboard by clinic
- Implement clinic-specific SMS templates
- Add clinic-specific rate limiting
- Monitor and alert on clinic-specific SMS credit balances
