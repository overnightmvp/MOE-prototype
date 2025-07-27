// Stripe Checkout Component for 7-Day MVP Validation System
import { useState } from 'react';

const StripeCheckout = ({ 
  productType = 'core', 
  buttonText = 'Get 7-Day Validation System - $497',
  buttonClass = 'btn btn-primary',
  onSuccess,
  onError 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get customer email if available
      const customerEmail = getCustomerEmail() || '';
      
      // Create checkout session
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productType,
          email: customerEmail,
          customerInfo: {
            source: 'landing_page',
            userAgent: navigator.userAgent,
            referrer: document.referrer
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Track checkout initiation
      if (typeof gtag !== 'undefined') {
        gtag('event', 'begin_checkout', {
          event_category: 'Ecommerce',
          event_label: productType,
          currency: 'USD',
          value: getProductAmount(productType) / 100
        });
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;

    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message);
      
      if (onError) {
        onError(err);
      }

      // Track checkout error
      if (typeof gtag !== 'undefined') {
        gtag('event', 'checkout_error', {
          event_category: 'Error',
          event_label: err.message
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getProductAmount = (type) => {
    const amounts = {
      core: 49700,      // $497
      community: 9700,  // $97
      coaching: 99700,  // $997
      consulting: 500000 // $5000
    };
    return amounts[type] || amounts.core;
  };

  const getCustomerEmail = () => {
    // Check for previously captured email
    return localStorage.getItem('customerEmail') || 
           sessionStorage.getItem('customerEmail') || 
           '';
  };

  return (
    <div className="stripe-checkout-wrapper">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`${buttonClass} ${loading ? 'loading' : ''}`}
        data-product={productType}
      >
        {loading ? (
          <span className="loading-content">
            <span className="spinner"></span>
            Processing...
          </span>
        ) : (
          buttonText
        )}
      </button>
      
      {error && (
        <div className="checkout-error">
          <p>⚠️ {error}</p>
          <button 
            onClick={() => setError(null)}
            className="error-dismiss"
          >
            Try Again
          </button>
        </div>
      )}

      <style jsx>{`
        .stripe-checkout-wrapper {
          display: inline-block;
          position: relative;
        }

        .loading-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #ffffff40;
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .checkout-error {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #ff6b6b;
          color: white;
          padding: 12px;
          border-radius: 8px;
          margin-top: 8px;
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
          z-index: 10;
        }

        .checkout-error p {
          margin: 0 0 8px 0;
          font-size: 14px;
        }

        .error-dismiss {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 4px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .error-dismiss:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .btn.loading {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

// Product configuration for different checkout options
export const ProductOptions = {
  CORE: {
    type: 'core',
    name: '7-Day MVP Validation System',
    price: 497,
    description: 'Complete AI-powered validation framework',
    features: [
      'Complete 7-Day Framework',
      'AI-powered market research',
      'Daily email guidance & templates',
      'Landing page builder & copy',
      'Discord community access',
      '24/7 AI assistant support'
    ]
  },
  COMMUNITY: {
    type: 'community',
    name: 'Community Access',
    price: 97,
    description: 'Monthly Discord community and ongoing support',
    features: [
      'Discord community access',
      'Weekly group coaching calls',
      'Resource library',
      'Peer support network'
    ]
  },
  COACHING: {
    type: 'coaching',
    name: 'Implementation Coaching',
    price: 997,
    description: '1:1 coaching for MVP implementation',
    features: [
      'Everything in Core System',
      '90-minute 1:1 strategy session',
      'Personalized implementation plan',
      'Direct access to Johnny',
      '30-day email support'
    ]
  },
  CONSULTING: {
    type: 'consulting',
    name: 'Custom Consulting',
    price: 5000,
    description: 'Comprehensive strategic consulting package',
    features: [
      'Everything in Coaching',
      'Custom market research',
      'Competitive analysis',
      'Go-to-market strategy',
      '6-month implementation support'
    ]
  }
};

// Upsell component for post-purchase
export const UpsellCheckout = ({ originalPurchase, onSuccess }) => {
  const getUpsellProduct = (originalType) => {
    switch (originalType) {
      case 'core':
        return ProductOptions.COACHING;
      case 'community':
        return ProductOptions.CORE;
      default:
        return ProductOptions.COMMUNITY;
    }
  };

  const upsellProduct = getUpsellProduct(originalPurchase);

  return (
    <div className="upsell-checkout">
      <div className="upsell-header">
        <h3>Perfect! One more thing...</h3>
        <p>Since you're serious about validation, here's an exclusive offer:</p>
      </div>

      <div className="upsell-product">
        <h4>{upsellProduct.name}</h4>
        <p className="upsell-price">${upsellProduct.price}</p>
        <p className="upsell-description">{upsellProduct.description}</p>
        
        <ul className="upsell-features">
          {upsellProduct.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>

      <div className="upsell-actions">
        <StripeCheckout
          productType={upsellProduct.type}
          buttonText={`Yes, Add ${upsellProduct.name} - $${upsellProduct.price}`}
          buttonClass="btn btn-primary upsell-btn"
          onSuccess={onSuccess}
        />
        
        <button 
          className="btn btn-secondary"
          onClick={() => window.location.href = '/dashboard'}
        >
          No thanks, take me to my account
        </button>
      </div>

      <style jsx>{`
        .upsell-checkout {
          max-width: 500px;
          margin: 0 auto;
          padding: 40px 20px;
          text-align: center;
        }

        .upsell-header h3 {
          color: var(--mvp-primary);
          margin-bottom: 10px;
        }

        .upsell-product {
          background: var(--mvp-light-gray);
          padding: 30px;
          border-radius: 12px;
          margin: 30px 0;
          border: 3px solid var(--mvp-black);
        }

        .upsell-price {
          font-size: 2rem;
          font-weight: bold;
          color: var(--mvp-primary);
          margin: 10px 0;
        }

        .upsell-features {
          list-style: none;
          text-align: left;
          margin: 20px 0;
        }

        .upsell-features li {
          padding: 5px 0;
          padding-left: 25px;
          position: relative;
        }

        .upsell-features li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: var(--mvp-success);
          font-weight: bold;
        }

        .upsell-actions {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .upsell-btn {
          font-size: 1.1rem;
          padding: 18px 24px;
        }
      `}</style>
    </div>
  );
};

export default StripeCheckout;