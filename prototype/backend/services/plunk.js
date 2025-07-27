// Plunk Email Service Integration
// Handles all email automation for the 7-Day MVP Validation System

const axios = require('axios');

class PlunkService {
  constructor() {
    this.apiKey = process.env.PLUNK_API_KEY;
    this.secretKey = process.env.PLUNK_SECRET_KEY;
    this.baseURL = process.env.PLUNK_API_URL || 'https://api.useplunk.com/v1';
    
    if (!this.apiKey || !this.secretKey) {
      throw new Error('Plunk API credentials not configured');
    }
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // Core API Methods
  async addContact(email, data = {}) {
    try {
      const response = await this.client.post('/contacts', {
        email,
        subscribed: true,
        data: {
          source: 'mvp-validation-system',
          ...data
        }
      });
      
      console.log(`Contact added to Plunk: ${email}`);
      return response.data;
      
    } catch (error) {
      console.error('Failed to add contact to Plunk:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateContact(email, data = {}) {
    try {
      const response = await this.client.put('/contacts', {
        email,
        data
      });
      
      console.log(`Contact updated in Plunk: ${email}`);
      return response.data;
      
    } catch (error) {
      console.error('Failed to update contact in Plunk:', error.response?.data || error.message);
      throw error;
    }
  }

  async triggerEvent(email, eventId, data = {}) {
    try {
      const response = await this.client.post('/track', {
        email,
        event: eventId,
        data
      });
      
      console.log(`Event triggered in Plunk: ${eventId} for ${email}`);
      return response.data;
      
    } catch (error) {
      console.error('Failed to trigger Plunk event:', error.response?.data || error.message);
      throw error;
    }
  }

  async sendTransactionalEmail(email, templateId, data = {}) {
    try {
      const response = await this.client.post('/emails', {
        to: email,
        template: templateId,
        data
      });
      
      console.log(`Transactional email sent via Plunk: ${templateId} to ${email}`);
      return response.data;
      
    } catch (error) {
      console.error('Failed to send transactional email:', error.response?.data || error.message);
      throw error;
    }
  }

  // Email Campaign Methods
  async sendWelcomeEmail(email, productType) {
    try {
      // Add contact with product information
      await this.addContact(email, {
        product_type: productType,
        signup_date: new Date().toISOString(),
        customer_status: 'active'
      });

      // Trigger welcome sequence based on product type
      const eventId = this.getWelcomeEventId(productType);
      await this.triggerEvent(email, eventId, {
        product_type: productType,
        purchase_date: new Date().toISOString()
      });

      return { success: true, message: 'Welcome email sequence initiated' };
      
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw error;
    }
  }

  async sendDailyProgressEmail(email, day, data = {}) {
    try {
      await this.triggerEvent(email, process.env.PLUNK_EVENT_DAILY_PROGRESS, {
        day,
        ...data
      });

      return { success: true, message: `Day ${day} email sent` };
      
    } catch (error) {
      console.error(`Failed to send day ${day} email:`, error);
      throw error;
    }
  }

  async sendCompletionEmail(email, validationResults) {
    try {
      await this.triggerEvent(email, process.env.PLUNK_EVENT_COMPLETION, {
        completion_date: new Date().toISOString(),
        validation_score: validationResults.score,
        recommendation: validationResults.recommendation
      });

      return { success: true, message: 'Completion email sent' };
      
    } catch (error) {
      console.error('Failed to send completion email:', error);
      throw error;
    }
  }

  async sendCommunityWelcome(customerId) {
    try {
      // Get customer email from Stripe customer ID
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const customer = await stripe.customers.retrieve(customerId);
      
      await this.triggerEvent(customer.email, process.env.PLUNK_EVENT_COMMUNITY_WELCOME, {
        community_join_date: new Date().toISOString()
      });

      return { success: true, message: 'Community welcome email sent' };
      
    } catch (error) {
      console.error('Failed to send community welcome email:', error);
      throw error;
    }
  }

  async sendPaymentFailureNotification(customerId, amount) {
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const customer = await stripe.customers.retrieve(customerId);
      
      await this.triggerEvent(customer.email, 'payment-failed', {
        failed_amount: amount,
        failure_date: new Date().toISOString()
      });

      return { success: true, message: 'Payment failure notification sent' };
      
    } catch (error) {
      console.error('Failed to send payment failure notification:', error);
      throw error;
    }
  }

  async sendExitSurvey(customerId) {
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const customer = await stripe.customers.retrieve(customerId);
      
      await this.triggerEvent(customer.email, 'exit-survey', {
        cancellation_date: new Date().toISOString()
      });

      return { success: true, message: 'Exit survey sent' };
      
    } catch (error) {
      console.error('Failed to send exit survey:', error);
      throw error;
    }
  }

  // Lead Magnet and Marketing
  async addLeadMagnetSubscriber(email, source = 'landing_page') {
    try {
      await this.addContact(email, {
        lead_source: source,
        signup_date: new Date().toISOString(),
        customer_status: 'lead'
      });

      await this.triggerEvent(email, process.env.PLUNK_EVENT_LEAD_MAGNET, {
        source,
        download_date: new Date().toISOString()
      });

      return { success: true, message: 'Lead magnet subscriber added' };
      
    } catch (error) {
      console.error('Failed to add lead magnet subscriber:', error);
      throw error;
    }
  }

  async sendSprint0Checklist(email, source = 'sprint0_checklist_page') {
    try {
      // Add contact specifically for Sprint 0 checklist download
      await this.addContact(email, {
        lead_source: source,
        lead_magnet: 'sprint0_setup_checklist',
        signup_date: new Date().toISOString(),
        customer_status: 'sprint0_lead'
      });

      // Generate secure download link
      const downloadToken = this.generateDownloadToken(email, 'sprint0-setup-checklist.md');
      const downloadLink = `${process.env.BASE_URL || 'https://7daymvp.com'}/api/downloads/secure/sprint0-setup-checklist.md?email=${encodeURIComponent(email)}&token=${downloadToken}`;

      // Trigger Sprint 0 checklist delivery email with download link
      await this.triggerEvent(email, 'sprint0-checklist-delivery', {
        source,
        download_date: new Date().toISOString(),
        checklist_type: 'sprint0_setup',
        download_link: downloadLink
      });

      return { success: true, message: 'Sprint 0 checklist sent successfully' };
      
    } catch (error) {
      console.error('Failed to send Sprint 0 checklist:', error);
      throw error;
    }
  }

  // Generate secure download token
  generateDownloadToken(email, filename) {
    const crypto = require('crypto');
    const secret = process.env.DOWNLOAD_TOKEN_SECRET || 'your-secret-key';
    const data = `${email}:${filename}:${Date.now()}`;
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  async sendNurtureSequence(email, sequenceType = 'pre_purchase') {
    try {
      await this.triggerEvent(email, `nurture-${sequenceType}`, {
        sequence_start: new Date().toISOString()
      });

      return { success: true, message: `${sequenceType} nurture sequence started` };
      
    } catch (error) {
      console.error('Failed to start nurture sequence:', error);
      throw error;
    }
  }

  // Utility Methods
  getWelcomeEventId(productType) {
    const eventMap = {
      'core': process.env.PLUNK_EVENT_CUSTOMER_ONBOARD,
      'community': process.env.PLUNK_EVENT_COMMUNITY_WELCOME,
      'coaching': 'coaching-welcome',
      'consulting': 'consulting-welcome'
    };
    
    return eventMap[productType] || process.env.PLUNK_EVENT_CUSTOMER_ONBOARD;
  }

  async getContactStats(email) {
    try {
      const response = await this.client.get(`/contacts/${email}`);
      return response.data;
      
    } catch (error) {
      console.error('Failed to get contact stats:', error);
      return null;
    }
  }

  async removeContact(email) {
    try {
      const response = await this.client.delete(`/contacts/${email}`);
      console.log(`Contact removed from Plunk: ${email}`);
      return response.data;
      
    } catch (error) {
      console.error('Failed to remove contact from Plunk:', error);
      throw error;
    }
  }

  // Analytics and Reporting
  async getEmailAnalytics(startDate, endDate) {
    try {
      const response = await this.client.get('/analytics', {
        params: {
          start: startDate,
          end: endDate
        }
      });
      
      return response.data;
      
    } catch (error) {
      console.error('Failed to get email analytics:', error);
      return null;
    }
  }

  // Batch Operations
  async bulkAddContacts(contacts) {
    try {
      const promises = contacts.map(contact => 
        this.addContact(contact.email, contact.data)
      );
      
      const results = await Promise.allSettled(promises);
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      console.log(`Bulk operation completed: ${successful} successful, ${failed} failed`);
      
      return { successful, failed, results };
      
    } catch (error) {
      console.error('Bulk contact addition failed:', error);
      throw error;
    }
  }
}

module.exports = PlunkService;