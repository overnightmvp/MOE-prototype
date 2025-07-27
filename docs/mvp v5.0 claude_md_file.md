# 500 Posts on X - Serverless Automation Service

## Project Overview
A serverless social media automation service that generates 500 X (Twitter) posts based on comprehensive brand questionnaires. The service uses AI to create authentic, brand-aligned content and automates posting schedules.

**Target Users**: Small businesses, personal brands, and content creators who need consistent X presence.

**Core Value Prop**: Transform 30 minutes of brand questionnaire input into 500+ high-quality, scheduled X posts.

## Architecture & Tech Stack

### Serverless Infrastructure
- **Frontend**: Next.js 14+ with App Router on Vercel
- **Backend**: Vercel Serverless Functions (Node.js & Edge Runtime)
- **Database**: PlanetScale (serverless MySQL) with Prisma ORM
- **Queue System**: Upstash Redis + QStash for job processing
- **Authentication**: Clerk (serverless-optimized)
- **Storage**: Vercel Blob for assets
- **Payments**: Stripe with webhooks
- **Email**: Resend for transactional emails
- **Monitoring**: Vercel Analytics + Upstash Redis metrics

### AI & Content Generation
- **Content AI**: OpenAI GPT-4 + Anthropic Claude for content generation
- **X Integration**: X API v2 with OAuth 2.0
- **Content Review**: Real-time feedback system with approval workflow
- **Scheduling**: Cron-based posting with intelligent timing optimization

## Project Structure

```
500-posts-x/
├── claude.md                    # This file - main context
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Auth-protected routes
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/            # Main application
│   │   ├── dashboard/          # Overview & metrics
│   │   ├── questionnaire/      # Brand profile setup
│   │   ├── content/            # Post review & management
│   │   ├── schedule/           # Calendar & timing
│   │   └── settings/           # Account & X integration
│   ├── api/                    # Serverless API routes
│   │   ├── auth/               # Clerk webhooks
│   │   ├── content/
│   │   │   ├── generate/       # AI content generation
│   │   │   ├── review/         # Feedback processing
│   │   │   └── schedule/       # Post scheduling
│   │   ├── x-api/              # X API integration
│   │   ├── webhooks/           # External service webhooks
│   │   ├── cron/               # Scheduled functions
│   │   └── payments/           # Stripe integration
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── components/                 # Reusable UI components
│   ├── ui/                     # Base components (shadcn/ui)
│   ├── dashboard/              # Dashboard-specific components
│   ├── forms/                  # Form components
│   └── content/                # Content management components
├── lib/                        # Utilities & configurations
│   ├── db/                     # Database client & queries
│   ├── queue/                  # QStash job management
│   ├── ai/                     # AI prompt engineering
│   ├── x-api/                  # X API wrapper
│   ├── auth/                   # Clerk configuration
│   ├── payments/               # Stripe utilities
│   └── utils.ts                # Helper functions
├── docs/                       # Documentation & context
│   ├── context/                # Feature-specific context
│   │   ├── brand-questionnaire.md
│   │   ├── content-generation.md
│   │   ├── x-automation.md
│   │   └── payment-flow.md
│   ├── design-system.md        # UI/UX guidelines
│   └── api-documentation.md    # API endpoints
├── prisma/                     # Database schema
│   ├── schema.prisma
│   └── migrations/
├── public/                     # Static assets
└── package.json
```

## Key Directories & Files

### `/app/api` - Serverless Functions
- **Runtime Strategy**: Use Edge Runtime for auth/simple operations, Node.js for AI/heavy processing
- **Timeout Limits**: 10s (Hobby), 15s+ (Pro) - design accordingly
- **Error Handling**: Always return proper HTTP responses with error logging

### `/lib` - Core Business Logic
- **Database**: Connection pooling patterns for serverless
- **Queue Management**: Job queuing for long-running tasks
- **AI Prompts**: Centralized prompt engineering and optimization

### `/components` - UI Components
- **Design System**: Based on shadcn/ui with Tailwind CSS
- **Atomic Design**: Atoms → Molecules → Organisms → Templates → Pages
- **Accessibility**: WCAG 2.1 AA compliance throughout

## Development Commands

```bash
# Environment Setup
vercel dev                      # Local development with serverless functions
vercel env pull .env.local      # Pull environment variables
npm run db:push                 # Push Prisma schema changes
npm run db:studio               # Open Prisma Studio

# Development Workflow
npm run dev                     # Next.js development server
npm run build                   # Production build
npm run type-check              # TypeScript validation
npm run lint                    # ESLint + Prettier

# Database Operations
npx prisma generate             # Generate Prisma client
npx prisma migrate dev          # Create and apply migration
npx prisma db seed              # Seed development data

# Deployment
vercel --prod                   # Deploy to production
vercel logs                     # View function logs
```

## Serverless Patterns & Constraints

### Function Design Principles
- **Stateless**: No persistent connections or in-memory state
- **Idempotent**: Functions should be safely retryable
- **Fast Cold Starts**: Minimize initialization time
- **Proper Error Handling**: Always catch and log errors appropriately

### Database Connection Pattern
```typescript
// lib/db.ts - Serverless-optimized Prisma client
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

### Queue Job Pattern
```typescript
// lib/queue.ts - QStash job queuing
import { Client } from '@upstash/qstash'

const qstash = new Client({ token: process.env.QSTASH_TOKEN! })

export async function queueJob(endpoint: string, data: any, options?: {
  delay?: string
  retries?: number
}) {
  return await qstash.publishJSON({
    url: `${process.env.VERCEL_URL}/api/jobs/${endpoint}`,
    body: data,
    delay: options?.delay,
    retries: options?.retries ?? 3
  })
}
```

## Feature Implementation Guidelines

### 1. Brand Questionnaire
- **15 core questions** covering brand voice, target audience, content themes
- **Progressive disclosure** - show relevant follow-ups based on answers
- **Auto-save** functionality to prevent data loss
- **Example guidance** for each question to improve response quality

### 2. AI Content Generation
- **Batch processing** - Generate 50 posts at a time to manage API costs
- **Quality scoring** - Rate generated content and regenerate low-quality posts
- **Brand alignment** - Use questionnaire data to maintain consistent voice
- **Content variety** - Mix of promotional, educational, and engagement posts

### 3. Content Review Interface
- **Bulk operations** - Approve/reject multiple posts at once
- **Inline editing** - Quick edits without losing generated context
- **Preview mode** - See how posts will appear on X
- **Feedback integration** - Learn from user preferences over time

### 4. X Integration & Scheduling
- **OAuth 2.0 flow** - Secure credential management
- **Optimal timing** - Analyze user's audience for best posting times
- **Rate limit handling** - Respect X API limits with intelligent queuing
- **Engagement tracking** - Monitor post performance and adjust strategy

## Design System Guidelines

### Color Palette
- **Primary**: #1DA1F2 (X Blue)
- **Secondary**: #14171A (X Dark)
- **Success**: #00BA7C
- **Warning**: #FFD400
- **Error**: #E0245E
- **Background**: #FFFFFF / #000000 (light/dark mode)

### Typography
- **Font Family**: Inter (system fallback: -apple-system, BlinkMacSystemFont)
- **Scale**: 12px, 14px, 16px, 18px, 20px, 24px, 32px, 48px
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Component Standards
- **Spacing**: 8px grid system (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- **Borders**: 1px solid, 8px border radius for cards, 4px for buttons
- **Shadows**: Subtle elevation with CSS box-shadow
- **Animations**: 200ms ease-in-out transitions, 300ms for complex animations

## Environment Variables

```bash
# Database
DATABASE_URL="mysql://..."
DIRECT_URL="mysql://..."

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# AI Services
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."

# X API
X_CLIENT_ID="..."
X_CLIENT_SECRET="..."

# Queue & Redis
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
QSTASH_TOKEN="..."

# Payments
STRIPE_SECRET_KEY="sk_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
RESEND_API_KEY="re_..."

# Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_..."
```

## Code Style & Conventions

### TypeScript Standards
- **Strict Mode**: Always use TypeScript strict mode
- **Interfaces over Types**: Prefer interfaces for object shapes
- **Explicit Return Types**: For public functions and API routes
- **Proper Error Types**: Use typed error objects, not just strings

### File Naming Conventions
- **Components**: PascalCase (e.g., `BrandQuestionnaire.tsx`)
- **Pages**: kebab-case (e.g., `brand-questionnaire/page.tsx`)
- **Utilities**: camelCase (e.g., `generatePosts.ts`)
- **API Routes**: kebab-case (e.g., `generate-content/route.ts`)

### Import Organization
```typescript
// 1. React & Next.js imports
import { useState } from 'react'
import { NextRequest } from 'next/server'

// 2. Third-party libraries
import { clsx } from 'clsx'
import { Prisma } from '@prisma/client'

// 3. Internal utilities & types
import { db } from '@/lib/db'
import type { BrandProfile } from '@/types'

// 4. Internal components
import { Button } from '@/components/ui/button'
import { BrandForm } from '@/components/forms/brand-form'
```

## Testing Strategy

### Unit Testing
- **Framework**: Vitest for unit tests
- **Coverage**: Aim for 80%+ on utility functions and business logic
- **Mocking**: Mock external APIs (OpenAI, X API) in tests

### Integration Testing
- **Database**: Use test database with realistic seed data
- **API Routes**: Test full request/response cycles
- **Queue Jobs**: Mock QStash for deterministic testing

### E2E Testing
- **Framework**: Playwright for critical user journeys
- **Key Flows**: Signup → Questionnaire → Content Generation → Scheduling
- **Visual Testing**: Screenshot comparison for UI consistency

## Performance Optimization

### Frontend Optimization
- **Code Splitting**: Route-based splitting with Next.js
- **Image Optimization**: Next.js Image component with WebP
- **Font Loading**: Preload Inter font with font-display: swap
- **Bundle Analysis**: Regular bundle size monitoring

### Serverless Function Optimization
- **Cold Start Reduction**: Minimize dependencies in Edge functions
- **Connection Pooling**: Reuse database connections appropriately
- **Caching Strategy**: Redis for frequently accessed data
- **Concurrent Processing**: Parallel execution where possible

## Security Considerations

### Data Protection
- **User Data**: Encrypt sensitive information at rest
- **X Credentials**: Secure token storage with Clerk metadata
- **API Keys**: Environment variables only, never in code
- **Content Filtering**: Basic profanity and spam detection

### API Security
- **Rate Limiting**: Implement per-user rate limits
- **Input Validation**: Zod schemas for all API inputs
- **CORS Configuration**: Restrict origins in production
- **Webhook Validation**: Verify signatures for external webhooks

## Monitoring & Analytics

### Application Monitoring
- **Error Tracking**: Vercel Analytics for function errors
- **Performance**: Core Web Vitals monitoring
- **User Analytics**: Privacy-friendly usage tracking
- **Uptime Monitoring**: External service for availability checks

### Business Metrics
- **User Engagement**: Questionnaire completion rates
- **Content Quality**: User approval/rejection ratios
- **X Performance**: Post engagement metrics via X API
- **Revenue Tracking**: Stripe dashboard integration

## Deployment & CI/CD

### Vercel Deployment
- **Automatic Deployments**: Git push triggers deployment
- **Preview Deployments**: All PRs get preview URLs
- **Environment Promotion**: Staging → Production workflow
- **Rollback Strategy**: Instant rollback via Vercel dashboard

### Database Migrations
- **Migration Strategy**: Prisma migrate for schema changes
- **Backup Policy**: Automated daily backups with PlanetScale
- **Schema Evolution**: Backwards-compatible changes when possible

## Common Issues & Solutions

### Cold Start Optimization
- **Problem**: Slow initial function responses
- **Solution**: Use Edge Runtime for simple operations, optimize imports

### Database Connection Limits
- **Problem**: "Too many connections" errors
- **Solution**: Implement proper connection pooling pattern

### Queue Job Failures
- **Problem**: Jobs failing silently
- **Solution**: Comprehensive error handling with retry logic and dead letter queues

### X API Rate Limits
- **Problem**: Hitting X API limits during peak usage
- **Solution**: Intelligent queuing with exponential backoff

## Future Enhancements

### Phase 2 Features
- **Multi-platform**: Instagram, LinkedIn support
- **Team Collaboration**: Multiple users per account
- **Advanced Analytics**: Detailed engagement insights
- **Content Calendar**: Visual scheduling interface

### Phase 3 Features
- **White Label**: Reseller program
- **API Access**: Public API for integrations
- **Mobile App**: React Native companion app
- **Enterprise Features**: SSO, advanced permissions

---

## Getting Started for Claude Code

1. **Initialize Project**: `claude /init "Next.js serverless X automation service"`
2. **Set up Database**: `claude "Create Prisma schema for user profiles and content management"`
3. **Build UI Foundation**: `claude "Create design system components with shadcn/ui and Tailwind"`
4. **Implement Auth**: `claude "Set up Clerk authentication with user management"`
5. **Core Features**: `claude "Build brand questionnaire with 15 questions and AI content generation"`

Remember: This project leverages Claude Code's strengths in multi-file generation, pattern recognition, and complex workflow automation. Keep context files updated as the project evolves.