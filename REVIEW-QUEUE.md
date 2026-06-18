# REVIEW-QUEUE — Phase 2 pilot

> One + Claude (orchestrator) review before merge. DRAFT PRs only — no merge/deploy/purge.
> This branch carries **one** pilot article. Items marked ⚑ need editorial confirmation.

---

## eating-liver-spleen-of-sacrificial-animal — ตับและม้ามของสัตว์กุรบ่านรับประทานได้ไหม · DRAFT PR · branch claude/phase2-liver-spleen-qurban
- **source:** Drive `1rIyWH85_8ttcKgA0sUOpATYdOXk5Zj6AsDsdcuEpudc` (#25) · ตอน: 1 (เดี่ยว)
- **category:** nitisart (นิติศาสตร์) · author: กองบรรณาธิการ
- **child-safety (R71):** ✅ ผ่าน — ฟิกฮ์ว่าด้วยอวัยวะสัตว์เชือด (clinical) ไม่มีประเด็นเด็ก
- **สถานะ:** ✅ build เสร็จ · lint PASS · coverage **99.71%** (≥99) · reading-time 9
- **§6 footnote↔bib:** มี aya/hadith → footnote 3 จุด (fnref-1/2/3) ↔ บรรณานุกรม Arabic RTL (ref-1/2/3) · bidirectional ครบ ไม่มี orphan (ตรวจด้วยสคริปต์)

### Arabic — ตัวบทศักดิ์สิทธิ์
- **อายะฮ์ (2 standalone .aya-block):** paste byte-exact จาก quran.com — 7:157 (`27e37b5824fa`), 6:145 (`8d9ecb9dca92`) · ดู AUDIT-FIXES.md
- **scholar quotes (.ar-quote):** อัลกะซานีย์, อัลหัศกะฟีย์, อิบนุ อาบิดีน ×หลายช่วง, อันนะวาวีย์ ×2 — **ทุกบล็อกลงสระครบใน source → R60 keep voweled (all-or-nothing satisfied, ไม่ strip)** คง byte-exact
- **หะดีษ:** `أُحِلَّ لَنَا مَيْتَتَانِ...` ฝังในคำพูดอันนะวาวีย์ → footnote ref-3 (takhrij Ibn Majah 3314, เศาะฮีฮ์)

### ⚑ ต้องอนุมัติ/ท้วงติง
- [x] **✅ CONFIRMED CORRECT (One §C): R77 / nested-aya** — scholar quotes คงตัวบท byte-exact (รวมอายะฮ์ที่แทรก) + อายะฮ์ standalone จาก quran.com = ถูกต้อง (การแทนค่าลงในคำพูดจะบิดเบือน quote, R1 เหนือ R53/R8 เมื่ออายะฮ์ฝังในคำพูดปราชญ์) · กฎใหม่บันทึกใน rulebook PR (D)
- [x] **✅ CONFIRMED CORRECT (One §C): R8 / hadith wording** — คงสำนวนอันนะวาวีย์ `فَالسَّمَكُ` + takhrij Ibn Majah `فَالْحُوتُ` = ถูกต้อง
- [ ] **R80 ย่อชื่อเรื่อง:** "ตับ ม้ามของสัตว์กุรบ่านรับประทานได้ไหม**?**" → H1 "ตับและม้ามของสัตว์กุรบ่านรับประทานได้ไหม" (เติม "และ", ตัด "?") — ความหมายคงเดิม, H1 ไม่ตัด (R67)
- [ ] **self-made R1 (revert):** source บางจุดสะกด "ท่านนบี ﷺ" → คงตาม source (ไม่เติม "มุฮัมมัด")
- [ ] **self-made R12.1:** ศอเฮี้ยะห์ → **ศอเฮี้ยะฮ์** (2×)
- [ ] **self-made R73:** ศอฮาบัต/ศอฮาบะฮ์ → **เศาะหาบะฮ์** (2×)
- [ ] **self-made S2:** มิใช่ → ไม่ใช่ (1× ในคำแปล, ไม่บิดความหมาย)
- [ ] **self-made typo (R56/R81):** จาแกะ→จากแกะ, จสกสัตว์→จากสัตว์, อย่าว→อย่าง, อัลฮะนทฟียะฮ์→อัลฮะนะฟียะฮ์, อัลกุรอ่าน→อัลกุรอาน
- [ ] **self-made R16(b):** ชื่อตำราในเนื้อความครอบ “…” (อัลบะดาอิอ์/อัลกุนยะฮ์/อัลวะฮบานียะฮ์/อัลกอมูส)
- [ ] **self-made S4:** ไม้ยมก เติมช่องว่างหลัง ๆ (2 จุด)
- [x] **✅ RESOLVED (One §B2): "อัลอัศกาฟีย์" → "อัลหัศกะฟีย์"** (al-Haskafi الحصكفي ผู้แต่ง الدر المختار — One ยืนยันว่า source สะกดผิด) — แก้แล้ว 1 จุด
- [ ] **⚑ ทับศัพท์มัสฮับไม่สม่ำเสมอใน source:** ฮะนาฟียะฮ์/ฮะนะฟีย์/ฮานะฟียะฮ์ — คงตาม source, ขอ One ตัดสินรูปมาตรฐาน
- [ ] **Latin (R78 อนุญาตในบริบท):** Uromastyx (translit aid) — คงไว้
- **byte-diff Arabic:** ดู AUDIT-FIXES.md (2 aya paste byte-exact + scholar verbatim)
