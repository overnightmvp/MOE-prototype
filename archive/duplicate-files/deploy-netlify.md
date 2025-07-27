# Netlify Deployment Guide

## Quick Deploy Options

### Option 1: GitHub Integration (Recommended)
1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect GitHub account
   - Select repository: `overnightmvp/MOE-prototype`

2. **Build Settings**
   ```
   Base directory: prototype
   Build command: npm install && npm run build
   Publish directory: prototype/frontend
   ```

3. **Environment Variables**
   Add these in Netlify dashboard under "Site settings" > "Environment variables":
   ```
   NODE_VERSION=18
   NPM_VERSION=9
   BASE_URL=https://your-site-name.netlify.app
   ```

### Option 2: Netlify CLI (Manual)
1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy from project root**
   ```bash
   cd /Users/toshioj/Projects/overnight-mvp
   netlify deploy --dir=prototype/frontend --prod
   ```

### Option 3: Drag & Drop
1. Build the project locally:
   ```bash
   cd prototype
   npm install
   npm run build
   ```

2. Drag the `prototype/frontend` folder to Netlify's deploy page

## Configuration Files

### netlify.toml
Located at project root - handles redirects, headers, and build settings.

### _redirects
Located in `prototype/frontend/_redirects` - handles URL routing.

## Post-Deployment Setup

### 1. Custom Domain (Optional)
- Go to Site settings > Domain management
- Add your custom domain
- Configure DNS

### 2. Form Handling
- Enable Netlify Forms in Site settings
- Forms will automatically work for email capture

### 3. Analytics
- Enable Netlify Analytics for traffic insights
- Integrate with Google Analytics using your GA4 ID

### 4. Environment Variables
Add production environment variables:
```
BASE_URL=https://your-domain.com
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
DOWNLOAD_TOKEN_SECRET=your-production-secret
```

## Verification Checklist

After deployment, verify:
- [ ] Landing page loads at root URL
- [ ] Sprint 0 checklist page accessible
- [ ] Onboarding page loads with progress tracking
- [ ] Email capture forms work
- [ ] File downloads function
- [ ] Redirects work correctly
- [ ] Mobile responsiveness
- [ ] Analytics tracking

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify package.json dependencies
- Check build logs in Netlify dashboard

### 404 Errors
- Verify _redirects file is in correct location
- Check netlify.toml redirect rules
- Ensure all referenced files exist

### Email Forms Not Working
- Verify form has `data-netlify="true"` attribute
- Check Netlify Forms dashboard
- Test with different email addresses

### Performance Issues
- Enable asset optimization in Netlify
- Check Core Web Vitals in dashboard
- Optimize images and CSS

## Expected URLs After Deployment

```
https://your-site.netlify.app/                    → Landing page
https://your-site.netlify.app/get-started         → Sprint 0 checklist
https://your-site.netlify.app/onboarding          → Interactive guide
https://your-site.netlify.app/setup               → Interactive guide
https://your-site.netlify.app/checklist           → Sprint 0 checklist
```

## Support

- **Netlify Docs**: https://docs.netlify.com
- **Build Logs**: Available in Netlify dashboard
- **Community**: https://community.netlify.com

---

**Ready to deploy!** 🚀