# Missing Environment Variables for Render

Add these to your Render.com Environment Variables:

```
PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

## How to Add:

1. Go to https://dashboard.render.com
2. Select your service (eye2wear)
3. Click "Environment" in the left sidebar
4. Click "Add Environment Variable"
5. Add both variables above
6. Click "Save Changes"
7. Redeploy your service

## Why These Are Needed:

- `PUPPETEER_CACHE_DIR` - Tells Puppeteer where to store/find Chrome
- `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` - Prevents downloading Chromium (we want Chrome)

After adding these, redeploy and check the logs for:
```
📦 Chrome executable not found, proceeding with installation...
📦 Installing Chrome for Puppeteer...
✅ Chrome installed successfully!
```
