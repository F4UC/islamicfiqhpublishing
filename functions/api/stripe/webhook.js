import Stripe from 'stripe';

export async function onRequestPost(context) {
  const { request, env } = context;
  const sig  = request.headers.get('stripe-signature');
  const raw  = await request.text(); // RAW body — required for signature verification
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, { httpClient: Stripe.createFetchHttpClient() });

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      raw, sig, env.STRIPE_WEBHOOK_SECRET, undefined, Stripe.createSubtleCryptoProvider()
    );
  } catch (e) {
    return new Response('invalid signature', { status: 400 });
  }

  const DB = env.DB;
  try {
    if (event.type === 'checkout.session.completed') {
      const s = event.data.object;
      // one-time pass only (subscriptions are handled by invoice.paid)
      if (s.mode === 'payment' && s.payment_status === 'paid') {
        const uid = s.metadata && s.metadata.clerk_user_id;
        const plan = s.metadata && s.metadata.plan_id;
        if (uid && plan) await grantPass(DB, uid, plan);
      }
    } else if (event.type === 'invoice.paid') {
      const inv = event.data.object;
      if (inv.subscription) {
        const sub = await stripe.subscriptions.retrieve(inv.subscription);
        const uid  = sub.metadata && sub.metadata.clerk_user_id;
        const plan = sub.metadata && sub.metadata.plan_id;
        const end  = new Date(sub.current_period_end * 1000).toISOString();
        if (uid && plan) await upsertSub(DB, sub.id, uid, plan, 'active', end);
      }
    } else if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object;
      await DB.prepare(`UPDATE subscriptions SET status='canceled' WHERE sub_id=?`).bind(sub.id).run();
    }
  } catch (e) {
    return new Response('handler error', { status: 500 }); // 5xx → Stripe retries
  }
  return new Response('ok', { status: 200 });
}

// 30-day pass: deterministic sub_id so repeat purchases STACK instead of piling up rows
async function grantPass(DB, uid, plan) {
  const subId = `pass:${uid}:${plan}`;
  const row = await DB.prepare(
    `SELECT current_period_end AS e FROM subscriptions WHERE sub_id=?`
  ).bind(subId).first();
  let baseMs = Date.now();
  if (row && row.e) {
    const existing = Date.parse(row.e);
    if (!isNaN(existing) && existing > baseMs) baseMs = existing; // extend from current end if still active
  }
  const end = new Date(baseMs + 30 * 86400 * 1000).toISOString();
  await DB.prepare(
    `INSERT INTO subscriptions (sub_id, clerk_user_id, plan_id, status, current_period_end, source)
     VALUES (?,?,?,?,?, 'stripe')
     ON CONFLICT(sub_id) DO UPDATE SET
       status='active', current_period_end=excluded.current_period_end, plan_id=excluded.plan_id`
  ).bind(subId, uid, plan, 'active', end).run();
}

async function upsertSub(DB, subId, uid, plan, status, end) {
  await DB.prepare(
    `INSERT INTO subscriptions (sub_id, clerk_user_id, plan_id, status, current_period_end, source)
     VALUES (?,?,?,?,?, 'stripe')
     ON CONFLICT(sub_id) DO UPDATE SET
       status=excluded.status, current_period_end=excluded.current_period_end, plan_id=excluded.plan_id`
  ).bind(subId, uid, plan, status, end).run();
}
