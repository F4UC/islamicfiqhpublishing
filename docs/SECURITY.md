# Security & HTTP Headers Policy — Islamic Fiqh Publishing

> Authoritative security/headers doc. Codified by **Rule 74** in `CLAUDE.md`.
> Enforced at the edge via the repo-root **`_headers`** file (Cloudflare Pages).
> เอกสารนี้คือแหล่งอ้างอิงจริงของนโยบายความมั่นคง — แก้ที่นี่ที่เดียว แล้วให้ `_headers` ตรงกัน

---

## 1. Content-Security-Policy (CSP)

CSP ถูกบังคับใช้ใน `_headers` สำหรับทุก path (`/*`). นโยบายปัจจุบัน (สรุป):

- `default-src 'self'`
- `script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com`
- `style-src 'self' 'unsafe-inline'`
- `font-src 'self'` · `connect-src 'self' https://cloudflareinsights.com`
- `img-src 'self' data: blob: https:`
- `connect-src 'self'`
- `frame-ancestors 'self'` · `base-uri 'self'` · `object-src 'none'` · `form-action 'self'` · `upgrade-insecure-requests`

### ★ ข้อบังคับ — ห้ามแตะ `'unsafe-inline'` (Rule 74 / audit D-3)
- **ห้ามตัด `'unsafe-inline'`** ออกจาก `script-src` หรือ `style-src` เด็ดขาด
- **ห้าม refactor inline event handlers** (`onclick="scrollToTop()"`, `toggleDarkMode()`, `changeFontSize()`, `copyCite()` ฯลฯ) หรือ inline `<script>` blocks ในเทมเพลต/บทความ ไปเป็น `addEventListener`
- เหตุผล: control bar (cb-*) + chrome (theme/font/Arabic toggle, copy, back-to-top) และ no-flash theme bootstrap พึ่งพา inline เหล่านี้ทั้งเว็บ การ harden CSP จะทำให้ทั้งไซต์พัง
- การ harden CSP (เช่น ย้ายไป nonce/hash) เป็นงานใหญ่ระดับสถาปัตยกรรม — **ต้องได้รับอนุมัติจาก One ก่อนเท่านั้น** ห้ามเอเยนต์ตัดสินใจเอง

## 2. Cache-Control (HTML must not be cached)

`_headers` กำหนดให้ HTML ทุกชนิดเสิร์ฟแบบ **no-store** เพื่อกันผู้ใช้เห็นหน้าเก่า:

```
/*.html  (และ /, /pages/*, /pages/tools/* ฯลฯ)
  Cache-Control: no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0
  Surrogate-Control: no-store
```

- Shared versioned assets (`article.css`, `main.js`) ใช้ cache-busting ผ่าน `?v=YYYYMMDD…` (ดู Cache-busting ใน `CLAUDE.md`) — เมื่อ bump เวอร์ชันต้อง bump พร้อมกันทั้งเว็บใน commit เดียว
- ห้ามตั้ง HTML ให้ cacheable (จะทำให้ผู้ใช้ค้างหน้าเก่าแม้ deploy แล้ว)

## 3. Other security headers (`_headers`)

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`  *(directive ใส่แล้ว — ต้อง submit ที่ hstspreload.org เพื่อ enroll จริง; sticky)*
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Cross-Origin-Opener-Policy: same-origin`
- `X-Permitted-Cross-Domain-Policies: none`
- *(จงใจ **ไม่** ใส่ `Cross-Origin-Resource-Policy` — จะบล็อกการ embed รูป/เนื้อหา cross-origin ที่ถูกต้องของไซต์เผยแพร่)*
- **`/.well-known/security.txt`** (RFC 9116) — ช่องทาง responsible disclosure

## 4. Branch protection / deploy ruleset (agents)

- **Push ตรง `main` ถูกบล็อก (503)** — ทุกการเปลี่ยนแปลงต้องผ่าน **PR → Cloudflare preview → QA + byte-QC → owner-merge**
- **★ เอเยนต์ทุกตัวห้าม merge เข้า `main`★** — เฉพาะ One (เจ้าของ) เท่านั้นที่ merge (สอดคล้อง Rule 66, debug-harris, Push & safety discipline)
- **★ ห้าม "Purge Everything"★** — หลัง merge ใช้ **Custom Purge เฉพาะ URL** ที่แก้เท่านั้น
- Per-deployment verify ต้อง fetch จาก per-deployment hash URL (ไม่ใช่ branch alias / ไม่ใช่ production ที่ WAF 403) — Rule 66
- บทความที่ติด **child-safety flag (Rule 71)** ห้าม merge โดยเด็ดขาดจนกว่า One ตัดสิน

## 5. Preview-deployment access control (Rule 84)

Cloudflare Pages preview (`*.pages.dev`) เป็น **public** — ใครมีลิงก์ hash/branch-alias ก็เปิดได้
โดยไม่ต้อง auth ดังนั้น **ดราฟต์ที่ยังไม่เผยแพร่ต้องถือว่าเปิดเผยต่อสาธารณะแล้วโดยปริยาย**:

- **ดราฟต์ sensitive โดยเฉพาะบทที่ติด child-safety flag (Rule 71)** ต้องไม่เข้าถึงได้ผ่าน preview —
  สอดคล้องหลัก Rule 71 "ห้าม surface/reproduce ที่ใดก็ตาม"
- มาตรการที่แนะนำ: ใส่ **Cloudflare Access** (email/SSO/one-time-PIN) ครอบ preview deployments
  ของโปรเจกต์ หรือปิด **public branch alias** (ให้เหลือเฉพาะ per-deployment hash ที่ไม่เดา)
- per-deployment hash URL ใช้สำหรับ **QA ภายในเท่านั้น** — ห้ามโพสต์/แชร์ลิงก์สู่สาธารณะ
- เนื้อหาที่ติด Rule 71: ห้าม build/push ขึ้น branch ที่จะสร้าง preview จนกว่า One ตัดสิน

## 6. Supply-chain & runtime security baseline (Rule 85)

- **Token/secret:** ใช้ **fine-grained PAT** (จำกัดเฉพาะ repo ที่ต้องใช้ + สิทธิ์ขั้นต่ำ เช่น
  contents + pull_requests) **ตั้งวันหมดอายุ + หมุนเปลี่ยน**; ห้าม classic PAT แบบ scope `repo` กว้าง;
  **ห้าม commit secret/token ลง repo** — เปิด **GitHub secret scanning + push protection** (ฟรีสำหรับ
  public repo) เป็นด่านสุดท้าย · สอดคล้อง *Push & safety discipline* (ห้ามอ่าน/ใช้ credential เรียก API ตรง)
- **DOM (กัน stored-XSS):** ข้อมูลที่มาจาก JSON / แหล่งภายนอก / ผู้ใช้ ต้อง render ด้วย
  `textContent` หรือ DOM API เสมอ — **ห้าม `innerHTML`/`insertAdjacentHTML` กับข้อมูลที่ไม่ trusted**
  (ตัวอย่างที่ทำถูก: `el()` ใน `ijazah-network.html` ใช้ `textContent` กับชื่ออาหรับ)
- **Vendored libraries:** pin ชื่อไฟล์ตามเวอร์ชัน + **SRI (`integrity="sha384-…"`)** + บันทึกใน
  `pages/tools/vendor/MANIFEST.sha256`; โหลดเฉพาะ `script-src 'self'` — **ห้ามโหลด script จาก CDN ภายนอก**
  · หมายเหตุ: SRI จะ pass ก็ต่อเมื่อ Cloudflare เสิร์ฟ bytes เดิม → ปิด Auto-Minify JS / Rocket Loader
- **CI gate:** ทุก PR ต้องผ่าน `.github/workflows/ci.yml` (articles.json/JSON valid, Arabic-ortho gate,
  gitleaks secret scan) ก่อน owner-merge
- **Dependencies:** libs เป็น vendored (ไม่มี package manifest) → ติดตามเวอร์ชัน/CVE ด้วยมือ;
  `.github/dependabot.yml` ดูแลเฉพาะ github-actions

---
หากแก้นโยบายใด ๆ ที่นี่ ต้องอัปเดต `_headers` ให้ตรงกันใน commit เดียว และ verify ด้วย cache-busted fetch
