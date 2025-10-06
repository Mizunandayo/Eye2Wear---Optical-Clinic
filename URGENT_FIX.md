# URGENT FIX - Add Environment Variable to Render

## 🔴 THE PROBLEM
Chrome is installed during build but the cache directory `/opt/render/.cache/puppeteer/chrome` doesn't exist at runtime. This happens because Render might be clearing the cache between build and runtime.

## ✅ THE IMMEDIATE SOLUTION

### Add this environment variable to Render RIGHT NOW:

1. **Go to**: https://dashboard.render.com
2. **Click**: Your "eye2wear" service
3. **Click**: "Environment" in the left sidebar
4. **Click**: "Add Environment Variable"
5. **Add**:
   - **Key**: `PUPPETEER_EXECUTABLE_PATH`
   - **Value**: `/opt/render/.cache/puppeteer/chrome/linux-141.0.7390.54/chrome-linux64/chrome`
6. **Click**: "Save Changes"

This will force the code to use Strategy 1 (environment variable) which checks first before trying to scan directories.

---

## 🔍 WHY THIS WORKS

Your `pdf.controller.js` already has this code at the top of `findChrome()`:

```javascript
// Strategy 1: Check environment variable first
if (process.env.PUPPETEER_EXECUTABLE_PATH && existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
  console.log('✅ Found Chrome via PUPPETEER_EXECUTABLE_PATH:', process.env.PUPPETEER_EXECUTABLE_PATH);
  return process.env.PUPPETEER_EXECUTABLE_PATH;
}
```

By setting the environment variable, it will:
1. Skip all the directory scanning
2. Go straight to the exact Chrome path
3. Work immediately

---

## 📊 EXPECTED LOGS AFTER FIX

After adding the environment variable and redeploying, you should see:

```
🔍 Searching for Chrome executable...
✅ Found Chrome via PUPPETEER_EXECUTABLE_PATH: /opt/render/.cache/puppeteer/chrome/linux-141.0.7390.54/chrome-linux64/chrome
Using Chrome at: /opt/render/.cache/puppeteer/chrome/linux-141.0.7390.54/chrome-linux64/chrome
```

Instead of:
```
❌    Trying Puppeteer CLI...
❌ ⚠️  No Chrome executable found
```

---

## ⚠️ ALTERNATE PATH (If Chrome version changes)

If Render updates Chrome to a newer version, you might need to update the path. The pattern is:

```
/opt/render/.cache/puppeteer/chrome/linux-<VERSION>/chrome-linux64/chrome
```

To find the exact version:
1. Check your Render build logs for lines like:
   ```
   ✅ Chrome executable found at: /opt/render/.cache/puppeteer/chrome/linux-XXX.X.XXXX.XX/chrome-linux64/chrome
   ```
2. Copy that exact path
3. Update the environment variable

---

## 🚀 DO THIS NOW

1. Add the environment variable (steps above)
2. Wait for automatic redeploy (~30 seconds)
3. Test PDF export
4. Should work immediately! ✅

---

## 📝 ROOT CAUSE ANALYSIS

The real issue is that Render's free tier might be using **ephemeral storage** where the cache directory exists during build but gets cleared before runtime. By using an environment variable, we bypass the directory scanning and go straight to where we KNOW Chrome is installed during the build.

This is a common pattern for Render deployments with Puppeteer.
