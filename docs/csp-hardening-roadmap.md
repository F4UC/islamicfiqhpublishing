# CSP Hardening Roadmap — drop `'unsafe-inline'` from `script-src`

> สถานะ: **ข้อเสนอ (proposal)** · ต้องได้รับอนุมัติจาก One ก่อนเริ่ม (Rule 74 / `docs/SECURITY.md §1`
> ห้ามแตะ `'unsafe-inline'` โดยพลการ) · เอกสารนี้คือคำขออนุมัติ + แผนทำเป็นเฟส

## 1. ปัญหา
CSP ปัจจุบัน: `script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com`

`'unsafe-inline'` ทำให้ **inline `<script>` หรือ `onclick=...` ใดๆ ที่ถูกแทรกเข้ามารันได้ทันที** —
จึงทำให้ CSP กัน script-injection / stored-XSS **ไม่ได้จริง** (ถ้ามี PR ร้าย/เนื้อหาร้ายหลุดเข้า main)

ทำไมตอนนี้ยังตัดไม่ได้ (ตาม Rule 74):
- **inline event handlers** บน chrome ทั้งเว็บ: `onclick="scrollToTop()"`, `toggleDarkMode()`,
  `changeFontSize()`, `copyCite()`, control bar `cb-*`
- **inline `<script>` bootstrap**: no-flash theme (อ่าน localStorage ตั้ง `.dark-mode` ก่อน render)
- ตัด `'unsafe-inline'` ตอนนี้ = chrome พังทั้งไซต์

## 2. เป้าหมาย (เลือกแนวทาง)
| แนวทาง | เหมาะกับ static site | ครอบ `onclick` inline | ภาระดูแล |
|---|---|---|---|
| **A. Hash-based** (`'sha256-…'` ต่อ inline block) | ✅ ไม่ต้องมี server | ✗ ต้อง `'unsafe-hashes'` หรือย้ายออก | hash เปลี่ยนทุกครั้งที่แก้ inline |
| **B. Nonce-based** (nonce ต่อ request) | ✗ ต้องมี edge (Pages Functions/Worker) inject nonce | ✓ | ปานกลาง |
| **C. Externalize ทั้งหมด** → ตัด `'unsafe-inline'` | ✅ | ✓ (ใช้ `addEventListener`) | ครั้งเดียวจบ, สะอาดสุด |

**แนะนำ: C เป็นเป้าหมายปลายทาง** (สอดคล้องกฎ 85 textContent/no-inline), ระหว่างทางใช้ A/report-only วัดผล

## 3. แผนเป็นเฟส (test บน preview ทุกเฟส, ห้าม merge ทั้งที่ chrome พัง)
- **เฟส 0 — วัดก่อน (ไม่กระทบผู้ใช้):** เพิ่ม `Content-Security-Policy-Report-Only` ที่ตั้ง
  `script-src 'self' https://static.cloudflareinsights.com` (ไม่มี unsafe-inline) + `report-uri`/`report-to`
  → เก็บ violation report ดูว่ามี inline จุดไหนบ้าง โดยไซต์จริงยังทำงานปกติ
- **เฟส 1 — ย้าย event handlers:** เปลี่ยน `onclick=...` ทุกจุดใน chrome/control-bar/template
  เป็น `addEventListener` ใน `main.js` (ทีละหน้า/ทีละ component, bump `?v=` + purge `/main.js`)
- **เฟส 2 — ย้าย bootstrap:** ย้าย no-flash theme bootstrap ออกเป็นไฟล์ภายนอก (หรืออนุญาตด้วย hash)
- **เฟส 3 — ตัด `'unsafe-inline'`:** เมื่อ report-only เฟส 0 ขึ้นเป็น 0 violation แล้ว ย้าย policy
  จาก report-only มา enforce + ลบ `'unsafe-inline'` ออกจาก `script-src`
  (พิจารณาคง `style-src 'unsafe-inline'` หรือ hash แยก — inline style เสี่ยงน้อยกว่า)
- **เฟส 4 — ป้องกันถอยหลัง:** เพิ่ม CI check (ต่อยอด `.github/workflows/ci.yml`) จับ `onclick=`/inline
  `<script>` ใหม่ใน articles/templates → กันไม่ให้ inline กลับมา

## 4. ความเสี่ยง / หมายเหตุ
- กระทบ **ทุกหน้า** (chrome ใช้ร่วม) + `main.js` เป็น cached asset → ต้อง bump `?v=` + Custom Purge ทุกเฟส
- ทำทีละเฟส, verify per-deployment hash URL (Rule 66) ว่า theme/font/copy/back-to-top ยังทำงาน
- **ต้อง One อนุมัติ** (Rule 74) — เอกสารนี้เป็นข้อเสนอเริ่มจากเฟส 0 (report-only) ที่ความเสี่ยง = ศูนย์
