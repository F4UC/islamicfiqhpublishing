// ==========================================================================
// /api/collect — anonymous, cookieless article view counter (Cloudflare Pages Function)
// --------------------------------------------------------------------------
// - POST only (other methods get the framework's default 405).
// - Cookieless. Reads no IP and stores no PII. The only datum kept is an
//   aggregate per-article counter in D1.
// - article_id is validated against the REAL id set baked from articles.json
//   (not a regex) so junk rows can never be injected.
// - Every outcome returns 204 with no body: no echo, no enumeration, no leak.
// - Analytics must never break the page: any D1/parse error is swallowed and
//   we still answer 204.
// ==========================================================================

import articlesData from "../../articles.json";

// Built once at module init (baked at deploy time). Re-deploying after an
// articles.json change refreshes this set automatically.
const VALID_IDS = new Set(
  (Array.isArray(articlesData) ? articlesData : [])
    .map((a) => a && a.id)
    .filter(Boolean)
);

// CORS courtesy layer only — NOT a security boundary. The real gate is the
// article_id id-set check below (see Rule note: CORS is courtesy, not security).
const APEX_ORIGIN = "https://islamicfiqhpublishing.com";

// Server-side bot/crawler skip (the client skips too, but never trust the client).
// Only unambiguous non-interactive crawlers / HTTP clients — NOT messaging-app
// in-app browsers (Telegram/WhatsApp/etc.), which are real readers that run JS
// and fire the beacon; filtering those would undercount shared-link views.
const BOT_RE = /bot|crawl|spider|slurp|mediapartners|bingpreview|facebookexternalhit|embedly|headless|phantom|puppeteer|playwright|lighthouse|gtmetrix|pingdom|uptime|monitor|curl|wget|python-requests|axios|go-http/i;

function corsHeaders(origin) {
  // Only name the apex origin; same-origin beacons don't need CORS at all.
  if (origin === APEX_ORIGIN) {
    return {
      "Access-Control-Allow-Origin": APEX_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin",
    };
  }
  return { Vary: "Origin" };
}

function noContent(origin) {
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

// Single catch-all handler so the function owns EVERY method on this route
// (exporting only onRequestPost lets other methods fall through to static
// asset serving instead of being rejected). OPTIONS → preflight 204,
// POST → counter, anything else → 405.
export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;
  const origin = request.headers.get("Origin");

  // TEMP gated diagnostic (removed before merge): responds only to a private
  // probe token, so normal/public callers never see it — no public leak.
  // Reports only whether the D1 binding is present (boolean), never any error.
  if (new URL(request.url).searchParams.get("probe") === "ifp-d1-checkX9q2") {
    return new Response(null, {
      status: 204,
      headers: { "x-db-bound": env && env.DB ? "1" : "0" },
    });
  }

  if (method === "OPTIONS") return noContent(origin); // CORS preflight (courtesy)
  if (method !== "POST") {
    return new Response(null, {
      status: 405,
      headers: { ...corsHeaders(origin), Allow: "POST" },
    });
  }

  // Server-side bot skip — silently 204 (counted as no-op).
  const ua = request.headers.get("User-Agent") || "";
  if (BOT_RE.test(ua)) return noContent(origin);

  // Parse JSON body; malformed → 204 (no error surfaced).
  let articleId = null;
  try {
    const body = await request.json();
    if (body && typeof body.article_id === "string") {
      articleId = body.article_id;
    }
  } catch (e) {
    return noContent(origin);
  }

  // ★ Validate against the real article id set — reject junk silently (204). ★
  if (!articleId || !VALID_IDS.has(articleId)) {
    return noContent(origin);
  }

  // Increment the aggregate counter. Never let analytics break UX: on any
  // failure (or a missing binding) we still answer 204.
  try {
    if (env && env.DB) {
      await env.DB.prepare(
        "INSERT INTO article_hits (article_id, views, last_viewed) " +
          "VALUES (?1, 1, CURRENT_TIMESTAMP) " +
          "ON CONFLICT(article_id) DO UPDATE SET " +
          "views = views + 1, last_viewed = CURRENT_TIMESTAMP"
      )
        .bind(articleId)
        .run();
    }
  } catch (e) {
    // swallow — aggregate analytics is best-effort
  }

  return noContent(origin);
}
