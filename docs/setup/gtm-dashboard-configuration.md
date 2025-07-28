# GTM Dashboard Configuration Guide
## 🎯 Complete Setup for Container GTM-57CDVXRW

### ✅ **Phase 1 Complete: GTM Code Implementation**
- ✅ GTM container code added to all 10 HTML files
- ✅ Scripts placed high in `<head>` per Google specifications
- ✅ Noscript tags added immediately after `<body>` tags
- ✅ Existing GA4 and Hotjar tracking preserved

---

## 🚀 **Phase 2: GTM Dashboard Configuration**

### **Step 1: Create GA4 Configuration Tag**

#### **Tag Settings:**
```
Tag Type: Google Analytics: GA4 Configuration
Tag Name: GA4 - Base Configuration
Measurement ID: G-L99CMW68TS

Configuration Settings:
├── Enhanced Measurement: Enable all
├── Send Page Views: Automatically
├── Custom Parameters:
│   ├── user_email: {{Email Variable}}
│   ├── current_sprint: {{Sprint Number}}  
│   ├── journey_stage: {{Journey Stage}}
│   └── session_source: {{Page Referrer}}

Trigger: All Pages
```

#### **Advanced Settings:**
```
Tag Firing Options: Once per page
Tag Sequencing: Fire before all other GA4 tags
Custom Dimensions:
├── user_email (Text)
├── current_sprint (Number)
├── journey_stage (Text)
└── page_type (Text)
```

---

### **Step 2: Create Custom Variables**

#### **Variable 1: Email Variable**
```javascript
Variable Type: JavaScript Variable
Variable Name: Email Variable

JavaScript Code:
function() {
  // Check URL parameters first
  const urlParams = new URLSearchParams(window.location.search);
  const emailFromUrl = urlParams.get('email');
  if (emailFromUrl) return emailFromUrl;
  
  // Check localStorage
  const emailFromStorage = localStorage.getItem('user_email');
  if (emailFromStorage) return emailFromStorage;
  
  // Check for email in forms
  const emailInput = document.querySelector('input[name="email"], input[type="email"]');
  if (emailInput && emailInput.value) return emailInput.value;
  
  return 'anonymous';
}
```

#### **Variable 2: Sprint Number**
```javascript
Variable Type: JavaScript Variable
Variable Name: Sprint Number

JavaScript Code:
function() {
  const path = window.location.pathname;
  const match = path.match(/sprint-(\d+)/);
  if (match) return parseInt(match[1]);
  
  // Special cases
  if (path.includes('index.html') || path === '/') return -1; // Landing page
  if (path.includes('success.html')) return 0; // Success page
  
  return null;
}
```

#### **Variable 3: Journey Stage**
```javascript
Variable Type: Lookup Table
Variable Name: Journey Stage
Input Variable: {{Page Path}}

Lookup Table:
Input                   | Output
/index.html            | awareness
/                      | awareness  
/success.html          | conversion
/sprint-0.html         | onboarding
/sprint-1.html         | foundation
/sprint-2.html         | development
/sprint-3.html         | discovery
/sprint-4.html         | content
/sprint-5.html         | community
/sprint-6.html         | analytics
/sprint-7.html         | launch

Default Value: unknown
```

#### **Variable 4: Page Type**
```javascript
Variable Type: Lookup Table
Variable Name: Page Type
Input Variable: {{Page Path}}

Lookup Table:
Input                   | Output
/index.html            | landing
/                      | landing
/success.html          | success
/sprint-0.html         | sprint
/sprint-1.html         | sprint
/sprint-2.html         | sprint
/sprint-3.html         | sprint
/sprint-4.html         | sprint
/sprint-5.html         | sprint
/sprint-6.html         | sprint
/sprint-7.html         | sprint

Default Value: other
```

---

### **Step 3: Create Event Triggers**

#### **Trigger 1: Email Signup Success**
```
Trigger Type: Custom Event
Event Name: email_signup
Trigger Name: Email Signup Success

Fire On: Some Custom Events
Conditions:
├── Event Category equals "Lead Generation"
└── Event Label equals "Email Reveal Form"
```

#### **Trigger 2: Sprint Progress**
```
Trigger Type: Custom Event
Event Name Regex: sprint[0-7]_(step_complete|onboarding_start)
Trigger Name: Sprint Progress Events

Fire On: Some Custom Events
Conditions:
├── Event Category equals "Sprint Progress" OR "Onboarding"
└── Event Name matches RegEx: sprint[0-7]_(step_complete|onboarding_start)
```

#### **Trigger 3: Purchase/Conversion**
```
Trigger Type: Custom Event
Event Name: purchase
Trigger Name: Purchase Success

Fire On: Some Custom Events
Conditions:
├── Event Category equals "Ecommerce"
└── Event Name equals "purchase"
```

#### **Trigger 4: High Intent Actions**
```
Trigger Type: Custom Event
Event Name Regex: (purchase_intent_final|calendly_click|cta_click)
Trigger Name: High Intent Actions

Fire On: Some Custom Events
Conditions:
├── Event Category equals "Conversion" OR "Upsell"
└── Event Name matches RegEx: (purchase_intent_final|calendly_click|cta_click)
```

---

### **Step 4: Create Conversion Events**

#### **Event 1: Email Capture Conversion**
```
Tag Type: Google Analytics: GA4 Event
Tag Name: GA4 - Email Signup
Event Name: email_capture

Event Parameters:
├── email: {{Email Variable}}
├── source: {{Referrer}}
├── page_type: {{Page Type}}
├── journey_stage: {{Journey Stage}}
└── value: 10 (lead value)

Trigger: Email Signup Success
```

#### **Event 2: Sprint Engagement**
```
Tag Type: Google Analytics: GA4 Event
Tag Name: GA4 - Sprint Progress
Event Name: sprint_engagement

Event Parameters:
├── sprint_number: {{Sprint Number}}
├── action_type: {{Event Action}}
├── user_email: {{Email Variable}}
├── journey_stage: {{Journey Stage}}
└── engagement_value: 25

Trigger: Sprint Progress Events
```

#### **Event 3: Purchase Conversion**
```
Tag Type: Google Analytics: GA4 Event
Tag Name: GA4 - Purchase
Event Name: purchase_complete

Event Parameters:
├── transaction_id: {{Transaction ID}}
├── value: 497
├── currency: USD
├── item_name: "7-Day MVP Validation System"
├── user_email: {{Email Variable}}
└── conversion_source: {{Journey Stage}}

Trigger: Purchase Success
```

#### **Event 4: High Intent Tracking**
```
Tag Type: Google Analytics: GA4 Event
Tag Name: GA4 - Intent Signals
Event Name: high_intent_action

Event Parameters:
├── intent_type: {{Event Label}}
├── page_location: {{Page URL}}
├── journey_stage: {{Journey Stage}}
├── user_email: {{Email Variable}}
└── intent_value: 50

Trigger: High Intent Actions
```

---

### **Step 5: Enhanced Ecommerce Setup**

#### **Purchase Event Enhancement**
```
Tag Type: Google Analytics: GA4 Event
Tag Name: GA4 - Enhanced Ecommerce
Event Name: purchase

Ecommerce Data:
├── transaction_id: {{Transaction ID}}
├── value: 497.00
├── currency: USD
├── items: [
│   {
│     item_id: "mvp-validation-system",
│     item_name: "7-Day MVP Validation System",  
│     category: "Digital Course",
│     quantity: 1,
│     price: 497.00
│   }
│ ]

Additional Parameters:
├── user_email: {{Email Variable}}
├── acquisition_source: {{Journey Stage}}
└── customer_lifetime_stage: "new"

Trigger: Purchase Success
```

---

### **Step 6: Set Up Conversion Goals**

#### **GA4 Conversion Events to Mark:**
```
In GA4 Admin → Events → Mark as Conversions:

Primary Conversions:
✅ email_capture (Micro-conversion)
✅ sprint_engagement (Mid-funnel)  
✅ purchase_complete (Macro-conversion)

Secondary Conversions:
✅ high_intent_action (Intent signals)
✅ sprint7_step_complete (Journey completion)
```

---

### **Step 7: Create Custom Audiences**

#### **Audience 1: High Intent Users**
```
Audience Name: High Intent Prospects
Conditions:
├── email_capture event in last 7 days
├── AND high_intent_action event in last 7 days
├── AND sprint_engagement event count ≥ 3

Membership Duration: 30 days
Description: Users showing strong purchase signals
```

#### **Audience 2: Sprint Completers**
```
Audience Name: Sprint Completers
Conditions:
├── sprint_engagement event in last 14 days
├── AND sprint_number parameter ≥ 3
├── AND journey_stage contains "launch" OR "community"

Membership Duration: 60 days
Description: Users progressing through sprint system
```

#### **Audience 3: Conversion-Ready**
```
Audience Name: Conversion Ready
Conditions:
├── email_capture event exists
├── AND high_intent_action event count ≥ 2
├── AND page_view count ≥ 5
├── AND session_duration ≥ 300 seconds

Membership Duration: 15 days
Description: Primed for purchase conversion
```

---

### **Step 8: Debug and Test**

#### **GTM Preview Mode Testing**
```
1. Enable Preview Mode in GTM
2. Visit each page type:
   ├── Landing (index.html)
   ├── Success (success.html)  
   ├── Sprint pages (sprint-0 through sprint-7)

3. Verify for each page:
   ├── GA4 Configuration tag fires
   ├── Custom variables populate correctly
   ├── Page view events are tracked
   ├── Custom events trigger properly

4. Test conversion events:
   ├── Submit email form
   ├── Complete sprint steps
   ├── Click high-intent CTAs
   ├── Navigate between sprints
```

#### **Real-Time Validation**
```
Google Analytics 4 → Reports → Realtime:

Check these metrics appear:
✅ Active users by page
✅ Events by event name
✅ Custom dimensions populated
✅ Conversion events firing
✅ User journeys tracking properly
```

---

### **Step 9: Performance Monitoring**

#### **Key Metrics Dashboard**
```
Create GA4 Custom Dashboard:

Conversion Funnel:
├── Landing page views
├── Email capture rate  
├── Sprint access rate
├── Sprint completion rate
└── Purchase conversion rate

User Behavior:
├── Average session duration
├── Pages per session
├── Sprint progression patterns
└── Drop-off analysis

Business Metrics:
├── Revenue per visitor
├── Customer acquisition cost
├── Lifetime value projection
└── Cohort retention analysis
```

---

### **Step 10: Automated Reporting**

#### **Weekly Insights Report**
```
GA4 → Admin → Data Export:

Scheduled Report Contents:
├── Weekly conversion rates
├── Top-performing pages
├── User journey analysis
├── Sprint completion trends
├── Revenue attribution
└── Audience growth metrics

Recipients: Send to key stakeholders
Frequency: Every Monday at 9 AM
Format: PDF + Data Studio link
```

---

## 🎯 **Quick Implementation Checklist**

### **Dashboard Setup (30 minutes)**
- [ ] Create GA4 configuration tag
- [ ] Set up 4 custom variables  
- [ ] Create 4 event triggers
- [ ] Configure 4 conversion events
- [ ] Enable enhanced ecommerce

### **Testing Phase (15 minutes)**
- [ ] Enable GTM preview mode
- [ ] Test all page types
- [ ] Verify custom variables
- [ ] Confirm event firing
- [ ] Check GA4 real-time data

### **Optimization Setup (15 minutes)**
- [ ] Create custom audiences
- [ ] Set up conversion goals
- [ ] Build performance dashboard
- [ ] Configure automated reports

---

**🚀 Result: Complete funnel visibility with automated insights and conversion optimization ready!**

**Next Steps:**
1. Follow this guide in your GTM dashboard (tagmanager.google.com)
2. Test everything in preview mode
3. Publish the container when ready
4. Monitor performance and optimize based on data