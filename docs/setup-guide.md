# 7-Day MVP Validation System - Setup Guide

## Quick Start (5 Minutes)

### 1. Download & Deploy
```bash
git clone https://github.com/your-repo/overnight-mvp
cd overnight-mvp
```

### 2. Configure Analytics
- **GA4**: Replace `G-L99CMW68TS` with your GA4 property ID
- **Hotjar**: Replace `6476354` with your Hotjar site ID

### 3. Deploy to Netlify
```bash
# Option 1: Drag & drop prototype/frontend/ folder to Netlify
# Option 2: Connect GitHub repo for auto-deployment
```

### 4. Update Payment Links
Replace all instances of `https://polar.sh/overnightmvp/products/7-day-mvp-validation-system` with your payment processor URL.

## Complete Customization Guide

### Core Configuration Files

#### 1. Landing Page (`/index.html`)
**Key Elements to Customize:**
```html
<!-- Hero Section -->
<h1>Stop Building Wrong Things.<br>Start Validating Smart. 🚀</h1>
<p class="subtitle">Your value proposition here</p>

<!-- Pricing -->
<div class="price">$497</div> <!-- Your price -->

<!-- Payment Link -->
<a href="YOUR_PAYMENT_URL" class="btn btn-primary">
    Get 7-Day Validation System - $497
</a>
```

#### 2. Success Page (`/pages/success.html`)
**Update Redirect URLs:**
```javascript
// Calendly booking link
window.open('https://calendly.com/toshioj/30min', '_blank');

// Dashboard access
dashboardLink.href = `/pages/sprint0-onboarding.html?email=${email}`;
```

#### 3. Sprint Content (`/pages/sprint0-7-onboarding.html`)
**Customize for Your Industry:**
- Update step titles and descriptions
- Modify time estimates
- Replace example content
- Adjust checklist items

### Analytics & Tracking

#### Google Analytics 4
**Files to Update:**
- `/index.html`
- `/pages/success.html`
- All sprint onboarding pages

```html
<!-- Replace this property ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA4_ID"></script>
<script>
    gtag('config', 'YOUR_GA4_ID');
</script>
```

#### Hotjar Tracking
**Update Site ID:**
```javascript
// Replace hjid value
h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6};
```

### Payment Integration Options

#### Option 1: Polar.sh (Current)
- Create account at polar.sh
- Set up product
- Replace URLs in all files

#### Option 2: Stripe Integration
- Use existing `/prototype/frontend/components/StripeCheckout.js`
- Update success page redirects
- Configure webhook handling

#### Option 3: Gumroad/Other
- Replace payment URLs
- Update success page logic
- Modify email capture flow

### Email System Configuration

#### Current: Manual Email Capture
- Emails saved to success page parameters
- No automated sequences configured

#### Upgrade Options:
1. **Plunk Integration** (prepared)
   - Use `/prototype/backend/services/plunk.js`
   - Configure API keys
   - Set up email sequences

2. **Other Email Services**
   - ConvertKit, Mailchimp, etc.
   - Update success page to call your API
   - Modify email capture flow

### Content Customization

#### 1. Sprint Themes
Replace industry-specific content:
- **Sprint 1**: Landing page → Your core product
- **Sprint 2**: Customer portal → Your user system  
- **Sprint 3**: AI integration → Your key differentiator
- **Sprint 4**: Content creation → Your value delivery
- **Sprint 5**: Community → Your engagement strategy
- **Sprint 6**: Analytics → Your optimization approach
- **Sprint 7**: Testing → Your launch strategy

#### 2. Visual Design
**CSS Variables (in each HTML file):**
```css
:root {
    --primary: #6366f1;     /* Your brand primary color */
    --secondary: #06b6d4;   /* Your brand secondary color */
    --accent: #f59e0b;      /* Your accent color */
    --success: #10b981;     /* Success state color */
}
```

#### 3. Navigation & URLs
**Current Structure:**
- `/` - Landing page
- `/pages/success.html` - Payment success
- `/pages/sprint0-onboarding.html` - Setup guide
- `/pages/sprint1-onboarding.html` - Sprint 1
- etc.

**Recommended Clean URLs:**
- `/` - Landing page
- `/success/` - Payment success  
- `/setup/` - Setup guide
- `/sprint1/` - Sprint 1
- etc.

### Advanced Customization

#### 1. Progress Tracking
**Local Storage Keys:**
- `sprint0-progress` to `sprint7-progress`
- JSON format with completion states
- Server-side sync available

#### 2. User Authentication
**Current**: Email parameter passing
**Upgrade**: Full user system in `/prototype/backend/`

#### 3. AI Integration
**Placeholder**: Claude API integration prepared
**Customize**: Replace with your AI provider
**Files**: Sprint 3 onboarding content

## Deployment Options

### Option 1: Static Hosting (Recommended)
- **Netlify**: Drag & drop deployment
- **Vercel**: GitHub integration
- **GitHub Pages**: Free hosting
- **Cloudflare Pages**: Fast global CDN

### Option 2: Full-Stack Deployment
- **Netlify Functions**: Serverless backend
- **Vercel Functions**: API routes
- **Railway/Render**: Full backend deployment

### Option 3: WordPress Integration
- Upload HTML files as custom pages
- Embed forms and tracking codes
- Use existing payment systems

## Performance Optimization

### Load Time Optimization
- **CSS**: Inline critical styles
- **Images**: Optimize and use WebP
- **JavaScript**: Minimize inline scripts
- **Fonts**: Use system fonts or preload

### SEO Configuration
```html
<!-- Update meta tags -->
<title>Your Product Name | Your Value Proposition</title>
<meta name="description" content="Your SEO description">
<meta property="og:title" content="Your Social Media Title">
```

## Support & Maintenance

### Regular Updates Needed
- **Analytics**: Monitor conversion rates
- **Content**: Update based on user feedback  
- **Pricing**: A/B test different price points
- **Copy**: Optimize based on performance data

### Common Issues
1. **Payment Links**: Ensure all URLs are updated
2. **Analytics**: Verify tracking codes work
3. **Email Flow**: Test complete user journey
4. **Mobile**: Check responsive design
5. **Performance**: Monitor page load speeds

### Backup Strategy
- **Git Repository**: Version control all changes
- **Content Backup**: Export all custom content
- **Analytics Data**: Regular data exports
- **User Data**: Secure customer information

This setup guide provides everything needed to customize and deploy your own MVP validation system. Focus on the Quick Start section for immediate deployment, then gradually implement advanced features as needed.