# Patient Demographic to Order Sync - Documentation

## 📋 Overview

Enhanced the middleware in `patientdemographic.js` to automatically sync patient information changes to order records in addition to the existing account and appointment syncing.

## 🔄 What Gets Synced

### Fields Synced Across All Models

When these fields are updated in `patientdemographic.js`:

| Field | Syncs To |
|-------|----------|
| `patientlastname` | ✅ Accounts, ✅ Appointments, ✅ Orders (Ambher & Bautista) |
| `patientfirstname` | ✅ Accounts, ✅ Appointments, ✅ Orders (Ambher & Bautista) |
| `patientmiddlename` | ✅ Accounts, ✅ Appointments, ✅ Orders (Ambher & Bautista) |
| `patientprofilepicture` | ✅ Accounts, ✅ Appointments |
| `patientcontactnumber` | ✅ Orders (Ambher & Bautista) **NEW** |

## 🎯 Models Affected

### 1. **PatientAccount** (Existing)
- `patientlastname`
- `patientfirstname`
- `patientmiddlename`
- `patientprofilepicture`
- `patientprofilepicture_public_id`

### 2. **PatientAppointment** (Existing)
- `patientappointmentlastname`
- `patientappointmentfirstname`
- `patientappointmentmiddlename`
- `patientappointmentprofilepicture`

### 3. **PatientOrderAmbher** (NEW)
- `patientlastname`
- `patientfirstname`
- `patientmiddlename`
- `patientcontactnumber`

### 4. **PatientOrderBautista** (NEW)
- `patientlastname`
- `patientfirstname`
- `patientmiddlename`
- `patientcontactnumber`

## 🔧 Changes Made

### 1. Pre-Save Middleware (`pre('save')`)
**Added tracking for:**
- `_contactNumberModified` - Tracks if contact number changed

```javascript
this._contactNumberModified = this.isModified('patientcontactnumber');
```

### 2. Post-Save Middleware (`post('save')`)
**Added order syncing:**
```javascript
// Sync with PatientOrderAmbher and PatientOrderBautista if needed
if (shouldSyncNames || shouldSyncContact) {
  const orderUpdateData = {};
  if (shouldSyncNames) {
    orderUpdateData.patientlastname = doc.patientlastname;
    orderUpdateData.patientfirstname = doc.patientfirstname;
    orderUpdateData.patientmiddlename = doc.patientmiddlename;
  }
  if (shouldSyncContact) {
    orderUpdateData.patientcontactnumber = doc.patientcontactnumber;
  }
  
  // Update both Ambher and Bautista orders (fire-and-forget)
  PatientOrderAmbher.updateMany(...);
  PatientOrderBautista.updateMany(...);
}
```

### 3. Pre-findOneAndUpdate Middleware
**Added contact number tracking:**
```javascript
this._contactNumberModified = $set.patientcontactnumber !== undefined;
```

### 4. Post-findOneAndUpdate Middleware
**Added order syncing for updates:**
- Syncs name fields to orders when changed
- Syncs contact number to orders when changed

### 5. Bulk Update Middleware (`post(['updateOne', 'updateMany'])`)
**Enhanced to include:**
- Contact number tracking
- Order syncing for bulk operations

### 6. Static Method: `syncProfilePicture()`
**Enhanced to sync orders:**
```javascript
// Now also syncs to Ambher and Bautista orders
PatientOrderAmbher.updateMany(...);
PatientOrderBautista.updateMany(...);
```

### 7. Static Method: `syncAllProfilePictures()`
**Enhanced for bulk migration:**
- Now includes contact number in projection
- Bulk syncs to both order models

## 🚀 How It Works

### Automatic Sync (On Save/Update)

When you update a patient's demographic information:

```javascript
// Example: Update patient demographic
const demographic = await Patientdemographic.findOneAndUpdate(
  { patientemail: 'patient@example.com' },
  {
    patientlastname: 'NewLastName',
    patientfirstname: 'NewFirstName',
    patientcontactnumber: '09123456789'
  },
  { new: true }
);
```

**What happens automatically:**
1. ✅ `PatientAccount` updated with new name
2. ✅ All `PatientAppointment` records updated with new name
3. ✅ All `PatientOrderAmbher` records updated with new name and contact number
4. ✅ All `PatientOrderBautista` records updated with new name and contact number

### Manual Sync (Programmatic)

You can also trigger manual sync:

```javascript
// Sync single patient
const result = await Patientdemographic.syncProfilePicture('patient@example.com');

// Sync all patients (for data migration)
const bulkResult = await Patientdemographic.syncAllProfilePictures();
```

## 📊 Console Logging

The middleware provides detailed logging:

```
✅ Patient account synced for: patient@example.com (updated demographic)
✅ 3 appointment(s) synced via update for: patient@example.com
✅ 5 Ambher order(s) synced via update for: patient@example.com
✅ 2 Bautista order(s) synced via update for: patient@example.com
```

## ⚡ Performance Optimizations

### Fire-and-Forget Pattern
- Account updates are **awaited** (critical)
- Appointment/Order updates are **fire-and-forget** (non-blocking)
- This ensures fast response times while maintaining data consistency

### Selective Updates
Only modified fields are synced:
- If only contact number changes, only contact number is updated in orders
- If only name changes, only name fields are updated
- Profile picture doesn't sync to orders (not needed)

### Batch Processing
The `syncAllProfilePictures()` method processes in batches of 50 for optimal performance.

## 🔍 Use Cases

### 1. Patient Updates Their Profile
When a patient updates their profile through the frontend:
- Name change reflects in all appointments and orders
- Contact number change reflects in all orders

### 2. Staff Corrects Patient Information
When staff corrects patient demographic data:
- All historical orders show the corrected information
- Appointments show the corrected information

### 3. Data Migration
When migrating or cleaning up data:
```javascript
// Sync all patient data across all models
const result = await Patientdemographic.syncAllProfilePictures();
console.log(result);
// {
//   success: true,
//   message: "Synced 150 profile pictures...",
//   accountsSynced: 150,
//   totalProcessed: 150
// }
```

## 🎯 Benefits

1. **Data Consistency** - Single source of truth for patient information
2. **Automatic Updates** - No manual intervention required
3. **Historical Accuracy** - Order records stay current with patient info
4. **Performance** - Fire-and-forget pattern for non-critical updates
5. **Debugging** - Comprehensive logging for troubleshooting

## 🔐 Important Notes

### Email as Primary Key
- All syncing uses `patientemail` as the matching field
- Ensure email addresses are unique and correct

### Order Syncing Scope
Orders are synced when:
- ✅ Name fields change (`patientlastname`, `patientfirstname`, `patientmiddlename`)
- ✅ Contact number changes (`patientcontactnumber`)
- ❌ Profile picture changes (not needed in orders)

### Async Operation
- Order updates happen asynchronously
- Main operation completes quickly
- Sync happens in the background

## 📝 Testing

### Test Name Change:
```javascript
// Update name in demographic
await Patientdemographic.findOneAndUpdate(
  { patientemail: 'test@example.com' },
  { 
    patientlastname: 'TestLast',
    patientfirstname: 'TestFirst'
  }
);

// Verify orders are updated
const ambherOrders = await PatientOrderAmbher.find({ 
  patientemail: 'test@example.com' 
});
console.log(ambherOrders[0].patientlastname); // Should be 'TestLast'
```

### Test Contact Number Change:
```javascript
// Update contact number
await Patientdemographic.findOneAndUpdate(
  { patientemail: 'test@example.com' },
  { patientcontactnumber: '09999999999' }
);

// Verify orders are updated
const bautistaOrders = await PatientOrderBautista.find({ 
  patientemail: 'test@example.com' 
});
console.log(bautistaOrders[0].patientcontactnumber); // Should be '09999999999'
```

## 🚨 Error Handling

All sync operations include error handling:
```javascript
.catch((ambherError) => {
  console.error('❌ Error syncing Ambher orders:', ambherError);
});
```

Errors in order syncing **don't block** the main operation to ensure reliability.

## 📅 Implementation Date

**October 7, 2025** - Enhanced patient demographic middleware to include order syncing

---

**Status**: ✅ Complete and Production Ready
