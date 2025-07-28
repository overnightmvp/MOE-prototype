# Plunk Email Integration Setup Guide

## 🎯 Overview
Complete setup guide for integrating Plunk email automation with the 7-Day MVP Validation System.

## 📋 Required Environment Variables

### Netlify Environment Variables
Add these variables in your Netlify dashboard under **Site Settings → Environment Variables**:

```bash
# Required - Plunk API Authentication
PLUNK_API_KEY=your_plunk_api_key_here

# Optional - Email Sequence IDs (if using custom sequences)
PLUNK_VALIDATION_SERIES_ID=sequence_id_for_validation_series
PLUNK_NEWSLETTER_ID=sequence_id_for_newsletter
```

### How to Get Your Plunk API Key
1. Log into your [Plunk dashboard](https://app.useplunk.com)
2. Navigate to **Settings → API Keys**
3. Create a new API key with the following permissions:
   - **Contacts**: Create, Read, Update
   - **Campaigns**: Send
   - **Events**: Track
4. Copy the API key and add it to Netlify environment variables

## 📧 Email Sequence Configuration

### Default Sequence Types
The integration supports these sequence types:

1. **validation-series** (Default)
   - Welcome email with dashboard access
   - 5-day validation framework
   - Foundation, research, MVP definition, launch strategy

2. **newsletter** 
   - General newsletter subscription
   - Weekly insights and case studies

### Sequence ID Configuration
If you want to use custom sequence IDs in Plunk:

```javascript
// Update in netlify/functions/plunk-integration.js
function getSequenceId(sequenceType) {
  const sequences = {
    'validation-series': process.env.PLUNK_VALIDATION_SERIES_ID || 'default-validation',
    'newsletter': process.env.PLUNK_NEWSLETTER_ID || 'default-newsletter'
  };
  return sequences[sequenceType];
}
```

## 🚀 Email Template Integration

### Template Files Created
- `email-templates/01-welcome.html` - Welcome email
- `email-templates/02-foundation.html` - Day 2 validation mindset
- `email-templates/03-customer-research.html` - Day 4 customer interviews
- `email-templates/04-mvp-definition.html` - Day 6 MVP framework
- `email-templates/05-launch-strategy.html` - Day 7 go/no-go decision

### Template Variables
Each template supports these variables:
- `{{dashboard_url}}` - Link to user dashboard
- `{{support_email}}` - Support contact email
- `{{user_email}}` - User's email address
- `{{user_name}}` - User's name (if collected)

## 🔧 Frontend Integration

### Form Submission Flow
1. User enters email in landing page form
2. Frontend calls `/.netlify/functions/plunk-integration`
3. Netlify function adds contact to Plunk
4. Contact is enrolled in validation email sequence
5. User redirected to success page

### Frontend Implementation
```javascript
// Current implementation in index.html
async function handleEmailReveal(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const email = formData.get('email');
  const source = formData.get('source');
  
  try {
    const response = await fetch('/.netlify/functions/plunk-integration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        source: source || 'main_landing',
        sequence_type: 'validation-series'
      })
    });
    
    if (response.ok) {
      // Success - redirect to success page
      window.location.href = `./success.html?email=${encodeURIComponent(email)}&enrolled=true`;
    }
  } catch (error) {
    console.error('Error submitting to Plunk:', error);
    // Handle error gracefully
  }
}
```

### Error Handling
- API failures are tracked in Google Analytics
- User-friendly error messages displayed
- Graceful fallback to success page

## 📊 Analytics Integration

### Tracked Events
- `email_signup` - User submits email
- `email_sequence_enrolled` - Successfully enrolled in sequence
- `email_signup_error` - Integration failure

### Debug Information
All events include:
- Email source (main_landing, etc.)
- Sequence type (validation-series, newsletter)
- Error details (for failures)

## 🧪 Testing the Integration

### Local Testing
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Set up local environment: `netlify dev`
3. Test API endpoint: `curl -X POST http://localhost:8888/.netlify/functions/plunk-integration`

### Production Testing
1. Deploy to Netlify with environment variables set
2. Test email signup on live site
3. Verify contact appears in Plunk dashboard
4. Check email sequence enrollment

### Test Data
```json
{
  "email": "test@example.com",
  "source": "main_landing",
  "sequence_type": "validation-series"
}
```

## 🚨 Troubleshooting

### Common Issues

**401 Unauthorized**
- Check PLUNK_API_KEY is set correctly
- Verify API key has required permissions

**Contact Not Added**
- Check email format is valid
- Verify Plunk account has contact limits available

**Sequence Not Triggered**
- Check sequence ID exists in Plunk
- Verify sequence is active and published

### Debug Steps
1. Check Netlify function logs: `netlify logs --function=plunk-integration`
2. Verify environment variables: Netlify dashboard → Site Settings → Environment Variables
3. Test API key: Use Plunk API documentation to test manually
4. Check Google Analytics for error events

## 📈 Success Metrics

### Key Performance Indicators
- **Email Capture Rate**: Landing page visits → email signups
- **Sequence Enrollment Rate**: Email signups → successful Plunk enrollment (target: 95%+)
- **Email Open Rate**: Sequence emails opened (target: 35%+)
- **Click-through Rate**: Email links clicked (target: 15%+)

### Monitoring Dashboard
Track these metrics in:
- Google Analytics 4 events
- Plunk analytics dashboard
- Netlify function logs

## 🔄 Maintenance

### Weekly Tasks
- [ ] Check Plunk contact growth
- [ ] Review email open rates
- [ ] Monitor function error rates
- [ ] Test integration end-to-end

### Monthly Tasks
- [ ] Analyze email performance
- [ ] Update template content based on feedback
- [ ] Review and optimize sequences
- [ ] Check for Plunk API updates

---

## Quick Reference Commands

```bash
# Deploy with environment variables
netlify env:set PLUNK_API_KEY your_api_key_here

# Test function locally
netlify functions:invoke plunk-integration --payload '{"email":"test@example.com","source":"test"}'

# Check function logs
netlify logs --function=plunk-integration

# Deploy to production
netlify deploy --prod
```

For support, check the [Plunk API documentation](https://docs.useplunk.com) or contact the development team.