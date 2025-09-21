# Email Service Configuration Fix

## Issue Analysis
The email verification is failing due to two main problems:

1. **Gmail API OAuth Issue**: The refresh token is invalid or the OAuth configuration has issues
2. **Nodemailer Import Error**: Fixed - was using `createTransporter` instead of `createTransport`

## Solution 1: Quick Fix - Use SMTP with App Password

### Step 1: Generate Gmail App Password
1. Go to your Google Account settings
2. Security → 2-Step Verification (must be enabled)
3. App passwords → Generate app password for "Mail"
4. Copy the 16-character app password

### Step 2: Update Environment Variables
Add this to your Render environment variables:
```
EMAIL_PASS=your-16-character-app-password
EMAIL_PROVIDER=smtp
```

### Step 3: Remove gmail-api provider temporarily
Change your environment variable:
```
EMAIL_PROVIDER=smtp
```

## Solution 2: Fix Gmail API (For later implementation)

The Gmail API is failing because:
1. The OAuth redirect URI `'urn:ietf:wg:oauth:2.0:oob'` is deprecated
2. The refresh token might be invalid
3. The OAuth consent screen configuration might need updates

### To fix Gmail API:
1. Update the OAuth redirect URI in Google Cloud Console
2. Generate a new refresh token
3. Update the gmailAPIService.js to use the new OAuth flow

## Files Modified
- ✅ `utils/emailService.js` - Fixed `createTransporter` → `createTransport`
- ✅ `utils/emailServiceManager.js` - Fixed parameter mismatch for SMTP fallback

## Next Steps
1. Implement Solution 1 (SMTP) for immediate fix
2. Test email verification flow
3. Later implement Solution 2 (Gmail API) for better scalability