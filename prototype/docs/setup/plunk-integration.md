# Plunk Email Integration Setup Guide

## Overview
This guide covers the complete setup of Plunk email automation for the 7-Day MVP Validation System, replacing ConvertKit with a more cost-effective and developer-friendly solution.

## Plunk Account Setup

### 1. Account Configuration
- **API Key:** `pk_1652d6b7abcca49fdb0486286e7613c061e34fc3b46c6a02`
- **Secret Key:** `sk_722305b4dffd7f31f8f96ae27934aebc9e2f5f483a5fd4f0`
- **Dashboard:** https://app.useplunk.com

### 2. Required Events Setup
Create these events in your Plunk dashboard:

```
lead-magnet-download - Triggered when someone downloads free checklist
customer-onboarding - Triggered after successful purchase
daily-progress - Triggered each day of 7-day journey
validation-completed - Triggered when customer finishes Day 7
community-welcome - Triggered when joining Discord community
payment-failed - Triggered on failed subscription payments
exit-survey - Triggered when subscription is cancelled
```

## Environment Variables

Add these to your `.env` file:
```bash
PLUNK_API_KEY=pk_1652d6b7abcca49fdb0486286e7613c061e34fc3b46c6a02
PLUNK_SECRET_KEY=sk_722305b4dffd7f31f8f96ae27934aebc9e2f5f483a5fd4f0
PLUNK_API_URL=https://api.useplunk.com/v1

# Event IDs
PLUNK_EVENT_LEAD_MAGNET=lead-magnet-download
PLUNK_EVENT_CUSTOMER_ONBOARD=customer-onboarding
PLUNK_EVENT_DAILY_PROGRESS=daily-progress
PLUNK_EVENT_COMPLETION=validation-completed
PLUNK_EVENT_COMMUNITY_WELCOME=community-welcome
```

## Email Templates Required

### 1. Lead Magnet Sequence
**Event:** `lead-magnet-download`

**Email 1 - Immediate Delivery:**
- Subject: "Your MVP Validation Checklist (+ why 90% of startups fail)"
- Content: Deliver checklist PDF + introduce Johnny's story
- CTA: "Ready for the complete system?"

**Email 2 - Day 2:**
- Subject: "The $50k mistake I made (and how you can avoid it)"
- Content: Personal failure story + validation importance
- CTA: "Get the 7-Day Validation System"

**Email 3 - Day 4:**
- Subject: "Last call: Stop building wrong things"
- Content: Urgency + social proof + clear value prop
- CTA: "Start validating today"

### 2. Customer Onboarding
**Event:** `customer-onboarding`

**Welcome Email:**
- Subject: "Welcome to the 7-Day MVP Validation System! 🚀"
- Content: Access instructions + what to expect + Discord invite
- CTA: "Access Day 1 Materials"

### 3. Daily Progress Emails
**Event:** `daily-progress`

**Template Variables:** `{{day}}`, `{{title}}`, `{{tasks}}`, `{{ai_prompt}}`

**Daily Structure:**
- Subject: "Day {{day}}: {{title}} - Your MVP Validation Journey"
- Content: Daily agenda + AI prompts + community check-in
- CTA: "Complete Day {{day}} Exercises"

### 4. Completion Email
**Event:** `validation-completed`

**Email:**
- Subject: "🎉 You did it! Your validation results are ready"
- Content: Congratulations + next steps + upsell opportunity
- CTA: "Book Implementation Coaching"

## Integration Points

### 1. Landing Page Email Capture
```javascript
// Add to landing page
async function handleEmailSignup(email) {
  try {
    const response = await fetch('/api/plunk/lead-magnet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: 'landing_page' })
    });
    
    if (response.ok) {
      showSuccess("Checklist sent! Check your email.");
    }
  } catch (error) {
    showError("Something went wrong. Please try again.");
  }
}
```

### 2. Purchase Flow Integration
```javascript
// In Stripe webhook handler
async function handleCheckoutCompleted(session) {
  const plunk = new PlunkService();
  await plunk.sendWelcomeEmail(
    session.customer_email, 
    session.metadata.productType
  );
}
```

### 3. Daily Email Automation
```javascript
// Scheduled function (run daily at 9 AM customer timezone)
async function sendDailyEmails() {
  const customers = await getActiveCustomers();
  
  for (const customer of customers) {
    const currentDay = calculateCurrentDay(customer.startDate);
    if (currentDay <= 7) {
      await plunk.sendDailyProgressEmail(
        customer.email, 
        currentDay, 
        getDayContent(currentDay)
      );
    }
  }
}
```

## API Usage Examples

### Add Contact
```javascript
const plunk = new PlunkService();
await plunk.addContact('user@example.com', {
  product_type: 'core',
  signup_date: new Date().toISOString(),
  customer_status: 'active'
});
```

### Trigger Event
```javascript
await plunk.triggerEvent('user@example.com', 'daily-progress', {
  day: 3,
  completion_rate: 85
});
```

### Update Contact Properties
```javascript
await plunk.updateContact('user@example.com', {
  current_day: 5,
  last_activity: new Date().toISOString(),
  engagement_score: 92
});
```

## Error Handling

### Retry Logic
```javascript
async function sendWithRetry(emailFunction, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await emailFunction();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(1000 * Math.pow(2, i)); // Exponential backoff
    }
  }
}
```

### Fallback System
```javascript
async function sendEmailWithFallback(email, content) {
  try {
    await plunk.sendEmail(email, content);
  } catch (error) {
    console.error('Plunk failed, using SMTP fallback:', error);
    await sendViaSMTP(email, content);
  }
}
```

## Monitoring and Analytics

### Track Key Metrics
- Email delivery rate (target: >98%)
- Open rate (target: >25%)
- Click-through rate (target: >5%)
- Conversion rate (email to purchase: target: >2%)

### Plunk Dashboard Monitoring
- Daily email volume
- Event trigger success rate
- Contact growth trends
- Template performance

## Cost Optimization

### Current Plan
- **Starter:** $19/month (up to 2,000 emails)
- **Growth:** $49/month (up to 10,000 emails)
- **Scale:** $99/month (up to 50,000 emails)

### Usage Estimates
- **100 customers/month:** ~1,500 emails/month
- **500 customers/month:** ~7,500 emails/month
- **1,000 customers/month:** ~15,000 emails/month

## Testing Checklist

### Pre-Launch Testing
- [ ] Lead magnet email delivery
- [ ] Welcome email trigger on purchase
- [ ] Daily email sequence (test with 7-day simulation)
- [ ] Community welcome email
- [ ] Payment failure notifications
- [ ] Unsubscribe functionality

### Performance Testing
- [ ] API response times (<500ms)
- [ ] Bulk contact upload (100+ contacts)
- [ ] Event triggering under load
- [ ] Error handling and retries

## Migration from ConvertKit

### Data Export
1. Export all contacts from ConvertKit
2. Export email performance data
3. Export automation sequences

### Data Import
1. Bulk upload contacts to Plunk
2. Recreate automation sequences as Plunk events
3. Set up equivalent triggers and conditions

### Testing Migration
1. Run parallel systems for 1 week
2. Compare delivery and engagement rates
3. Monitor for any missing functionality
4. Gradually shift traffic to Plunk

## Security Considerations

### API Key Management
- Store keys in environment variables only
- Rotate keys quarterly
- Monitor API usage for anomalies
- Implement rate limiting

### Data Protection
- Encrypt contact data at rest
- Implement GDPR-compliant unsubscribe
- Regular data cleanup (inactive contacts)
- Audit trail for all email sends

## Troubleshooting

### Common Issues
1. **Events not triggering:** Check event ID spelling and API credentials
2. **Low delivery rates:** Verify domain authentication
3. **Template errors:** Validate all variable substitutions
4. **Rate limiting:** Implement exponential backoff

### Debug Mode
```javascript
// Enable detailed logging
const plunk = new PlunkService({ debug: true });
```

This integration provides a robust, cost-effective email automation system that scales with the 7-Day MVP Validation System's growth.