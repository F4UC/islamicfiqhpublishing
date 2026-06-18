# REVIEW-QUEUE — Phase 2 pilot

> One + Claude (orchestrator) review before merge. DRAFT PRs only — no merge/deploy/purge.
> This branch carries **one** pilot article. Items marked ⚑ need editorial confirmation.

---

## fatima-al-fihriya-founder-of-al-qarawiyyin — ฟาฏิมะฮ์ อัลฟิฮ์รียะฮ์: สตรีผู้ก่อตั้งมหาวิทยาลัยที่เก่าแก่ที่สุดในโลก · DRAFT PR · branch claude/phase2-fatima-al-fihriya
- **source:** Drive `1psDDux_2K2HGMZlsP1g-nyOaCTOYJhpmZhawRPhIKLI` (#52) · ตอน: 1 (เดี่ยว)
- **category:** history (ประวัติศาสตร์) · author: กองบรรณาธิการ
- **child-safety (R71):** ✅ ผ่าน — ชีวประวัติ/ประวัติศาสตร์การศึกษา ไม่มีประเด็นเด็ก
- **สถานะ:** ✅ build เสร็จ · lint PASS · coverage **99.91%** (≥99) · reading-time 23
- **Arabic:** 4 บล็อกคำพูดปราชญ์ (.ar-quote: อิบนุ คอลดูน, อัซซิริกลี الأعلام, อัลลาล อัลฟาซี ×2) + inline (ชื่อหนังสือ/มัสญิด/คำศัพท์) — **ไม่มี aya/hadith**
- **R60 ALL-OR-NOTHING:** source ลงสระไม่สม่ำเสมอ → **strip เป็น bare ทั้งหมด** (ลบ U+064B–U+0652 เท่านั้น, skeleton ก่อน=หลังทุกบล็อก) · byte-diff + blob-SHA ใน **AUDIT-FIXES.md**
- **R77 punctuation:** ตัวบทอาหรับใช้ `،` (U+060C) อยู่แล้ว → ไม่ต้อง normalize
- **§6 footnote/bib:** ไม่มี aya/hadith → ไม่มี footnote (§6.3) · บรรณานุกรม = 3 URL ที่ผู้เขียนให้ (Al Jazeera + BBC Arabic + Wikipedia), LTR

### ต้องอนุมัติ/ท้วงติง
- [ ] **self-made (Arabic, logged):** strip harakat 4 บล็อก (นบّهت→نبهت, ووُسع→ووسع, مراراً→مرارا, الْقَرَوِيِّينَ→القرويين) — ดู AUDIT-FIXES.md (skeleton-equal ทุกตัว)
- [ ] **self-made: มุหัมหมัด/มุหัมมัด → มุฮัมมัด** — normalize ทับศัพท์ตาม corpus (R12/R73); รวมพระนามท่านนบี **คง ﷺ** (S5) · ขอยืนยัน
- [ ] **self-made: en-dash → hyphen** (ช่วงปี 183-184, 878-880; และ "–" ในวงเล็บ "(الجامع - ที่รวมผู้คน)") ตาม S3; "สังคม-วัฒนธรรม" คงไว้ (ขีดเชื่อมคำ)
- [ ] **self-made: S4 ไม้ยมก** เติมช่องว่างหลัง ๆ (2 จุด) ตาม house-style (linter)
- [ ] **⚑ ทับศัพท์ชื่อสถานที่ไม่สม่ำเสมอใน source:** "กอยรอวียีน/กอรอวียีน" (al-Qarawiyyin) และครั้งหนึ่ง "อัลกอยรอวียีน" (ในย่อหน้านำ) — **คงรูป source ไว้ตาม R1** ไม่เดา normalize · ขอ One ตัดสินรูปมาตรฐาน (เสนอ: เมือง=กอยรอวาน, มหาวิทยาลัย/มัสญิด=กอรอวียีน)
- [ ] **⚑ ชื่อ "ดร.ลุฏฟี อีซา" vs "ดร.ลุตฟี อีซา":** source สะกด 2 แบบ (ฏ vs ต) — คงตาม source, flag ให้รวมเป็นรูปเดียว
- [ ] **⚑ Latin ในร้อยแก้ว (R78 — อนุญาตในบริบท translit/proper noun):** euergetism, Historiography, University of Bologna, Oxford, Guinness World Records — คงไว้เป็น translit aid/ชื่อเฉพาะ (R78 ใหม่อนุญาต) · แจ้งเพื่อ review
- **byte-diff Arabic:** ดู AUDIT-FIXES.md (4 บล็อก, skeleton-equal, blob-SHA)
