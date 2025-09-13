# Patient Profile Picture Synchronization

## Overview
This feature ensures that the `patientprofilepicture` field in the `patientaccount.js` model stays synchronized with the `patientprofilepicture` field in the `patientdemographic.js` model.

## How It Works

### Automatic Synchronization
The synchronization happens automatically through Mongoose middleware hooks:

1. **On Save**: When a new demographic record is created or an existing one is updated, the middleware checks if the `patientprofilepicture` field was modified.

2. **On Update**: When using `findOneAndUpdate` operations, the middleware automatically syncs the profile picture to the corresponding patient account.

### Middleware Implementation
```javascript
// Post-save middleware
PatientdemographicSchema.post('save', async function(doc) {
  if (this.isModified && this.isModified('patientprofilepicture')) {
    await Patientaccount.findOneAndUpdate(
      { patientemail: doc.patientemail },
      { patientprofilepicture: doc.patientprofilepicture }
    );
  }
});

// Post-update middleware
PatientdemographicSchema.post('findOneAndUpdate', async function(doc) {
  if (doc && this.getUpdate()?.patientprofilepicture) {
    await Patientaccount.findOneAndUpdate(
      { patientemail: doc.patientemail },
      { patientprofilepicture: this.getUpdate().patientprofilepicture }
    );
  }
});
```

## Manual Synchronization

### Single Patient Sync
To manually sync a specific patient's profile picture:

**API Endpoint**: `POST /api/patientdemographics/sync-profile/:patientemail`

**Example**:
```javascript
const result = await Patientdemographic.syncProfilePicture('patient@example.com');
```

### Bulk Sync (All Patients)
To sync all patients' profile pictures (useful for data migration):

**API Endpoint**: `POST /api/patientdemographics/sync-all-profiles`

**Example**:
```javascript
const result = await Patientdemographic.syncAllProfilePictures();
```

## Usage Examples

### Updating Profile Picture in Demographics
```javascript
// This will automatically sync to the account model
const updatedDemographic = await Patientdemographic.findOneAndUpdate(
  { patientemail: 'patient@example.com' },
  { patientprofilepicture: 'new-profile-picture.jpg' },
  { new: true }
);
```

### Manual Sync via API
```javascript
// Sync specific patient
fetch('/api/patientdemographics/sync-profile/patient@example.com', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Sync all patients
fetch('/api/patientdemographics/sync-all-profiles', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## Benefits

1. **Data Consistency**: Ensures both models always have the same profile picture.
2. **Automatic Updates**: No manual intervention required for most operations.
3. **Migration Support**: Bulk sync functionality for existing data.
4. **Error Handling**: Graceful error handling with logging.
5. **Performance**: Efficient updates using `findOneAndUpdate`.

## Authentication
The manual sync endpoints require authentication. Users must be logged in as:
- Staff
- Owner
- Admin
- Patient (for their own records)

## Error Handling
All sync operations include proper error handling and logging. If a sync fails, it will:
1. Log the error to the console
2. Continue with the original operation
3. Return appropriate error messages via the API

## Testing
Use the provided test script (`test-profile-sync.js`) to verify the synchronization is working correctly:

```bash
node test-profile-sync.js
```

## Notes
- The synchronization is based on the `patientemail` field as the common identifier.
- Profile picture changes in the `patientaccount.js` model do NOT automatically sync to `patientdemographic.js` (one-way sync from demographic to account).
- For two-way synchronization, additional middleware would need to be added to the `patientaccount.js` model.