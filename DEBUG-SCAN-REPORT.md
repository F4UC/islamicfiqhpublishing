# DEBUG-SCAN-REPORT — Full-repo health scan

- **Date:** 2026-07-01
- **Branch:** `claude/debug-scan-report` (cut from latest `origin/main`)
- **Method:** Debug Harris discipline — evidence over guessing, READ-ONLY scan. No content/auth/gate/`CLAUDE.md`/`docs/*` edits. The only writes in this task: this report + deletion of **confirmed-merged** branches (SCAN F).
- **Scope scanned:** 193 `.html`, 27 `.js`, 5 `.css`, 960 `.json`, 150 media files.

Every finding carries: **file:line · evidence · severity · proposed action.** Nothing is fixed here — A1 + One triage, fixes ship later as separate small gated PRs.

---

## TL;DR — prioritized triage

| # | Severity | Finding | File | Proposed fix PR |
|---|----------|---------|------|-----------------|
| 1 | **BUG (404)** | 2 homepage hero images missing (fire a 404 each load; solid-color fallback hides it visually) | `index.html:769-770` | small PR: add images **or** drop the two `background-image` rules |
| 2 | DEAD-FILE | `hero-hadith.webp` — genuine 0-ref orphan | `images/heroes/hero-hadith.webp` | delete after A1 re-confirms 0-ref |
| 3 | DEAD-CODE | Dead `if (window.Clerk)…` fallback + stale "Clerk" comments (Clerk fully decommissioned; buttons work via `ifpSignIn`) | `pages/tools/hijri-time-machine.html:1155-1161`, `:82`, `:598` | small PR: drop the 2 dead fallback lines + refresh comments |
| 4 | SECURITY (hygiene) | Dead CSP allowance: `challenges.cloudflare.com` (Turnstile) — **0** source usage after email-login removal | `_headers:9` (script-src + frame-src) | small PR: prune Turnstile origins from CSP |
| 5 | DEAD-CODE (cosmetic) | Stale "was Clerk / clerk-auth.js" comments in `functions/**` + `main.js` | see SCAN E.2 | optional comment-refresh PR (defer to avoid cache-bust cascade on `main.js`) |
| 6 | BRANCH | 12 branches confirmed MERGED (squash) → deletion candidates; the rest are open/active/abandoned | see SCAN F | **actioned in this task** (merged only) |

**Clean scans (no action):** SCAN A internal links (all resolve), SCAN C JS parse (`node --check` 21/21 OK), SCAN C smart-quotes/dup-ids/secret-logging (none), SCAN D cache-bust (fully consistent), SCAN E secrets/deps/`.gitignore` (clean).

---

## SCAN A — broken references / 404 bugs

Extracted every same-origin `src`/`href`/`poster`/`preload`/CSS `url(...)` from all 193 HTML files, resolved relative to each file, and checked existence in the tree.

### A-1 · BUG (404) — missing homepage hero images
- **`index.html:769`** — `.cat-panel-reflections .cat-panel-bg { … background-image: url('/images/heroes/hero-reflections-1.jpg'); }` → **target does not exist.**
- **`index.html:770`** — `.cat-panel-works .cat-panel-bg { … background-image: url('/images/heroes/hero-works-1.jpg'); }` → **target does not exist.**
- **Evidence:** `git ls-files images/heroes/` lists `hero-{hadith,hajj-1..6,history-1..5,kalam-1..5,nitisart-1..6,tools-1..4}` — there is **no** `hero-reflections-*` or `hero-works-*` file at all. Both rules carry `background-color:#14100b`, so the panel degrades to a solid dark color and the breakage is invisible on screen — but the browser still issues a 404 GET on every homepage load. This is the same class as the `hero-works-1.jpg → 404` that motivated this scan; it is still live.
- **Severity:** BUG (404, low visual impact — cosmetic fallback exists).
- **Proposed action:** either (a) add the two hero images (respect Rule 67 hero-optional norms), or (b) drop the two `background-image` declarations and keep the solid `background-color`. Owner picks; ship as a 1-file PR.

### A-2 · verified FALSE POSITIVES (no action)
Reported by the raw scanner, confirmed benign:
- `articles/_TEMPLATE.html` → `../../{article.css,favicon.png,main.js,pages/CATEGORY.html}` — these resolve **above repo root** only because the template lives one level up (`articles/_TEMPLATE.html`); when cloned into `articles/<category>/<slug>.html` the `../../` paths resolve correctly. `CATEGORY.html` is a literal replaceable token. Template artifact, not a bug.
- `pages/tools/hijri-time-machine.html` → `${t.url}`, `${e.relatedArticle.url}`, `${a.urlAlt}` — JS template literals inside a `<script>`, not static hrefs.
- `login.html` → `document.referrer` — JS expression matched by the `href=` regex; not a real reference.
- **Supplement:** a second pass over every internal `<a href>` (including extensionless routes resolved as `.html`/`index.html`) found **0** broken links.

---

## SCAN B — dead / orphan files

Flagged every `.js`/`.css`/image/`.json` whose basename appears in **no** other tracked text file, then cross-checked JS-built paths (per the "linked only from JS is NOT dead" caveat).

### B-1 · DEAD-FILE candidate — `images/heroes/hero-hadith.webp`
- **Evidence:** the only `hero-hadith` references are `index.html:951` (`hero-hadith.mp4`, video src) and `pages/hadith.html:34,81` (`hero-hadith.jpg`, preload + bg). The `.webp` sibling is referenced **nowhere**.
- **Severity:** DEAD-FILE (0 inbound refs).
- **Proposed action:** delete after A1 independently re-confirms 0-ref. (Do NOT delete in this task — file deletion is content, out of this scan's allowed writes.)

### B-2 · verified FALSE POSITIVES — ijazah graph shards (21 files)
- `pages/tools/ijazah-data/graphs/*.json` (fadani_b3, fadani_b4, faid_rahmani, ghaya_taqrib, hajar_*, kalam_ashari, kawthari_*, matii_*, musalsal_rahma, musnad_shafii_tijani, sardar_*, shafii_fiqh, zamzami) were flagged only because they are loaded by **id**, not basename.
- **Confirmed live:** `pages/tools/ijazah-data/index.json` lists each id (verified: zamzami/fadani_b3/kalam_ashari/shafii_fiqh/faid_rahmani/sardar_bukhari all present), and the page fetches them via `GRAPH_BASE = '/api/ijazah/graph/'` → `functions/api/ijazah/[[path]].js:27` reads `/pages/tools/ijazah-data/graphs/<gid>.json` through `env.ASSETS`. **Not dead — gated data.** No action.

---

## SCAN C — JS / HTML correctness

- **C-1 `node --check`:** all **21** files under `functions/`, `js/`, plus `main.js`/`sw.js`/`pwa-register.js` parse cleanly. No failures.
- **C-2 smart-quote corruption in attributes** (`class`/`id`/`src`/`href`): **none** across all HTML.
- **C-3 duplicate `id=` in one file:** only `articles/_TEMPLATE.html` has `id="SLUG"` ×2 — a replaceable template token, not a served page. Note for template hygiene only; **not a bug** (both tokens are substituted at clone time).
- **C-4 secret-leaking `console.*` in `functions/`:** **none** (grepped token/secret/session/cookie/password/apikey/authorization/bearer).

---

## SCAN D — cache-bust consistency

**Fully consistent — no stragglers.**

| Asset | Versions in use | Count |
|-------|-----------------|-------|
| `main.js` | `?v=20260630b` (single) | 187 pages |
| `js/auth.js` | `?v=20260630b` (single) | 3 pages |
| `article.css` | `?v=20260614d` (single) | 174 pages |
| `components/header.html` | `?v=20260630b` (single) | 1 (fetched in `main.js`) |

- **`sw.js`:** `CACHE_VERSION = 'ifp-v3'` (`sw.js:20`); precache pins `/main.js?v=20260630b` (`sw.js:38`) — **matches** the site-wide version.
- No page found on an older `main.js` (`20260629b` / `20260619a`) — the stale-precache class caught previously is clean now.

---

## SCAN E — security / hygiene

- **E-1 committed secrets:** no `*.env`/`.dev.vars`/`*.pem`/`*.p8`/`*.key` files tracked; no hardcoded `sk_live_`/`pk_live_`/`re_…`/`whsec_…`/`ghp_…`/`AIza…` in tracked source. **Clean.**
- **E-2 Clerk / Resend / email-auth decommission sanity:**
  - `@clerk` dependency: **absent** from `package.json` / `package-lock.json`. ✔
  - `resend`: **0** references in js/html. ✔
  - `functions/api/auth/email/*`: **0** files, **0** references. ✔
  - **Residual `clerk` TEXT (not functional deps):**
    - **`pages/tools/hijri-time-machine.html:1160,1164`** — live but **dead** fallback: `if (window.Clerk) return Clerk.redirectToSignIn();` / `…redirectToSignUp();`. `window.Clerk` is never defined (Clerk script is loaded nowhere), and `js/auth.js:24` defines `window.ifpSignIn`, so `tmSignIn()`/`tmSignUp()` always take the working `ifp` path. → **dead code, buttons still work.** Plus stale comments at `:82`, `:598`, `:1155-1157`. → **DEAD-CODE, low.**
    - **`main.js:111`, `pages/tools/ijazah-network.html:1122`, `js/auth.js:2`, and comment banners in `functions/_lib/auth.js:8`, `functions/api/auth/{google,passkey}/*`, `functions/api/stripe/checkout.js:58`, `functions/api/ijazah/[[path]].js:51`, `functions/api/tm/[[path]].js:22-23,74`** — stale "was Clerk / parallel to live Clerk / replaces clerk-auth.js" comments. Historically accurate, functionally inert. → **DEAD-CODE (cosmetic), low.** (`docs/CODEX.md`, `docs/SCALING-ROADMAP.md` also mention Clerk — **out of scope**, `docs/*` untouched.)
  - **`clerk_user_id`** column writes in `functions/api/stripe/webhook.js` are **intentional** (NOT-NULL legacy column, documented `webhook.js:80`) — not a residual, no action.
- **E-3 `.gitignore`:** covers `.env`, `.env.*`, `.dev.vars*`, `node_modules/`, `scratch/`, `*.draft*`. `node_modules` is **not** tracked (0 files). **Clean.**
- **E-4 CSP allowance audit (`_headers:9`):**
  - `accounts.google.com` / `gsi.gstatic.com` — **used** (Google login on `/login`; GSI pulls assets from `gsi.gstatic`). Keep.
  - `static.cloudflareinsights.com` / `cloudflareinsights.com` — Cloudflare Web Analytics beacon (injected at edge, not in source). Keep.
  - **`challenges.cloudflare.com` (Turnstile) — DEAD allowance.** Present in `script-src` **and** `frame-src`, but **0** source usage (`turnstile`/`cf-turnstile`/`data-sitekey` grep empty). Almost certainly left from the removed email-login flow. → **SECURITY (hygiene): prune to shrink attack surface.**

---

## SCAN F — branch classification & cleanup

**Critical method note:** this repo **squash-merges** PRs, so no merged branch tip is an ancestor of `main` — `git branch -r --merged` returns **nothing** and is unusable here. Merged status below is taken from the **authoritative GitHub PR API** (`merged_at != null`), cross-checked with ahead/behind counts.

### F-1 · MERGED — safe to delete (deleted in this task)
All have a **closed PR with `merged_at` set**; GitHub retains one-click "Restore branch" on each merged PR, so deletion is fully reversible.

| Branch | PR | Purpose |
|--------|----|---------|
| `claude/auth-phase0-foundation` | #312 | auth foundation (D1 + session helper) |
| `claude/auth-phase1a-google` | #313 | Google id_token login |
| `claude/auth-phase1b-passkey` | #316 | passkey (WebAuthn) login |
| `claude/auth-phase1d-email` | #319 | email magic-link (later removed) |
| `claude/auth-phase2-cutover` | #317 | gate cutover Clerk → first-party session |
| `claude/auth-ui-and-price` | #310 | reactive header auth + tier badge |
| `claude/fix-ifp-menu-hidden` | #318 | header account-menu hide fix |
| `claude/ijazah-layout-ka` | #307 | ijazah compact chain-picker layout |
| `claude/remove-email-and-clerk` | #320 | remove email login + decommission Clerk |
| `claude/stripe-payments` | #309 | Stripe checkout + webhook → D1 |
| `claude/tm-shard-gate` | #308 | gate raw bidayah TM shards |
| `claude/cleanup-dead-files` | #321 | remove dead auth harness + purge Clerk CSP/COOP |

### F-2 · UNMERGED — leave for One's call (NOT touched)
**Open PRs (look active):**
| Branch | PR | Last commit | Purpose |
|--------|----|-------------|---------|
| `claude/bidayah-dataset-verification-7wqd1j` | #285 open | 2026-06-27 | bidayah dataset structural/translation QA |
| `claude/ijazah-graph-gating-z12xd9` | #304 open | 2026-06-29 | ijazah gating (this agent's assigned dev branch) |
| `claude/remove-shamela-link` | #306 open | 2026-06-30 | remove Shamela link |
| `claude/timemachine-muntazam-2` | #314 open | 2026-07-01 | Time Machine al-Muntazam (Muntazam/Oscar) — active |
| `claude/timemachine-muntazam-3` | #315 open | 2026-07-01 | Time Machine al-Muntazam handoff — active |
| `feat/months-finalize` | #294 open | 2026-06-28 | glossary muharram canonical + article months |
| `preview/timemachine-book-scoped-ui` | #297 open | 2026-06-29 | book-scoped Time Machine preview |

**Closed-without-merge (abandoned/superseded — One decides if worth deleting):**
| Branch | PR | Note |
|--------|----|------|
| `F4UC-patch-1` | #219 closed, not merged | old hadith-scholars edit |
| `claude/p3-daif-hadith-lesson-1` | #237 closed, not merged | daif hadith lesson |
| `claude/phase3-batch1` | #209 closed, not merged | article batch (reworked) |
| `claude/phase3-batch2` | #210 closed, not merged | article batch (reworked) |
| `claude/phase3-batch3` | #213 closed, not merged | article batch (reworked) |
| `claude/phase3-batch4` | #214 closed, not merged | article batch (reworked) |
| `claude/r90-align-pilot` | #290 closed, not merged | R90 alignment pilot |

**No PR ever opened (stale locals pushed long ago — One decides):**
| Branch | Last commit | Note |
|--------|-------------|------|
| `claude/exclude-internal-paths` | 2026-06-23 | Pages `_middleware` 404 for internal paths (behind 43) |
| `claude/muntazam-handoff-prep` | 2026-06-29 | Time Machine handoff docs (behind 21) |
| `claude/timemachine-prototype` | 2026-06-20 | old prototype (behind 81) |
| `claude/works-cover-cachebust` | 2026-06-19 | works.json cover cache-bust (behind 81) |

> ⚠️ Closed-without-merge and no-PR branches are **deliberately NOT deleted** — they contain commits not in `main` and are not recoverable from `main`. Only One should decide their fate.

---

## Proposed fix order (each = its own small PR, `DO NOT MERGE — A1 gate`, verified on preview)

1. **A-1 hero 404s** — 1 file (`index.html`), owner picks add-images vs drop-rules. No cache-bust cascade.
2. **E-4 dead CSP Turnstile allowance** — 1 file (`_headers`), remove `challenges.cloudflare.com` from `script-src`+`frame-src`. Verify served CSP on preview.
3. **B-1 `hero-hadith.webp` delete** — after A1 re-confirms 0-ref.
4. **C-3 / E-2 dead-code + stale comments** — `hijri-time-machine.html` dead Clerk fallback (2 lines) + comment refresh. **Skip `main.js` comment edits** to avoid a 187-page cache-bust cascade unless bundled with a real `main.js` change.

Nothing above is fixed yet. Awaiting A1 + One triage on which to ship.
