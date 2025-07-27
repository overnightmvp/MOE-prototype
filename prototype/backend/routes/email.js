// Email API Routes - Plunk Integration
// Handles all email-related endpoints for the 7-Day MVP Validation System

const express = require('express');
const router = express.Router();
const PlunkService = require('../services/plunk');
const { trackConversion, trackEngagement } = require('../middleware/analytics');
const { rateLimiter } = require('../middleware/rateLimiter');

const plunk = new PlunkService();

// Lead Magnet Email Capture
router.post('/lead-magnet', 
  rateLimiter('email', 10, 60), // 10 requests per minute
  trackConversion('email_signup'),
  async (req, res) => {
    try {
      const { email, source = 'landing_page', leadMagnet = 'mvp_validation_checklist' } = req.body;
      
      // Basic email validation
      if (!email || !isValidEmail(email)) {
        return res.status(400).json({ 
          error: 'Valid email address is required' 
        });
      }

      // Determine which lead magnet to send
      let result;
      if (leadMagnet === 'sprint0_setup_checklist') {
        result = await plunk.sendSprint0Checklist(email, source);
      } else {
        result = await plunk.addLeadMagnetSubscriber(email, source);
      }
      
      // Track successful signup
      if (result.success) {
        // Log for analytics
        console.log(`New lead magnet signup: ${email} from ${source} (${leadMagnet})`);
        
        res.json({
          success: true,
          message: 'Checklist sent! Check your email.',
          subscribed: true,
          leadMagnet
        });
      } else {
        throw new Error('Failed to add subscriber');
      }
      
    } catch (error) {
      console.error('Lead magnet signup failed:', error);
      
      // Don't expose internal errors to user
      res.status(500).json({
        error: 'Unable to send checklist. Please try again.',
        success: false
      });
    }
  }
);

// Nurture Sequence Trigger
router.post('/nurture-sequence',
  rateLimiter('email', 5, 60), // 5 requests per minute
  async (req, res) => {
    try {
      const { email, sequenceType = 'pre_purchase' } = req.body;
      
      if (!email || !isValidEmail(email)) {
        return res.status(400).json({ 
          error: 'Valid email address is required' 
        });
      }

      const result = await plunk.sendNurtureSequence(email, sequenceType);
      
      res.json({
        success: result.success,
        message: result.message
      });
      
    } catch (error) {
      console.error('Nurture sequence trigger failed:', error);
      res.status(500).json({
        error: 'Unable to start email sequence',
        success: false
      });
    }
  }
);

// Daily Progress Email (Internal API - called by scheduler)
router.post('/daily-progress',
  authenticateSystem, // Only internal systems can call this
  async (req, res) => {
    try {
      const { email, day, dayData } = req.body;
      
      if (!email || !day || !dayData) {
        return res.status(400).json({ 
          error: 'Email, day, and dayData are required' 
        });
      }

      const result = await plunk.sendDailyProgressEmail(email, day, dayData);
      
      res.json({
        success: result.success,
        message: result.message
      });
      
    } catch (error) {
      console.error('Daily progress email failed:', error);
      res.status(500).json({
        error: 'Failed to send daily progress email',
        success: false
      });
    }
  }
);

// Bulk Daily Email Sender (Scheduled job endpoint)
router.post('/send-daily-batch',
  authenticateSystem,
  async (req, res) => {
    try {
      const { customers, day, dayContent } = req.body;
      
      if (!Array.isArray(customers) || !day || !dayContent) {
        return res.status(400).json({ 
          error: 'Customers array, day, and dayContent are required' 
        });
      }

      const results = await Promise.allSettled(
        customers.map(customer => 
          plunk.sendDailyProgressEmail(customer.email, day, {
            ...dayContent,
            customerName: customer.name,
            startDate: customer.startDate,
            progress: customer.progress
          })
        )
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      console.log(`Daily batch emails: ${successful} sent, ${failed} failed`);

      res.json({
        success: true,
        sent: successful,
        failed: failed,
        total: customers.length
      });
      
    } catch (error) {
      console.error('Batch email sending failed:', error);
      res.status(500).json({
        error: 'Failed to send batch emails',
        success: false
      });
    }
  }
);

// Customer Update Email Preferences
router.patch('/preferences',
  authenticateUser, // Require user authentication
  async (req, res) => {
    try {
      const { email, preferences } = req.body;
      const userId = req.user.id;
      
      // Verify user owns this email
      if (!await verifyUserEmail(userId, email)) {
        return res.status(403).json({ 
          error: 'Unauthorized email access' 
        });
      }

      // Update contact preferences in Plunk
      const result = await plunk.updateContact(email, {
        email_preferences: preferences,
        updated_at: new Date().toISOString()
      });

      res.json({
        success: true,
        message: 'Email preferences updated',
        preferences
      });
      
    } catch (error) {
      console.error('Email preferences update failed:', error);
      res.status(500).json({
        error: 'Failed to update preferences',
        success: false
      });
    }
  }
);

// Unsubscribe Handler
router.post('/unsubscribe',
  async (req, res) => {
    try {
      const { email, token } = req.body;
      
      // Verify unsubscribe token (implement your token verification)
      if (!verifyUnsubscribeToken(email, token)) {
        return res.status(400).json({ 
          error: 'Invalid unsubscribe token' 
        });
      }

      // Update contact to unsubscribed status
      await plunk.updateContact(email, {
        subscribed: false,
        unsubscribed_at: new Date().toISOString(),
        unsubscribe_reason: 'user_request'
      });

      res.json({
        success: true,
        message: 'Successfully unsubscribed'
      });
      
    } catch (error) {
      console.error('Unsubscribe failed:', error);
      res.status(500).json({
        error: 'Failed to unsubscribe',
        success: false
      });
    }
  }
);

// Email Analytics Endpoint
router.get('/analytics',
  authenticateAdmin, // Admin only
  async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      const analytics = await plunk.getEmailAnalytics(startDate, endDate);
      
      res.json({
        success: true,
        analytics
      });
      
    } catch (error) {
      console.error('Email analytics fetch failed:', error);
      res.status(500).json({
        error: 'Failed to fetch analytics',
        success: false
      });
    }
  }
);

// Test Email Endpoint (Development only)
router.post('/test-send',
  authenticateAdmin,
  async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'Not available in production' });
    }

    try {
      const { email, eventType, testData } = req.body;
      
      let result;
      
      switch (eventType) {
        case 'welcome':
          result = await plunk.sendWelcomeEmail(email, 'core');
          break;
        case 'daily':
          result = await plunk.sendDailyProgressEmail(email, 1, { title: 'Test Day 1' });
          break;
        case 'completion':
          result = await plunk.sendCompletionEmail(email, { score: 85, recommendation: 'go' });
          break;
        default:
          return res.status(400).json({ error: 'Invalid event type' });
      }

      res.json({
        success: true,
        message: 'Test email sent',
        result
      });
      
    } catch (error) {
      console.error('Test email failed:', error);
      res.status(500).json({
        error: 'Test email failed',
        success: false
      });
    }
  }
);

// Utility Functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function authenticateSystem(req, res, next) {
  const systemToken = req.headers['x-system-token'];
  if (systemToken !== process.env.SYSTEM_API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized system access' });
  }
  next();
}

function authenticateUser(req, res, next) {
  // Implement your user authentication logic
  // For now, mock implementation
  req.user = { id: 'user_123', email: 'user@example.com' };
  next();
}

function authenticateAdmin(req, res, next) {
  // Implement your admin authentication logic
  // For now, mock implementation
  if (process.env.NODE_ENV !== 'development') {
    return res.status(401).json({ error: 'Admin access required' });
  }
  next();
}

async function verifyUserEmail(userId, email) {
  // Implement user email verification logic
  // Check if user owns this email address
  return true; // Mock implementation
}

function verifyUnsubscribeToken(email, token) {
  // Implement unsubscribe token verification
  // Should verify HMAC or JWT token
  return true; // Mock implementation
}

module.exports = router;