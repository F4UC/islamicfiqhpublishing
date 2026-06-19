# Security hardening — action checklist

สถานะงาน hardening (อ้างอิง `docs/SECURITY.md`, Rule 74/84/85). ติ๊กเมื่อทำเสร็จ.

## ✅ ทำแล้ว (code/config — อยู่ใน PR)
- [x] `/.well-known/security.txt` (RFC 9116) — PR #202
- [x] Headers: COOP, X-Permitted-Cross-Domain-Policies, HSTS `preload` directive — PR #202
- [x] SRI (sha384) บน vendored cytoscape/dagre — PR #202 · **verify แล้ว: bytes ตรงทั้ง preview + production**
- [x] CI (`.github/workflows/ci.yml`): JSON/ortho gate + gitleaks — PR #202
- [x] Dependabot (github-actions) — PR #202
- [x] Rule 84 (preview access) + Rule 85 (supply-chain/runtime) + SECURITY.md §5/§6 — PR #203
- [x] CSP hardening roadmap (`docs/csp-hardening-roadmap.md`) — PR #203
- [x] **GitHub secret scanning + push protection — เปิดแล้ว** (ผ่าน API)
- [x] Cloudflare Rocket Loader = Off, Auto-Minify = deprecated/off (เจ้าของยืนยัน)

## ☐ เหลือ — เจ้าของทำเอง (ต้องสิทธิ์ dashboard/admin)
**Cloudflare / DNS**
- [ ] **Cloudflare Access** ครอบ preview deployments (กันดราฟต์/บทกฎ 71 หลุด — Rule 84)
- [ ] Submit **HSTS preload** ที่ https://hstspreload.org (sticky — ทำเมื่อพร้อม commit ระยะยาว)
- [ ] เปิด **DNSSEC** + ตั้ง **CAA record** (จำกัด CA ที่ออก cert)

**GitHub**
- [ ] **Branch protection `main`**: require PR + require status check `ci` (ทำได้หลัง #202 merge แล้ว check จะโผล่) — ผมไม่ตั้งให้เองเพราะอาจล็อก owner-merge flow
- [ ] บังคับ **2FA** ทั้ง org (Settings → org → Authentication security)
- [ ] เปลี่ยน **classic PAT → fine-grained** (เฉพาะ repo + contents/pull_requests) + ตั้งหมดอายุ + หมุนเปลี่ยน

**งานใหญ่ (ทำทีหลัง)**
- [ ] CSP hardening ตาม `docs/csp-hardening-roadmap.md` (เริ่มเฟส 0 report-only) — ต้อง One อนุมัติ (Rule 74)

## ☐ Deploy runbook (เมื่อพร้อม merge)
1. merge **#200, #201, #202, #203** (ลำดับอิสระ; #202 ต้องกด Ready ก่อน — ทำแล้ว)
2. หลัง deploy → **Custom Purge `/main.js` ทีเดียว** (จาก #201; ที่เหลือ no-cache เสิร์ฟสด)
3. เปิด `https://islamicfiqhpublishing.com/pages/tools/ijazah-network` → Console (F12) ไม่มี error integrity = SRI ผ่าน ✅
