'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface UpgradePromptProps {
  onUpgrade?: () => void;
  message?: string;
}

export function UpgradePrompt({ 
  onUpgrade, 
  message = "You've reached your daily limit of 3 analyses. Upgrade to Pro for unlimited analyses!" 
}: UpgradePromptProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleUpgrade = async (plan: 'PRO' | 'AGENCY') => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/v1/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      });

      const data = await response.json();

      if (response.ok && data.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to start upgrade process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upgrade to Continue
        </h3>
        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {/* Pro Plan */}
          <div className="bg-white rounded-lg border-2 border-blue-200 p-6 hover:border-blue-300 transition-colors">
            <div className="text-center">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Pro</h4>
              <div className="mb-4">
                <span className="text-3xl font-bold text-blue-600">$29</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>✅ Unlimited Analyses</li>
                <li>✅ Advanced AI Insights</li>
                <li>✅ Priority Support</li>
                <li>✅ White-label Reports</li>
              </ul>
              <button
                onClick={() => handleUpgrade('PRO')}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? 'Processing...' : 'Upgrade to Pro'}
              </button>
            </div>
          </div>

          {/* Agency Plan */}
          <div className="bg-white rounded-lg border-2 border-purple-200 p-6 hover:border-purple-300 transition-colors relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                Most Popular
              </span>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Agency</h4>
              <div className="mb-4">
                <span className="text-3xl font-bold text-purple-600">$99</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>✅ Everything in Pro</li>
                <li>✅ API Access</li>
                <li>✅ Custom Branding</li>
                <li>✅ Team Accounts</li>
                <li>✅ Dedicated Support</li>
              </ul>
              <button
                onClick={() => handleUpgrade('AGENCY')}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? 'Processing...' : 'Upgrade to Agency'}
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          No credit card required for free tier • Cancel anytime • 30-day money-back guarantee
        </p>
      </div>
    </div>
  );
}