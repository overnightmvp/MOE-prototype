# 🚀 Deployment Guide - 7-Day MVP Validation System

## Quick Deployment to Netlify

### Option 1: Automated Script (Recommended)
```bash
# From project root
./deploy.sh
```

### Option 2: Manual Netlify CLI
```bash
# Login to Netlify
netlify login

# Deploy from project root
netlify deploy --prod --dir=prototype/frontend
```

### Option 3: GitHub Integration
1. Push code to GitHub (already done ✅)
2. Connect repository in Netlify dashboard
3. Configure build settings (see below)

## Build Configuration

### Netlify Build Settings
```
Base directory: prototype
Build command: npm install && npm run build
Publish directory: prototype/frontend
```

### Environment Variables (Required)
Set these in Netlify dashboard under "Site settings" > "Environment variables":

```bash
NODE_VERSION=18
NPM_VERSION=9
BASE_URL=https://your-site-name.netlify.app
```

### Optional Environment Variables
```bash
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
DOWNLOAD_TOKEN_SECRET=your-production-secret
```

## File Structure for Deployment

```
prototype/frontend/                 # Deploy directory
├── index.html                     # Root redirect
├── _redirects                      # Netlify redirects
├── pages/
│   ├── index.html                 # Main landing page
│   ├── sprint0-checklist.html     # Email capture
│   ├── sprint0-onboarding.html    # Interactive guide
│   └── success.html               # Post-purchase
├── assets/
│   ├── mvp-validation-checklist.md
│   └── sprint0-setup-checklist.md
├── components/
│   └── StripeCheckout.js
└── email-templates/
    └── sprint0-checklist-delivery.html
```

## Post-Deployment Checklist

### ✅ Basic Functionality
- [ ] Root URL loads and redirects properly
- [ ] Landing page displays correctly
- [ ] Sprint 0 checklist page accessible
- [ ] Onboarding page loads with progress tracking
- [ ] All redirects work (/get-started, /onboarding, etc.)

### ✅ User Experience
- [ ] Email capture forms submit successfully
- [ ] Progress tracking saves in localStorage
- [ ] Mobile responsiveness works
- [ ] All images and assets load
- [ ] Page load speed is acceptable (<3 seconds)

### ✅ Analytics & Tracking
- [ ] Google Analytics tracking code loads
- [ ] Form submission events fire
- [ ] Page view tracking works
- [ ] Custom events for onboarding steps

### ✅ SEO & Performance
- [ ] Meta tags and descriptions set
- [ ] Open Graph images work
- [ ] Core Web Vitals scores are good
- [ ] SSL certificate active

## ✅ Live URLs (Deployment Complete!)

**🚀 LIVE SITE:** https://overnightmvp.netlify.app

```
https://overnightmvp.netlify.app/pages/index.html          → Main landing page
https://overnightmvp.netlify.app/get-started               → Sprint 0 checklist
https://overnightmvp.netlify.app/onboarding                → Interactive guide
https://overnightmvp.netlify.app/setup                     → Interactive guide (alias)
https://overnightmvp.netlify.app/checklist                 → Sprint 0 checklist (alias)
https://overnightmvp.netlify.app/validation-guide          → Checklist download
```

**Analytics:** Google Analytics 4 (G-L99CMW68TS) tracking active

## Configuration Files

### netlify.toml (Root)
Handles build settings, redirects, headers, and security.

### _redirects (Frontend)
Simple redirect rules for pretty URLs.

### package.json (Prototype)
Build scripts and dependencies.

## Troubleshooting

### Build Fails
```bash
# Common issues:
1. Node version mismatch → Set NODE_VERSION=18 in Netlify
2. Missing dependencies → Check package.json
3. Build command fails → Test locally first
```

### 404 Errors
```bash
# Check:
1. _redirects file is in prototype/frontend/
2. netlify.toml is in project root
3. All file paths are correct
```

### Forms Not Working
```bash
# Ensure:
1. Form has data-netlify="true" attribute
2. Netlify Forms are enabled in dashboard
3. Form action points to correct endpoint
```

## Advanced Configuration

### Custom Domain Setup
1. Purchase domain through your registrar
2. Add custom domain in Netlify dashboard
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

### Performance Optimization
1. Enable asset optimization in Netlify
2. Configure CDN caching headers
3. Optimize images and CSS
4. Set up analytics monitoring

### Security Headers
All security headers are configured in netlify.toml:
- X-Frame-Options
- X-XSS-Protection  
- X-Content-Type-Options
- Strict-Transport-Security

## Monitoring & Analytics

### Built-in Netlify Analytics
- Site traffic and performance
- Top pages and referrers
- Bandwidth usage
- Form submissions

### Google Analytics 4
- Custom event tracking
- Conversion funnels
- User behavior analysis
- Goal completion tracking

### Performance Monitoring
- Core Web Vitals
- Page load times
- Error rate monitoring
- Uptime monitoring

## Support Resources

- **Netlify Docs**: https://docs.netlify.com
- **Deployment Logs**: Available in Netlify dashboard
- **Community**: https://community.netlify.com
- **Status Page**: https://netlifystatus.com

## Emergency Procedures

### Rollback Deployment
```bash
# Via CLI
netlify rollback

# Via Dashboard
Site overview → Deploys → Click previous deploy → Publish
```

### Quick Fixes
```bash
# Hot fix deployment
netlify deploy --prod --dir=prototype/frontend --message="Hotfix: description"
```

---

**🎉 Your 7-Day MVP Validation System is ready for the world!**

Test everything thoroughly before announcing your launch. The system is production-ready and scalable.