# Contributing to 7-Day MVP Validation System

## 🚀 Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Individual features (e.g., `feature/sprint-2-portal`)
- `hotfix/*` - Critical production fixes

### Commit Message Format
We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

#### Examples
```bash
feat(payments): add recurring subscription support
fix(email): resolve Plunk API timeout issues
docs(setup): update Sprint 0 installation guide
refactor(auth): simplify JWT token validation
```

### Sprint Development Process

#### Sprint Planning
1. Review development backlog
2. Select features for sprint
3. Create feature branches
4. Estimate and assign tasks

#### Sprint Execution
1. **Daily Progress Tracking**
   ```bash
   git add .
   git commit -m "feat(feature-name): implement core functionality
   
   - Add main component structure
   - Integrate with existing API
   - Update tests and documentation
   
   Progress: 60% complete"
   ```

2. **Feature Completion**
   ```bash
   git commit -m "feat(feature-name): complete feature implementation
   
   - All functionality implemented
   - Tests passing
   - Documentation updated
   - Ready for review"
   ```

3. **Sprint Review**
   ```bash
   git commit -m "chore(sprint-2): complete sprint 2 implementation
   
   Sprint 2 Complete: Customer Portal & Authentication
   
   Features Added:
   - User registration and login system
   - Customer dashboard with progress tracking
   - Day-by-day journey interface
   - Content management and delivery
   
   Technical Implementation:
   - JWT-based authentication with secure sessions
   - PostgreSQL user data and progress tracking
   - AWS S3 integration for file storage
   - WebSocket real-time updates
   
   Time Investment: 35 hours
   Next Sprint: AI Integration & Customer Experience
   
   🤖 Generated with [Claude Code](https://claude.ai/code)
   
   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

## 📋 Sprint Tracking

### Current Sprint Status
**Sprint 0: ✅ Complete**
**Sprint 1: ✅ Complete** 
**Sprint 2: 🔄 Next** - Customer Portal & Authentication

### Development Backlog Reference
See [development_backlog.md](docs/backlog/strategy/development_backlog.md) for complete 8-sprint roadmap.

### Progress Tracking Commands
```bash
# Start new sprint
git checkout -b feature/sprint-X-name

# Daily progress commit
git add .
git commit -m "feat(sprint-X): day Y progress update

- Implemented feature A
- Fixed issue B  
- Updated documentation C

Progress: X% complete
Blockers: [list any blockers]
Next: [next steps]"

# Sprint completion
git checkout main
git merge feature/sprint-X-name
git commit -m "chore(sprint-X): complete sprint X implementation"
```

## 🔧 Technical Standards

### Code Quality
- All features must include tests
- Documentation updated for new features
- Environment variables properly configured
- Security considerations addressed

### Testing Requirements
```bash
# Run all tests before committing
npm run test
npm run lint
npm run type-check
```

### Documentation Standards
- Update README.md for major features
- Add inline code comments for complex logic
- Update API documentation for new endpoints
- Include setup instructions for new services

## 🚨 Emergency Procedures

### Hotfix Process
```bash
# Critical production fix
git checkout -b hotfix/critical-issue-name
# Make necessary fixes
git commit -m "fix(critical): resolve production issue

- Description of the fix
- Impact assessment
- Monitoring requirements"

# Deploy immediately
git checkout main
git merge hotfix/critical-issue-name
git push origin main
```

### Rollback Process
```bash
# If deployment fails
git revert HEAD
git push origin main

# Or rollback to specific commit
git reset --hard [commit-hash]
git push --force-with-lease origin main
```

## 📊 Performance Tracking

### Metrics to Monitor
- Deployment success rate
- Feature completion time vs estimates
- Bug frequency and resolution time
- Customer conversion rate impact

### Sprint Review Template
```markdown
## Sprint X Review

**Completed Features:**
- [List all completed features]

**Technical Debt:**
- [Any technical debt created]

**Performance Impact:**
- [Customer metrics affected]

**Lessons Learned:**
- [What went well/poorly]

**Next Sprint Planning:**
- [Adjustments for next sprint]
```

---

**Remember:** Every commit should move the project closer to revenue generation and customer success. Focus on features that directly impact the customer journey and business metrics.