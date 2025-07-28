// Plunk API Integration for 7-Day MVP Validation System
// Handles email capture, sequence enrollment, and newsletter signup

const PLUNK_API_URL = 'https://api.useplunk.com/v1';
const PLUNK_API_KEY = process.env.PLUNK_API_KEY;

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email, source, sequence_type = 'validation-series' } = JSON.parse(event.body);

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email is required' })
      };
    }

    // Add contact to Plunk
    const contactResponse = await fetch(`${PLUNK_API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PLUNK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        subscribed: true,
        data: {
          source: source || 'website',
          signup_date: new Date().toISOString(),
          sequence: sequence_type
        }
      })
    });

    if (!contactResponse.ok) {
      throw new Error(`Plunk API error: ${contactResponse.status}`);
    }

    // Enroll in email sequence based on type
    const sequenceId = getSequenceId(sequence_type);
    if (sequenceId) {
      await enrollInSequence(email, sequenceId);
    }

    // Add to newsletter list
    await addToNewsletter(email);

    // Send welcome email immediately
    await sendWelcomeEmail(email, source);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Successfully subscribed to email sequences',
        email: email
      })
    };

  } catch (error) {
    console.error('Plunk integration error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};

// Helper function to get sequence ID based on type
function getSequenceId(sequenceType) {
  const sequences = {
    'validation-series': process.env.PLUNK_VALIDATION_SEQUENCE_ID,
    'onboarding': process.env.PLUNK_ONBOARDING_SEQUENCE_ID,
    'sprint-complete': process.env.PLUNK_SPRINT_SEQUENCE_ID
  };
  
  return sequences[sequenceType];
}

// Enroll user in specific email sequence
async function enrollInSequence(email, sequenceId) {
  if (!sequenceId) return;

  const response = await fetch(`${PLUNK_API_URL}/automations/${sequenceId}/subscribers`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PLUNK_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email
    })
  });

  if (!response.ok) {
    console.error(`Failed to enroll in sequence ${sequenceId}:`, response.status);
  }
}

// Add user to general newsletter
async function addToNewsletter(email) {
  const newsletterListId = process.env.PLUNK_NEWSLETTER_LIST_ID;
  if (!newsletterListId) return;

  await fetch(`${PLUNK_API_URL}/contacts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PLUNK_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      subscribed: true,
      data: {
        newsletter: true,
        list: 'general'
      }
    })
  });
}

// Send immediate welcome email
async function sendWelcomeEmail(email, source) {
  const welcomeTemplateId = process.env.PLUNK_WELCOME_TEMPLATE_ID;
  if (!welcomeTemplateId) return;

  await fetch(`${PLUNK_API_URL}/send`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PLUNK_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to: email,
      template: welcomeTemplateId,
      data: {
        source: source,
        dashboard_url: 'https://overnightmvp.netlify.app/sprint-0.html',
        support_email: 'support@overnightmvp.com'
      }
    })
  });
}