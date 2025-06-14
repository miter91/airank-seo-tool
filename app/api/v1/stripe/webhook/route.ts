import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === 'subscription') {
          // Get the subscription
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          // Update user plan in database
          await prisma.user.update({
            where: { stripeCustomerId: session.customer as string },
            data: {
              plan: session.metadata?.plan === 'AGENCY' ? 'AGENCY' : 'PRO',
            }
          });

          console.log(`User upgraded to ${session.metadata?.plan} plan`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Handle subscription updates (plan changes, etc.)
        const customer = await stripe.customers.retrieve(
          subscription.customer as string
        );

        if (customer && !customer.deleted) {
          await prisma.user.update({
            where: { stripeCustomerId: customer.id },
            data: {
              // Update plan based on subscription status
              plan: subscription.status === 'active' ? 'PRO' : 'FREE',
            }
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Handle subscription cancellation
        const customer = await stripe.customers.retrieve(
          subscription.customer as string
        );

        if (customer && !customer.deleted) {
          await prisma.user.update({
            where: { stripeCustomerId: customer.id },
            data: { plan: 'FREE' }
          });

          console.log('User downgraded to FREE plan');
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Handle failed payments
        console.log('Payment failed for customer:', invoice.customer);
        
        // You might want to send an email notification here
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}