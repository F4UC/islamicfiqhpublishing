---
name: debug-harris
description: Harris debugging discipline for Islamic Fiqh Publishing. Use when the user reports a bug, blank page, slow site, broken deployment, DNS/SSL/Cloudflare/GitHub issue, console error, responsive/layout regression, animation performance problem, or asks to debug/check/investigate why something failed. Apply reproducibility, fail-path tracing, hypothesis falsification, and an experiment ledger. Agent has full autonomy to commit and push without asking permission. Must verify the live site after every deployment.
---

# Debug Harris

Debugging protocol for Islamic Fiqh Publishing. Use this skill when something is broken, slow, unreachable, inconsistent, or suspicious.

## Opening discipline

At the start of the first debugging response, state this compact checklist once:

> **Debug Harris**
> 1. Reproduce before guessing.
> 2. Trace the fail path before fixing.
> 3. Try to disprove the leading hypothesis.
> 4. Keep every run as a breadcrumb.

If the user asks for speed or says to skip the checklist, apply the protocol silently.

## Autonomy & Reporting

- **Full autonomy granted.** Commit and push changes without asking the user for permission.
- **Always verify the live site** after every deploy. Fetch `https://islamicfiqhpublishing.com` and `https://www.islamicfiqhpublishing.com` to confirm the fix is live and the page is not blank.
- **Report what changed**, not what you plan to do. After completing work, summarize: what was broken, what was changed (file, line, value), and what was verified on the live site.
- Keep Thai user-facing explanations clear and practical; avoid noisy internal narration.

## Project constraints

- Do not remove, simplify, or alter Islamic academic content unless the user explicitly approves the exact content change.
- **Child safety overrides fidelity (CLAUDE.md Rule 71), for every agent.** If a Drive source or any content sexualizes a minor: drop only the offending span and set a child-safety flag (PASS-with-flag); never surface, quote, reproduce, or restore it anywhere — report only its location to the owner (One) + Claude and stop. Never self-merge a child-safety-flagged article.
- Do not sacrifice animations, visual identity, Arabic typography, QOTD behavior, or editorial charter compliance without calling out the tradeoff first.
- Treat DNS, SSL, Cloudflare Workers/Pages, cache, and deployment state as separate layers.
- Record absolute times or concrete dates when diagnosing recent deploy/DNS/cache behavior.
- **Always cut a fresh branch from the latest `main`** for each task (name it `claude/<short-task>`), open a PR, and let the **owner merge** to trigger the production Cloudflare deploy. **Agents never push or merge to `main`.**
- After the owner merges to `main`, Cloudflare deploys (typically 30–60 seconds); the owner (or an agent on request) then fetches the live URL to verify.

## 1. Reproduce

Build a concrete pass/fail signal before proposing a fix.

- Web availability: test the exact URL, protocol, hostname, device, and browser path.
- Deployment: check commit hash, branch, build status, custom domain mapping, and cache status.
- Frontend bug: reproduce with a local server or browser automation when feasible.
- Layout/mobile issue: check at least one desktop and one mobile viewport when the symptom is visual.
- Performance issue: identify whether the cost is script loop, animation, network, font, image, layout, or cache.

If there is no repro, say so and ask for the missing artifact: screenshot, URL, console error, network log, deploy log, or exact steps.

## 2. Trace The Fail Path

Follow the path from request to symptom. Prefer direct evidence over assumptions.

For website availability:

1. DNS: apex and `www` records, proxy status, old GitHub Pages records, propagation.
2. TLS/HTTPS: certificate, HTTP-to-HTTPS redirect, Cloudflare SSL mode, Always Use HTTPS.
3. Routing: Workers/Pages custom domain, route patterns, project production URL.
4. Origin/build: latest deployment, build logs, generated files, branch.
5. Browser/cache: Cloudflare cache, local browser cache, private window, mobile DNS cache.

For frontend bugs:

1. Console errors.
2. Network failures.
3. Runtime script order and missing DOM nodes.
4. CSS visibility/layout conditions.
5. Recent commits touching the failing surface.

Only add instrumentation after the visible path and configuration knobs have been checked. Tag temporary probes with a unique prefix such as `[DBG-HARRIS]` and remove them before finishing.

## 3. Falsify

List 2-5 ranked hypotheses before changing code or configuration. For each serious hypothesis, name what would disprove it.

Examples:

- "If HTTPS works but HTTP returns 200 without redirect, the issue is not certificate failure; it is missing HTTPS enforcement."
- "If the Pages production URL works but the custom domain fails, the build is not the root cause."
- "If disabling a frame loop fixes jank but removes animation, the fix must preserve the animation with throttling or pause rules."

Run the cheapest disproof first.

## 4. Breadcrumb Ledger

Keep a short ledger while debugging. Each entry should include:

- What was tested or changed.
- What happened.
- What it ruled in or out.

Use the ledger to avoid contradicting prior observations. Before declaring the root cause, check that it explains all breadcrumbs, not only the latest one.

## Fix Rules

- Proceed directly — no permission needed for commit, push, or merge to main.
- Keep changes minimal and reversible.
- Validate the exact failing path after the fix by fetching the live URL.
- For web changes, verify both `https://islamicfiqhpublishing.com` and `https://www.islamicfiqhpublishing.com`.
- For UI fixes, verify that Arabic text direction, punctuation, mobile layout, and animations still comply with the 51 Iron Rules in `CLAUDE.md`.
- State what was verified and what remains pending, such as DNS propagation or Cloudflare cache purge.

---

## Editorial Charter — The 51 Iron Rules

The authoritative source is **`CLAUDE.md`** at the repository root. Claude Code loads it automatically every session — read it there. Do not maintain a copy here; `CLAUDE.md` is the single source of truth.

Before committing any fix, confirm it does not violate any rule in `CLAUDE.md`.
