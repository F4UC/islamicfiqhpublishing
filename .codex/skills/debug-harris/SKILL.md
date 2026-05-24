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
- Do not sacrifice animations, visual identity, Arabic typography, QOTD behavior, or editorial charter compliance without calling out the tradeoff first.
- Treat DNS, SSL, Cloudflare Workers/Pages, cache, and deployment state as separate layers.
- Record absolute times or concrete dates when diagnosing recent deploy/DNS/cache behavior.
- Always develop on branch `claude/rules-full-update-kGLfz`, then merge to `main` to trigger Cloudflare deploy.
- After pushing to `main`, wait for Cloudflare to deploy (typically 30–60 seconds), then fetch the live URL to verify.

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
- For UI fixes, verify that Arabic text direction, punctuation, mobile layout, and animations still comply with the 51 Iron Rules below.
- State what was verified and what remains pending, such as DNS propagation or Cloudflare cache purge.

---

# Editorial Charter — The 51 Iron Rules

Every fix must not violate these rules. Check compliance before committing.

## Section 1: Academic & Editorial Integrity

- **R1** Maintain 100% of the original content. No truncation or modification without editorial approval.
- **R2** Code modifications within articles: structural HTML and CSS only.
- **R3** No insertion of speculative or unverified data (Fiqh, Kalam, Hadith, History).
- **R4** All analyses must accurately reference classical primary sources.
- **R5** Avoid colloquialisms when referring to the Prophet and scholars. Use academic prose.
- **R6** Arabic book titles in references must stay in native Arabic script — no translation.
- **R7** Quranic citations must be verified at `https://quran.com/ar` with exact Surah and Ayah.
- **R8** Hadith texts from `https://sunnah.com/` or `https://shamela.ws/` — full Harakat required.

## Section 2: Transliteration & Word Choice

- **R9** First mention of a classical scholar must include demise year: `(เสียชีวิตปี ฮ.ศ. XXX / ค.ศ. XXX)`.
- **R10** Honorifics follow the name **without parentheses** — even adjacent to the demise year.
- **R11** Al- (ال) transliteration follows Shamsiyya rules; exception: "ชะรีอะฮ์" omits "อัช-".
- **R12** Use "อิหม่าม" — never "อิมาม" or "ท่านอิมาม".
- **R13** Transliterated terms in Thai sentences: **no spaces** before or after.
- **R14** Never use "ทว่า"; always use "แต่".
- **R15** Quotations, Hadith, and translations: curved marks `"..."` only — never straight `"..."`.
- **R16** Book titles in text and bibliography: always wrap in `<strong>`.
- **R17** Never use `<em>` or CSS italic for book titles.

## Section 3: Language & Typography Structure

- **R18** `<body>` and all Thai elements must carry `lang="th"`.
- **R19** Arabic text ≤ 1 line → center-aligned. > 1 line → blockquote.
- **R20** Thai translation of Arabic text ≤ 60 words → below source inside `<div class="thai-quote">`.
- **R21** Highlighted keywords in body text: `<strong>` only.
- **R22** Fiqh container structures use stable system architecture classes.

## Section 4: Code & CSS Architecture

- **R23** All CSS inside `<style>` in `<head>` — never injected into `<body>`.
- **R24** Fonts: **Amiri** (Arabic), **Sarabun** (Thai), **Inter** (English) — no substitutes.
- **R25** Every page must have `id="header-placeholder"` and `id="footer-placeholder"`.
- **R26** Subfolder assets use double backtrack: `../../`.
- **R27** Body `line-height: 2.0` standard — prevents diacritic overlap.
- **R28** Thai paragraphs: `text-align: left` + `word-break: break-word` — never `justify`.
- **R29** Brand gold `#c49a45` for badges, active states, and highlights.
- **R30** No inline `style=""` attributes — except script-calculated dynamic values.
- **R31** QOTD data array must sit at the end of the file, before `</body>`.

## Section 5: UI/UX & Digital Experience

- **R32** Article pages: Centered Reading Layout, max-width 900px — no sidebar TOC.
- **R33** `tools.html`: Premium Minimalist — white cards, thin borders, soft shadows.
- **R34** Tool cards must show a status badge (พร้อมใช้งาน / กำลังพัฒนา / กำลังพิจารณา).
- **R35** Scroll Reveal animations via `.reveal` class.
- **R36** Back-to-top button `#backToTopBtn` appears after 400px scroll depth.
- **R37** Dark Mode supported via `.dark-mode` class on `<html>`.
- **R38** Reading panel font size: A- / Normal / A+ clamped between 14px–28px.
- **R39** Reading Progress Bar pinned at top viewport boundary.
- **R40** Citation format: `ผู้เขียน. (ปี พ.ศ.). ชื่อบทความ. Islamic Fiqh Publishing. สืบค้นจาก [URL]`.
- **R41** Copy buttons show "คัดลอกแล้ว ✓" for 2 seconds.
- **R42** All images must have a descriptive `alt` attribute.
- **R43** Fiqh article citations: Arabic block and Thai translation strictly separated (R20 / R49).
- **R44** `<title>` format: `[Article/Page Title] — Islamic Fiqh Publishing` (em dash).
- **R45** All layouts validated with `@media` queries for mobile.
- **R46** `index.html` must have a "Featured Applications" section above the article list.

## Section 6: RTL Core Specification

- **R47** All block-level or list elements containing pure Arabic text must carry `dir="rtl"` and `lang="ar"`.
- **R48** Standard blockquote and bibliography blueprint:

```html
<ul class="ref-list" lang="ar" dir="rtl">
  <li>...Arabic content...</li>
</ul>

<blockquote lang="ar" dir="rtl" class="quote-container">
  <span class="ar">...Arabic content...</span>
</blockquote>

<div class="references">
  <h2 class="ref-title" lang="th">บรรณานุกรม</h2>
  <ul class="ref-list" lang="ar" dir="rtl">
    <li>ابن كثير. <strong>البداية والنهاية</strong>. بيروت: دار إحياء التراث العربي.</li>
  </ul>
</div>
```

## Section 7: Long-form & Mixed Script Standards

- **R49** Source text > 60 words: show Thai translation only, preceded by attribution formula. Conceal original under `<details><summary>ดูตัวบทต้นฉบับ ▼</summary>...</details>`.
  - Scholar: `[Name] (เสียชีวิตปี ฮ.ศ. XXX / ค.ศ. XXX) [Honorific] กล่าวว่า:`
  - Quran: `อัลลอฮ์ ซุบหานะฮูวะตะอาลา ตรัสในสูเราะฮ์ [X] อายะฮ์ที่ [Y] ว่า:`
  - Hadith: `ท่านนบีมุหัมมัด ศ็อลลัลลอฮุอะลัยฮิวะซัลลัม กล่าวว่า:` (บันทึกโดย [...])

```html
<blockquote class="quote-container">
  <div class="thai-quote">
    <span class="attribution">อัซซุบกีย์ (เสียชีวิตปี ฮ.ศ. 771 / ค.ศ. 1370) เราะหิมะฮุลลอฮ์ กล่าวว่า:</span>
    "...คำแปลภาษาไทย..."
  </div>
  <details class="source-toggle">
    <summary>ดูตัวบทต้นฉบับ ▼</summary>
    <div lang="ar" dir="rtl" class="ar">...نص عربي...</div>
  </details>
</blockquote>
```

- **R50** Inline Arabic in Thai paragraphs:
  - `:lang(ar)` → `font-size: 1.15em`
  - `span.ar-inline` → `vertical-align: middle`
  - Mixed paragraphs → `line-height: 2.4`

- **R51** QOTD system:
  - `setInterval` fixed at **9,000 ms** — do not change without editorial approval.
  - Every `ar` entry must have full Harakat, `lang="ar" dir="rtl"` on the container, no quotation marks or periods inside `ar` field.
  - If author provides text: accept as-is, add Harakat if missing, cite source.
  - If no text provided: verify via web search against primary sources.
  - `th` field: ASCII `"` outer + curly `"..."` as content typography. Use `\n` (JS escape, not actual newline) for line breaks.
  - `author` field: `ชื่อ · เสียชีวิตปี ฮ.ศ. XXX` — ASCII `"` delimiters.
  - Array placed before `</body>` per R31.
