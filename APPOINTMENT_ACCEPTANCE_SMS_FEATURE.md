# Appointment Acceptance SMS Feature

## Overview
This feature automatically sends SMS notifications to patients when their appointment requests are accepted by staff or admin users through the Admin Dashboard.

## How It Works

### 1. Admin Dashboard Button Click
When an admin/staff clicks either:
- "Accept Ambher Appointment" button
- "Accept Bautista Appointment" button

### 2. Backend Processing
1. The frontend calls `/api/patientappointments/appointments/{id}` with status "Accepted"
2. The `updateappointmentbyid` controller function:
   - Updates the appointment status
   - Detects status change to "Accepted"
   - Calls the new `sendAppointmentAcceptanceSMS` function
   - Fetches patient demographics using `patientappointmentemail`

### 3. SMS Sending
1. The `sendAppointmentAcceptanceSMS` function calls `/api/sms/appointment-acceptance`
2. The SMS controller:
   - Looks up appointment by ObjectId
   - Finds patient demographics using appointment email
   - Extracts clinic-specific appointment details
   - Sends SMS via iProg API with acceptance notification

## Message Format

The SMS includes:
- Patient's first name
- Confirmation of acceptance
- Appointment date and time
- Clinic name and location
- Eye specialist (if assigned)
- Instructions to arrive early
- Clinic contact information

Example message:
```
Appointment Accepted

Dear John,

Great news! Your appointment request has been ACCEPTED.

📅 Date: December 15, 2024
⏰ Time: 2:00 PM
🏥 Clinic: Ambher Optical
📍 Location: Main Street Branch
👨‍⚕️ Eye Specialist: Dr. Smith

Please arrive 15 minutes early for your appointment. Bring a valid ID and any previous eye examination records.

If you need to reschedule, please contact us immediately.

Thank you for choosing Ambher Optical!
```

## Technical Implementation

### Files Modified:
1. **controllers/patientappointment.controller.js**
   - Added `sendAppointmentAcceptanceSMS` function
   - Modified `updateappointmentbyid` to trigger SMS on "Accepted" status

2. **controllers/smsmessage.controller.js**
   - Added `sendAppointmentAcceptance` static method
   - Implements patient lookup by email
   - Handles clinic-specific message formatting

3. **routes/sms.js**
   - Added `/api/sms/appointment-acceptance` POST route

### Database Relations:
- PatientAppointment → `patientappointmentemail`
- PatientDemographic → `patientemail` (lookup match)
- PatientDemographic → `patientcontactnumber` (SMS destination)

### SMS Provider:
- Uses iProg SMS API via clinic-specific clients
- Supports both Ambher Optical and Bautista Eye Center
- Includes credits tracking and error handling

## Configuration Requirements

### Environment Variables:
```
AMBHER_IPROG_API_TOKEN=your_ambher_token
BAUTISTA_IPROG_API_TOKEN=your_bautista_token
```

### Patient Data Requirements:
- Valid `patientappointmentemail` in appointment
- Matching `patientemail` in PatientDemographic
- Valid `patientcontactnumber` for SMS delivery

## Error Handling

The system handles various error scenarios:
- Missing appointment ID or clinic type
- Appointment not found
- Patient demographic not found
- Invalid/missing phone number
- SMS API failures
- Credits insufficient

**Important**: SMS failures do not prevent appointment status updates. The appointment is still marked as "Accepted" even if SMS delivery fails.

## Testing

Use the provided test script:
```bash
node test-appointment-acceptance-sms.js
```

### Manual Testing:
1. Create a test appointment with valid patient data
2. Access Admin Dashboard as Staff/Owner
3. Click "Accept [Clinic] Appointment" button
4. Verify SMS is sent to patient's phone number
5. Check SMS logs in database

## Security & Permissions

- Only Staff and Owner roles can accept appointments
- Clinic-specific access controls apply
- SMS sending is logged for audit purposes
- Patient phone numbers are validated and formatted

## Monitoring

SMS sending activity is logged with:
- Timestamp and user information
- Credits usage tracking
- Success/failure status
- Error messages for debugging

## Future Enhancements

Potential improvements:
1. SMS templates customization
2. Multi-language support
3. SMS delivery status tracking
4. Retry mechanisms for failed SMS
5. Appointment acceptance email notifications