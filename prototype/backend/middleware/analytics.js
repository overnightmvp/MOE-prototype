// Analytics Middleware and Tracking System
// Handles all analytics tracking for the 7-Day MVP Validation System

const { GoogleAnalytics } = require('@google-analytics/data');

class AnalyticsService {
  constructor() {
    this.ga4PropertyId = process.env.GA4_MEASUREMENT_ID;
    this.ga4ApiSecret = process.env.GA4_API_SECRET;
    this.isEnabled = process.env.ENABLE_ANALYTICS === 'true';
    
    if (this.isEnabled && this.ga4PropertyId) {
      this.analytics = new GoogleAnalytics({
        propertyId: this.ga4PropertyId.replace('G-', '')
      });
    }
  }

  // Server-side event tracking via Measurement Protocol
  async trackEvent(eventName, parameters = {}, clientId = null) {
    if (!this.isEnabled || !this.ga4PropertyId || !this.ga4ApiSecret) {
      console.log('Analytics tracking disabled or not configured');
      return;
    }

    try {
      const payload = {
        client_id: clientId || this.generateClientId(),
        events: [{
          name: eventName,
          params: {
            engagement_time_msec: '1',
            session_id: Date.now(),
            ...parameters
          }
        }]
      };

      const response = await fetch(
        `https://www.google-analytics.com/mp/collect?measurement_id=${this.ga4PropertyId}&api_secret=${this.ga4ApiSecret}`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`GA4 API error: ${response.status}`);
      }

      console.log(`Analytics event tracked: ${eventName}`);
      
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  }

  // Generate unique client ID
  generateClientId() {
    return Date.now() + '.' + Math.random().toString(36).substring(2);
  }

  // Track conversion funnel events
  async trackConversionFunnel(stage, data = {}) {
    const funnelEvents = {
      landing_page_view: {
        event: 'page_view',
        params: {
          page_title: '7-Day MVP Validation System',
          page_location: data.url || 'unknown',
          funnel_stage: 'awareness'
        }
      },
      email_signup: {
        event: 'sign_up',
        params: {
          method: 'email',
          funnel_stage: 'interest',
          lead_source: data.source || 'landing_page'
        }
      },
      pricing_view: {
        event: 'view_item',
        params: {
          currency: 'USD',
          value: 497,
          funnel_stage: 'consideration',
          items: [{
            item_id: 'mvp_validation_core',
            item_name: '7-Day MVP Validation System',
            price: 497,
            quantity: 1
          }]
        }
      },
      checkout_begin: {
        event: 'begin_checkout',
        params: {
          currency: 'USD',
          value: data.amount || 497,
          funnel_stage: 'intent',
          items: [{
            item_id: data.product_id || 'mvp_validation_core',
            item_name: data.product_name || '7-Day MVP Validation System',
            price: data.amount || 497,
            quantity: 1
          }]
        }
      },
      purchase: {
        event: 'purchase',
        params: {
          transaction_id: data.transaction_id,
          currency: 'USD',
          value: data.amount,
          funnel_stage: 'conversion',
          items: [{
            item_id: data.product_id,
            item_name: data.product_name,
            price: data.amount,
            quantity: 1
          }]
        }
      }
    };

    const eventConfig = funnelEvents[stage];
    if (eventConfig) {
      await this.trackEvent(eventConfig.event, {
        ...eventConfig.params,
        ...data
      }, data.client_id);
    }
  }

  // Track user engagement events
  async trackUserEngagement(action, data = {}) {
    const engagementEvents = {
      scroll_75: {
        event: 'scroll',
        params: {
          percent_scrolled: 75,
          engagement_type: 'scroll_depth'
        }
      },
      video_play: {
        event: 'video_play',
        params: {
          video_title: data.video_title,
          video_duration: data.duration
        }
      },
      cta_click: {
        event: 'select_promotion',
        params: {
          promotion_id: data.cta_id || 'primary_cta',
          promotion_name: data.cta_text || 'Get Validation System',
          creative_name: data.location || 'unknown'
        }
      },
      faq_open: {
        event: 'select_content',
        params: {
          content_type: 'faq',
          item_id: data.question_id
        }
      },
      time_on_page: {
        event: 'user_engagement',
        params: {
          engagement_time_msec: data.time_spent * 1000,
          page_title: data.page_title
        }
      }
    };

    const eventConfig = engagementEvents[action];
    if (eventConfig) {
      await this.trackEvent(eventConfig.event, {
        ...eventConfig.params,
        ...data
      }, data.client_id);
    }
  }

  // Track customer journey events
  async trackCustomerJourney(stage, data = {}) {
    const journeyEvents = {
      day_1_start: {
        event: 'level_start',
        params: {
          level_name: 'day_1_idea_validation',
          character: 'mvp_founder'
        }
      },
      day_complete: {
        event: 'level_end',
        params: {
          level_name: `day_${data.day}_${data.day_name}`,
          success: data.completed || false,
          score: data.completion_percentage
        }
      },
      ai_interaction: {
        event: 'select_content',
        params: {
          content_type: 'ai_assistance',
          item_id: data.prompt_type,
          custom_category: 'claude_interaction'
        }
      },
      validation_complete: {
        event: 'tutorial_complete',
        params: {
          success: true,
          final_score: data.validation_score,
          recommendation: data.go_no_go
        }
      },
      community_join: {
        event: 'join_group',
        params: {
          group_id: 'discord_community',
          method: 'automatic'
        }
      }
    };

    const eventConfig = journeyEvents[stage];
    if (eventConfig) {
      await this.trackEvent(eventConfig.event, {
        ...eventConfig.params,
        ...data
      }, data.client_id);
    }
  }

  // Express middleware for automatic page tracking
  trackPageView() {
    return (req, res, next) => {
      if (!this.isEnabled) {
        return next();
      }

      // Extract client info
      const clientId = req.headers['x-client-id'] || this.generateClientId();
      const userAgent = req.headers['user-agent'];
      const referer = req.headers['referer'];
      
      // Track page view
      this.trackEvent('page_view', {
        page_location: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        page_title: this.getPageTitle(req.originalUrl),
        page_referrer: referer,
        user_agent: userAgent
      }, clientId);

      // Add client ID to response for frontend tracking
      res.setHeader('X-Client-ID', clientId);
      
      next();
    };
  }

  // Get page title based on URL
  getPageTitle(url) {
    const titles = {
      '/': '7-Day MVP Validation System - Landing Page',
      '/success': 'Payment Success - 7-Day MVP Validation',
      '/dashboard': 'Customer Dashboard - 7-Day MVP Validation',
      '/day-1': 'Day 1: Idea Validation - 7-Day MVP',
      '/day-2': 'Day 2: Problem Validation - 7-Day MVP',
      '/day-3': 'Day 3: Solution Design - 7-Day MVP',
      '/day-4': 'Day 4: Value Proposition - 7-Day MVP',
      '/day-5': 'Day 5: Landing Page - 7-Day MVP',
      '/day-6': 'Day 6: Traffic & Testing - 7-Day MVP',
      '/day-7': 'Day 7: Validation Analysis - 7-Day MVP'
    };
    
    return titles[url] || '7-Day MVP Validation System';
  }

  // Analytics reporting for dashboard
  async getConversionReport(startDate, endDate) {
    if (!this.analytics) {
      return null;
    }

    try {
      const response = await this.analytics.runReport({
        property: `properties/${this.ga4PropertyId.replace('G-', '')}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'eventName' }],
        metrics: [
          { name: 'eventCount' },
          { name: 'totalUsers' },
          { name: 'sessions' }
        ],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            inListFilter: {
              values: ['page_view', 'sign_up', 'begin_checkout', 'purchase']
            }
          }
        }
      });

      return this.processConversionData(response);
      
    } catch (error) {
      console.error('Failed to get conversion report:', error);
      return null;
    }
  }

  // Process GA4 data into conversion funnel
  processConversionData(response) {
    const funnel = {
      page_views: 0,
      signups: 0,
      checkout_starts: 0,
      purchases: 0,
      conversion_rates: {}
    };

    response.rows.forEach(row => {
      const eventName = row.dimensionValues[0].value;
      const eventCount = parseInt(row.metricValues[0].value);

      switch (eventName) {
        case 'page_view':
          funnel.page_views = eventCount;
          break;
        case 'sign_up':
          funnel.signups = eventCount;
          break;
        case 'begin_checkout':
          funnel.checkout_starts = eventCount;
          break;
        case 'purchase':
          funnel.purchases = eventCount;
          break;
      }
    });

    // Calculate conversion rates
    if (funnel.page_views > 0) {
      funnel.conversion_rates.signup_rate = (funnel.signups / funnel.page_views * 100).toFixed(2);
      funnel.conversion_rates.checkout_rate = (funnel.checkout_starts / funnel.page_views * 100).toFixed(2);
      funnel.conversion_rates.purchase_rate = (funnel.purchases / funnel.page_views * 100).toFixed(2);
    }

    return funnel;
  }

  // Custom event tracking for business metrics
  async trackBusinessMetric(metric, value, dimensions = {}) {
    await this.trackEvent('custom_business_metric', {
      metric_name: metric,
      metric_value: value,
      ...dimensions
    });
  }
}

// Export singleton instance
const analyticsService = new AnalyticsService();

// Express middleware functions
const trackPageView = analyticsService.trackPageView.bind(analyticsService);

const trackConversion = (stage) => {
  return async (req, res, next) => {
    try {
      const clientId = req.headers['x-client-id'] || analyticsService.generateClientId();
      await analyticsService.trackConversionFunnel(stage, {
        ...req.body,
        client_id: clientId,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
    next();
  };
};

const trackEngagement = (action) => {
  return async (req, res, next) => {
    try {
      const clientId = req.headers['x-client-id'] || analyticsService.generateClientId();
      await analyticsService.trackUserEngagement(action, {
        ...req.body,
        client_id: clientId
      });
    } catch (error) {
      console.error('Engagement tracking error:', error);
    }
    next();
  };
};

module.exports = {
  analyticsService,
  trackPageView,
  trackConversion,
  trackEngagement
};