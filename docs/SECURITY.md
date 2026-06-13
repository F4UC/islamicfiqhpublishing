# Security & HTTP Headers Policy — Islamic Fiqh Publishing

> Authoritative security/headers doc. Codified by **Rule 74** in `CLAUDE.md`.
> Enforced at the edge via the repo-root **`_headers`** file (Cloudflare Pages).
> เอกสารนี้คือแหล่งอ้างอิงจริงของนโยบายความมั่นคง — แก้ที่นี่ที่เดียว แล้วให้ `_headers` ตรงกัน

---

## 1. Content-Security-Policy (CSP)

CSP ถูกบังคับใช้ใน `_headers` สำหรับทุก path (`/*`). นโยบายปัจจุบัน (สรุป):

- `default-src 'self'`
- `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com`
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`
- `font-src 'self' https://fonts.gstatic.com`
- `img-src 'self' data: blob: https:`
- `connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com`
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
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## 4. Branch protection / deploy ruleset (agents)

- **Push ตรง `main` ถูกบล็อก (503)** — ทุกการเปลี่ยนแปลงต้องผ่าน **PR → Cloudflare preview → QA + byte-QC → owner-merge**
- **★ เอเยนต์ทุกตัวห้าม merge เข้า `main`★** — เฉพาะ One (เจ้าของ) เท่านั้นที่ merge (สอดคล้อง Rule 66, debug-harris, Push & safety discipline)
- **★ ห้าม "Purge Everything"★** — หลัง merge ใช้ **Custom Purge เฉพาะ URL** ที่แก้เท่านั้น
- Per-deployment verify ต้อง fetch จาก per-deployment hash URL (ไม่ใช่ branch alias / ไม่ใช่ production ที่ WAF 403) — Rule 66
- บทความที่ติด **child-safety flag (Rule 71)** ห้าม merge โดยเด็ดขาดจนกว่า One ตัดสิน

---
หากแก้นโยบายใด ๆ ที่นี่ ต้องอัปเดต `_headers` ให้ตรงกันใน commit เดียว และ verify ด้วย cache-busted fetch
