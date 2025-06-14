import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Client-side Stripe instance
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
};

// Price IDs - You'll get these from Stripe Dashboard after creating products
export const STRIPE_PLANS = {
  PRO: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
  AGENCY: process.env.STRIPE_AGENCY_PRICE_ID || 'price_agency_monthly',
} as const;

// Plan configurations
export const PLAN_LIMITS = {
  FREE: {
    analysesPerDay: 3,
    features: ['Basic SEO Analysis', 'AI Optimization Score', 'Core Recommendations']
  },
  PRO: {
    analysesPerDay: -1, // Unlimited
    features: [
      'Unlimited Analyses',
      'Advanced AI Insights', 
      'Competitor Comparison',
      'Priority Support',
      'Bulk URL Analysis',
      'White-label Reports'
    ]
  },
  AGENCY: {
    analysesPerDay: -1, // Unlimited
    features: [
      'Everything in Pro',
      'API Access',
      'Custom Branding',
      'Team Accounts',
      'Advanced Analytics',
      'Dedicated Support'
    ]
  }
} as const;