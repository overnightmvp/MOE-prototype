// Onboarding API Routes - Sprint 0 Progress Tracking
// Handles user progress through the Sprint 0 setup process

const express = require('express');
const router = express.Router();
const { trackEngagement } = require('../middleware/analytics');
const { rateLimiter } = require('../middleware/rateLimiter');

// In-memory progress storage (in production, use database)
const userProgress = new Map();

// Get user's current progress
router.get('/progress/:email', 
  rateLimiter('progress', 30, 60), // 30 requests per minute
  async (req, res) => {
    try {
      const { email } = req.params;
      
      if (!email || !isValidEmail(email)) {
        return res.status(400).json({ 
          error: 'Valid email is required' 
        });
      }

      const progress = userProgress.get(email) || {
        email,
        currentStep: 1,
        completedSteps: [],
        stepProgress: {},
        timeSpent: 0,
        startTime: Date.now(),
        lastActivity: Date.now()
      };

      res.json({
        success: true,
        progress
      });

    } catch (error) {
      console.error('Failed to get progress:', error);
      res.status(500).json({
        error: 'Failed to retrieve progress',
        success: false
      });
    }
  }
);

// Update user progress
router.post('/progress/:email',
  rateLimiter('progress', 60, 60), // 60 requests per minute
  trackEngagement('onboarding_progress'),
  async (req, res) => {
    try {
      const { email } = req.params;
      const { 
        currentStep, 
        completedSteps = [], 
        stepProgress = {}, 
        timeSpent = 0,
        action 
      } = req.body;

      if (!email || !isValidEmail(email)) {
        return res.status(400).json({ 
          error: 'Valid email is required' 
        });
      }

      // Get existing progress or create new
      const existingProgress = userProgress.get(email) || {
        email,
        currentStep: 1,
        completedSteps: [],
        stepProgress: {},
        timeSpent: 0,
        startTime: Date.now(),
        lastActivity: Date.now()
      };

      // Update progress
      const updatedProgress = {
        ...existingProgress,
        currentStep: currentStep || existingProgress.currentStep,
        completedSteps: [...new Set([...existingProgress.completedSteps, ...completedSteps])],
        stepProgress: { ...existingProgress.stepProgress, ...stepProgress },
        timeSpent: timeSpent || existingProgress.timeSpent,
        lastActivity: Date.now()
      };

      // Save progress
      userProgress.set(email, updatedProgress);

      // Track significant milestones
      if (action === 'step_complete') {
        console.log(`User ${email} completed step ${currentStep}`);
        
        // Track in analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'sprint0_step_complete', {
            event_category: 'Onboarding',
            event_label: `Step ${currentStep}`,
            custom_parameter: email
          });
        }
      }

      res.json({
        success: true,
        progress: updatedProgress,
        message: 'Progress updated successfully'
      });

    } catch (error) {
      console.error('Failed to update progress:', error);
      res.status(500).json({
        error: 'Failed to update progress',
        success: false
      });
    }
  }
);

// Mark step as completed
router.post('/complete-step/:email/:stepNumber',
  rateLimiter('progress', 30, 60),
  trackEngagement('step_completion'),
  async (req, res) => {
    try {
      const { email, stepNumber } = req.params;
      const step = parseInt(stepNumber);

      if (!email || !isValidEmail(email)) {
        return res.status(400).json({ 
          error: 'Valid email is required' 
        });
      }

      if (step < 1 || step > 4) {
        return res.status(400).json({ 
          error: 'Invalid step number' 
        });
      }

      // Get existing progress
      const existingProgress = userProgress.get(email) || {
        email,
        currentStep: 1,
        completedSteps: [],
        stepProgress: {},
        timeSpent: 0,
        startTime: Date.now(),
        lastActivity: Date.now()
      };

      // Update progress
      const completedSteps = [...new Set([...existingProgress.completedSteps, step])];
      const updatedProgress = {
        ...existingProgress,
        completedSteps,
        currentStep: Math.min(step + 1, 4),
        lastActivity: Date.now()
      };

      userProgress.set(email, updatedProgress);

      // Check if all steps completed
      if (completedSteps.length === 4) {
        console.log(`User ${email} completed all Sprint 0 steps!`);
        
        // Track completion
        if (typeof gtag !== 'undefined') {
          gtag('event', 'sprint0_complete', {
            event_category: 'Onboarding',
            event_label: 'Full Sprint 0 Completion',
            custom_parameter: email
          });
        }

        // Could trigger completion email or notification here
      }

      res.json({
        success: true,
        progress: updatedProgress,
        message: `Step ${step} marked as completed`,
        allComplete: completedSteps.length === 4
      });

    } catch (error) {
      console.error('Failed to complete step:', error);
      res.status(500).json({
        error: 'Failed to mark step as completed',
        success: false
      });
    }
  }
);

// Get onboarding analytics
router.get('/analytics',
  rateLimiter('analytics', 10, 60), // 10 requests per minute
  async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      // Calculate analytics from stored progress
      const allProgress = Array.from(userProgress.values());
      
      const analytics = {
        totalUsers: allProgress.length,
        activeUsers: allProgress.filter(p => 
          Date.now() - p.lastActivity < 24 * 60 * 60 * 1000 // Active in last 24h
        ).length,
        completionRates: {
          step1: allProgress.filter(p => p.completedSteps.includes(1)).length,
          step2: allProgress.filter(p => p.completedSteps.includes(2)).length,
          step3: allProgress.filter(p => p.completedSteps.includes(3)).length,
          step4: allProgress.filter(p => p.completedSteps.includes(4)).length,
        },
        averageTimeSpent: allProgress.reduce((sum, p) => sum + p.timeSpent, 0) / allProgress.length || 0,
        completedSprint0: allProgress.filter(p => p.completedSteps.length === 4).length
      };

      res.json({
        success: true,
        analytics,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Failed to get analytics:', error);
      res.status(500).json({
        error: 'Failed to retrieve analytics',
        success: false
      });
    }
  }
);

// Reset user progress (development/testing only)
router.delete('/progress/:email',
  rateLimiter('progress', 5, 60), // 5 requests per minute
  async (req, res) => {
    try {
      if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ 
          error: 'Not available in production' 
        });
      }

      const { email } = req.params;
      
      if (userProgress.has(email)) {
        userProgress.delete(email);
        res.json({
          success: true,
          message: 'Progress reset successfully'
        });
      } else {
        res.json({
          success: true,
          message: 'No progress found to reset'
        });
      }

    } catch (error) {
      console.error('Failed to reset progress:', error);
      res.status(500).json({
        error: 'Failed to reset progress',
        success: false
      });
    }
  }
);

// Health check for onboarding system
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    activeUsers: userProgress.size,
    timestamp: new Date().toISOString()
  });
});

// Utility function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = router;