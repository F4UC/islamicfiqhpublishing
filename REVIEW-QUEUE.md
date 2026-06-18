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

## editorial-pass — ibn-battuta-the-great-traveler (#182 follow-up) · branch editorial/ibn-battuta-factual-pass
> #182 ถูก merge ไปแล้ว → editorial pass นี้เป็น follow-up PR แยก (One สั่ง §1–4, approved R1 deviations, ต้อง VISIBLE บนหน้า ไม่ใช่ silent rewrite)
- **[1] 1324 → 1325 (internal consistency):** body แก้ให้สม่ำเสมอเป็น 1325 (lead/closing ใช้ 1325) + note ในวงเล็บ `[ต้นฉบับบางช่วงระบุ 1324 - ใช้ 1325 ตามที่ต้นฉบับใช้เป็นหลัก]` (คงคำ "1324" ไว้ใน note)
- **[2] แอฟริกาใต้ → แอฟริกาตะวันตก (factual, Mali=West Africa):** body แก้ + note `[ต้นฉบับ: แอฟริกาใต้]` (คงคำเดิมใน note)
- **[3] Port Said (geographic):** คงคำต้นฉบับ verbatim + footnote ¹ (ref-1): Port Said อยู่เมดิเตอร์เรเนียน; ทะเลแดงมักผ่านอัยซาบ/สุเอซ — **ไม่แทนชื่อเมืองลง body**
- **[4] อิบนุ ญุซัยย์ เสียชีวิต 1355 (date):** คง 1355 verbatim + footnote ² (ref-2): แหล่งส่วนใหญ่ ~ค.ศ. 1356-1357
- §6 footnote↔bib: fnref-1/2 ↔ ref-1/2 bidirectional ครบ ไม่มี orphan · coverage 99.47% · HTMLParser OK · lint PASS · reading-time 22 (ไม่เปลี่ยน → articles.json ไม่แตะ)
- หลักการ (precedent ทั้งเฟส): source factual slip → ไม่ silent-fix/ไม่เดาค่าแทน; correct-in-body เฉพาะที่ค่าถูกต้องแน่นอน (#1,#2), ที่ไม่แน่ใจ/ต้องเดา (#3,#4) → คง verbatim + footnote
