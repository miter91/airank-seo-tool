import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { stripe, STRIPE_PLANS } from '@/lib/stripe';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { plan } = await request.json();

    // Validate plan
    if (!plan || !['PRO', 'AGENCY'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    let customer;
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (user?.stripeCustomerId) {
      // Use existing customer
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      // Create new customer
      customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || undefined,
        metadata: {
          userId: user?.id || 'unknown'
        }
      });

      // Save customer ID to database
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customer.id }
        });
      }
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS],
          quantity: 1,
        },
      ],
      success_url: `${request.headers.get('origin')}/dashboard?success=true&plan=${plan.toLowerCase()}`,
      cancel_url: `${request.headers.get('origin')}/dashboard?canceled=true`,
      metadata: {
        userId: user?.id || 'unknown',
        plan: plan
      }
    });

    return NextResponse.json({ 
      checkoutUrl: checkoutSession.url 
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}