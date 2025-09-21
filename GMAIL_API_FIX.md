# Gmail API Fix for Eye2Wear Email Service

## Problem
The Gmail API is failing with `invalid_client` error when trying to send verification emails.

## Root Cause Analysis
The `invalid_client` error typically occurs due to:
1. ❌ **Deprecated OAuth redirect URI**: Was using `'urn:ietf:wg:oauth:2.0:oob'`
2. ❌ **Invalid/Expired refresh token**: The refresh token might be expired or invalid
3. ❌ **OAuth consent screen configuration**: Might need verification or republishing

## Fixes Applied ✅

### 1. Updated OAuth Configuration
- Changed redirect URI from deprecated `'urn:ietf:wg:oauth:2.0:oob'` to `null`
- This is appropriate for server-side applications using refresh tokens

### 2. Added Retry Logic
- Gmail API now retries failed requests with exponential backoff
- Better error handling and logging

### 3. Removed SMTP Fallback
- Since Render blocks SMTP, removed all SMTP fallback code
- Forces Gmail API usage exclusively

### 4. Enhanced Error Messages
- Better debugging information for OAuth failures
- Specific guidance on fixing configuration issues

## Current Status: Need New Refresh Token

Your current refresh token might be invalid. Here's how to generate a new one:

### Option 1: Quick Test (Recommended)
Deploy the current changes first and check if the OAuth issue is resolved with the new redirect URI configuration.

### Option 2: Generate New Refresh Token (If still failing)

1. **Go to Google Cloud Console OAuth Playground**:
   https://developers.google.com/oauthplayground/

2. **Configure the playground**:
   - Click the gear icon (⚙️) in the top right
   - Check "Use your own OAuth credentials"
   - Enter your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

3. **Authorize APIs**:
   - In the left sidebar, find "Gmail API v1"
   - Select: `https://www.googleapis.com/auth/gmail.send`
   - Click "Authorize APIs"

4. **Get the refresh token**:
   - Complete the OAuth flow
   - Click "Exchange authorization code for tokens"
   - Copy the `refresh_token` value

5. **Update Environment Variable**:
   ```
   GMAIL_REFRESH_TOKEN=your_new_refresh_token_here
   ```

## Testing the Fix

After deploying, you can test by:
1. Creating a new patient account
2. Check the logs for Gmail API success messages
3. Verify the verification email is received

## Expected Log Output (Success)
```
Gmail API service initialized successfully
Using Gmail API for verification email
Email sent successfully via Gmail API: [message_id]
```

## If Still Failing
If you still get `invalid_client` errors after these changes:
1. Verify your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
2. Check if your OAuth consent screen needs republishing
3. Generate a new refresh token using the steps above
4. Ensure your Google Cloud project has Gmail API enabled

## Files Modified
- ✅ `utils/gmailAPIService.js` - Fixed OAuth configuration and added retry logic
- ✅ `utils/emailServiceManager.js` - Removed SMTP fallback, enhanced error handling