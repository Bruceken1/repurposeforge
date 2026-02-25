import express from 'express';
import Stripe from 'stripe';
import authMiddleware from '../middleware/auth.js';
import pb from '../utils/pocketbase.js';
import logger from '../utils/logger.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const tierPrices = {
  free: 0,
  pro: 2999, // $29.99
  enterprise: 9999, // $99.99
};

// POST /stripe/create-checkout - Create Stripe Checkout Session
router.post('/create-checkout', authMiddleware, async (req, res) => {
  const { tier, successUrl, cancelUrl } = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  if (!tier || !tierPrices[tier]) {
    return res.status(400).json({ error: 'Invalid tier' });
  }

  if (!successUrl || !cancelUrl) {
    return res.status(400).json({ error: 'Missing successUrl or cancelUrl' });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Plan`,
          },
          unit_amount: tierPrices[tier],
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      tier,
    },
  });

  res.json({ url: session.url });
});

// POST /stripe/webhook - Handle Stripe webhook events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    logger.warn('STRIPE_WEBHOOK_SECRET not configured');
    return res.json({ received: true });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    logger.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, tier } = session.metadata;

    if (userId && tier) {
      try {
        await pb.collection('subscriptions').create({
          user_id: userId,
          tier,
          stripe_subscription_id: session.subscription,
          stripe_customer_id: session.customer,
          status: 'active',
          created_at: new Date().toISOString(),
        });

        // Update user tier
        await pb.collection('users').update(userId, { tier });
      } catch (err) {
        logger.error('Failed to create subscription record:', err.message);
      }
    }
  }

  res.json({ received: true });
});

export default router;