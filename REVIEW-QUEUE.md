# REVIEW-QUEUE — Phase 2 pilot

> One + Claude (orchestrator) review before merge. DRAFT PRs only — no merge/deploy/purge.
> This branch carries **one** pilot article. Items marked ⚑ need editorial confirmation.

---

## ibn-battuta-the-great-traveler — อิบนุ บะฏูเฏาะฮ์: นักเดินทางรอบโลกแห่งศตวรรษ · DRAFT PR · branch claude/phase2-ibn-battuta-traveler
- **source:** Drive `13_4aKk6WvZRvi5FdaXiQlxL2XGP-cZJj4Th5ty9ToaI` (#51) · ตอน: 1 (เดี่ยว)
- **category:** history (ประวัติศาสตร์) · author: กองบรรณาธิการ
- **child-safety (R71):** ✅ ผ่าน — สารคดีการเดินทาง ไม่มีประเด็นเด็ก
- **สถานะ:** ✅ build เสร็จ · lint PASS · coverage **99.94%** (≥99) · reading-time 22
- **Arabic:** มีเฉพาะ inline book-title `رحلة ابن بطوطة` (`.ar-inline`) — ไม่มี aya/hadith, ไม่มี tashkeel ที่ต้องแตะ → ไม่มี AUDIT-FIXES entry
- **§6 footnote/bib:** ไม่มี aya/hadith → ไม่มี footnote (ตาม §6.3) · บรรณานุกรม = 2 URL ที่ผู้เขียนให้มา (BBC Arabic + Britannica), LTR

### ต้องอนุมัติ/ท้วงติง
- [x] **✅ RESOLVED (One): ทับศัพท์ → "อิบนุ บะฏูเฏาะฮ์"** (ต→ฏ, ตรงกับบทเดิม `ibn-battuta-in-al-andalus` + precise translit ط→ฏ) — แก้แล้วทั้ง title + body + meta + articles.json (50 จุด) · เพิ่ม "Ibn Battuta = อิบนุ บะฏูเฏาะฮ์" เข้า R73 corpus ใน rulebook PR (D)
- [ ] **⚑ หัวข้อซ้ำกับบทเดิม (subject overlap):** `ibn-battuta-in-al-andalus` = เฉพาะช่วงอันดะลุส; บทนี้ = ชีวประวัติ/การเดินทางเต็ม → ใช้ slug ใหม่ `ibn-battuta-the-great-traveler` · ขอยืนยันว่าให้อยู่คู่กันได้
- [ ] **self-made: มุหัมหมัด → มุฮัมมัด** (3×: ชื่ออิบนุ บะตูเตาะฮ์ในย่อหน้านำ + สุลต่านมุฮัมมัด บิน ตุฆลุฆ ×2) — normalize ทับศัพท์ตาม corpus (R12/R73) · **ไม่ใช่พระนามท่านนบี** (เป็นชื่ออิบนุ บะตูเตาะฮ์เองและสุลต่านเดลี) → ไม่มี ﷺ · ขอยืนยัน
- [ ] **self-made: ทว่า → แต่** (1×, ในร้อยแก้ว ไม่ใช่กลอน) ตาม S2
- [ ] **self-made: en-dash → hyphen** ในช่วงปี (1316-1336, 1312-1341, 1325-1351) ตาม S3
- [ ] **self-made: S4 ไม้ยมก** เติมช่องว่างหลัง ๆ (11 จุด) ตาม house-style (linter R4)
- [ ] **self-made: บรรณานุกรม em-dash → hyphen** ในชื่อบทความ Britannica ("Ibn Battuta - Moroccan explorer") ตาม S3
- **byte-diff Arabic:** ไม่มี (ไม่แตะ tashkeel) · **AUDIT-FIXES.md:** ไม่มี entry
