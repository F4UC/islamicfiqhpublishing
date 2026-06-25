# Handoff — Subscriptions + Login (สำหรับทดสอบ)

อัปเดต: 2026-06-25 · branch `claude/timemachine-years-1-100`

> ⚠️ **สำคัญที่สุด:** ระบบ Subscriptions และ Login **ยังไม่ถูกเขียนลงโค้ดในขณะนี้** — มีเพียง
> *สถาปัตยกรรมที่ออกแบบไว้* ใน `docs/SCALING-ROADMAP.md` (Axis C). เอกสารนี้สรุปว่า "อะไรมีจริง"
> vs "อะไรเป็นแค่แผน" เพื่อให้คุณทดสอบได้โดยไม่เข้าใจผิดว่ามีระบบอยู่แล้ว

---

## 1) สิ่งที่ "มีจริง" ในโค้ดตอนนี้
- โฮสต์: **Cloudflare Pages** (static) + **Pages Functions** (`functions/`)
  - `functions/_middleware.js` — บล็อกพาธภายใน (docs/ scripts/ .claude/ + ไฟล์ .md/.py) คืน 404 ก่อนเสิร์ฟ static
  - `functions/api/collect.js` — ตัวนับวิวบทความ (cookieless, ไม่มี PII) เขียนลง **D1** ผ่าน binding `env.DB`
- **D1 ใช้งานอยู่แล้ว** (binding `DB`) แต่ผูกผ่าน Cloudflare dashboard — **ไม่มี `wrangler.toml` ใน repo**
- `_headers` — **CSP เข้มงวดมาก** (ดูข้อ 4) + no-store cache ทุก HTML
- **ยังไม่มี:** auth / session / JWT / cookie login / payment / webhook / entitlement / paywall — ไม่มีไฟล์ใดเลย

## 2) สิ่งที่ "เป็นแผน" (authoritative design)
อ่านตัวจริงที่ **`docs/SCALING-ROADMAP.md` → Axis C — Membership / entitlement**. สรุปแกน:
- **หน่วยขาย = "ตัวงาน" (work)** ไม่ใช่ปี/เล่ม/ยุค — เช่น al-Bidayah = 1 work. subscribe = grant `{work_id}`
- **บิลลิ่ง = subscription ล้วน** (recurring, ไม่มีขายขาด) — corpus โตต่อเนื่อง · all-access bundle = union ทุก work
- **Gated = เฉพาะ Hijri Time Machine corpus** (shards/glossary/sources) · **บทความยัง public ทั้งหมด**
- ส่วนประกอบที่ต้องสร้าง (ลำดับ build ที่แนะนำ):
  1. **Auth** — login/session (Workers+JWT เอง หรือ Clerk/Supabase Auth)
  2. **Entitlement store (D1)** — ตาราง account/grant: ผูก user → `work_id` ที่มีสิทธิ์ + วันหมดอายุ
  3. **Gated data Worker/API** — session → entitlement → เสิร์ฟเฉพาะ account ที่ owned + locked-stub + server-side search filter (`WHERE source_id IN (owned)`)
  4. **Payment** — Stripe (สากล) / Omise (ไทย, **ต้องรองรับ PromptPay**) · webhook จ่าย/ต่อ/ยกเลิก → อัปเดต entitlement
  5. **Front-end** — login, "แพ็คของฉัน", buy/upgrade/re-subscribe, loader ยิง API พร้อม token
- **★ JSON = canonical, D1 = derived ★** — author แก้ JSON (gate ด้วย `tm_qc` ใน CI) → ETL push เข้า D1 → Worker เสิร์ฟจาก D1

## 3) จุดเชื่อม data model ↔ entitlement (ใช้ตอนทำ paywall)
- คอนเทนต์ที่จะ gate อยู่ที่ `pages/tools/timemachine-data/` (`index.json` + `bidayah-h*.json` + `glossary.json`)
- **work_id ของ subscription = `account.source`** (เช่น `"ibn-kathir"`) และ/หรือ `meta.book = "al-bidayah-wa-al-nihayah"`
  → กรองด้วยฟิลด์นี้เพื่อแยกสิทธิ์รายงาน (al-Bidayah แยกจากตำราเล่มอื่นในอนาคต)
- ปัจจุบัน TM JSON ยัง **เสิร์ฟ public แบบ static** — ตามแผนต้อง **ย้ายออกจาก static path ไปหลัง Worker/D1** ตอน launch (Axis C build ข้อ 4 ใน roadmap)

## 4) ข้อจำกัด/กับดักที่จะเจอตอนทดสอบ (อ่านก่อนเทส!)
- **CSP ใน `_headers` จะบล็อก Stripe/auth provider** — ปัจจุบัน:
  `script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; connect-src 'self' https://cloudflareinsights.com; frame-ancestors 'self'; form-action 'self'`
  → ต้องเพิ่ม origin ของ provider ใน `script-src`/`connect-src`/`frame-src` (เช่น `js.stripe.com`, `api.stripe.com`, `*.omise.co`) ไม่งั้น checkout/login widget จะไม่โหลด
- `functions/_middleware.js` รันก่อน static — ถ้าเพิ่ม route auth/api ใหม่ ตรวจว่าไม่โดน BLOCK_PREFIX/BLOCK_EXT โดยไม่ตั้งใจ
- **ไม่มี `wrangler.toml`** → binding D1/KV/secret (Stripe keys) ตั้งใน Cloudflare dashboard; ทดสอบ local ต้องสร้าง `wrangler.toml` + `.dev.vars` เอง (อย่า commit secret)
- `_headers` ตั้ง no-store ทุก HTML/pages — หน้า login/account ที่มี state ต้องวางแผน cache ให้เหมาะ
- เอกสาร security ที่เกี่ยวข้อง: `docs/SECURITY-CHECKLIST.md`, `docs/csp-hardening-roadmap.md`

## 5) สถานะ al-Bidayah ingestion (คอนเทนต์ที่จะขาย)
- **ปี ฮ.ศ. 1 → 430 เสร็จ = 421 shards** · ปีว่าง 9 ปี (30/32/38/42/52/58/82/92/303) · glossary 1,226 persons / 278 places
- ทุก shard ผ่าน `tm_qc.py` + byte-gate · push ครบบน branch นี้
- **เหลือ ~337 ปี ถึงปีสุดท้าย ~767** · ★ทำต่อ = ปี 431 (สมรภูมิดันดานกอน)
- รายละเอียด harness + กฎ: **`pages/tools/timemachine-data/HANDOFF-al-bidayah.md`**

---
### เช็กลิสต์ทดสอบเร็ว (greenfield — เริ่มจากศูนย์)
1. ตัดสินใจ provider: Auth (Clerk/Supabase หรือ Workers+JWT) + Payment (Stripe/Omise+PromptPay)
2. สร้าง `wrangler.toml` + binding D1 + secrets (อย่า commit) → migrate ตาราง entitlement
3. อัปเดต CSP ใน `_headers` ให้ allow provider (มิฉะนั้น widget โหลดไม่ขึ้น)
4. ทำ Worker/Function: `/api/auth/*` (login/session) + `/api/tm/*` (gated: session→entitlement→data)
5. ETL: `timemachine-data/*.json` → D1 (gate ด้วย work_id) — JSON ยังเป็นต้นฉบับ
6. ทดสอบ flow: signup → subscribe (test card / PromptPay sandbox) → webhook grant → เข้าถึง gated TM → logout/expire → re-subscribe
