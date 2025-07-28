# CLAUDE.md - S-Tier Engineering Guide

## ⚡ Quick Reference (Use These Daily)

### 🚀 One-Line Deploy
```bash
# Deploy everything (most common)
./deploy.sh

# Status check
git status && netlify status

# Emergency rollback
netlify rollback
```

### 📊 Project Status
- **Live**: https://overnightmvp.netlify.app
- **Stack**: JAMstack (HTML/CSS/JS)
- **Analytics**: GA4 (G-L99CMW68TS) + GTM (GTM-57CDVXRW)
- **Email**: Plunk integration active
- **Status**: ✅ Production ready

### 🔧 Development Workflow
```bash
# Local dev
cd prototype && npm run dev

# Quality gates
npm run build && npm run lint

# Commit pattern
git add . && git commit -m "type: description" && git push
```

## ⚠️ Emergency Procedures
```bash
# Rollback
netlify rollback

# Hotfix
git checkout -b hotfix/fix && git add . && git commit -m "hotfix: issue" && git push

# Status check
git log --oneline -5 && netlify status
```

## 🏗️ Architecture
```
prototype/frontend/     # Netlify auto-deploy
├── assets/css/         # Design system
├── components/         # JS modules
├── index.html          # Landing
├── success.html        # Post-signup
├── sprint-[0-7].html   # User journey
└── _redirects          # Routing
```

## 🎯 Quality Gates
**Before every deploy:**
- [ ] Local test: All routes work
- [ ] Build passes: `npm run build`  
- [ ] Mobile responsive
- [ ] Email capture functional
- [ ] Performance < 2s load time

## 🎨 Design System
```css
/* Core tokens */
--brand-primary: #FF6B6B;   /* CTA buttons */
--brand-secondary: #4ECDC4; /* Accents */
--shadow-brutal: 6px 6px 0px var(--color-black);
```

**Files**: `design-system.css` + `landing.css` + `onboarding.css`

## 📊 Analytics Stack
- **GA4**: G-L99CMW68TS (conversion tracking)
- **GTM**: GTM-57CDVXRW (event management)
- **Plunk**: Automated email sequences
- **Netlify**: Deployment & performance metrics

## 📈 Key Metrics
- **Email Capture**: Target 3-5% (currently ~2%)
- **Sprint Completion**: Target 60% (currently ~30%)
- **Page Load**: < 2 seconds
- **Mobile Conversion**: Match desktop rates

## 🔄 Auto-Commit Protocol
**After major implementations, auto-commit:**
```bash
git add . && git commit -m "feat: [FEATURE] complete

🚀 Changes: [list]
📊 Impact: [business value]
🧪 Status: [testing notes]

🤖 Generated with Claude Code" && git push
```

## 📚 Documentation Index
- **[PROJECT-STATUS.md](PROJECT-STATUS.md)** - Current health dashboard
- **[UX-AUDIT-REPORT.md](UX-AUDIT-REPORT.md)** - UX analysis
- **[docs/setup-guide.md](docs/setup-guide.md)** - Complete setup
- **[docs/setup/gtm-dashboard-configuration.md](docs/setup/gtm-dashboard-configuration.md)** - GTM setup
- **[mvp-validation-checklist.md](mvp-validation-checklist.md)** - Interactive validation system

---

## 🛠️ Advanced Configuration

<details>
<summary>🤖 Sub-Agent Commands (Click to expand)</summary>

```bash
# Product Strategy
/product-roadmap-review
/feature-prioritization [data]
/competitive-landscape

# Technical Architecture  
/performance-audit
/security-audit
/dependency-optimization

# Analytics & Data
/conversion-funnel-analysis
/user-journey-mapping
/ab-test-analysis [results]
```
</details>

<details>
<summary>📊 Advanced Analytics (Click to expand)</summary>

```javascript
// Sprint Progress Tracking
gtag('event', 'sprint_started', {
  'event_category': 'Sprint Progress',
  'sprint_number': sprintNumber,
  'user_email': userEmail
});

// Conversion Funnel
gtag('event', 'cta_click', {
  'event_category': 'Conversion',
  'cta_text': buttonText,
  'cta_position': position
});
```
</details>

<details>
<summary>🚀 Git Automation Templates (Click to expand)</summary>

**Major Feature Template:**
```bash
git commit -m "feat: [FEATURE] implementation complete

🚀 Changes: [key changes]
📊 Impact: [business value] 
🧪 Status: [testing notes]

🤖 Generated with Claude Code"
```

**Integration Template:**  
```bash
git commit -m "feat: [SERVICE] integration complete

⚡ Integration: [details]
🔧 Config: [requirements]
📊 Metrics: [KPIs]

🤖 Generated with Claude Code"
```
</details>

---

## 🏆 Success Metrics
- ✅ **Uptime**: 100% Netlify reliability
- ⚡ **Performance**: < 2s load time
- 📱 **Mobile**: Responsive design
- 📊 **Conversion**: 3-5% email capture
- 🚀 **Completion**: 60% sprint finish rate

---

**⚡ Engineering Principle**: Ship fast, measure everything, iterate constantly.

---

<details>
<summary>🎆 Recent Achievements (Click to expand)</summary>

**✅ UX Overhaul Complete**: Neo-brutalist design system, WCAG compliance, mobile optimization

**📊 Measured Impact**: Inline CSS → Modular system, 2 design systems → Unified approach

**🎨 Architecture**: 1500+ lines modular CSS (design-system.css + landing.css + onboarding.css)


</details>

---

*Optimized for S-tier engineering performance. Keep lean, ship fast.*