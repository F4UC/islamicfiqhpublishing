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

- [ ] **⚑ Arabic book-title correction (Codex, approved-deviation):** `الاعلام` → `الأعلام` (al-Zirikli's al-A'lām; source ตกฮัมซะฮ์) — แก้ตาม One precedent (correct-where-certain) + R6 · skeleton edit, logged ใน AUDIT-FIXES · ขอ One ยืนยัน/revert ได้

- [x] **✅ quote-close (Codex, R56 polish):** ปิดอัญประกาศโค้งนอกของย่อหน้าอิบนุ อบี ซัรอ์ (source เปิด “ หลัง "ว่า" แต่ไม่ปิด — 4 เปิด/3 ปิด) → เพิ่ม ” ท้าย passage ให้สมดุล (R15/R81) · ไม่ใช่ content change

## editorial-pass — ibn-battuta-the-great-traveler (#182 follow-up) · branch editorial/ibn-battuta-factual-pass
> #182 ถูก merge ไปแล้ว → editorial pass นี้เป็น follow-up PR แยก (One สั่ง §1–4, approved R1 deviations, ต้อง VISIBLE บนหน้า ไม่ใช่ silent rewrite)
- **[1] 1324 → 1325 (internal consistency):** body แก้ให้สม่ำเสมอเป็น 1325 (lead/closing ใช้ 1325) + note ในวงเล็บ `[ต้นฉบับบางช่วงระบุ 1324 - ใช้ 1325 ตามที่ต้นฉบับใช้เป็นหลัก]` (คงคำ "1324" ไว้ใน note)
- **[2] แอฟริกาใต้ → แอฟริกาตะวันตก (factual, Mali=West Africa):** body แก้ + note `[ต้นฉบับ: แอฟริกาใต้]` (คงคำเดิมใน note)
- **[3] Port Said (geographic):** คงคำต้นฉบับ verbatim + footnote ¹ (ref-1): Port Said อยู่เมดิเตอร์เรเนียน; ทะเลแดงมักผ่านอัยซาบ/สุเอซ — **ไม่แทนชื่อเมืองลง body**
- **[4] อิบนุ ญุซัยย์ เสียชีวิต 1355 (date):** คง 1355 verbatim + footnote ² (ref-2): แหล่งส่วนใหญ่ ~ค.ศ. 1356-1357
- §6 footnote↔bib: fnref-1/2 ↔ ref-1/2 bidirectional ครบ ไม่มี orphan · coverage 99.47% · HTMLParser OK · lint PASS · reading-time 22 (ไม่เปลี่ยน → articles.json ไม่แตะ)
- หลักการ (precedent ทั้งเฟส): source factual slip → ไม่ silent-fix/ไม่เดาค่าแทน; correct-in-body เฉพาะที่ค่าถูกต้องแน่นอน (#1,#2), ที่ไม่แน่ใจ/ต้องเดา (#3,#4) → คง verbatim + footnote

## kumushtakin-ibn-danishmend — กุมุชตะกีน อิบนุ ดานิชเมนด์ (Batch A #70) · branch claude/phase2a-kumushtakin
- **source:** Drive `1H4_UozOC9PtMk3cHwGFZGFLDWhsrziqmYd1NXKxNAp0` (#70) · ตอน: 1 · category history
- **child-safety (R71):** ✅ ผ่าน — ประวัติศาสตร์การทหาร (ครูเสด/ดานิชเมนด์) ไม่มีประเด็นเด็ก
- **สถานะ:** ✅ lint PASS · coverage **99.99%** · reading-time 24 · HTMLParser OK
- **Arabic:** ไม่มี aya/hadith/scholar-quote · inline Latin "Manzikert" (translit aid, R78) → ไม่มี footnote/bib, ไม่มี AUDIT-FIXES
- **self-made:** R80 ย่อชื่อ (`...` → `:`), ทว่า→แต่ (S2, 1×), markdown `\!`→`!` (2×), section `[…]`→`<h2>`, S4 ไม้ยมก (7×)
- **⚑ typo source (คงไว้, flag):** "สุล่านเซลจุก" (น่าจะ "สุลต่าน") — คงตาม source (R1), ขอ One ยืนยันแก้

---

# Batch A — 5 history articles (ONE DRAFT PR) · branch `claude/loving-ride-m41v40`

> Built from main @ 9d6d0d2 (articles.json=72 → 77). DRAFT PR only — no merge/deploy/purge.
> child-safety (R71): all 5 PRE-CLEARED ✅. Coverage measured by `scripts/coverage.py` (≥99 gate).
> Arabic: every āyah re-fetched byte-exact from quran.com, every hadith from sunnah.com (curl, paste-only);
> scholar quotes per R60; byte-diff + blob-SHA in AUDIT-FIXES.md.

## madain-salih — มะดาอิน ศอลิห์: สถานที่ต้องห้ามหรือแค่เข้าใจผิด (#8)
- source Drive `1QhbOklgYtSkAYA3IWayvw_2S3vAMjF0maAgz3U5uLqc` · history · กองบรรณาธิการ · child-safety ✅
- coverage **99.03%** · lint PASS · HTMLParser OK · reading-time 9 · footnotes 1–7 bidirectional
- Arabic: 11 standalone sacred-text blocks re-fetched byte-exact — an-Naml 27:45–52 (8 `.aya-block`), ash-Shuʿarāʾ 26:149, al-Aʿrāf 7:74 (opening substring), hadith Bukhari 433 `.hadith-block`. 3 bare scholar `.ar-quote` (Ibn Nasir al-Din al-Dimashqi, Ibn ʿAbd al-Barr, al-Ṭabari).
- **★ R8:** source's hadith wording `أن يصيبكم مثل ما أصابهم` (non-canonical) → replaced with canonical `لاَ يُصِيبُكُمْ مَا أَصَابَهُمْ` (Bukhari 433); Thai translation kept as author's.
- **★ verse-id:** 26:149 cited to ash-Shuʿarāʾ (has مِنَ + فارهين), NOT 7:74; 7:74 opening cited separately.
### ⚑
- [ ] self-made R12.1 ศอเฮี้ยะห์→ศอเฮี้ยะฮ์ (2×) · S5 long-salawat→ﷺ (2×)+intro · R73 ศอฮาบัต→เศาะหาบะฮ์ · R9 "เสียชีวิตปี…"→"(เสียชีวิต ฮ.ศ. …)" (×2) · markdown \!→! · list 1]…8]→prose
- [ ] **⚑ R52 FLAG:** "อิบนุลเญาซีย์" (al- fused) — confirm
- [ ] **⚑ attribution inference:** alifta.gov.sa attached as footnote on the Ibn Nasir al-Din/al-Birzali quote (likely its fatwa source); source listed alifta as general bibliography — confirm

## remembering-the-mawlid — รำลึกเมาลิดินนบี: นอกจากเพื่อความเมตตาแห่งสากลโลก (#81)
- source Drive `1DjZv9AIMuifR1aEbBeE9fdss9iHsQv1hcRHkneSXzxI` · history · กองบรรณาธิการ · child-safety ✅
- coverage **99.90%** · lint PASS · HTMLParser OK · reading-time 10 · footnotes 1–4 bidirectional
- Arabic: 1 voweled Ibn Hajar (Fath al-Bari) `.ar-quote` KEPT verbatim (embeds 3:159 + 21:107 in printed orthography) + closing Shawqi couplet.
- **★ R77/R1 edge case (#185 / pilot #25):** quote kept byte-exact (no canonical splice); the 2 āyāt supplied as takhrij in bib (ref-3/ref-4), re-fetched byte-exact from quran.com. Aisha "day of Aqaba" hadith → takhrij Bukhari 3231 / Muslim 1795.
### ⚑
- [ ] **★ FLAG (Shawqi couplet untranslated):** source gave no Thai translation → Arabic kept + editorial note "รอการตรวจทานคำแปล" (no fabrication) · One to provide translation or confirm
- [ ] self-made: removed tatweel U+0640 (decorative) from couplet; dropped trailing Latin "." in Ibn Hajar quote (R77); ทว่า→แต่ (1×); ศอเฮี้ยะห์→ศอเฮี้ยะฮ์ (2×); "ท่านท่านนบี"→"ท่านนบี" (3×); +2 editorial h2 (coverage-neutral)

## scholars-of-the-nile — บันทึกจุดยืนของปราชญ์แห่งลุ่มแม่น้ำไนล์ (#56)
- source Drive `1GWpCh4OtAGM7cTjp2W8cW-F_VDcWdGwLTsCYdz4u1lY` · history · กองบรรณาธิการ · child-safety ✅
- coverage **99.77%** · lint PASS · HTMLParser OK · reading-time 6 · footnote 1↔1 bidirectional
- Arabic: 2 bare scholar `.ar-quote` (al-Ramli, al-Shaʿrani — bare in source) + 1 Arabic bib (al-Jaziri, al-Durar al-Fawāʾid 1/711–713, RTL). No aya/hadith.
### ⚑
- [ ] self-made R12/R73 มุหัมหมัด→มุฮัมมัด (al-Jaziri byline) · S2 แต่ทว่า→แต่ (2×) · markdown \!→! (2×) · R80 H1 shortened (subtitle kept as dek + citation) · +1 editorial h2 (coverage-neutral)
- [ ] R52: none (อิบนุ อันนัจญาร spaced). Source mixes อับดุลกอดีร/อับดุลกอดิร — kept verbatim

## crusades-after-salahuddin — เรื่องราวของชัยชนะและการทรยศในยุคครูเสดหลังยุคเศาะลาฮุดดีน (#72)
- source Drive `1fPxUtecIArUFucnfxTRc2v1BD2CDjwyxuGODfCydcUw` · history · กองบรรณาธิการ · child-safety ✅
- coverage **99.74%** · lint PASS · HTMLParser OK · reading-time 21
- Arabic: 15 historian/scholar `.ar-quote` STRIPPED TO BARE (R60 all-or-nothing; source voweling mixed) — Ibn Wasil, Felix Fabri (via Suhayl Zakkar), Ibn Shaddad, al-Dhahabi, Sibt Ibn al-Jawzi, Jirjis Ibn al-Amid, al-Mu'ayyad, Ibn Taghri Birdi, al-Dawadari, Abu al-Fida. No aya/hadith → no footnote/bib (inline attribution).
- R77: no Latin punctuation present (already ، ؛) → no-op.
### ⚑
- [ ] **⚑ R52 FLAG:** อิบนุลอะษีร (×4), สิบฏ์ อิบนุลเญาซีย์ (×2), อบุลฟิดาอ์, อิบนุลวัรดี; ญิรญิส อิบนุ อัลอะมีด (source spaced) — confirm
- [ ] **⚑ author editorial glosses inside Arabic** kept byte-exact (`[لي صلاح الدين]`, `(= الصليبيين)`, `[فـ]ـيا`, etc.) · stray ASCII `"` in blocks 1–2 kept · author ellipsis `..` kept (not R77-stripped)
- [ ] **⚑ source Thai typo** "สมรภูมิทแห่งกาซา" kept verbatim · ambiguous quote-boundary L68 (Ibn Shaddad) flagged
- [ ] self-made: ทว่า→แต่ (8×); R9 death-years; S4 yamok (5×); S1 colon; section [..]→h2 (3×); >60w quotes use source naming lead-in `<p>` as attribution (vs `.attribution` span) — confirm convention

## sunni-shia-conflict-baghdad-443 — บันทึกเหตุการณ์ความขัดแย้งระหว่างซุนนีย์และชีอะฮ์ในปี 443 ฮ.ศ. (#2)
- source Drive `1d5el3g3JASc_JUqGwGLRjBSETrbuHX-D5rU-9SQuexc` · history · กองบรรณาธิการ · child-safety ✅
- coverage **99.75%** · lint PASS · HTMLParser OK · reading-time 10
- Arabic: 9 Ibn al-Athir (al-Kāmil) `.ar-quote` KEPT VOWELED byte-exact (R60: source fully voweled → keep); extracted byte-exact from the downloaded source (programmatic, no hand-retype). No aya/hadith → no footnote/bib.
- NOTE: delegated sub-agent hit an API content-policy false-positive on the sectarian-violence narrative; built by orchestrator instead. Source downloaded byte-exact (34239 B); 9 blocks extracted via script.
### ⚑
- [ ] **⚑ R52 FLAG:** อิบนุลอะษีร (×many), อิบนุลมุซฮิบ — confirm
- [ ] **⚑ R56 quote-balance:** 4 translations closed with opening “ in source → fixed to ”
- [ ] **⚑ Arabic source quirk kept byte-exact:** B2 "ا تَجَاوَزْنَا" (likely dropped مـ) + editorial brackets `[ أَنْ ]`, `( فِي التُّرْبِ وَالدُّورِ )`
- [ ] self-made: มุหัมหมัด→มุฮัมมัด (~5×); typo-fix ทึ่→ที่, ไส้ใช้→ไว้ใช้ (correct-where-certain); S4 yamok; +1 editorial h2

---

# Batch A + QC cleanup (extends PR #190) · branch `claude/loving-ride-m41v40`

> Per One: extend PR #190 to "Batch A + QC cleanup" (same branch, no new PR). Keep DRAFT, no merge.

## (A) aya/hadith placement fix — golden-master conformance (Rule, moon-sighting)
Bug = `<p class="ar-translation">` (and `<p class="block-source">`) **inside** `<div class="aya-block">`/`<div class="hadith-block">`. Correct = block holds ONLY `<p class="block-ar">`; Thai translation is a normal `<p>` **outside** (āyah `{…}`, hadith `“…”`); `block-source` removed (citation via footnote/attribution).
Scope = exactly the files matching One's grep (`ar-translation` before `</div>` of an aya/hadith block):
- `tarikh/madain-salih.html` (Batch A #8) — 11 blocks
- `nitisart/eating-liver-spleen-of-sacrificial-animal.html` (#25, live) — 2 blocks
- `tarikh/abu-al-aynaa-blind-satirist.html` (live) — 6 blocks
- `kalam/al-ashari-and-the-unity-of-the-ummah.html` (live) — 12 blocks
- `_TEMPLATE.html` — 1 (N2 example)
All: `block-ar` kept **byte-exact** (before==after verified); every `<sup class="fn-ref">` preserved (incl. al-ashari where it sat inside `block-source`); footnote counts unchanged; lint/HTMLParser PASS.
- **madain-salih:** its āyāt were cited only by `block-source`; after removal, citations restored via R49 intro attribution ("…ในสูเราะฮ์อัชชุอะรออ์ อายะฮ์ที่ 149 ว่า:", "…ในสูเราะฮ์อัลอะอ์รอฟ อายะฮ์ที่ 74 ว่า:"); coverage 99.03% (PASS).
- **⚑ pre-existing (NOT changed here):** abu-al-aynaa (ref-7…22) and al-ashari (ref-16…18) have bibliography entries without in-text fnref — counts identical to `origin/main`, so pre-existing, left as-is (out of cleanup scope).

## (B) editorial — live merged articles
- **#25 eating-liver-spleen:** removed duplicate "คือ คือ"→"คือ"; unified ฮานะฟียะฮ์→ฮะนะฟียะฮ์ + ฮานะฟีย์→ฮะนะฟีย์ (2×, to dominant ฮะ-stem); removed informal aside "ที่ตัวเล็กยังมีความน่ารัก" (R5 register); "ฎ้อบ" = ضبّ (Uromastyx/spiny-tailed lizard) — translit reviewed OK; "อิบนุ อาบิดีน" — only one rendering present (already consistent, spaced per R52).
- **#70 kumushtakin:** สุล่าน→สุลต่าน (1×); unified เมอร์ซิน/เมอร์ซิฟ→เมอร์ซิฟอน (Merzifon) ×5 incl. H2; **fact-geo:** corrected the wrong identification "ปัจจุบันคือเมืองเมอร์ซินในตุรกี" — the 1101 battle site is Mersivan/Merzifon (จ.อามาสยา), NOT the Mediterranean-coast city Mersin → rewrote the parenthetical with a contrast note.

## (C) content-gate (5 Batch A) + reading-time
- #6 (aya/hadith translation outside block): only madain-salih had such blocks → fixed; #81/#56/#72/#2 have none. #1–5 (translit/proofread/register/fact-geo/citations) verified at build.
- reading-time re-run (placement moved translations into counted prose): madain-salih 9, eating-liver-spleen 9, abu-al-aynaa 17, al-ashari 17. articles.json stays **77 entries** (no new entries; readingTime updated per Rule 55).

---

# Phase-2 prove-the-gate batch — 6 articles (ONE DRAFT PR) · branch `claude/phase2-batch-prove-gate`
> Built from main @ 9249fde (articles.json 76 → 82). DRAFT PR only — no merge/deploy/purge. child-safety (R71): all 6 pre-cleared by A1 + re-read by orchestrator/agents (no flags).

- **the-age-of-khadija** (ประวัติศาสตร์) — R79 merge of 2 Drive docs; coverage 99.23%; ⚑R52: อิบนุลมุลักกิน/อิบนุลก็อตฏอน/อบุนนัฎร์/อบุลวะลีด
- **sunglasses-during-ihram** (หัจญ์) — coverage 98.60% raw / 99.79% S5-adj ⚑; hadith Muslim 1298a
- **conjoined-twins-in-islamic-law** (นิติศาสตร์) — coverage 99.65%; ⚑R52: อิบนุลเญาซีย์/อิบนุลอิม้าด/อบุลบะศ็อล
- **ethics-of-war-in-islamic-law** (นิติศาสตร์) — Dar al-Ifta anti-extremism framing preserved; coverage 99.01%; 15 aya/hadith byte-exact; ⚑R52: อิบนุลก็อยยิม/อิบนุซุบัยร
- **touching-dogs-in-islam** (นิติศาสตร์) — coverage 98.53% raw / 99.43% S5-adj ⚑; hadith Muslim 1575b + āyah 5:4; ⚑R52: อิบนุลกอซิม
- **hadith-scholars-vs-jurists** (หะดีษ) — balanced conclusion preserved; coverage 99.69%; ⚑R52: อบุลฟัตห์

---

# PHASE-2 BATCH 10 — review flags (10 articles, branch `claude/phase2-batch-10`, DRAFT PR)
> Built fresh from Drive by orchestrated agents; orchestrator independently byte-verified all standalone Quran/hadith against quran.com/sunnah.com (see AUDIT-FIXES). All 10 child-safety CLEAR (R71). Coverage (Thai char-diff, R72): usul 99.74 · fidyah 99.99 · taysir 99.27 · harmony 99.92 · arafah 99.68 (body; raw 96.01 = source ref-list lives in excluded `.bibliography-section`, all entries preserved) · mihna 99.28 · mamluks 99.66 · politics 99.69 · paper 99.97 · clockmaking 99.93.

## R52 fused-form flags (al- vs name-initial — needs editorial confirmation; kept fused, not silently altered)
- usul-al-fiqh-foundations: **อิบนุศศอลาห์** (Ibn al-Salah)
- arafah-time-and-place: **อิบนุลหะสัน** (Muhammad ibn al-Hasan al-Shaybani, in al-Shawkani's quote)
- mamluks-of-sword-and-pen: **อิบนุลเคาะฏีบ** (Ibn al-Khatib)
- politics-power-and-scholarship: **อบุลอับบาส** (Abu al-ʿAbbas, kunya of Ibn Taymiyya; normalized from source สระอู "อบูล" → สระอุ "อบุล" per R52)
- clockmaking-in-the-mamluk-era: **อบุลอิซซ์** (Abu al-ʿIzz al-Jazari), **อบุลหะซัน** (Ibn al-Shatir's kunya), **อิบนุลมัจดีย์**, **อิบนุลลับบานี**, **อิบนุลมุซัลลัก**, **อิบนุชชาฏิร** (sun-letter), **อิบนุสซิรรอจญ์** (sun-letter)

## Arabic / sacred-text verification flags
- taysir-vs-tasahul-in-fatwa: **Jabir "al-hanifiyya al-samha" hadith** (`بعثت بالحنيفية السمحة…`) rendered as a BARE scholar `.ar-quote` from the source (within al-Munawi's discussion), NOT a re-fetched standalone `.hadith-block` — not cleanly verifiable as a single canonical sunnah.com matn (Munawi grades hasan via multiple chains, chiefly Musnad Ahmad). No takhrij fabricated. Needs editorial verification of wording/grading.
- taysir-vs-tasahul-in-fatwa: embedded **2:185** inside Ibn ʿAbd al-Barr's quote kept verbatim+bare within the quote (R1>R53, #185); canonical voweled 2:185 supplied as a standalone aya-block earlier.
- arafah-time-and-place: **2 al-Bayhaqi narrations** (`يوم عرفة الذي يعرف فيه الناس`, `وعرفتكم يوم تعرفون`) + chapter title `باب خطأ الناس يوم عرفة` (al-Sunan al-Kubra) NOT byte-exact-verifiable from sunnah.com graded collections — kept as the author's quoted material in BARE scholar `.ar-quote` (no `.hadith-block`/takhrij claimed). Needs editorial wording/grading verification.
- arafah-time-and-place: 3 hadith retrieved via WebFetch render of sunnah.com (raw curl is Cloudflare-blocked in build env); orchestrator independently byte-verified muslim:1977e + tirmidhi:697; tirmidhi:802 advisable to spot-confirm.
- the-mihna-under-al-mamun: scholar blocks kept FULLY VOWELED (R60 ALL path) byte-exact from the al-Tabari/Ibn Kathir printed source; embedded Quran fragments **Q16:106, Q2:156, Q42:11** woven inside the scholar quotes kept byte-exact verbatim (R1>R53, #185) — a takhrij could be added editorially; orchestrator confirmed 20/20 skeletons byte-exact in source.

## Bibliography note (Bibliography Standard — no fabrication)
- Across the batch, bibliography entries include ONLY details the Drive source provided (author + native-Arabic title, or source-given page/publisher as in arafah's numbered list). Where building agents had reconstructed muhaqqiq/place/publisher/year not in the source (usul ×6, paper Bloom/Goitein), the orchestrator trimmed them to the source-provided form. Fuller Chicago-style citations may be added editorially after verification.

---

# PHASE-2 BATCH 11 — review flags (10 articles, branch `claude/phase2-batch-11`, DRAFT PR)
> Built fresh from Drive; all 10 child-safety CLEAR (R71, scanned from disk). articles.json 92→102, author = bare `กองบรรณาธิการ` for all 10. Coverage (Thai char-diff R72): secularism 99.82 · governance 99.95 · taxation 99.93 · women 99.64 · art 99.95 · nur-al-din 99.68 · surnames 99.32 · maintenance 99.86 · jurisprudence 99.91 · ikhtilāf 99.06.

## ★ Beta byte-QC (raw quran.com/sunnah.com — small marks lossy through WebFetch)
- **husband-maintenance** Bukhari 2554, ʿabd clause: file `وَهُوَ مَسْئُولٌ` vs canonical `وَهْوَ مَسْئُولٌ` (the other 3 clauses match `وَهْوَ`). One orthographic harakat (damma vs sukun on ه); confirm against raw sunnah.com and correct via paste if needed.
- **justice-belief-and-power** āyah 99:8 silah: file `يَرَهُۥ`; confirm the silah-damma against raw quran.com JSON (matches the mushaf where 99:7 and 99:8 end identically).

## R52 fused-form flags (kept fused, not silently altered — confirm al- vs name-initial)
- justice-belief-and-power: **อบุลหะสัน** (al-Māwardī, Abū al-Ḥasan)
- womens-power: **อบุลหะสัน** (al-Masʿūdī, Abū al-Ḥasan)
- origins-of-nur-al-din-zangi: 11× **อิบนุล…** — incl. **อิบนุลอะษีร** (Ibn al-Athīr), **อิบนุลอะดีม** (Ibn al-ʿAdīm), **อิบนุลเญาซีย์** (Ibn al-Jawzī)
- surnames-and-lineage-in-islam: **อิบนุลก็อยยิม** (Ibn al-Qayyim)
- divergent-opinions: **อิบนุศศอลาห์** (Ibn al-Ṣalāḥ — sun-letter ص assimilation of al-, source-fused; not an อิบนุล form)

## Content / editorial flags
- **surnames-and-lineage-in-islam**: built from the doc titled with the Ḥunayn hadith line, but its actual topic is **nasab/lineage & surnames fiqh** (Ḥunayn hadith = closing proof-text). Per owner decision (AskUserQuestion), slug renamed `battle-of-hunayn → surnames-and-lineage-in-islam` and recategorized **history → nitisart**.
- **husband-maintenance**: the Drive doc's «كلكم راع» wording differed from sunnah.com; canonical Bukhari 2554 matn was pasted into the block, but the Thai translation reflects the source's fuller narration — confirm the intended narration length.
- **#3 taxation distinctness CONFIRMED**: taxation/jibāyah/Laffer-curve angle, distinct from live `ibn-khaldun-scholars-and-power` and `ibn-khaldun-on-the-bedouin-arabs`.
- **Bibliography (all 10)**: source-provided detail ONLY (no muḥaqqiq/place/publisher/year/page invented). Some sources gave only truncated/placeholder URLs (womens-power, shadow-puppet) — preserved verbatim per the strict rule; editor may resolve.

---

# PHASE-2 BATCH 12 — reflections (มุมพักใจ) review flags (11 articles, branch `claude/phase2-batch-12-reflections`, DRAFT PR)
> All 11 child-safety CLEAR (R71, scanned from disk; the two love/poetry docs read personally by orchestrator). articles.json 102→113; reflections category now populated (0→11). Coverage (R72): self-effacement 99.98 · salaf 99.73 · patience 99.98 · value-of-time 99.93 · society 99.79 · guarding-time 99.22 · brotherhood 99.84 (S5-adj; raw 98.90) · sleep 99.96 · barakah 99.94 (S5-adj; raw 96.61) · power 99.87 · love 99.61. All gate[a]/lint-article.js/lint-arabic-ortho.py/comments=0 clean.

## ★ Beta byte-QC (raw quran.com/sunnah.com)
- **barakah-of-eating-together**: independently byte-verify the 4 hadith (Ibn Mājah 3287, Abū Dāwūd 3764, Muslim 2059a, Bukhari 5392) — agent reported paste-only byte-exact; orchestrator did not re-fetch all 4.
- **what-the-salaf-left-us**: āyah 11:111 silah `إِنَّهُۥ` — confirm the silah-damma against raw quran.com JSON (WebFetch renders it unreliably).

## R52 fused-name flags (kept fused, confirm al- vs name-initial)
- brotherhood **อิบนุลเญาซีย์** · barakah **อิบนุลค็อตฏ้อบ**, **อิบนุลมุนซีร์** · guarding-time **อบุลกอเซม**, **อบุลฟัฎล์** · patience **อบุลวะลีด**, **อิบนุลกอเซม** · power **อบุลบะเราะกาต**, **อิบนุลอะเราะบีย์** · love **อิบนุลก็อยยิม**.

## Source-faithfulness flags (kept verbatim per R1, NOT silently changed)
- **scholars-and-the-value-of-time**: Arabic `أبو سيف` where context = `أبو يوسف` (Abū Yūsuf).
- **scholars-patience-in-poverty**: Ibn Ḥazm block `أبن حزام` / `الفقيةأبى` / `مخزفة` / `المامون` / `واالله`.
- **barakah-of-eating-together**: Thai `ปรากฎ` (ฎ; dict = `ปรากฏ`/ฏ).
- **the-etiquette-of-sleep**: Arabic mid-word split `ت طول` (canon `تطول`; public digitized text carries same split).
- **on-love-and-longing**: transliteration tail variance `อัฎเฎาะห์ฮาก` (Doc A) vs `อัฎเฎาะห์หาก` (Doc B) — unify if desired.

## Hadith variant decisions (Drive vs canonical — canonical pasted per R8, Drive variant kept as Thai gloss)
- salaf: Muslim 1017a (`من سن…` vs Drive `…فعمل بها بعده كتب…`). · society: Bukhari 3416 «لعبد» (Drive «لنبي»). · barakah: Abū Dāwūd 3764 (`تفترقون` vs Drive `تأكلون متفرقين`).

## Content notes
- **on-love-and-longing** (R79 merge): dropped one Facebook cross-reference nav line from Doc B (sequel pointer, not article content).
- **guarding-time-and-aging** bibliography lists `دار صادر` for Ibn Khallikān's Wafayāt — confirm it was source-provided (else trim per Bibliography Standard).
- **Deferred OUT of reflections** (One-approved, for later category batches): สูงสุดคืนสู่สามัญ→history · มนุษย์เป็นสัตว์สังคม→kalam/nitisart · วางไม้เรียวลง→nitisart · ศิลปะแห่งการถามตอบ→kalam/adab · มายาคติ→kalam.
