// Payment Processing Routes - Stripe Integration
// Handles all payment-related endpoints for the 7-Day MVP Validation System

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { logPaymentEvent } = require('../services/analytics');
const { enrollCustomer } = require('../services/customer');

// Product Configuration
const PRODUCTS = {
  core: {
    priceId: process.env.STRIPE_PRODUCT_CORE,
    amount: 49700, // $497.00
    name: '7-Day MVP Validation System',
    description: 'Complete AI-powered MVP validation framework'
  },
  community: {
    priceId: process.env.STRIPE_PRODUCT_COMMUNITY,
    amount: 9700, // $97.00
    name: 'Community Access',
    description: 'Monthly access to Discord community and ongoing support'
  },
  coaching: {
    priceId: process.env.STRIPE_PRODUCT_COACHING,
    amount: 99700, // $997.00
    name: 'Implementation Coaching',
    description: '1:1 coaching session for MVP implementation'
  },
  consulting: {
    priceId: process.env.STRIPE_PRODUCT_CONSULTING,
    amount: 500000, // $5,000.00
    name: 'Custom Consulting',
    description: 'Comprehensive strategic consulting package'
  }
};

// Create Checkout Session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { productType, email, customerInfo } = req.body;
    
    // Validate product type
    if (!PRODUCTS[productType]) {
      return res.status(400).json({ error: 'Invalid product type' });
    }
    
    const product = PRODUCTS[productType];
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: product.priceId,
          quantity: 1,
        },
      ],
      mode: productType === 'community' ? 'subscription' : 'payment',
      success_url: `${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/?cancelled=true`,
      metadata: {
        productType,
        customerEmail: email,
        source: 'landing_page'
      },
      // For subscriptions, add trial period
      ...(productType === 'community' && {
        subscription_data: {
          trial_period_days: 7
        }
      })
    });
    
    // Log checkout creation
    await logPaymentEvent('checkout_created', {
      sessionId: session.id,
      productType,
      amount: product.amount,
      email
    });
    
    res.json({ sessionId: session.id, url: session.url });
    
  } catch (error) {
    console.error('Checkout session creation failed:', error);
    res.status(500).json({ error: 'Unable to create checkout session' });
  }
});

// Verify Payment Success
router.get('/verify-session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      // Log successful payment
      await logPaymentEvent('payment_successful', {
        sessionId,
        customerId: session.customer,
        amount: session.amount_total,
        productType: session.metadata.productType
      });
      
      res.json({
        success: true,
        customer: session.customer,
        productType: session.metadata.productType,
        amount: session.amount_total
      });
    } else {
      res.json({ success: false, status: session.payment_status });
    }
    
  } catch (error) {
    console.error('Session verification failed:', error);
    res.status(500).json({ error: 'Unable to verify payment' });
  }
});

// Stripe Webhook Handler
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle specific events
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
        
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object);
        break;
        
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
        
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    res.json({ received: true });
    
  } catch (error) {
    console.error('Webhook handling failed:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Customer Portal (for subscription management)
router.post('/create-portal-session', authenticateUser, async (req, res) => {
  try {
    const { customerId } = req.body;
    
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.APP_URL}/dashboard`,
    });
    
    res.json({ url: portalSession.url });
    
  } catch (error) {
    console.error('Portal session creation failed:', error);
    res.status(500).json({ error: 'Unable to create portal session' });
  }
});

// Refund Processing
router.post('/process-refund', authenticateUser, async (req, res) => {
  try {
    const { paymentIntentId, reason } = req.body;
    
    // Verify user has permission to request refund
    // (implement your business logic here)
    
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: reason || 'requested_by_customer'
    });
    
    await logPaymentEvent('refund_processed', {
      refundId: refund.id,
      paymentIntentId,
      amount: refund.amount,
      reason
    });
    
    res.json({ success: true, refundId: refund.id });
    
  } catch (error) {
    console.error('Refund processing failed:', error);
    res.status(500).json({ error: 'Unable to process refund' });
  }
});

// Get Customer Payment History
router.get('/payment-history', authenticateUser, async (req, res) => {
  try {
    const { customerId } = req.user;
    
    const payments = await stripe.paymentIntents.list({
      customer: customerId,
      limit: 10
    });
    
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 10
    });
    
    res.json({
      payments: payments.data,
      subscriptions: subscriptions.data
    });
    
  } catch (error) {
    console.error('Payment history retrieval failed:', error);
    res.status(500).json({ error: 'Unable to retrieve payment history' });
  }
});

// Webhook Event Handlers
async function handleCheckoutCompleted(session) {
  console.log('Checkout completed:', session.id);
  
  try {
    // Enroll customer in appropriate product
    await enrollCustomer({
      sessionId: session.id,
      customerId: session.customer,
      customerEmail: session.customer_email,
      productType: session.metadata.productType,
      amount: session.amount_total
    });
    
    // Send welcome email via Plunk
    const { sendWelcomeEmail } = require('../services/plunk');
    await sendWelcomeEmail(session.customer_email, session.metadata.productType);
    
    // Log conversion
    await logPaymentEvent('conversion_completed', {
      sessionId: session.id,
      productType: session.metadata.productType,
      amount: session.amount_total,
      customerEmail: session.customer_email
    });
    
  } catch (error) {
    console.error('Error handling checkout completion:', error);
  }
}

async function handleSubscriptionCreated(subscription) {
  console.log('Subscription created:', subscription.id);
  
  try {
    // Add customer to community
    const { addToDiscordCommunity } = require('../services/discord');
    await addToDiscordCommunity(subscription.customer);
    
    // Send community welcome email
    const { sendCommunityWelcome } = require('../services/plunk');
    await sendCommunityWelcome(subscription.customer);
    
  } catch (error) {
    console.error('Error handling subscription creation:', error);
  }
}

async function handleSubscriptionCancelled(subscription) {
  console.log('Subscription cancelled:', subscription.id);
  
  try {
    // Remove from community (grace period)
    const { scheduleDiscordRemoval } = require('../services/discord');
    await scheduleDiscordRemoval(subscription.customer, 30); // 30 day grace period
    
    // Send exit survey
    const { sendExitSurvey } = require('../services/plunk');
    await sendExitSurvey(subscription.customer);
    
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

async function handlePaymentSucceeded(invoice) {
  console.log('Payment succeeded:', invoice.id);
  
  // Handle recurring subscription payments
  if (invoice.subscription) {
    await logPaymentEvent('subscription_payment_succeeded', {
      invoiceId: invoice.id,
      subscriptionId: invoice.subscription,
      amount: invoice.amount_paid,
      customerId: invoice.customer
    });
  }
}

async function handlePaymentFailed(invoice) {
  console.log('Payment failed:', invoice.id);
  
  try {
    // Send payment failure notification
    const { sendPaymentFailureNotification } = require('../services/plunk');
    await sendPaymentFailureNotification(invoice.customer, invoice.amount_due);
    
    await logPaymentEvent('payment_failed', {
      invoiceId: invoice.id,
      customerId: invoice.customer,
      amount: invoice.amount_due,
      attempt: invoice.attempt_count
    });
    
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

module.exports = router;