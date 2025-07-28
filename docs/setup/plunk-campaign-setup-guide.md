# Plunk Email Campaign Setup Guide
## 🎯 7-Day MVP Validation Email Sequence

### 📧 Campaign Overview
Create a comprehensive email automation sequence that guides users through the 7-day MVP validation process with engaging, actionable content.

---

## 🚀 **CAMPAIGN 1: Welcome & Validation Series**

### **Campaign Settings**
- **Campaign Type**: Automation/Drip Sequence
- **Trigger**: Contact added with tag "validation-series"
- **Campaign Name**: "7-Day MVP Validation Journey"
- **From Name**: "MVP Validation Team"
- **From Email**: Your verified sender email

---

## 📬 **Email Sequence Structure**

### **EMAIL #1: Welcome Email (Day 0 - Immediate)**
**Subject**: 🚀 Welcome to Your 7-Day MVP Validation Journey!
**Delay**: Send immediately after signup

**Content Structure**:
```
📋 What's Inside:
- Welcome message with excitement
- Clear expectations for the 7-day journey
- Immediate access to Sprint 0 dashboard
- What to expect in upcoming emails
- Support contact information

🎯 Call-to-Action:
- "Start Your MVP Journey" → Link to sprint-0.html
- "Join Community" → Optional community link
```

**Template Variables to Use**:
- `{{email}}` - User's email address
- `{{dashboard_url}}` - Link to sprint-0.html
- `{{support_email}}` - Support contact

---

### **EMAIL #2: Foundation Mindset (Day 2)**
**Subject**: 🧠 Day 2: Build the Right Mindset for MVP Success
**Delay**: 2 days after signup

**Content Structure**:
```
📚 Today's Focus: Foundation Mindset
- Why 90% of MVPs fail (mindset issues)
- The "Build-Measure-Learn" framework
- Setting realistic expectations
- Common founder mistakes to avoid

🎯 Action Items:
- Complete Sprint 1 foundation exercises
- Define your validation hypothesis
- Set success metrics

🔗 Resources:
- Link to sprint-1.html
- Downloadable mindset checklist
```

---

### **EMAIL #3: Customer Discovery (Day 4)**
**Subject**: 🔍 Day 4: The Customer Research That Actually Matters
**Delay**: 4 days after signup

**Content Structure**:
```
🎯 Today's Mission: Customer Discovery
- How to find your ideal customers
- Interview questions that reveal truth
- Red flags to watch for
- Validating pain points vs. nice-to-haves

📋 Sprint 2 & 3 Tasks:
- Conduct 5 customer interviews
- Document pain point patterns
- Validate problem-solution fit

🔗 Tools & Templates:
- Link to sprint-2.html and sprint-3.html
- Customer interview template
- Pain point analysis worksheet
```

---

### **EMAIL #4: MVP Definition (Day 6)**
**Subject**: ⚡ Day 6: Define Your MVP (The Make-or-Break Decision)
**Delay**: 6 days after signup

**Content Structure**:
```
🚀 Critical Phase: MVP Definition
- What is an MVP (and what it's NOT)
- Feature prioritization framework
- Technical feasibility assessment
- Resource requirement planning

📊 Sprint 4 & 5 Deliverables:
- MVP feature specification
- Technical architecture plan
- Resource and timeline estimate
- Go/no-go decision framework

🎯 Access Your Sprint Materials:
- Link to sprint-4.html and sprint-5.html
- MVP definition template
- Feature prioritization matrix
```

---

### **EMAIL #5: Launch Strategy (Day 7)**
**Subject**: 🎯 Day 7: Your Go/No-Go Decision & Launch Plan
**Delay**: 7 days after signup

**Content Structure**:
```
🎯 Final Day: Launch Decision
- Go/no-go decision criteria
- Launch strategy framework
- Marketing and distribution plan
- Success metrics and tracking

📋 Sprint 6 & 7 Completion:
- Launch readiness assessment
- Marketing strategy document
- Success tracking dashboard
- Next steps planning

🚀 Ready to Launch?
- Link to sprint-6.html and sprint-7.html
- Launch readiness checklist
- Optional: Schedule strategy call
```

---

## 🎨 **Email Design Guidelines**

### **Visual Consistency**
Use the Neo-brutalist design system from the existing templates:

```css
/* Brand Colors */
--brand-primary: #FF6B6B    /* CTA buttons */
--brand-secondary: #4ECDC4  /* Accents */
--brand-accent: #FFD93D     /* Highlights */
--brand-success: #6BCF7F    /* Success elements */

/* Typography */
- Headers: Bold, 1.8-2rem
- Body: Arial/sans-serif, 1.1rem
- CTAs: Bold, contrasting colors

/* Elements */
- Thick borders (3-4px solid black)
- Box shadows (4-8px offset)
- High contrast colors
- Generous padding/margins
```

### **Email Template Structure**
```html
1. Header with gradient background
2. Welcome/content section with yellow highlight box
3. Action items in structured list
4. Clear CTA button with brutal styling
5. Footer with support/unsubscribe
```

---

## 🔧 **Plunk Dashboard Configuration**

### **Step 1: Create the Automation**
1. Go to **Automations** in Plunk dashboard
2. Click **"Create Automation"**
3. Choose **"Triggered by Contact Added"**
4. Set trigger condition: Contact has tag `validation-series`

### **Step 2: Add Email Steps**
For each email above:
1. Click **"Add Step"** → **"Send Email"**
2. Set delay (0 days, 2 days, 4 days, 6 days, 7 days)
3. Create email using HTML template
4. Add subject line and content
5. Configure sender information

### **Step 3: Email Template Setup**
Copy the existing HTML from `/email-templates/01-welcome.html` and adapt:

```html
<!-- Use this structure for all emails -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EMAIL_TITLE_HERE</title>
    <!-- Include the Neo-brutalist CSS from welcome template -->
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>EMAIL_TITLE</h1>
            <p>Day X of your MVP validation journey</p>
        </div>
        <div class="content">
            <!-- Email-specific content here -->
        </div>
    </div>
</body>
</html>
```

### **Step 4: Template Variables**
Configure these variables in each email:
- `{{email}}` - User's email
- `{{dashboard_url}}` - https://overnightmvp.netlify.app/sprint-0.html
- `{{support_email}}` - Your support email
- `{{unsubscribe_url}}` - Plunk's unsubscribe link

---

## 🎯 **Additional Campaign Ideas**

### **CAMPAIGN 2: Newsletter Sequence**
**Purpose**: Weekly insights for ongoing engagement
**Trigger**: Contact tagged with "newsletter"
**Frequency**: Weekly
**Content**: Case studies, tips, success stories

### **CAMPAIGN 3: Sprint Completion Follow-ups**
**Purpose**: Re-engage users who complete specific sprints
**Trigger**: Contact completes sprint milestone
**Content**: Advanced strategies, next steps, community invitation

### **CAMPAIGN 4: Abandoned Journey Recovery**
**Purpose**: Re-engage users who stop mid-journey
**Trigger**: No activity for 5+ days
**Content**: Motivational check-in, common challenges, simplified next steps

---

## 📊 **Success Metrics to Track**

### **Email Performance**
- **Open Rate Target**: 35%+ (industry average: 25%)
- **Click Rate Target**: 15%+ (industry average: 8%)
- **Conversion Rate**: Sprint completion rate
- **Unsubscribe Rate**: <2%

### **User Journey Metrics**
- **Sprint 0 Completion**: 70%+
- **Sprint 3 Completion**: 50%+
- **Sprint 7 Completion**: 30%+
- **Action Item Completion**: Track via dashboard

### **Business Metrics**
- **Email-to-Dashboard**: Signup to sprint access rate
- **Engagement Depth**: Average sprints completed
- **Retention**: 7-day active user rate
- **Conversion**: Sprint completion to paid conversion

---

## 🚨 **Testing & Launch Checklist**

### **Pre-Launch Testing**
- [ ] Test all email templates on desktop/mobile
- [ ] Verify all links work correctly
- [ ] Test template variables populate correctly
- [ ] Check spam score (aim for <5)
- [ ] Test unsubscribe functionality

### **Launch Sequence**
1. **Start with 1 email** (welcome only)
2. **Test with small audience** (10-20 contacts)
3. **Monitor metrics** for 48 hours
4. **Add remaining emails** one by one
5. **Full sequence activation** after testing

### **Ongoing Optimization**
- **Weekly**: Review open/click rates
- **Bi-weekly**: A/B test subject lines
- **Monthly**: Update content based on feedback
- **Quarterly**: Analyze completion rates and optimize flow

---

## 🔗 **Quick Reference Links**

- **Plunk Documentation**: https://docs.useplunk.com
- **Email Templates**: `/email-templates/` directory
- **Integration Function**: `/netlify/functions/plunk-integration.js`
- **Dashboard Links**: https://overnightmvp.netlify.app/sprint-X.html

---

**Ready to build your email empire? Start with Email #1 and expand from there! 🚀**