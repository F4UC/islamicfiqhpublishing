import Stripe from 'stripe';
import { verifyUserBySession } from '../../_lib/auth.js';

// Price IDs come from env (One sets them in Cloudflare). Keeps code free of hardcoded IDs.
function priceFor(env, planId, mode) {
  const map = {
    'fiqh-plus': { subscription: env.STRIPE_PRICE_PLUS_SUB, pass: env.STRIPE_PRICE_PLUS_PASS },
    'fiqh-pro':  { subscription: env.STRIPE_PRICE_PRO_SUB,  pass: env.STRIPE_PRICE_PRO_PASS },
  };
  return map[planId] && map[planId][mode];
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // 1. Auth: identify the user from the first-party session cookie (Phase 2 cutover)
  const uid = await verifyUser(request, env);
  if (!uid) return json({ ok: false, error: 'auth_required' }, 401);

  // 2. Parse body
  let body;
  try { body = await request.json(); } catch (e) { return json({ ok: false, error: 'bad_json' }, 400); }
  const planId = body && body.plan_id;
  const mode   = body && body.mode; // 'pass' | 'subscription'
  if ((planId !== 'fiqh-plus' && planId !== 'fiqh-pro') || (mode !== 'pass' && mode !== 'subscription')) {
    return json({ ok: false, error: 'bad_request' }, 400);
  }
  const price = priceFor(env, planId, mode);
  if (!price) return json({ ok: false, error: 'price_not_configured' }, 500);

  // 3. Create Checkout Session
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, { httpClient: Stripe.createFetchHttpClient() });
  const origin = new URL(request.url).origin;

  const params = {
    mode: mode === 'subscription' ? 'subscription' : 'payment',
    line_items: [{ price, quantity: 1 }],
    success_url: `${origin}/pages/account.html?paid=1`,
    cancel_url:  `${origin}/pages/membership.html?canceled=1`,
    client_reference_id: uid,
    metadata: { user_id: uid, plan_id: planId },
    // PromptPay is one-time only → offer it for passes; subscriptions are card-only
    payment_method_types: mode === 'subscription' ? ['card'] : ['card', 'promptpay'],
  };
  if (mode === 'subscription') {
    params.subscription_data = { metadata: { user_id: uid, plan_id: planId } };
  }

  try {
    const session = await stripe.checkout.sessions.create(params);
    return json({ ok: true, url: session.url }, 200);
  } catch (e) {
    return json({ ok: false, error: 'stripe_error' }, 502);
  }
}

// ---- resolve the signed-in user from our first-party session cookie (Phase 2
// cutover; was Clerk JWT). Returns the userId string or null; never throws. ----
async function verifyUser(request, env) {
  const r = await verifyUserBySession(env, request);
  return r ? r.userId : null;
}

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
