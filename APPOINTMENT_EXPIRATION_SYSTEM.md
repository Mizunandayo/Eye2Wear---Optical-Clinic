# Appointment Expiration System

## Overview
This system automatically expires pending appointments 1 hour before their scheduled time if they haven't been accepted or declined by staff/owners.

## How It Works

### Example Scenario
- **Patient books appointment for:** October 11, 2025 at 10:00 AM
- **Appointment status:** Pending
- **Expiration time:** October 11, 2025 at 9:00 AM
- **Result:** If the appointment is still "Pending" at 9:00 AM, it will be automatically marked as "Expired"

## Implementation Details

### 1. Database Schema Updates
Added "Expired" status to all appointment status enums:
- `patientappointmentstatus`
- `patientambherappointmentstatus`
- `patientbautistaappointmentstatus`

**File:** `models/patientappointment.js`

```javascript
enum: ['Cancelled', 'Pending', 'Declined', 'Accepted', 'Completed', 'Expired']
```

### 2. Expiration Scheduler
Created an automated scheduler that:
- Runs every minute
- Checks all pending appointments
- Calculates if current time >= (appointment time - 1 hour)
- Automatically updates status to "Expired"
- Adds entry to status history

**File:** `utils/appointmentExpirationScheduler.js`

### 3. Server Integration
The scheduler is initialized when the server starts:

**File:** `server.js`
```javascript
AppointmentExpirationScheduler.init();
```

## Features

### Time Parsing
- Supports both 12-hour format (AM/PM)
- Example: "10:00 AM", "2:30 PM"
- Automatically converts to 24-hour format for calculations

### Dual Clinic Support
- Handles Ambher Optical appointments
- Handles Bautista Eye Center appointments
- Each clinic's appointments expire independently

### Status History Tracking
Every expiration is logged with:
- Status: "Expired"
- Timestamp: When it was expired
- Changed By: "System - Auto-expired 1 hour before appointment time"

## Console Logging

The system provides detailed console output:

```
🕐 [2025-10-11T08:00:00.000Z] Checking for appointments to expire...
✓ No appointments to expire at this time

🕐 [2025-10-11T09:00:00.000Z] Checking for appointments to expire...
⏰ Expiring Ambher appointment 123 - scheduled for 2025-10-11 10:00 AM
📅 Appointment scheduled: 10/11/2025, 10:00:00 AM
⏱️  Expiration time: 10/11/2025, 9:00:00 AM
🕐 Current time: 10/11/2025, 9:00:15 AM
✅ Expired 1 appointment(s)
```

## Scheduler Configuration

### Current Settings
- **Frequency:** Every minute (`* * * * *`)
- **Runs on startup:** Yes
- **Auto-start:** Yes (when server starts)

### Adjusting Frequency
Edit `utils/appointmentExpirationScheduler.js`:

```javascript
// Run every minute (current)
this.task = cron.schedule('* * * * *', () => {

// Run every 5 minutes (for less frequent checks)
this.task = cron.schedule('*/5 * * * *', () => {

// Run every hour
this.task = cron.schedule('0 * * * *', () => {
```

## Manual Testing

You can manually trigger the expiration check for testing:

```javascript
import AppointmentExpirationScheduler from './utils/appointmentExpirationScheduler.js';

// Trigger manual check
await AppointmentExpirationScheduler.triggerManualCheck();
```

## Status Flow

```
Pending → Accepted → Completed
        → Declined
        → Cancelled (by patient/staff)
        → Expired (automatic, 1 hour before appointment)
```

## Database Queries

### Find Expired Appointments
```javascript
const expiredAppointments = await PatientAppointment.find({
  $or: [
    { patientambherappointmentstatus: 'Expired' },
    { patientbautistaappointmentstatus: 'Expired' }
  ]
});
```

### Find Appointments About to Expire
The scheduler automatically handles this, but you can query:
```javascript
const pendingAppointments = await PatientAppointment.find({
  $or: [
    { patientambherappointmentstatus: 'Pending' },
    { patientbautistaappointmentstatus: 'Pending' }
  ]
});
```

## Error Handling

The scheduler includes error handling for:
- Invalid time formats
- Missing date/time fields
- Database connection issues
- Invalid date formats

All errors are logged to console with descriptive messages.

## Performance Considerations

- **Lightweight:** Only queries pending appointments
- **Efficient:** Uses MongoDB indexes for quick lookups
- **Non-blocking:** Runs asynchronously
- **Scalable:** Can handle thousands of appointments

## Future Enhancements

Possible improvements:
1. **Email notifications** when appointments expire
2. **SMS notifications** to patients
3. **Configurable expiration window** (currently 1 hour)
4. **Admin dashboard** showing expired appointments
5. **Auto-rebooking suggestions** for expired appointments

## Troubleshooting

### Scheduler not running
- Check server console for initialization message
- Verify `node-cron` package is installed
- Check database connection

### Appointments not expiring
- Verify date/time format in database
- Check console logs for errors
- Manually trigger check for testing

### Time zone issues
- Server uses system time zone
- Ensure appointment times are stored in correct format
- Consider UTC conversion for multi-timezone support

## Dependencies

- `node-cron`: ^4.2.1 (for scheduling)
- `mongoose`: For database operations
- MongoDB: Database storage

## Files Modified/Created

### Created
- `utils/appointmentExpirationScheduler.js` - Main scheduler logic

### Modified
- `models/patientappointment.js` - Added "Expired" status
- `server.js` - Initialize scheduler on startup

## Conclusion

This system ensures that pending appointments don't remain in limbo indefinitely. By automatically expiring appointments 1 hour before their scheduled time, it:
- Keeps the appointment system clean
- Prevents confusion for patients and staff
- Provides clear status for appointments
- Maintains data integrity
