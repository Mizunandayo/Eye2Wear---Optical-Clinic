# Render.com Deployment Configuration for PDF Generation

## Required Environment Variables

Add these to your Render.com service:

### Option 1: Force Puppeteer to Use Installed Chrome
```
PUPPETEER_EXECUTABLE_PATH=/opt/render/.cache/puppeteer/chrome/linux-141.0.7390.54/chrome-linux64/chrome
```

**Note:** This path might change with Puppeteer updates. You can find the correct path by:
1. SSH into your Render instance (if available)
2. Run: `ls -la /opt/render/.cache/puppeteer/chrome/`
3. Use the path with the latest version number

### Option 2: Set Puppeteer Cache Directory
```
PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer
```

### Option 3: Skip Chromium Download (Use Chrome)
```
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
PUPPETEER_SKIP_DOWNLOAD=false
```

## Build Command Configuration

Make sure your Render build command is set to:

```bash
chmod +x render-build.sh && ./render-build.sh
```

OR simply:

```bash
npm install --legacy-peer-deps && npx puppeteer browsers install chrome && npm run build
```

## Alternative: Use render.yaml

Create a `render.yaml` file in your project root:

```yaml
services:
  - type: web
    name: eye2wear
    env: node
    region: oregon
    plan: free
    buildCommand: chmod +x render-build.sh && ./render-build.sh
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PUPPETEER_CACHE_DIR
        value: /opt/render/.cache/puppeteer
      - key: PUPPETEER_SKIP_CHROMIUM_DOWNLOAD
        value: true
```

## Troubleshooting

### If Chrome Still Not Found

1. **Check Build Logs**: Look for "Installing Chrome for Puppeteer..." message
   
2. **Manual Chrome Installation**: SSH into Render and run:
   ```bash
   npx puppeteer browsers install chrome
   ```

3. **Find Chrome Path**: Run this in Render shell:
   ```bash
   find /opt/render -name "chrome" -type f 2>/dev/null
   ```

4. **Set Explicit Path**: Add environment variable with the found path

### If Build Times Out

Increase build timeout in Render settings:
- Go to Settings → Advanced → Build Timeout
- Set to 15-20 minutes

### If Memory Issues Occur

- Upgrade to a paid plan with more RAM
- Or use a headless Chrome service like Browserless.io

## Expected Build Output

You should see these lines in your build logs:

```
📦 Installing Chrome for Puppeteer...
   This may take a few minutes...
✅ Chrome installed successfully!
   Cache directory: /opt/render/.cache/puppeteer
```

## Runtime Logs

When PDF generation works, you should see:

```
🔍 Searching for Chrome executable...
✅ Found Chrome at: /opt/render/.cache/puppeteer/chrome/linux-{version}/chrome-linux64/chrome
Using Chrome at: /opt/render/.cache/puppeteer/chrome/linux-{version}/chrome-linux64/chrome
```

## Performance Notes

- **First PDF**: 10-15 seconds (Chrome startup)
- **Subsequent PDFs**: 3-5 seconds
- **Memory Usage**: ~200-300MB per PDF generation
- **Concurrent Requests**: Limited by available RAM

## Security Considerations

The following Puppeteer flags are used for Render compatibility:
- `--no-sandbox` - Required on Render (no user namespaces)
- `--disable-setuid-sandbox` - Required on Render
- `--disable-dev-shm-usage` - Prevents shared memory issues
- `--disable-gpu` - Not needed in headless mode

These are safe in a containerized environment like Render.

## Cost Optimization

To reduce build times and costs:
1. Cache is persistent between deploys
2. Chrome only downloads once
3. Use `postinstall` hook to auto-install

## Support

If issues persist:
1. Check Render status page
2. Review build logs for specific errors
3. Contact Render support with error details
4. Check Puppeteer GitHub issues for known problems
