# Plunk Integration Deployment Checklist

## 🚀 Pre-Deployment Checklist

### ✅ Code Implementation
- [x] **Frontend Integration**: Updated `index.html` handleEmailReveal() function to use Plunk API
- [x] **Netlify Function**: Created `netlify/functions/plunk-integration.js` 
- [x] **Success Page**: Updated `success.html` to handle enrollment confirmation
- [x] **Email Templates**: Created 5 email sequence templates with Neo-brutalist branding
- [x] **Documentation**: Updated setup guide in `docs/setup/plunk-integration.md`
- [x] **Test Script**: Created `test-plunk-integration.js` for end-to-end testing

### ⚙️ Environment Variables Required
**Set these in Netlify Dashboard → Site Settings → Environment Variables:**

```bash
# Required - Get from Plunk dashboard
PLUNK_API_KEY=pk_your_api_key_here

# Optional - If using custom sequences  
PLUNK_VALIDATION_SERIES_ID=your_sequence_id
PLUNK_NEWSLETTER_ID=your_newsletter_id
```

### 📧 Plunk Dashboard Setup
- [ ] **Create Plunk Account**: Sign up at https://app.useplunk.com
- [ ] **Generate API Key**: Settings → API Keys → Create new key
- [ ] **Set Permissions**: Contacts (Create, Read, Update), Campaigns (Send), Events (Track)
- [ ] **Create Email Sequences** (or use default handling):
  - Validation series sequence (5 emails)
  - Newsletter sequence (weekly insights)
- [ ] **Import Email Templates**: Upload the 5 HTML templates from `/email-templates/`
- [ ] **Test Email Delivery**: Send test emails to verify templates work

## 🧪 Testing Procedures

### 1. Local Testing (Optional)
```bash
# Install Netlify CLI if not already installed
npm install -g netlify-cli

# Start local development server
netlify dev

# Test the function
node test-plunk-integration.js --local
```

### 2. Production Testing
```bash
# Deploy to Netlify
git add .
git commit -m "feat: implement Plunk email integration"
git push origin main

# Wait for deployment to complete
# Test the integration
node test-plunk-integration.js
```

### 3. Manual Testing Steps
- [ ] **Email Capture**: Fill out the form on the landing page
- [ ] **Check Loading State**: Verify button shows "Starting Your Journey..."
- [ ] **Success Redirect**: Confirm redirect to success.html with enrolled=true
- [ ] **Success Page Content**: Verify success page shows enrollment confirmation
- [ ] **Plunk Dashboard**: Check that contact was added to Plunk
- [ ] **Email Sequence**: Verify contact was enrolled in validation series
- [ ] **Welcome Email**: Check if welcome email is received (may take a few minutes)

### 4. Error Testing
- [ ] **Invalid Email**: Test with malformed email address
- [ ] **Network Error**: Test behavior when Plunk API is unreachable
- [ ] **Missing API Key**: Test error handling when PLUNK_API_KEY is not set
- [ ] **Rate Limiting**: Test rapid submissions to verify rate limiting handling

## 📊 Monitoring & Analytics

### Google Analytics Events to Monitor
- `email_signup` - User submits email form
- `email_sequence_enrolled` - Successfully enrolled in Plunk sequence  
- `email_signup_error` - Integration failure
- `email_sequence_success` - Successful enrollment confirmation on success page

### Plunk Dashboard Metrics
- **Contact Growth**: Daily new contact additions
- **Sequence Performance**: Open rates, click rates for validation series
- **Delivery Rates**: Ensure >95% delivery success
- **API Usage**: Monitor API call volume and success rates

### Netlify Function Monitoring
```bash
# Check function logs
netlify logs --function=plunk-integration

# Monitor function performance
# Dashboard → Functions → plunk-integration → View logs
```

## 🚨 Rollback Procedures

### If Integration Fails
1. **Immediate Rollback**: Revert `index.html` to use Netlify Forms
2. **Update Environment**: Remove PLUNK_API_KEY to disable function
3. **User Communication**: Send email to recent signups explaining issue
4. **Fix and Redeploy**: Address issues and redeploy with proper testing

### Rollback Code (Emergency)
```javascript
// Replace handleEmailReveal() in index.html with this:
async function handleEmailReveal(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    
    // Fallback to Netlify Forms
    try {
        await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString()
        });
        window.location.href = `./success.html?email=${encodeURIComponent(email)}&source=main_landing`;
    } catch (error) {
        console.error('Error:', error);
        window.location.href = `./success.html?email=${encodeURIComponent(email)}&source=main_landing`;
    }
}
```

## 📈 Success Metrics (First Week)

### Target KPIs
- **Email Capture Rate**: >15% of landing page visitors
- **Plunk Enrollment Success**: >95% of email submissions
- **Email Delivery Rate**: >95% successful delivery
- **Open Rate**: >35% for welcome email
- **Error Rate**: <5% of all submissions

### Week 1 Monitoring
- [ ] **Day 1**: Monitor for critical errors, high bounce rates
- [ ] **Day 3**: Check email sequence performance, user feedback
- [ ] **Day 7**: Analyze full funnel performance, optimize as needed

## 🔧 Post-Deployment Optimization

### A/B Testing Opportunities
- Email subject lines for better open rates
- Welcome email content and CTAs
- Email timing and frequency
- Sequence branching based on user behavior

### Performance Improvements
- Implement email template personalization
- Add progressive profiling for better segmentation
- Set up behavior-triggered email sequences
- Integrate with other tools (CRM, analytics, etc.)

---

## ✅ Final Deployment Sign-off

**Deployer:** _________________ **Date:** _________

**QA Tested:** _________________ **Date:** _________

**Stakeholder Approval:** _________________ **Date:** _________

### Deployment Notes:
_____________________________________________________
_____________________________________________________
_____________________________________________________

### Issues Encountered:
_____________________________________________________
_____________________________________________________
_____________________________________________________

### Post-Deployment Actions Required:
_____________________________________________________
_____________________________________________________
_____________________________________________________