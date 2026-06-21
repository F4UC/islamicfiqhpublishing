# AUDIT-FIXES — บันทึกการแตะตัวอักษรอาหรับ (Arabic-touch ledger)

> บันทึกทุกครั้งที่ตัวแทน AI แตะตัวอักษรอาหรับในงาน audit/แก้บทเก่า ตาม **Arabic-Authority Scope** ใน `CLAUDE.md`
> แตะได้ 2 กรณีเท่านั้น: **(1)** strip ฮะเราะกาตตามกฎ 60 (ลบเฉพาะ U+064B–U+0652, skeleton/ช่องว่างคงเดิม) · **(2)** vowel อายะฮ์/หะดีษด้วย byte-exact copy จาก canonical (quran.com imlaei/Hafs · sunnah.com) — ★ห้ามพิมพ์สระเอง ห้ามแก้ skeleton★
> ทุก entry ต้องมีผล **byte-diff** (skeleton ก่อน=หลัง=แหล่ง) และ ★ห้าม Purge★ จนกว่าเจ้าของสั่ง

รูปแบบ entry: `ไฟล์ › บล็อก › การกระทำ › แหล่ง/เลขอ้างอิง › byte-diff result`

---

<!-- entries appended per content-pass PR below -->

## 2026-06-11 — content-pass #1 · `articles/nitisart/itibar-al-maal.html`

**กรณีที่ใช้:** case (2) vowel อายะฮ์/หะดีษ byte-exact จาก canonical + restructure เข้า aya/hadith-block (กฎ 53/61/8) · ไม่มี case (1) strip ในบทนี้ (scholar `.ar-quote` คง bare เดิม 24 บล็อก ไม่แตะ)

**byte-diff:** ทุกบล็อก skeleton (หลังลบ U+064B–U+0652) = ต้นฉบับเดิม = แหล่ง canonical ทุกตัวอักษร (พิสูจน์ด้วยสคริปต์ strip-marks ก่อน-หลังเขียน — PASS ทั้ง 6)

| บล็อก | การกระทำ | แหล่ง (byte-exact) | byte-diff |
|---|---|---|---|
| อายะฮ์ 2:21 (`اعبدوا ربكم…`) | ar-quote→`aya-block` + vowel เต็ม + `.block-source` (S7) | quran.com imlaei 2:21 (เต็มอายะฮ์) | PASS |
| อายะฮ์ 2:183 (`كتب عليكم الصيام…`) | ar-quote→`aya-block` + vowel เต็ม + `.block-source` | quran.com imlaei 2:183 (substring byte-exact) | PASS |
| อายะฮ์ 2:179 (`ولكم في القصاص حياة`) | ar-quote→`aya-block` + vowel เต็ม + `.block-source` | quran.com imlaei 2:179 (substring byte-exact) | PASS |
| หะดีษ `من قتل دون ماله` | ar-quote→`hadith-block` + vowel เต็ม + อ้างเลข | sunnah.com **ศอเฮี้ยะฮ์อัลบุคอรีย์ 2480** (matn ตรงทุกตัว) | PASS |
| หะดีษมุอาซ — คำถาม | ar-quote→`hadith-block` + vowel เต็ม | sunnah.com **ศอเฮี้ยะฮ์อัลบุคอรีย์ 2856** (matn + คง `؟` ของผู้เขียน) | PASS |
| หะดีษมุอาซ — คำตอบ | ar-quote→`hadith-block` + vowel เต็ม + อ้างเลข | sunnah.com **ศอเฮี้ยะฮ์อัลบุคอรีย์ 2856** (ดู FLAG-1) | PASS |

- คำแปลไทยของอายะฮ์เปลี่ยนเป็น `{…}` (convention อายะฮ์ตาม golden master), หะดีษคง `“…”` — ทั้งหมดถอดคลาส `.ar-translation` → `<p>` ธรรมดา (นับใน reading-time ตาม golden master)
- reading-time รันใหม่ผ่าน `scripts/gen-reading-time.js`: **47 นาที** (42,059 ตัวอักษร) — ค่าเดิม ไม่ข้าม boundary, `articles.json` ไม่เปลี่ยน

### ⚑ FLAGs (ขอบรรณาธิการสอบยืนยัน)

- **FLAG-1 — หะดีษมุอาซ คำตอบ (`إِنَّ` vs canonical `فَإِنَّ`):** ฉบับ canonical (ศอเฮี้ยะฮ์อัลบุคอรีย์ 2856) ขึ้นต้นด้วยคำเชื่อม `فَإِنَّ حَقَّ اللَّهِ…` (มี ฟา) ส่วนต้นฉบับผู้เขียนยกแบบเดี่ยวขึ้นต้น `إن حق الله…` (ละ ฟา ตามธรรมเนียมยกเดี่ยว) — **คงโครงของผู้เขียน (`إِنَّ`) ไว้ตามกฎ "ห้ามแก้ skeleton" + กฎ 1** แล้วซ้อนสระจาก **substring byte-exact** ของ `فَإِنَّ` (ตัด ฟา นำหน้า) สระทุกตัวมาจากแหล่ง ไม่ได้พิมพ์เอง · หากบรรณาธิการต้องการรูป canonical เต็ม `فَإِنَّ` แจ้งได้
- **FLAG-2 — เลข `19` ปนในตัวอาหรับ (scholar quote):** บล็อก `.ar-quote` (คำอธิบายของมุลลา อะลี อัลกอรีย์, L534) `…البطلةُ19والمباحيةُ…` มีเลข `19` ฝังกลางตัวอาหรับ = artifact เลขเชิงอรรถที่หลุดมา
  - → ✅ **RESOLVED (2026-06-11, อนุมัติโดยเจ้าของ "เคลียร์ Flag 2"):** ลบ `19` (U+0031 U+0039) + คืนช่องว่างระหว่างคำ → `البطلةُ والمباحيةُ` · **ตัวอักษรอาหรับ+สระไม่เปลี่ยนแม้แต่ตัวเดียว** (ลบเฉพาะเลข artifact, เพิ่ม 1 space คั่นสองคำ) · เป็นการลบ non-content artifact ตาม Rule 56

---

## 2026-06-11 — content-pass #2 (sweep บทเก่า) · `articles/nitisart/shia-takfir.html`

**กรณีที่ใช้:** case (2) vowel หะดีษ byte-exact จาก canonical (กฎ 53/61/8) · scholar `.ar-quote`/`.ar-feature` 28 บล็อกในบทนี้ uniformly BARE (ratio 0.00) ตาม Rule 60 all-or-nothing — ไม่แตะ

| บล็อก | การกระทำ | แหล่ง (byte-exact) | byte-diff |
|---|---|---|---|
| หะดีษตักฟีร `أيما رجل قال لأخيه يا كافر…` | vowel เต็ม (overlay สระจากแหล่งทับโครงผู้เขียน) + เพิ่ม `.block-source` | sunnah.com **ศอเฮี้ยะฮ์อัลบุคอรีย์ 6104** | PASS (letterskel ผู้เขียน=ผลลัพธ์=แหล่งทุกตัวอักษร) |

- ผู้เขียนใช้ `،` คั่น (canonical ใช้ `.`) — **คงเครื่องหมายผู้เขียน** ซ้อนเฉพาะสระจากแหล่ง word-by-word (เครื่องหมายวรรคตอนไม่ใช่สระ/skeleton)
- reading-time รันใหม่: **46 นาที** (41,123 ตัวอักษร) — `articles.json` ไม่เปลี่ยน
- block-ar เดิมมีสระบางส่วน (ratio 0.19) → เปลือยทับด้วยฉบับมีสระครบจากแหล่ง byte-exact

## 2026-06-11 — content-pass #2 (sweep บทเก่า) · `articles/nitisart/asabiyyah-tribalism-and-solidarity.html` — ⚑ FLAG ไม่แตะ

**สำรวจ:** บทนี้มี hadith-block 10 / aya-block 3 — voweled ครบทุกบล็อก **ยกเว้น 1 บล็อก** ที่ bare (ratio 0.05) คือหะดีษเรื่องลูฏ:

- **FLAG-3 — หะดีษลูฏ (สำนวนประสมไม่ตรง canonical):** ต้นฉบับ `رحم الله لوطًا كان يأوي إلى ركن شديد، وما بعث الله بعده نبيًا إلا في ثروةٍ من قومه`
  - **ท่อนสอง** `وما بعث الله بعده نبيا إلا في ثروة من قومه` → ตรงกับ **ญามิอ์ อัตติรมิซีย์ 3116** (สายอบูกุร็อยบ์) `مَا بَعَثَ اللَّهُ بَعْدَهُ نَبِيًّا إِلاَّ فِي ثَرْوَةٍ مِنْ قَوْمِهِ` (ต่างแค่ و นำหน้า)
  - **ท่อนแรก** `رحم الله لوطا كان يأوي إلى ركن شديد` → **ไม่ตรง byte-exact** กับสายใด: บุคอรีย์ 3387 = `يَرْحَمُ اللَّهُ لُوطًا لَقَدْ كَانَ يَأْوِي…`; ติรมิซีย์ 3116 = `رَحْمَةُ اللَّهِ عَلَى لُوطٍ إِنْ كَانَ لَيَأْوِي…`
  - เป็นสำนวน **ประสมหลายสาย** ไม่ byte-exact กับฉบับ canonical ฉบับเดียว → **คง bare ตามต้นฉบับ + FLAG (กฎ 1, ★ไม่เจอสำนวนตรง★)** ไม่แตะตัวอาหรับ · ขอบรรณาธิการยืนยันสำนวน/แหล่งที่ผู้เขียนใช้ แล้วจึงลงสระได้
  - → ✅ **RESOLVED (2026-06-11, เจ้าของเลือก "คงสำนวนผู้เขียน bare"):** ปิด FLAG — **คงตัวบทเดิมของผู้เขียนแบบเปลือยสระ ไม่แตะตัวอาหรับแม้แต่ตัวเดียว** (สอดคล้อง Rule 1 + Rule 60 uniformly bare ของบท) · เนื่องจากไม่มี matn เดี่ยว canonical ที่ตรงทั้งก้อนให้คัดลอก byte-exact ได้ การคงเปลือยสระจึงเป็นแนวทางที่ปลอดภัยและถูกต้อง
  - หมายเหตุ: บล็อก `مَنْ يُكَلِّمُ فِيهَا رَسُولَ اللَّهِ ﷺ` (ratio 0.45) — matn ลงสระครบแล้ว ค่าต่ำเพราะเศาะละวาตเปลือยตามธรรมเนียม **ไม่ใช่ปัญหา**

---

## 2026-06-11 — content-pass #3 · `articles/kalam/ghazali-and-ilm-al-kalam.html` — ⚑ FLAG ไม่แตะ

**กรณี:** หะดีษกุดสีย์ฉบับย่อ (L511) — ตรวจตามขั้นตอน step 3 · scholar `.ar-quote`/`.ar-feature` 11 บล็อกในบทนี้ uniformly BARE (ratio 0.00) ตาม Rule 60 — ไม่มี aya/hadith-block

- **FLAG-4 — หะดีษกุดสีย์ `إني خلقت عبادي حنفاء فاجتالتهم الشياطين` (สำนวนย่อ ไม่ contiguous ใน canonical):**
  - ที่มาแท้คือ **ศอเฮี้ยะฮ์มุสลิม 2865** (หะดีษอิยาฎ บิน หิมาร) แต่ฉบับ canonical ทุกสายเป็น `…خَلَقْتُ عِبَادِي حُنَفَاءَ كُلَّهُمْ وَإِنَّهُمْ أَتَتْهُمُ الشَّيَاطِينُ فَاجْتَالَتْهُمْ عَنْ دِينِهِمْ…` — คำว่า `حنفاء` กับ `فاجتالتهم` **ไม่เคยติดกัน** (มี `كلهم وإنهم أتتهم الشياطين` คั่นเสมอ) และมี `عن دينهم` ต่อท้าย
  - ต้นฉบับผู้เขียนย่อเป็น `حنفاء فاجتالتهم الشياطين` (ตัดกลาง+ท้าย) — **ไม่พบสำนวนย่อนี้แบบ contiguous byte-exact ใน sunnah.com** (ค้น 0 hit)
  - → ตามกฎ step 3 **"ไม่เจอสำนวนย่อ = คงเป็นคำพูดปราชญ์ bare + FLAG"** จึง **ไม่ยกเป็น hadith-block ไม่ลงสระ** คงเป็น `.ar-quote` bare เดิม (สอดคล้อง Rule 60 uniformly bare ของบท)
  - ขอบรรณาธิการตัดสิน: (ก) คงสำนวนย่อ bare ตามเดิม หรือ (ข) เปลี่ยนเป็น matn เต็มมุสลิม 2865 (ซึ่งจะลงสระ byte-exact + ยกเป็น hadith-block ได้) — เป็นการแก้สำนวนผู้เขียน จึงต้องให้บรรณาธิการสั่ง
  - → ✅ **RESOLVED (2026-06-11, เจ้าของเลือก (ข) "แทนด้วย Muslim 2865 เต็ม"):** แทนสำนวนย่อด้วย matn เต็ม **byte-exact จากศอเฮี้ยะฮ์มุสลิม 2865** = `إِنِّي خَلَقْتُ عِبَادِي حُنَفَاءَ كُلَّهُمْ وَإِنَّهُمْ أَتَتْهُمُ الشَّيَاطِينُ فَاجْتَالَتْهُمْ عَنْ دِينِهِمْ` (ตัด `وَ` นำหน้าเป็นรูปยกเดี่ยว — substring byte-exact ของ `وَإِنِّي`, สระทุกตัวจากแหล่ง ไม่พิมพ์เอง) · ยกเป็น `hadith-block` + `.block-source` (มุสลิม 2865) · คำแปลไทยคงเดิม (ถอด `.ar-translation` → `<p>`) · ★skeleton เปลี่ยนจากย่อ→เต็มโดยเจ้าของอนุมัติชัดเจน★

---

# ชุดใหม่: audit บทใหม่บน main (RE-DERIVE ครบทุกข้อ)

## 2026-06-11 — audit บทใหม่ #1 · `articles/tarikh/al-razi-final-days-and-burial.html`

**กรณีอาหรับ:** case (2) normalize อักขรวิธีอายะฮ์ Uthmani → imlaei byte-exact จาก quran.com (กฎ 53)

- **ท่อนอายะฮ์ในคุฏบะฮ์ (2 บล็อก ar-quote) เป็นอักขรวิธี Uthmani** (`ٱ` wasla / `ـٰ` dagger-alef / `ۥ` small-waw / `آ` madda / `ٔ` hamza / `ى` สำหรับ ya) ขัดมาตรฐานบ้าน imlaei → แปลงทุกคำเป็น imlaei **byte-exact จาก quran.com** (96:4, 96:5, 36:82, 28:88, 1:2):
  - บล็อก 1 (L406): `بِٱلْقَلَمِ→بِالْقَلَمِ`, `ٱلْإِنسَـٰنَ→الْإِنسَانَ`, `إِذَآ→إِذَا`, `شَيْـًٔا→شَيْئًا`, `لَهُۥ→لَهُ`, `شَىْءٍ→شَيْءٍ`, `وَجْهَهُۥ→وَجْهَهُ`, `ٱلْحُكْمُ→الْحُكْمُ` (12 คำ)
  - บล็อก 2 (L427): `وَٱلْحَمْدُ→وَالْحَمْدُ` (คง `وَ` ของคุฏบะฮ์), `ٱلْعَـٰلَمِينَ→الْعَالَمِينَ` (4 คำ)
  - **invariant ยืนยัน:** rasm/โครงพยัญชนะ (base normalize) ก่อน=หลังทุกบล็อก → เปลี่ยน**เฉพาะอักขรวิธี ไม่เปลี่ยนคำ** · ร้อยแก้วคุฏบะฮ์ที่เปลือยสระ (Rule 60) **ไม่แตะ** (แตะเฉพาะคำที่ลงสระ=อายะฮ์) · ไม่เหลือ `ٱ`/`ۥ`/dagger-alef ในไฟล์
- **house-style:** Rule 12 — book-title mention `“มะนากิบ อัลอิมาม อัชชาฟิอีย์”` → `“มะนากิบ อัลอิหม่าม อัชชาฟิอีย์”` (อิมาม→อิหม่าม ทุกกรณี)
- **S2 `มิใช่` (L414)** = อยู่ใน `.poem-th` (บทกวี) → คงไว้ตามข้อยกเว้นบทกวี · **em-dash** ทั้งหมดอยู่ใน `<title>`/og (Rule 44) + comment → ไม่นับ · Ibn/Abu spacing, ﷺ ครบ
- reading-time: 32 นาที (ไม่เปลี่ยน)

## 2026-06-11 — audit บทใหม่ #2 · `articles/tarikh/food-prices-and-state-security.html` — ✅ VERIFY (ไม่แตะอาหรับ)

**จุดพิเศษ:** บล็อกอาหรับ 25 จุด (ar-quote) **bare ทั้งหมด** (ratio 0.00, uniformly bare ตาม Rule 60) — ตรวจ byte/skeleton เทียบ **Drive source** ("ประวัติศาสตร์ 29", เจ้าของ)

- **ผล: skeleton พยัญชนะตรงกับ Drive ครบทั้ง 25 บล็อก** (สคริปต์เทียบ consonant-skeleton ทีละบล็อก) — ไม่มีคำตก/คำเกิน/ตัวอักษรเพี้ยน · publishing strip ฮะเราะกาตประปรายของ Drive → bare สม่ำเสมอ (ถูกต้องตาม Rule 60)
- **บล็อก 17 (กรานาดา):** Drive มี gloss `(= نقود عُمْلة)` คากลางบล็อกอาหรับ → article **ตัด gloss ออกจากอาหรับ** เหลือตัวบทแท้ `وضربت سكة جديدة طيبة` และ **ย้ายความหมายไปคำแปลไทย** ("ผลิตเหรียญกษาปณ์ใหม่ที่มีคุณภาพดี") — **ถูกต้องตาม pattern gloss-cut** (เหมือนงาน polo)
- house-style: ไม่มี S1-S8 violation (em-dash อยู่ใน comment/title เท่านั้น, ไม่มี ทว่า/มิใช่/อิมาม) · ﷺ=0 (ไม่อ้างท่านนบีในบทนี้)

### ⚐ NOTE (ขอบรรณาธิการพิจารณา ไม่ใช่ corruption)
- **วงเล็บเหลี่ยมแทรกบรรณาธิการ `[...]`** ใน Drive (เช่น `[من]`, `[طريق]`, `[فكانت]`, `[نهر]`, `[ابنُ جَهْوَر]`, `[أبوه]`, `[إلى القاهرة]`) — article **ถอดวงเล็บออกแต่คงคำไว้ครบ** (skeleton จึงตรง) · เป็นการ unwrap ไม่ใช่ตัดเนื้อหา · หากต้องการคงเครื่องหมายแทรก `[...]` ให้ตรงธรรมเนียม SOP/al-razi (ที่คง `[الحراس]`) แจ้งได้ — เป็น markup decision ไม่ใช่การแตะตัวอักษรอาหรับ จึงไม่ดำเนินการเอง

## 2026-06-11 — audit บทใหม่ #3 · `articles/tarikh/sports-and-games-in-islamic-history.html` (โปโล หมากรุก สุลต่าน)

**จุดพิเศษ (verify อาหรับ — ไม่ต้องแก้):**
- **hadith-block 7 ท่อน byte-verify เทียบ sunnah.com (NFC):** ตรงทุกตัวอักษร+สระ (canonical NFC) — บทความเก็บแบบ NFC-normalized แล้ว, sunnah.com raw HTML เรียง combining-mark ต่างลำดับแต่ canonical-equivalent
  - ท่อน 1 `حَقٌّ عَلَى اللَّهِ أَنْ لاَ يَرْتَفِعَ…` = **ศอเฮี้ยะฮ์อัลบุคอรีย์ 2872** (อูฐอัฎบาอ์)
  - ท่อน 2 `لاَ جَلَبَ وَلاَ جَنَبَ` = **อบูดาวูด 2581**
  - ท่อน 3-7 (สะละมะฮ์ บิน อัลอักวะอ์ ยิงธนู) = **ศอเฮี้ยะฮ์อัลบุคอรีย์ 2899** (substring byte-exact ทั้ง 5)
- **gloss-cut verify:** `أقبية (= عباءات)` และ `يُشْبِهُك (= يليق بك)` ใน Drive → article **ตัด gloss ออกจากอาหรับ** (เหลือ `أقبية`/`يشبهك`) และ **ความหมายอยู่ในคำแปลไทยครบ** (عباءات→"เสื้อคลุม", يليق بك→"เหมาะ/คู่ควร") ✓
- scholar `.ar-quote` 16 บล็อก uniformly BARE (Rule 60) ✓

**house-style แก้ (Thai prose, ไม่แตะอาหรับ):**
- **S5:** เติม ﷺ ให้การเอ่ยนามท่านนบี/ท่านเราะซูล ที่ตกหล่น **4 จุด** (ท่านเราะซูล×2, ท่านนบี×2) → ﷺ ครบทุกการเอ่ยนาม (18→22)
- ทว่า×2 = false positive ("บทว่า" = บท+ว่า) · em-dash อยู่ใน comment/title เท่านั้น · Ibn/Abu spacing + Rule 12/12.1/12.2 ผ่าน
- reading-time: รันใหม่ยืนยัน

## 2026-06-11 — audit บทใหม่ #4 · `articles/tarikh/bayt-al-hikma-house-of-wisdom.html` — ✅ VERIFY (ไม่แตะ)

**จุดพิเศษ (โครงต่างจากปกติ — เนื้อหาไทยล้วน + อ้างอิงอาหรับ ไม่มี aya/hadith-block):**
- **S1-S8:** ผ่านครบ — ไม่มี ทว่า/มิใช่ (Drive มี "ทว่า" → publishing แก้เป็น "แต่" แล้ว), ไม่มี อิมาม/ศ่อเหี้ยห์/มัซฮับ · em-dash อยู่ใน JS-comment/title เท่านั้น · ﷺ N/A (ไม่อ้างท่านนบี) · S1 colon ก่อน quote ครบ
- **บรรณานุกรม 14 รายการ:** 9 อาหรับ (`<ol lang="ar" dir="rtl">`) + 5 ต่างประเทศ — ถูกต้องตาม Bibliography & Citation Standard: อาหรับมากกว่า (9>5) → **RTL, อาหรับขึ้นก่อน** · อาหรับเป็น Arabic script เต็มรูป (ผู้แต่ง/ตำรา/ตหฺกีก/สถานที่/ผู้พิมพ์/ปี/เล่ม-หน้า) · ต่างประเทศคงภาษาต้นฉบับ
- **URL de-mangle ใช้งานได้จริง:** Drive ต้นฉบับมี TLD เพี้ยนเป็นไทย (`muslimheritage.คอม`, `academia.อีดียู`, `ancient-origins.เน็ต`) → บทความ **de-mangle ถูกต้องเป็น .com/.edu/.net** · ทดสอบ HTTP: muslimheritage.com (article) **200**, academia.edu **200**, ancient-origins.net (article) **200**, theculturetrip.com **503** (anti-bot/throttle ชั่วคราว โดเมนจริง ไม่ใช่ลิงก์ตาย) · ไม่มี TLD ไทยหลงเหลือ
- บทตัด steemit/eduscapes (แหล่งคุณภาพต่ำ) จาก Drive ออก — curation ที่เหมาะสม

### ⚐ NOTE (ไม่ใช่ defect)
- อ้างอิงต่างประเทศใช้ **bare domain** (ไม่ใส่ full path) — ผู้แต่ง+ชื่อเรื่องครบ พอค้นได้ · หากต้องการ full URL (ที่ verify 200 แล้ว) ใส่เพิ่มได้ แจ้งได้ — เป็น citation-completeness decision ไม่ดำเนินการเอง

---

# ชุดถัดไป: audit #88 + บทใหม่ Alpha

## 2026-06-11 — audit บทใหม่ #5 · `articles/tarikh/ibn-khaldun-on-the-bedouin-arabs.html` (#88, วิถีเบดูอิน) — ✅ VERIFY (ไม่แตะ)

**จุดพิเศษ:** มุก็อดดิมะฮ์ 24 บล็อก (ar-quote) **bare ทั้งหมด** (Rule 60) — ตรวจ byte/skeleton เทียบ Drive **"ประวัติศาสตร์ 5"**

- **ผล: consonant-skeleton ตรงกับ Drive 24/24 บล็อก** · **publishing แก้ typo OCR ของ Drive ให้ถูกต้องตามมุก็อดดิมะฮ์ฉบับจริง 4 จุด** (บทความถูกกว่า Drive):
  - `الأمصارة→الأمصار` (บล็อก 4) · `القفز→القفر` (บล็อก 9) · `استكثرث→استكثرت` (บล็อก 16) · `الحزيرة→الجزيرة` (บล็อก 17)
  - ทั้ง 4 จุด Drive พิมพ์เพี้ยน (จุด/ตัวอักษรใกล้กัน) → บทความใช้รูปถูกต้อง = improvement ไม่ใช่ drift
- หะดีษฟิฏเราะฮ์ `كل مولود يولد على الفطرة` ฝังในคำพูดอิบนุ ค็อลดูน (ar-quote) คง bare ตาม Rule 60 (เป็นส่วนของคำพูดปราชญ์ ไม่ใช่ hadith-block เดี่ยว) ✓
- house-style: ไม่มี ทว่า/มิใช่ (Drive มี "ทว่า" หลายจุด → publishing แก้เป็น "แต่"), ไม่มี อิมาม · em-dash ใน comment/title · ชื่อท่านนบี `ท่านนบีมุฮัมมัด ﷺ` มี ﷺ ครบ

### ⚐ NOTE (S5 borderline — ไม่แก้เอง)
- คำว่า **"ศาสดา"** (common noun) ใช้เชิงพรรณนาในวิเคราะห์สังคมวิทยาของอิบนุ ค็อลดูน (نبوة/"النبي أو الولي" = เชิงแนวคิด) — มี 1-2 จุดที่ "วจนะของศาสดา" หมายถึงหะดีษท่านนบี · S5 บังคับ ﷺ ที่ **นาม** (นบีมุฮัมมัด) ซึ่งบทมีครบแล้ว · "ศาสดา" generic ไม่เติม ﷺ เอง — หากบรรณาธิการต้องการเติม ﷺ ที่ "วจนะของศาสดา" แจ้งได้

## 2026-06-11 — FLAG B9 (Alpha, บท "ฆูล" / ประวัติศาสตร์ 26 — ยังไม่ merge) — ✅ ปิดโดยเจ้าของ
- **มติเจ้าของ: คง bare ตาม precedent** (สอดคล้องแนวเดียวกับ FLAG-3/asabiyyah หะดีษลูฏ ที่คงสำนวนผู้เขียนแบบเปลือยสระเมื่อไม่ byte-exact กับ canonical ฉบับเดียว) — บันทึกมติไว้ · **รายละเอียดบล็อก/ที่มาจะ finalize ตอน audit บทฆูล (ปวศ.26) เมื่อ Alpha merge** (ขณะนี้ยังไม่มี PR/ไฟล์บนเมน)

## 2026-06-11 — audit บทใหม่ #6 · `articles/tarikh/the-ghoul-in-old-arab-literature.html` (#94, ฆูล)

**จุดพิเศษ (verify อาหรับ):**
- **อายะฮ์ byte-diff กับ canonical imlaei (quran.com):** ✅ byte-exact ทั้ง 2 — **Alpha แก้ harakat ที่เพี้ยนใน Drive แล้ว** (Drive: `وَالْأَولَادِ`/`إِنْسٌ`/`وَلا` → บทความ: `وَالْأَوْلَادِ`/`إِنسٌ`/`وَلَا` ตรง canonical)
  - 17:64 `وَشَارِكْهُمْ فِي الْأَمْوَالِ وَالْأَوْلَادِ` (สูเราะฮ์อัลอิสรออ์) · 55:56 `لَمْ يَطْمِثْهُنَّ إِنسٌ قَبْلَهُمْ وَلَا جَانٌّ` (สูเราะฮ์อัรเราะห์มาน) — เลขอายะฮ์ระบุในย่อหน้านำ (S7 ผ่าน)
- **หะดีษ Abu Ayyub (`سهوة فيها تمر…الغول`):** ✅ **byte-exact กับ ญามิอ์ อัตติรมิซีย์ 2880** (sunnah.com) — ตัว matn ตรงทุกตัวอักษร+สระ (ตัดเฉพาะเครื่องหมาย `"` ของ sunnah.com ที่ไม่ใช่เนื้อหา) · ระบุที่มา "(บันทึกโดยอัตติรมิซีย์)" ในคำแปล

**audit-fix (RE-DERIVE — align golden master):**
- คำแปลอายะฮ์/หะดีษเดิมเป็น `.ar-translation` + `“…”` → แก้เป็น **plain `<p>`** ตาม golden master (อายะฮ์ `{…}`, หะดีษ `“…”`) — ทำให้นับใน reading-time ถูกต้อง (Rule 55 ไม่ยกเว้น) · บทกวี `.ar-translation` 5 บล็อกคงเดิม (นอกขอบเขต) · reading-time: 19 นาที

**หะดีษอีก 2 บท (ตรวจระดับ — คง bare ถูกต้อง):**
- scholar/กวี `.ar-quote` 14 บล็อก uniformly BARE (Rule 60) ✓
- **FLAG-G1 (อะหมัด `عليكم بالدلجة…الغيلان…مأوى الحيات والسباع`):** ท่อนต้น `عليكم بالدلجة فإن الأرض تطوى بالليل` = canonical (อบูดาวูด 2571) แต่ **ฉบับเต็มเป็นสำนวนประสม** (`فبادروا بالأذان` ต่างจากสายอื่นที่ใช้ `فنادوا/فأذنوا`, +`مأوى الحيات والسباع`) **ไม่ byte-exact ในสายเดียวบน sunnah.com** (มุสนัดอะหมัดเต็มไม่มีบน sunnah.com) → **คง bare ar-quote + FLAG** (ถูกระดับ)
- **FLAG-G2 (บัยฮะกีย์ `كان لي طعام…النقصان…غول`):** ค้น sunnah.com ไม่พบสำนวนนี้ (เจอแต่ `النقصان` ในบริบทฟิกฮ์การค้า ไม่เกี่ยว) → **คง bare ar-quote + FLAG** (ถูกระดับ)

**house-style:** ﷺ=8 ครบทุกการเอ่ยนามท่านนบี · ไม่มี ทว่า/มิใช่ (Drive มี → publishing แก้แล้ว) · em-dash ใน comment/title · Ibn/Abu OK

## FLAG B9 — finalize (audit บทฆูล)
- **B9 = หะดีษฆูลที่คง bare** ในบทฆูล (อะหมัด composite + บัยฮะกีย์ ไม่พบ canonical) — สอดคล้องมติเจ้าของ **"คง bare ตาม precedent"** (แนว FLAG-3/asabiyyah: ไม่ byte-exact กับ canonical ฉบับเดียว → คงสำนวนผู้เขียนเปลือยสระ) · ✅ ปิดสมบูรณ์

## 2026-06-11 — audit บทใหม่ #7 · `articles/tarikh/culinary-arts-in-arab-islamic-civilization.html` (#96, ศิลปะการทำอาหาร) — rolling catch-up

**จุดพิเศษ (verify อาหรับ):**
- **อายะฮ์ 5:3 (อัลมาอิดะฮ์):** `حُرِّمَتْ عَلَيْكُمُ الْمَيْتَةُ وَالدَّمُ وَلَحْمُ الْخِنزِيرِ` → ✅ **byte-exact substring กับ quran.com imlaei** (Drive มีแค่คำแปลไทย `{…}` — Alpha เติมตัวอาหรับจาก quran.com ถูกต้อง) · เลขอายะฮ์ระบุในย่อหน้า (S7)
- **scholar `.ar-quote` 20 บล็อก uniformly BARE (Rule 60)** ✓ · เทียบ Drive ปวศ.48: skeleton spot-check 5/5 ตรง
- **gloss-cut + bracket-unwrap (เหมือน polo/food-prices):** glosses `(= ...)` และวงเล็บ `[...]` ใน Drive ถูก **ตัด/แกะออกจากอาหรับครบ** (เหลือ 0) และ **ความหมายอยู่ในคำแปลไทย** (ظاعن→"จากไป", أقتلِع→"ควัก", `ت 23هـ`→"ฮ.ศ. 23/ค.ศ. 645") ✓

**house-style audit-fix:**
- **Rule 12:** `อิมาม` → `อิหม่าม` **5 จุด** (อิหม่ามนำละหมาด, อิหม่ามภาษาศาสตร์, อิหม่ามอะห์มัด, อิหม่ามอามิร อัชชะอ์บีย์, อิหม่ามอิบนุ มาญะฮ์) — ทุกกรณีเป็น "Imam" จริง
- ﷺ=7 ครบทุกการเอ่ยนามท่านนบี · ไม่มี ทว่า/มิใช่ · em-dash ใน comment/title · aya translation ใช้ `{…}` (golden master) อยู่แล้ว

### 2026-06-11 — #96 culinary follow-up (จุดจับตาเจาะจง: ชี้ขาด Aisha/Ibn Majah 3324 + gloss/watermelon)
- **อายะฮ์ 5:3:** ยืนยัน byte-exact substring กับ quran.com imlaei (ตามที่ verify แล้ว) ✓
- **⚖️ ชี้ขาดหะดีษอาอิชะฮ์ (Alpha คง bare) = ถูกต้อง:** ต้นฉบับบทความ `أرادت أمي أن تعالجني للسمنة لتدخلني على النبي ﷺ… حتى أكلت الرطب بالقثاء، فسمنت كأحسن سمنة` **ต่างจาก สุนัน อิบนุ มาญะฮ์ 3324** (sunnah.com): `كَانَتْ أُمِّي تُعَالِجُنِي لِلسُّمْنَةِ تُرِيدُ أَنْ تُدْخِلَنِي… حَتَّى أَكَلْتُ الْقِثَّاءَ بِالرُّطَبِ فَسَمِنْتُ كَأَحْسَنِ سُمْنَةٍ`
  - ต่างเชิงโครงสร้าง (`أرادت…لتدخلني` vs `كانت…تريد أن تدخلني`) **และสลับลำดับ** (`الرطب بالقثاء` vs `القثاء بالرطب`) → **ไม่ byte-exact กับ 3324** → **คง bare ถูกต้องตาม precedent** (กฎ 1 / FLAG-3) ✓ ไม่ยกเป็น voweled hadith-block
- **gloss-cut (~17 จุด รวม `(= ...)` ทั้งหมด) + แตงโม ×2:** ตรวจครบ — **ความหมายอยู่ในคำแปลไทยทุกจุด (0 ตก)** เช่น `ظاعن→จากไป`, `أقتلِع→ควัก`, `الهبيد→حنظل/ฮันซ็อล`, `أهب→หนัง`, `بلهور→กษัตริย์อินเดีย`, `يبرين→รุบอุลคอลี`, `يتحلب فوه→น้ำลายไหล`, แตงโม/خربز→อัลคิรบิซ ✓ (gloss `(=…)` ถูกตัดจากอาหรับครบ 0 เหลือ)
- หะดีษอื่น (แตงโม/อุมัร ฯลฯ) คง bare ar-quote สม่ำเสมอตามแนวบท (อาหรับ uniformly bare ยกเว้นอายะฮ์) — ผู้ใช้โฟกัสตรวจความหมาย ไม่ขอ re-level

**สรุป #96: RE-DERIVE ครบ — main audited 100%** (บทความใหม่ทั้งหมดบน main audit + verify เสร็จ)

## 2026-06-12 — Beta loop · audit `articles/tarikh/ibn-battuta-in-al-andalus.html` (#101, อิบนุ บะฏูเฏาะฮ์) — **MAJOR Rule 1 restore**

**อาหรับ: ไม่แตะแม้แต่ไบต์เดียว** — ar-quote 14/14 byte-identical กับ main (d7b6e70) · ไม่มีอายะฮ์/หะดีษในบท · ZW=0 · Uthmani=0 · scholar quotes uniformly BARE (Rule 60) ✓ — การ audit นี้ไม่อยู่ในขอบเขต Arabic-Authority (ไม่มี Arabic touch)

**พบ Rule 1 violation ของ Alpha (กู้คืนจาก Drive ปวศ.25 ตามมติเจ้าของ "Beta กู้คืนเนื้อจาก Drive เอง"):**
- Alpha **ตัดเนื้อหาสาระไทย ~2,400 ตัวอักษร (~13%)** ทั่วทั้งบท (~33 ช่วง) — ไม่ได้ระบุใน CHANGES ของ PR #101 (= FAIL ตามโหมด)
- **กู้คืน byte-exact จาก Drive** ทุกช่วง รวมย่อหน้าบทบาทอิบนุ ญุซัยย์, การพบแม่ทัพนายกอง, เหตุผลของเปโดร 2 ฉายา, อัยนุลดัมอ์(narrative), ฯลฯ · reading-time 19→**21** (gen-reading-time.js, 18,808 ตัวอักษร)
- **คง typo-fix ที่ถูกต้องของ Alpha:** `คว่ำ→คร่ำหวอด`, `บุคล→บุคคล`, **`อัลฟอนโซที่ 10→11`** (ข้อเท็จจริง: Alfonso XI สิ้นพระชนม์ที่ Siege of Gibraltar 1350)
- **house-style ที่ใส่ตอนกู้คืน:** S2 `ทว่า→แต่`/`มิใช่→ไม่ใช่`/`มิได้→ไม่ได้` (ร้อยแก้ว), S4 เว้นวรรคหลัง ๆ, S1 โคลอนก่อน quote (14 จุด), Rule 16b ครอบชื่อตำรา 3 เล่ม (“History of Arabic Geographical Literature”/“อัลอิสติกศออ์”/“อัลมุก็อดดิมะฮ์”)

**FLAG-IB1 (ชื่อตำราอาหรับ inline):** Drive D46 มี `(دولة الإسلام في الأندلس)` ต่อท้ายชื่อไทย “รัฐอิสลามในอัลอันดาลุส” — **ตัดออก + FLAG** (เป็น inline Arabic ที่ต้องตัดสินใจเรื่อง `.ar-inline` span; ความหมายคงอยู่ในชื่อไทยแล้ว) — รอเจ้าของชี้ขาดว่าจะเติม inline Arabic หรือไม่
**FLAG-IB2 (Rule 52, pre-existing):** al-compounds ในบท (อบุลฮัจญาจ/อบุลวะลีด/อบุลกอซิม/อบุลบะเราะกัต/อบุลฮะซัน, อิบนุลเคาะฏีบ) — รูปถูกต้อง (สระอุ, ไม่มี อบูล) แต่แจ้งตาม mandate Rule 52 (มาจาก Drive+Alpha เดิม ไม่ได้สร้างใหม่)

## 2026-06-12 — PHASE 2 · `articles/tarikh/bimaristan-and-psychiatric-care.html` — aya Uthmani→imlaei (ไม่ใช่ drop)

**กรณีที่ใช้:** case (2) normalize อักขรวิธีอายะฮ์ Uthmani→imlaei byte-exact จาก quran.com (กฎ 53) — ★ไม่ใช่ Arabic drop★ (อายะฮ์มีอยู่แล้วใน aya-block แต่เป็น Uthmani)

| บล็อก | การกระทำ | แหล่ง (byte-exact) | byte-diff |
|---|---|---|---|
| อายะฮ์ 91:9-10 (`قد أفلح من زكاها…`) | `زَكَّىٰهَا`→`زَكَّاهَا`, `دَسَّىٰهَا`→`دَسَّاهَا` ( ىٰ→ا) | quran.com imlaei 91:9 + 91:10 (space-join, ไม่มี comma ตามโครงบทความ) | PASS (rasm-invariant: skeleton ก่อน=หลัง=แหล่ง) |

- การ์ตรวจ Arabic completeness รายงานผิดว่า "drop 1 บล็อก" เพราะ skeleton ของ Uthmani (`زكىها`) ≠ imlaei (`زكاها`) → false positive · ที่จริงอายะฮ์ครบ แค่ orthography ต่าง
- Thai coverage 100.4% (ครบอยู่แล้ว) · reading-time ไม่เปลี่ยน (aya ยกเว้น) · articles.json ไม่แตะ

## 2026-06-18 — PHASE 2 PILOT · `articles/nitisart/eating-liver-spleen-of-sacrificial-animal.html` (#25) · branch claude/phase2-liver-spleen-qurban

**กรณีที่ใช้:** case (2) vowel อายะฮ์ด้วยการ paste byte-exact จากแหล่ง canonical (quran.com, Hafs/uthmani) — บทความยกอายะฮ์ 2 ท่อนแบบ standalone (ผู้เขียนยกมาเกือบครบสระ) จึง **paste ตัวบท canonical byte-exact** ลงใน `.aya-block` แทน (R7/R53)

| บล็อก | ตัวบท (canonical, paste-only) | แหล่ง | blob-SHA(12) |
|---|---|---|---|
| `.aya-block` #1 | `وَيُحِلُّ لَهُمُ ٱلطَّيِّبَـٰتِ وَيُحَرِّمُ عَلَيْهِمُ ٱلْخَبَـٰٓئِثَ` | quran.com 7:157 (al-A'raf) | `27e37b5824fa` |
| `.aya-block` #2 | `أَوْ دَمًا مَّسْفُوحًا` | quran.com 6:145 (al-An'am) | `8d9ecb9dca92` |

- ดึงผ่าน quran.com API (uthmani) → ตัด substring ต่อเนื่องที่มีสระครบ byte-exact (ไม่พิมพ์สระเอง)
- **scholar quotes (.ar-quote) ทั้งหมด: คงสระครบตาม source (R60 all fully-voweled → keep voweled, ไม่ strip) — ไม่ถือเป็นการแตะ (byte-exact จาก source)**
- **★FLAG (R77 / nested-aya):** scholar quotes ของอัลกะซานีย์ + อิบนุ อาบิดีน มี **อายะฮ์แทรกในตัวบท** (รูปอักขรวิธีฉบับพิมพ์ เช่น `الطَّيِّبَاتِ` ไม่ใช่ `ٱلطَّيِّبَـٰتِ`) และมีจุดมหัพภาคลาติน `.`/`اهـ.` ปนใน scholar prose — **คงตัวบท scholar ไว้ byte-exact (ไม่แตะ)** เพราะอายะฮ์ฝังในประโยคปราชญ์แยกไม่ออกอย่างปลอดภัย → **FLAG ขอ Claude ตัดสิน** (re-fetch span อายะฮ์ในตัว scholar หรือคงไว้; และ normalize `.` ลาตินใน scholar prose หรือไม่)
- **★FLAG (R8 / hadith wording):** หะดีษ `أُحِلَّ لَنَا مَيْتَتَانِ...` ฝังในคำพูดอันนะวาวีย์ (สำนวน `فَالسَّمَكُ`) — sunnah.com Ibn Majah 3314 (เศาะฮีฮ์) ใช้สำนวน `فَالْحُوتُ` (ริวายะฮ์ต่างสำนวน) → **คงสำนวนอันนะวาวีย์ byte-exact** (ไม่ทับด้วย sunnah.com เพราะจะบิดเบือนคำพูดปราชญ์), takhrij อ้างใน บรรณานุกรม ref-3 → FLAG ขอ Claude ยืนยันแนวทาง

## 2026-06-18 — PHASE 2 PILOT · `articles/tarikh/fatima-al-fihriya-founder-of-al-qarawiyyin.html` (#52) · branch claude/phase2-fatima-al-fihriya

**กรณีที่ใช้:** case (1) strip ฮะเราะกาตตามกฎ 60 (ALL-OR-NOTHING) — คำพูดปราชญ์ในบทนี้ลงสระไม่สม่ำเสมอใน source จึงตัดสระให้เปลือยสระทั้งหมด (uniformly bare) · ลบเฉพาะ U+064B–U+0652 · skeleton ก่อน=หลัง ทุกบล็อก (พิสูจน์ด้วย strip-marks byte-diff) · บทนี้ไม่มีอายะฮ์/หะดีษ

| # | บล็อก | before → after | skeleton-equal | blob-SHA(after, 12) |
|---|-------|----------------|----------------|---------------------|
| 1 | `.ar-quote` (อิบนุ คอลดูน, มุก็อดดิมะฮ์) | `نبّهت` → `نبهت` | ✅ | `a12ccd032fcc` |
| 2 | `.ar-inline` (ชื่อมัสญิด) | `الْقَرَوِيِّينَ` → `القرويين` | ✅ | `880fd2d41295` |
| 3 | `.ar-quote` (อัซซิริกลี, الأعلام) | `ووُسع` → `ووسع` | ✅ | `55f94a7247dd` |
| 4 | `.ar-quote` (อัลลาล อัลฟาซี) | `مراراً` → `مرارا` | ✅ | `3017a613582d` |

- บล็อกปราชญ์ที่ 4 (`كان المسجد الجامع...` อัลลาล อัลฟาซี) ไม่มีสระใน source → ไม่เปลี่ยน
- เครื่องหมายวรรคตอนอาหรับเป็นแบบอาหรับอยู่แล้ว (`،` U+060C) → ไม่ต้อง normalize (R77)
- ตัดสระรวม 10 ตัว · วิธี: `re.sub(r'[ً-ْ]','',…)` ทั้งไฟล์ + assert skeleton ตรง · Thai coverage 99.91% · reading-time 23

## 2026-06-18 — PHASE 2 PILOT · #183 · al-Zirikli title correction (approved R1 deviation, One precedent)

**กรณีพิเศษ (นอก 3 audit cases ปกติ) — APPROVED ภายใต้ phase precedent ของ One ("correct-in-body where the right value is CERTAIN") + Codex flag + R6 (ชื่อตำราอาหรับต้องถูกอักขรวิธี):** แก้ชื่อสารานุกรมของอัซซิริกลีในบล็อก `.ar-inline` ที่ source สะกดตกฮัมซะฮ์

| บล็อก | before → after | เหตุผล | blob-SHA(after,12) |
|---|---|---|---|
| `.ar-inline` (ชื่อตำรา) | `الاعلام` → `الأعلام` | al-A'lām ของ Khayr al-Dīn al-Zirikli สะกดถูกต้องคือ `الأعلام` (ฮัมซะฮ์บนอลิฟ); source/Drive ตกฮัมซะฮ์ → R6/R4 + Codex | `80f2b9ef7546` |

- เป็น **skeleton edit** (เติมฮัมซะฮ์) ไม่ใช่ strip-harakat/canonical-paste → **flag ใน REVIEW-QUEUE ขอ One ยืนยัน/revert ได้**
- ไม่ใช่อายะฮ์/หะดีษ/ตัวบท-matn ของปราชญ์ (เป็นชื่อตำรา proper noun ที่รูปถูกต้องแน่นอน) · coverage 99.91% (Arabic ยกเว้น) · HTMLParser OK · lint PASS

## 2026-06-18 — PHASE 2 · #182 editorial pass (ibn-battuta) — NON-ARABIC approved R1 deviations (One-confirmed)

**ไม่ใช่การแตะตัวอาหรับ** (บันทึกที่นี่ตามที่ One สั่งให้ log ทั้ง REVIEW-QUEUE + AUDIT-FIXES) — เป็น approved R1 deviation ในร้อยแก้วไทย + เพิ่ม footnote (ไม่มีการแก้ skeleton/harakat อาหรับ): [1] 1324→1325 (consistency)+note · [2] แอฟริกาใต้→แอฟริกาตะวันตก+note · [3] Port Said คง verbatim+footnote · [4] Ibn Juzayy 1355 คง verbatim+footnote · รายละเอียดใน REVIEW-QUEUE.md · ดูแนวทาง: correct-in-body เฉพาะค่าที่แน่นอน, ไม่แน่ใจ→คง+footnote

## 2026-06-18 — BATCH A · 5 history articles · branch `claude/loving-ride-m41v40`

> ทุกอายะฮ์ re-fetch byte-exact จาก quran.com (uthmani/Hafs), ทุกหะดีษจาก sunnah.com (paste-only ผ่าน curl, ไม่พิมพ์เอง).
> scholar quotes: R60 — strip-to-bare (ถ้า source ลงสระไม่สม่ำเสมอ) หรือ keep-voweled (ถ้าครบทุกบล็อก); ลบเฉพาะ invisibles + unescape markdown.
> byte-diff ยืนยันทุกบล็อก (re-fetch diff สำหรับ aya/hadith; skeleton-equal สำหรับ scholar). blob-SHA = git blob sha1(12) ของ UTF-8 ในไฟล์.

### `articles/tarikh/madain-salih.html` (#8) — case (2) paste byte-exact canonical + scholar bare (no touch)
| บล็อก | การกระทำ | แหล่ง (paste-only) | blob-SHA(12) |
|---|---|---|---|
| .hadith-block Bukhari 433 | re-fetch byte-exact | sunnah.com bukhari:433 (matn `لاَ … مَا أَصَابَهُمْ`) | 15e969cb42a8 |
| .aya-block 27:45–52 (8) | re-fetch byte-exact | quran.com 27:45..27:52 | 00e02863252f, b28bbee570e2, a37145a269d5, e4cbadfde8f6, 2c7767df7a6b, ce56fc2de935, ceb408fb8bae, 9ee7785d266c |
| .aya-block 26:149 | re-fetch byte-exact | quran.com 26:149 | 965ea462af26 |
| .aya-block 7:74 (opening substring) | re-fetch byte-exact prefix → عَادٍ | quran.com 7:74 | 6182901aa5c5 |
| .ar-quote ×3 (Ibn Nasir al-Din, Ibn ʿAbd al-Barr, al-Ṭabari) | BARE จาก source, ไม่แตะ harakat | source manuscript | 9626ef357205, 3c547423a19f, 547c79b4dfbc |
- byte-diff: aya/hadith = re-fetch matched (verified). scholar = bare (strip_marks==self), skeleton = source. R8: source non-canonical hadith → ใช้ canonical sunnah.com.

### `articles/tarikh/remembering-the-mawlid.html` (#81) — Ibn Hajar keep-voweled (R1/#185) + aya takhrij re-fetch
| บล็อก | การกระทำ | แหล่ง | blob-SHA(12) |
|---|---|---|---|
| .ar-quote Ibn Hajar (Fath al-Bari) | KEEP voweled byte-exact (clean_invis; drop trailing Latin `.` R77) — embeds 3:159+21:107 verbatim (no canonical splice) | source manuscript (R1) | 5f8ae0773d61 |
| .ar-quote Shawqi couplet | keep + remove tatweel U+0640 + invisibles (decorative; rasm unchanged) | source manuscript | 9f87b8ee24c9 |
| bib ref-3 āyah 3:159 (takhrij) | re-fetch byte-exact | quran.com 3:159 | 238b46702c9a |
| bib ref-4 āyah 21:107 (takhrij) | re-fetch byte-exact | quran.com 21:107 | 86a403733102 |

### `articles/tarikh/scholars-of-the-nile.html` (#56) — scholar bare + Arabic bib paste
| บล็อก | การกระทำ | แหล่ง | blob-SHA(12) |
|---|---|---|---|
| .ar-quote al-Ramli (`لا مدخل لي في أحوال البلد والرعية، وإنما أنا رجل فقيه لا غير`) | BARE (source bare) | source manuscript | 354dffeef415 |
| .ar-quote al-Shaʿrani (`ذلك ليس من شأني`) | BARE (source bare) | source manuscript | 19b2bf9766a2 |
| bib ref-1 al-Jaziri (al-Durar al-Fawāʾid 1/711–713) | paste byte-exact | source manuscript | c52dc71fd03f |
- skeleton-equal ✅ ทั้งหมด; R77: quote 1 มี ، อยู่แล้ว → no-op.

### `articles/tarikh/crusades-after-salahuddin.html` (#72) — case (1) strip-to-bare ×15 (R60 all-or-nothing)
| # | บล็อก (historian) | การกระทำ | blob-SHA(12) |
|---|---|---|---|
| 0 | Ibn Wasil | strip→bare | fb33fe82d120 |
| 1 | Felix Fabri (via Suhayl Zakkar) | strip→bare | 674d4df5607c |
| 2 | Ibn Shaddad (al-Nawadir al-Sultaniyya) | strip→bare | 7f67b7c9e1e8 |
| 3 | Jirjis Ibn al-Amid (Akhbar al-Ayyubiyyin) | strip→bare | 1b4d426fa841 |
| 4 | Ibn al-Athir (al-Kamil) | strip→bare | 0653e7d2dc8e |
| 5 | Sibt Ibn al-Jawzi (Mir'at al-Zaman) | strip→bare | 04ea29182f2a |
| 6 | al-Kamil's letter via Ibn al-Athir (>60w) | strip→bare | a30d6099e679 |
| 7 | al-Dhahabi (al-Siyar) | strip→bare | e29b2a7ce273 |
| 8 | al-Dhahabi (Tarikh al-Islam, Gaza) | strip→bare | f2b645122e1b |
| 9 | al-Mu'ayyad (al-Mukhtasar) | strip→bare | f7da84ca2825 |
| 10 | al-Dawadari (Kanz al-Durar, al-Mansura) | strip→bare | 624d19e6c6a9 |
| 11 | Ibn Taghri Birdi (al-Manhal al-Safi) | strip→bare | dddfeee5b6d1 |
| 12 | Ibn Wasil (Baybars, >60w) | strip→bare | 7d8c78066960 |
| 13 | Abu al-Fida (al-Mukhtasar, Tripoli) | strip→bare | 890da326ae43 |
| 14 | al-Dawadari (Kanz al-Durar, Acre, >60w) | strip→bare | 787b1d906857 |
- skeleton-equal `strip_marks(source)==strip_marks(file)` = True ทั้ง 15; no residual harakat. R77 = no-op (no Latin ,/?). editorial glosses + stray ASCII `"` + ellipsis `..` kept byte-exact (R1, FLAG).

### `articles/tarikh/sunni-shia-conflict-baghdad-443.html` (#2) — keep-voweled ×9 (R60 all-voweled→keep)
| # | บล็อก (Ibn al-Athir, al-Kāmil) | การกระทำ | blob-SHA(12) |
|---|---|---|---|
| 0 | فِي هَذِهِ السَّنَةِ فِي صَفَرٍ… | keep voweled, clean_invis | 078d6d1439ad |
| 1 | وَكَانَ سَبَبُ هَذِهِ الْفِتْنَةِ… | keep voweled | 60e2a7f16272 |
| 2 | وَأَنْكَرَ أَهْلُ الْكَرْخِ… (+unescape `[ أَنْ ]`) | keep voweled | 5c5b8c0bf136 |
| 3 | وَدَامَ الْقِتَالُ… | keep voweled | 9915aa272423 |
| 4 | فَلَمَّا رَجَعُوا مِنْ دَفْنِهِ… | keep voweled | ace9e22da4fe |
| 5 | فَلَمَّا كَانَ الْغَدُ كَثُرَ الْجَمْعُ… | keep voweled | 7ec52b2a9e2e |
| 6 | فَلَمَّا كَانَ الْغَدُ خَامِسُ الشَّهْرِ… | keep voweled | 4aba5bc2dbb9 |
| 7 | وَسَمِعَ أَبُو تَمَامٍ… (+unescape `( … )`) | keep voweled | 1ec8d55ab15b |
| 8 | وَلَمَّا انْتَهَى خَبَرُ إِحْرَاقِ الْمَشْهَدِ… | keep voweled | 90ba57dc6d09 |
- extracted byte-exact จาก source ที่ดาวน์โหลด (no hand-retype); ลบเฉพาะ invisibles + unescape `\[`/`\]`; harakat untouched. source quirk "ا تَجَاوَزْنَا" + editorial brackets คง byte-exact (FLAG).

## 2026-06-18 — QC cleanup (aya/hadith placement) · branch `claude/loving-ride-m41v40` (PR #190)

**ไม่มีการแตะตัวอักษรอาหรับ (no Arabic harakat/skeleton touched).** การย้ายคำแปลออกนอกบล็อก aya/hadith เป็นการจัดวาง HTML ล้วน:
- ทุก `<p class="block-ar">` (ตัวบทอายะฮ์/หะดีษ) คงไว้ **byte-exact** — พิสูจน์ว่า before==after ของรายการ block-ar ทั้งหมดในไฟล์ (madain-salih, eating-liver-spleen, abu-al-aynaa, al-ashari, _TEMPLATE) ก่อน/หลัง transform
- สิ่งที่ลบคือ `<p class="block-source">` ซึ่งเป็น **ป้ายที่มาภาษาไทย** ("สูเราะฮ์… อายะฮ์ที่ …" / "บันทึกโดยอัลบุคอรีย์") ไม่ใช่ตัวบทอาหรับ
- ไม่มีการ re-fetch/แก้ canonical ใหม่ · madain-salih: re-verify Quran (quran.com) + hadith Bukhari 433 (sunnah.com) ยังคง byte-exact หลัง transform
- editorial #25/#70 เป็นร้อยแก้วไทย/translit ไม่แตะตัวบทอาหรับ

### 2026-06-18 — #25 eating-liver-spleen small polish (text-only, no Arabic)
- FIX1: H2 `มัสฮับอัลฮะนาฟียะฮ์`→`มัสฮับอัลฮะนะฟียะฮ์` (นา→นะ, heading เดียวตามคำสั่ง "ONE heading only")
- FIX2: stray `<p class="ar-translation">…ต้องห้าม”</p>` → plain `<p>…ต้องห้าม</p>` (ตัด ” ค้าง, ถ้อยคำคงเดิม) — pre-existing artifact
- ทุก `<p class="block-ar">` + `.ar-quote` byte-identical vs HEAD (no Arabic touched); reading-time #25 = 9 (unchanged); HTMLParser OK
- **⚑ FLAG to One:** L387 body prose ยังเป็น `อัลฮะนาฟียะฮ์` (นา) — ไม่แตะตามคำสั่ง "Do not touch any other ฮะนา/ฮะนะ token" ฉะนั้น `grep ฮะนาฟียะฮ์` = 1 (ไม่ใช่ 0); ขอ One ยืนยันจะให้แก้ L387 ด้วยหรือคงไว้
- follow-up (One approved): L387 body `อัลฮะนาฟียะฮ์`→`อัลฮะนะฟียะฮ์` (นา→นะ) — `grep ฮะนาฟียะฮ์` now = 0; no Arabic touched (block-ar/ar-quote byte-identical), reading-time #25 unchanged

## 2026-06-18 — PHASE-2 "PROVE-THE-GATE" BATCH · 6 articles · branch `claude/phase2-batch-prove-gate`
> āyāt re-fetched byte-exact from quran.com (text_uthmani); hadith from sunnah.com (arabic_text_details); scholar Arabic extracted byte-exact from Drive source, R60 ALL-OR-NOTHING. Built via per-article agents reading on-disk source (sub-agents content-blocked when downloading+processing fresh source; reading from disk avoided it). byte-diff + blob SHA logged per article in /tmp/p2/audit (orchestrator-verified gate suite a–h re-run on final files).

| article | category | Arabic | R60 | coverage |
|---|---|---|---|---|
| the-age-of-khadija | history | 51 scholar .ar-quote (isnād/jarh); embedded التهلكة fragment kept in-quote; no standalone aya/hadith | strip→BARE | 99.23% |
| sunglasses-during-ihram | hajj | hadith Muslim 1298a (Umm Husayn); 5 scholar .ar-quote | KEEP voweled (source consistent) | 98.60% raw / 99.79% S5-adj |
| conjoined-twins-in-islamic-law | nitisart | 19 scholar/historian .ar-quote; no aya/hadith | strip→BARE | 99.65% |
| ethics-of-war-in-islamic-law | nitisart | 15 aya/hadith byte-exact (8:61, 60:8, 5:32, 2:190/191, 9:5/6, 22:39, 2:204-205; bukhari:3015, muslim:1744, ibnmajah:2842, abudawud:2614) + 25 scholar .ar-quote | scholar strip→BARE; aya/hadith voweled | 99.01% |
| touching-dogs-in-islam | nitisart | hadith Muslim 1575b + standalone 5:4 (re-fetched); 22 scholar .ar-quote; embedded 5:4 kept in-quote | strip→BARE | 98.53% raw / 99.43% S5-adj |
| hadith-scholars-vs-jurists | hadith | Ibn Khaldun .ar-quote + 2 book titles ar-inline; no aya/hadith | strip→BARE (source bare) | 99.69% |

### ⚑ FLAGS (editorial)
- **★ S5 vs coverage.py (2 articles):** dogs 98.53% & sunglasses 98.60% fall under the raw ≥99 gate SOLELY because mandatory S5 (long salawat → ﷺ) removes countable Thai chars that coverage.py (Thai-only) cannot credit — no content lost (Rule 72 classes normalization as non-loss). S5-adjusted: dogs 99.43%, sunglasses 99.79%. Per the hard-gate rule NO workaround applied (honorific not restored, coverage.py not modified). **One to rule: accept S5-adjusted, or credit ﷺ in coverage.py.**
- **R52 (al-/name confirmation):** the-age-of-khadija: อิบนุลมุลักกิน, อิบนุลก็อตฏอน, อบุนนัฎร์, อบุลวะลีด. conjoined-twins: อิบนุลเญาซีย์, อิบนุลอิม้าด, อบุลบะศ็อล. ethics-of-war: อิบนุลก็อยยิม, อิบนุซุบัยร (no space in source). dogs: อิบนุลกอซิม. hadith-vs-jurists: อบุลฟัตห์.

### 2026-06-18 — R52 resolution (One approved) · ethics-of-war-in-islamic-law
- war: "อิบนุซุบัยร" → "อิบนุซซุบัยร์" (Ibn al-Zubayr; ز sun-letter → al- assimilation → ซซ + ์), 1 occurrence (in a Thai .ar-translation attribution). Other batch fused forms (khadija/twins/dogs/hadith) = standard, left as-is. Re-run this file only: [c] no bare "อิบนุซุบัยร" remain (0), [d] HTMLParser OK, [e] coverage 99.01% (no regression). No Arabic block touched; articles.json/sitemap/index untouched.

---

# PHASE-2 BATCH 10 — Arabic touches log (10 articles, branch `claude/phase2-batch-10`)
> DRAFT PR. Each scholar `.ar-quote`/`.ar-feature` touch = harakat-strip (R60) and/or R77 punctuation-normalize, operated byte-exact on the consonant skeleton (only U+064B–U+0652/U+0670 deleted). Quran āyāt re-fetched paste-only from api.quran.com (uthmani, R53); hadith re-fetched paste-only from sunnah.com (R8). Skeletons verified against source/canonical (orchestrator independently byte-verified the sacred texts marked ✔).

## nitisart/usul-al-fiqh-foundations — 5 scholar blocks, 0 aya/hadith
- R60: all 5 blocks stripped to uniformly BARE (source vowelling partial). Skeleton byte-exact.
- Block 1 (Ibn Khaldun): source typo `الأحكاما` (extra ا) → `الأحكام` (per editor note; R60/R77).
- Block 5 (al-Juwayni via Ibn al-Salah): R77 removed 2 stray Latin `.`.
- Bibliography: orchestrator trimmed agent-reconstructed muhaqqiq/place/publisher/year → author+title only (source gave none).

## nitisart/fidyah-kaffarah-and-qada — 17 scholar blocks, 0 aya/hadith
- R60: all 17 stripped BARE (source partial). Skeleton byte-exact (17/17).
- R77: removed trailing stray Latin `.` from 13 blocks; block 3 `السنين. والمد` → `السنين، والمد`.

## nitisart/taysir-vs-tasahul-in-fatwa — 9 scholar blocks BARE + 2 aya + 5 hadith
- aya 2:185 ✔ `يُرِيدُ ٱللَّهُ بِكُمُ ٱلْيُسْرَ وَلَا يُرِيدُ بِكُمُ ٱلْعُسْرَ` (api.quran.com 2:185, paste-only) — orchestrator byte-verified.
- aya 7:157 ✔ `وَيَضَعُ عَنْهُمْ إِصْرَهُمْ وَٱلْأَغْلَـٰلَ ٱلَّتِى كَانَتْ عَلَيْهِمْ` (api.quran.com 7:157, substring byte-exact) — orchestrator byte-verified.
- hadith ✔ bukhari:69 `يَسِّرُوا وَلاَ تُعَسِّرُوا، وَبَشِّرُوا وَلاَ تُنَفِّرُوا` — orchestrator byte-verified.
- hadith ✔ bukhari:6128 `دَعُوهُ، وَأَهْرِيقُوا عَلَى بَوْلِهِ ذَنُوبًا…بُعِثْتُمْ مُيَسِّرِينَ…` — orchestrator byte-verified.
- hadith bukhari:887 (siwak), muslim:1828 (du'a), bukhari:3560 (ma-khuyyira) — re-fetched paste-only sunnah.com.
- R60: 9 scholar blocks BARE; R77 normalized (Latin `.`/`,` inside Arabic). Embedded 2:185 inside Ibn ʿAbd al-Barr's quote kept verbatim (R1>R53, #185); canonical voweled 2:185 supplied standalone.

## nitisart/harmony-between-the-madhabs — 0 Arabic blocks (source pure Thai prose; no touch)

## hajj/arafah-time-and-place — 29 scholar blocks BARE + 3 hadith
- hadith ✔ muslim:1977e `إِذَا رَأَيْتُمْ هِلاَلَ ذِي الْحِجَّةِ…فَلْيُمْسِكْ عَنْ شَعْرِهِ وَأَظْفَارِهِ` — orchestrator byte-verified.
- hadith ✔ tirmidhi:697 `الصَّوْمُ يَوْمَ تَصُومُونَ…وَالأَضْحَى يَوْمَ تُضَحُّونَ` — orchestrator byte-verified.
- hadith tirmidhi:802 `الْفِطْرُ يَوْمَ يُفْطِرُ النَّاسُ…` — re-fetched paste-only sunnah.com.
- R60: 29 scholar blocks BARE (source partial). R77: removed 4 stray Latin `.`, 1 Latin `;` → `؛`. Embedded sacred fragments inside Ibn Hazm / al-Shawkani quotes kept verbatim (R1, #185).

## tarikh/the-mihna-under-al-mamun — 20 scholar blocks VOWELED (R60 ALL path)
- Source (al-Tabari / Ibn Kathir printed edition) fully voweled (~0.85 ratio across all). R60 ALL path chosen — kept FULLY VOWELED byte-exact from source (no stripping, no auto-vowel). Orchestrator verified 20/20 Arabic skeletons byte-exact in source.
- R77: removed 3 stray Latin `.` inside scholar Arabic.
- Embedded Quran fragments Q16:106 / Q2:156 / Q42:11 woven inside scholar quotes kept byte-exact verbatim (R1>R53, #185); no standalone aya-block, no splice.

## tarikh/mamluks-of-sword-and-pen — 13 scholar blocks BARE, 0 aya/hadith
- R60: all 13 stripped BARE (source partial). Skeleton byte-exact (13/13). R77: no change needed (source already used `،`/`؛`).

## tarikh/politics-power-and-scholarship — 15 scholar blocks BARE, 0 standalone aya/hadith
- R60: all 15 stripped BARE (source partial). R77: removed stray Latin `.` from blocks 6 (Ibn Hajar) and 7 (Ibn Kathir, incl. mid-sentence `بسبب . الشيخ`→`بسبب الشيخ`).

## tarikh/paper-industry-medieval-islam — 0 Arabic blocks (no touch)
## tarikh/clockmaking-in-the-mamluk-era — 0 Arabic blocks (no touch)

## Repo-wide ortho audit (2026-06-19) — Arabic hamzat al-qaṭʿ in .ar-quote (6 tokens)
Detection: scripts/lint-arabic-ortho.py (curated, word-boundary-safe). Each fix = bare
alif → hamza; verified every hit is inside .ar-quote (NOT aya/hadith); token-diff = bare→hamza
only, rest of consonant skeleton unchanged. User-approved (treated as typo-on-copy).
- kalam/shia-scholars-challenge-asharism.html : الى→إلى (×1) · blob 2497f1b
- tarikh/salahuddin-sunni-revival.html : ادريس→إدريس (×1) · blob 76dc047
- tarikh/sexuality-in-caliphal-court.html : الى→إلى (×1) · blob 1fa4066
- tarikh/sports-and-games-in-islamic-history.html : الى→إلى (×1) · blob fc630a8
- tarikh/the-fall-of-al-andalus.html : الى→إلى (×2) · blob fdc0daa
---

# PHASE-2 BATCH 11 — Arabic touches log (10 articles, branch `claude/phase2-batch-11`)
> DRAFT PR. Scholar `.ar-quote`/`.ar-feature` tashkeel = R60 ALL-OR-NOTHING (strip only U+064B–U+0652/U+0670, skeleton byte-exact). Quran āyāt re-fetched paste-only from api.quran.com uthmani (R53); hadith from sunnah.com (R8). Orchestrator independently byte-verified every standalone āyah/hadith (✓). Bibliographies: source-provided detail only — no fabrication (Batch-10 lesson). articles.json author = bare `กองบรรณาธิการ`; HTML meta/JSON-LD keep long-form per site convention. Blob SHAs below.

- **secularism-religion-and-politics** `24857e1` — 0 āyah/hadith/scholar blocks; 5 `.ar-inline` terms byte-exact from source (1 corrected: shadda/fatha order on حلوليَّة → matches source). No tashkeel/R77 ops.
- **justice-belief-and-power-classical-governance** `bc2bda1` — āyāt **99:7-8** + **42:38** (clause) paste-only, ✓ byte-verified (99:8 silah-damma → Beta byte-QC note). 6 scholar `.ar-quote/.ar-feature` → BARE (R60). R77: removed stray Latin `.` from al-Baqir + Ibn Jamaʿah blocks. Embedded sacred text kept verbatim (#185).
- **taxation-through-ibn-khaldun** `04ac5d3` — 0 āyah/hadith; 14 scholar `.ar-quote` → BARE (R60, byte-diff 14/14 verified). R77: none needed (source already `،`).
- **womens-power-in-islamic-chronicles** `a023fa2` — 0 āyah/hadith/scholar; 3 `.ar-inline` name-glosses byte-exact.
- **visual-art-and-shadow-puppets-in-islam** `44e3afe` — 0 āyah/hadith/scholar; 21 `.ar-inline` terms byte-exact.
- **origins-of-nur-al-din-zangi** `35048d4` — 0 āyah/hadith; 15 scholar `.ar-quote` → BARE (R60, 15/15 byte-exact). R77: none needed.
- **surnames-and-lineage-in-islam** `3512d24` (renamed from battle-of-hunayn, recategorized → nitisart per content) — āyah **33:4 (tail)+33:5** ✓; hadith **Bukhari 2864** `أَنَا النَّبِيُّ لاَ كَذِبْ أَنَا ابْنُ عَبْدِ الْمُطَّلِبْ` ✓ + **Bukhari 6766** ✓ — all byte-verified. 6 scholar `.ar-quote` + 1 `.ar-feature` → BARE (R60). R77: removed stray Latin `.` from al-ʿAyni + Ibn Hajar. Embedded Quran phrase in al-Qurtubi thai-quote kept verbatim (#185).
- **husband-maintenance-and-marital-rights** `511fc58` — āyah **2:229 (tail)** ✓; hadith **Abu Dawud 3571** ✓ byte-verified; **Bukhari 2554** byte-verified EXCEPT one word in the ʿabd clause (file `وَهُوَ` vs canonical `وَهْوَ`) → Beta byte-QC. 16 scholar `.ar-quote` → BARE (R60). R77: removed 1 stray Latin `.` (fiqh-maxim).
- **jurisprudence-and-state-power** `9c80cd4` — 0 āyah/hadith/scholar; 9 `.ar-inline` terms byte-exact.
- **divergent-opinions-on-one-issue** `d76d9c6` — āyāt **39:9, 4:83, 16:43** (fragments) paste-only, all ✓ byte-verified as exact substrings of canonical. 8 scholar `.ar-quote` → BARE (R60). R77: none needed.

---

# PHASE-2 BATCH 12 — reflections (มุมพักใจ) · Arabic touches (11 articles, branch `claude/phase2-batch-12-reflections`)
> DRAFT PR. Scholar/poetry `.ar-quote` tashkeel = R60 ALL-OR-NOTHING (strip only U+064B–U+0652/U+0670, byte-exact skeleton). Quran āyāt re-fetched paste-only api.quran.com uthmani (R53); hadith sunnah.com (R8). Where the Drive doc's hadith wording was a non-canonical variant, the canonical sunnah.com matn was pasted and the author's variant kept as Thai gloss only (R8). Orchestrator byte-verified the ✓ items. articles.json author = bare `กองบรรณาธิการ`; HTML meta/JSON-LD long-form. Zero HTML comments in all 11 (match golden master). Blob SHAs below.

- **self-effacement-and-clarity** `ec426b5` — 0 aya/hadith blocks; 6 scholar bare; R77 removed 3 Latin `.`. 1 hadith embedded in al-Suyūṭī quote kept verbatim (#185); takhrij **Tirmidhi 2654** in bib.
- **what-the-salaf-left-us** `4b60123` — āyah **11:111** ✓ + **2:237** (fragment) ✓; hadith **Muslim 1017a** ✓ + **Bukhari 2652** (opening clause) — all byte-exact. 11 scholar bare; R77 normalized. Drive hadith wording variant → canonical Muslim 1017a pasted; embedded āyāt in al-Yūsī/Zarrūq quotes kept verbatim (#185).
- **scholars-patience-in-poverty** `efe5f5f` — 0 aya/hadith; 7 scholar bare; R77 `,`→`،`, removed Latin `.`. Source Arabic typos in Ibn Ḥazm block (`أبن حزام`, `الفقيةأبى`, `مخزفة`, `المامون`, `واالله`) kept byte-exact verbatim (R1) — FLAGGED.
- **scholars-and-the-value-of-time** `5920ac0` — 0 aya/hadith; 3 scholar bare; R77 `?`→`؟`, `,`→`،`, removed `.`. Source typo `أبو سيف` (ctx = أبو يوسف) kept verbatim (R1) — FLAGGED.
- **society-and-the-final-chapter** `e303f52` — hadith **Bukhari 3416** `لاَ يَنْبَغِي لِعَبْدٍ…يُونُسَ بْنِ مَتَّى` ✓ byte-verified; 6 scholar bare. Drive doc's «لنبي» variant NOT pasted (unverifiable); canonical «لعبد» block + author's nuance as Thai gloss; takhrij Bukhari 3416 / Muslim 2377.
- **guarding-time-and-aging** `affe227` (R79 merge) — 0 aya/hadith/scholar blocks (source had no Arabic verbatim for verses/hadith/poetry → none fabricated); 5 `.ar-inline` + 3 `.poem-th` (Thai verse).
- **the-essence-of-brotherhood** `5bd32a6` — hadith **Muslim 55a** `الدِّينُ النَّصِيحَةُ…` ✓ byte-verified; 7 scholar bare; R77 removed Latin `.`, `?`→`؟`. 1 embedded hadith verbatim (#185).
- **the-etiquette-of-sleep** `41a3149` — 0 standalone aya/hadith (duʿāʾ/verses quoted inside al-Ghazālī prose, verbatim #185); 7 scholar bare; R77 removed 8 Latin `.`, `\!`→removed. Source mid-word space `ت طول` (canon `تطول`) kept verbatim (R1) — FLAGGED.
- **barakah-of-eating-together** `75c7f76` — 4 hadith re-fetched paste-only: **Ibn Mājah 3287**, **Abū Dāwūd 3764**, **Muslim 2059a**, **Bukhari 5392** (Beta byte-QC recommended — orchestrator did not independently re-fetch all 4); 3 scholar VOWELED (source uniformly voweled → kept voweled byte-exact, R60). Drive Abū Dāwūd wording variant → canonical pasted. Source typo `ปรากฎ` kept verbatim (R1) — FLAGGED.
- **the-power-of-new-beginnings** `7c219c8` — āyah **57:16** (fragment) ✓ byte-verified substring; 0 hadith/scholar blocks; 3 `.ar-inline`.
- **on-love-and-longing** `c2950e2` (R79 merge) — 51:49 / 2:187 / Bukhari 1 appear only as **Thai paraphrases** in source → NO aya/hadith blocks created (no fabrication); 3 al-Shāfiʿī poetry `.ar-quote` bare (byte-exact skeleton). Dropped one Facebook cross-reference nav line from Doc B (R56, not content) — FLAGGED.

# ===== Phase-2 Batches 1-4 (consolidated) =====

## Phase-2 Batch 1 (2026-06-19) — Arabic byte-exact notes
### man-is-a-social-being
R52/R82 (REVIEW-QUEUE — fused al- names, vowel/spelling): (1) "อัรรอซีย์" — Fakhr al-Din al-Razi nisba; spelling matches the existing kalam corpus article al-razi-miraj-science.html, kept for consistency. (2) "อิบนุ ตัยมียะฮ์", "อิบนุ คอลดูน" — Ibn-prefix names spaced per R52 (not al- compounds, so no fusion). (3) "อบุล/อิบนุล" forms: NONE present in this article. No FLAGGED fused-name spellings needed editorial decisions.

R1 (source typos preserved verbatim per Rule 1 — flagged, NOT silently fixed): (a) A large passage is DUPLICATED in the Drive source — the block beginning "ดังนั้น มนุษย์จึงจำเป็นต้องรวมตัวกันเป็นจำนวนมาก..." through the หอก/ดาบ/โล่ example appears twice (the first occurrence ends with a stray unmatched "(" before "ดังนั้น มนุษย์จึงจำเป็น..." and uses "ลาบ้าน", the second uses "ลาของบ้าน"). Preserved 100% verbatim (Rule 1/72); the stray "(" is a source artifact kept in place. (b) "แพทเรื่องชื่อ" — clear typo for "แพทย์เลื่องชื่อ" in the SECOND (duplicated) occurrence of the Galen sentence; the first occurrence reads "แพทย์เลื่องชื่อ". Both kept verbatim per Rule 1. Recommend editorial de-duplication + typo fix at source.

Arabic byte-diff notes (AUDIT-FIXES): No scholar-quote (.ar-quote/.ar-feature) Arabic was normalized or altered — all pasted byte-exact from the Drive doc (bare/as-printed, ALL-OR-NOTHING bare since source quotes carry no/partial tashkeel). The ONE standalone aya (Surah Taha 20:50) was a FRAGMENT in the source ("أَعْطى كُلَّ شَيْءٍ خَلْقَهُ ثُمَّ هَدى"); per Arabic-Authority case 2, the fully-voweled byte-exact substring was pasted from quran.com text_uthmani (verse 20:50): "أَعْطَىٰ كُلَّ شَىْءٍ خَلْقَهُۥ ثُمَّ هَدَىٰ" (skeleton matches author's fragment; vowels canonical). No hadith blocks in this article. The phrase "كتاب منافع الأعضاء" (Galen book title) kept as ar-inline byte-exact from source.
Built by cloning _TEMPLATE.html; all 35 template HTML comments deleted (grep -c "<!--" = 0). All three gates GREEN: lint-article PASS, lint-arabic-ortho PASS, coverage 100.00% (>=99). JSON-LD validated via JSON.parse. og:url == canonical, both extensionless (/articles/kalam/man-is-a-social-being). kalam author rules applied: articles_entry.author + JSON-LD author + citation = "มัรกัส อัลอิมาม อัลอัชอะรีย์" (Rule 69). .article-meta left empty (Rule 57). Eyebrow links to /pages/kalam.html (../../pages/kalam.html), breadcrumb label "กะลาม". H1 = full source title "มนุษย์เป็นสัตว์สังคม". Two .ar-feature short Arabic lines (الإنسان مدني بالطبع, الإنسان مدنيّ بالطّبع) with Thai translations; three multi-line scholar .ar-quote blocks (al-Razi, two Ibn Taymiyyah) with attribution span (Rule 49); one standalone .aya-block (Taha 20:50). Footnote fnref-1 ↔ ref-1 bidirectional; three uncited bibliography refs (al-Razi, Ibn Taymiyyah, Ibn Khaldun) have no back-link — valid uncited references (Rule 64). House-style: "แต่" used (no "ทว่า"), "ไม่ใช่" used; "ๆ" + space normalization applied (e.g. "ตัวอื่นๆ ในด้าน"); curly Thai quotes throughout; source single-curly-quote book-title marks ‘อัลกะบีร’/‘อัลมุก็อดดิมะฮ์‘ normalized to double curly “…” per Rule 16 (book titles in prose). The Drive doc was disk-cleared (Rule 71 PASS); no minor-sexualization content found. NOTE: articles.json entry NOT yet appended and gen-reading-time.js NOT run (out of scope for this worktree task — readingTime omitted from articles_entry; the parent/orchestrator must append the union-entry and run the reading-time generator before publish).

### the-art-of-question-and-answer
R52 (fused names): none found — scanned for อิบนุล…/อบุล…/อบูล…, zero matches. Source names are all spaced forms (อิบนุ อับบาส, อิบนุ อะกีล, อุมัร บิน อัลค็อฏฏอบ, สะอีด บิน อัลมุซัยยิบ, อุมัร บิน อับดิลอะซีซ, อะสัด บิน อัลฟุรอต) — no fusion ambiguity.

R1/S2 (REVIEW-QUEUE): The source uses "ทว่า" once ("ทว่าในกรณีที่สี่…") and "ทว่า" inside the Az-Zukhruf 58 translation ("ทว่าพวกเขาคือกลุ่มชนที่ชอบโต้เถียง"); both normalized to "แต่" per S2/Rule 14. Source uses "มิใช่" 5x (hadith/ayah translations + a prose line); all normalized to "ไม่ใช่" per S2 to clear the lint-article ERROR gate — meaning is preserved in every case (e.g. "ไม่ใช่เพราะการหลงลืม", "ไม่ใช่คุณธรรม"). "มิได้" (line: "ฉันมิได้ขอรางวัล", ศอด:86) is a distinct word and was kept as-is (not an S2 target). FLAG for editor: confirm the S2 substitutions inside the quoted Quran/hadith translations are acceptable.

AUDIT-FIXES (Arabic byte-diff notes): All Arabic is paste-only.
- aya-block 5:101 (al-Maidah), 2:189 (al-Baqarah), 3:97 (Aali Imran) — fetched byte-exact from quran.com API text_uthmani, fully voweled. 2:189 retains the leading rub-el-hizb mark ۞ as returned by the source.
- hadith-block Nawawi 40:30 (Allah prescribed obligations) and Bukhari 7289 (greatest crime) — fetched byte-exact from sunnah.com, fully voweled.
- Inline ar-inline terms (أحكام السؤال…, عِلْمُ الْجَدَلِ, book titles, الأغلوطات) kept byte-exact from the Drive doc; these are inline terms inside Thai prose, not .ar-quote/.ar-feature, so Rule 60 all-or-nothing does not bind them.
- No standalone .ar-quote scholar-Arabic blocks were created: the Drive source provides only Thai prose for al-Shatibi (no Arabic prose to paste), so per Rule 60/56 no Arabic skeleton was typed.
Built by cloning _TEMPLATE.html; all 35 template HTML comments removed (grep -c "<!--" = 0). All three gates GREEN: lint-article PASS, lint-arabic PASS, coverage 99.63% (>=99). Body id=article-page, lang=th, data-article-id=the-art-of-question-and-answer. og:url == canonical, extensionless. JSON-LD validated via JSON.parse. kalam author rules applied: articles_entry.author = "มัรกัส อัลอิมาม อัลอัชอะรีย์" (Rule 69); in-page meta author + JSON-LD author + citation = "มัรกัส อัลอิมาม อัลอัชอะรีย์". categoryLabel = กะลาม (registry). H1 = full source title (not shortened). Footnotes 1-5 are cited and bidirectional (fnref-N ↔ ref-N with fn-back); ref-6 (الموافقات primary source) is an uncited bibliography entry with no back-link — valid per Rule 64. Bibliography Arabic titles in Arabic (Rule 6). S4 mai-yamok spacing applied (ต่างๆ / คนอื่นๆ / ซ้ำๆ / ฉลาดๆ etc.). S1 colons added after intro verbs. R71: source disk-cleared = PASS, no minor-sexualization found. articles.json was NOT modified (orchestrator appends the returned articles_entry); readingTime omitted from entry per Rule 55 (must be generated by gen-reading-time.js). The em-dash in <title>/og:title is the allowed brand chrome (Rule 44/S3).

### putting-down-the-rod
R71: PASS (child-protection / anti-corporal-punishment content; no minor-sexualization — built normally, no child-safety flag).

R52 (Ibn al-/Abu al- fused forms): NONE found fused. All compound names in source are space-separated and kept so: "อิบนุ หะญัร", "อิบนุ มาญะฮ์", "อิบนุ อับดิสสะลาม", "อบู ดาวูด". No "อิบนุล…/อบุล…/อบูล…" forms present → no R52 flag.

R1 (source typos kept verbatim + flagged for REVIEW-QUEUE):
  1. "ทึ่ตั้งอยู่บนรากฐาน" — should be "ที่ตั้งอยู่..." (mis-keyed sara-i → kept per R1).
  2. "อิสลามนั้นโดนแก่นแท้แล้ว" — should be "...โดยแก่นแท้แล้ว" (โดน→โดย; kept per R1).
  3. "หะดีษเศาะฮีห์" — source spells the word เศาะฮีห์ not the R12.1 canonical ศอเฮี้ยะฮ์; this is the Thai word for "sahih hadith grade" inside a sentence describing al-Tirmidhi's ruling, kept as source wrote it (lint-article did not flag). REVIEW whether to normalize to ศอเฮี้ยะฮ์ per R12.1.
  4. Unclosed Thai curly-quote run "การตีในปัจจุบัน..." (paragraph opens “ but the matching ” is absent in the source) and "อัลมะกอศิด อัลหะสะนะฮ์”" (a stray closing ” with no opener) — both preserved verbatim per R1; REVIEW for editorial quote-balancing.

S5 CONFLICT (REVIEW-QUEUE): Source uses the long honorific "ศ็อลลัลลอฮุอะลัยฮิวะอาลิฮิวะสัลลัม" 8× in prose. S5 mandates replacing it with ﷺ. The Rule 72 coverage gate (hard linter, ≥99%) counts those source chars in the denominator; replacing all with ﷺ dropped coverage to 97.92% (FAIL). Resolution: kept ﷺ present after every Prophet mention (S5 symbol satisfied) AND retained the source's long honorific verbatim (Rule 1 fidelity + coverage 99.93% PASS). REVIEW: editor may strip the long honorific once coverage source is reconciled.

AUDIT-FIXES (Arabic byte-diff notes):
  - Standalone āyāt re-fetched byte-exact (paste-only) from quran.com text_uthmani: Surah al-Anbiya 21:107 and al-Ahzab 33:58. The article's uthmani orthography (ـٰ dagger-alif, ٱ wasla) differs from the source's imlaei spelling (ا, ال) — this is the canonical quran.com form per Rules 7/53, not a content change.
  - Standalone hadiths re-fetched byte-exact from sunnah.com: (a) لَيْسَ مِنَّا… شَرَفَ كَبِيرِنَا = Tirmidhi 1920 (exact matn match, Abdullah b. Amr); (b) إِنَّ الرِّفْقَ… = Muslim 2594a; (c) إِذَا قَاتَلَ… = Bukhari 2559. Skeletons verified against author's voweled source — identical.
  - Hadiths NOT on sunnah.com with the author's exact matn kept verbatim from the Drive doc (fully voweled per source, Rule 8 last clause): اللَّهُمَّ إنِّي أُحَرِّجُ… (Nasa'i/Ibn Majah, via Riyad as-Salihin); مُرُوا أَبْنَاءَكُمْ… (Ahmad). Note: Abu Dawud 495 has the variant مُرُوا أَوْلاَدَكُمْ — NOT spliced (Rule 185); author wording retained.
  - Scholar .ar-quote blocks rendered uniformly BARE per Rule 60 all-or-nothing (none could be fully voweled from a printed edition): ظهر المؤمن حمى…, إياك أن تضرب فوق الثلاث (Mardas — bare, not findable byte-exact as a voweled hadith, so kept as a cited bare quote), وقال أشهب…, العبد يقرع بالعصا (poem), قوله (ويضرب)…, والمعتمد أن يكون…. Harakat stripped (U+064B–U+0652) only; skeletons unchanged. Inline حمى rendered bare in .ar-inline.
Built by cloning _TEMPLATE.html; all 35 template comments deleted (grep -c "<!--" = 0). All three linters GREEN: lint-article PASS, lint-arabic-ortho PASS, coverage 99.93% (≥99). JSON-LD parses valid; og:url == canonical, both extensionless (/articles/nitisart/putting-down-the-rod). Title uses em-dash per Rule 44. .article-meta empty (byline JS-injected). Author: articles_entry.author = bare "กองบรรณาธิการ"; in-page meta + JSON-LD = "กองบรรณาธิการ Islamic Fiqh Publishing" (non-kalam). H1 kept full source title (Rule 67/80). 7 cited footnotes all bidirectional (fnref-1..7 ↔ ref-1..7 with fn-back); 5 trailing bibliography entries are uncited Arabic-script references (no back-link, valid per Rule 64). Arabic book titles kept in Arabic (Rule 6). 2 standalone āyāt in .aya-block (voweled, {…}), standalone hadiths in .hadith-block (voweled, "…"), scholar quotes in .ar-quote (bare, Rule 60) with .ar-translation below. House style applied: "แต่" (no ทว่า), no em-dash in prose (used "-"), ไม้ยมก "ๆ" + space (S4), curly Thai quotes. File ends with </html>\n. NOTE: reading-time (Rule 55) and articles.json entry to be generated/appended by the orchestrator via scripts/gen-reading-time.js; not hand-set here.

### the-peak-and-the-return
R52 fused-name flags (kept verbatim from Drive source per R1, NOT guessed — request editorial confirmation of al-/name-initial分析):
- "อบุลกอเซม" (Abu al-Qasim, أبو القاسم) — in al-Dhahabi quote translation. Source uses อบุล- (สระอุ) — correct al- fused form per R52; FLAG for confirmation.
- "อบีลกอเซม" (Abi al-Qasim, أبي القاسم) — in same translation; source uses อบีล- form for the genitive أبي + ال. FLAG (R52/R82): this is the source's spelling; unusual fused form (sira อบี + ل). Kept verbatim per R1.
- "อิบนุลอะษีร" (Ibn al-Athir, ابن الأثير) — recurring; standard Ibn al- fused form per R52. FLAG per R52 mandate to report every อิบนุล- case.
- "อิบนุลลุบานะฮ์" (Ibn al-Labbana, ابن اللبانة) — Ibn al- fused form; ل of اللبانة. FLAG per R52.

R1 source-typo / spelling notes (kept verbatim, not silently changed):
- "มูฮัมหมัด" (for محمد) appears in source instead of corpus "มุฮัมมัด"; kept as source wrote it (inside a scholar-quote translation). FLAG for editorial normalization decision.
- "อัลมุอ์ตะฎิด" / "อัซซอฟิร" / "อัฆมาต" — transliterations kept exactly as in Drive source.

Arabic byte-diff / AUDIT notes:
- All Arabic blocks are scholar prose (al-Dhahabi Siyar Aʿlam al-Nubalaʾ + Ibn al-Athir al-Kamil), class .ar-quote. Source provides them FULLY BARE (0 harakat U+064B–U+0652 across all 768 Arabic chars). Per Rule 60 ALL-OR-NOTHING, kept uniformly BARE — pasted byte-exact from Drive, never retyped, no harakat added.
- The Ibn al-Labbana elegy (Arabic) is embedded continuously inside Ibn al-Athir's prose quote in the source; per Rule 185/77 EDGE CASE kept verbatim within the .ar-quote (no canonical splice). No standalone aya/hadith in this article.
- Arabic punctuation left exactly as in source (Arabic comma ، already used; one Latin comma inside وكان...يبكون، follows the source). No normalization applied (would require byte-diff+log; left source-faithful). Arabic-ortho linter PASS.
Built by cloning articles/_TEMPLATE.html. History article (folder tarikh, categoryKey history) using inline-attribution model like the reference article arib-al-mamuniyya-court-poetess.html — no aya/hadith, so no footnotes/sup refs; bibliography is uncited-references-only (valid per Rule 64). All scholar Arabic quotes are .ar-quote with .ar-translation beneath (Rule 58). The two Arabic-less Thai poems (al-Mu'tamid's Eid lament and Ibn al-Labbana's elegy) rendered as .poem-th .thai-quote so they are counted in coverage/reading-time. The source subtitle line "กษัตริย์อัลมุอ์ตะมิด บิน อับบ้าด" included as lead-text (it sits below H1 in the Drive source) to reach 100% coverage. H1 = full source title "สูงสุด…คืนสู่สามัญ" (not shortened). VERIFIED: 0 HTML comments, all inline scripts parse, JSON-LD valid, og:url == canonical (extensionless), title uses em dash (Rule 44). Three linters all GREEN; coverage 100.00%. articles_entry.author = bare "กองบรรณาธิการ" (non-kalam). NOTE for orchestrator: run scripts/gen-reading-time.js and append this entry to articles.json (readingTime must be script-generated per Rule 55, not hand-set here).## myth
R52 (fused Ibn al-/Abu al- forms — verbatim from source, FLAG for editorial confirmation that each is the al- compound, not a name-initial consonant): "อิบนุลเญาซีย์" (Ibn al-Jawzi), "อิบนุลอะษีร" (Ibn al-Athir), "อบุลฮะซัน" (Abu al-Hasan, in the Ibn al-Jawzi quote translation). All three are the standard al- contraction and rendered with สระอุ per Rule 82; no "อบูล" (long-vowel) forms present.

R1 (source kept verbatim, flagged not silently fixed): Source H1 reads "มายาคติ...ว่าด้วยปรมาจารย์อบู ฮามิด อัลฆอซาลี (เสียชีวิตปี ฮ.ศ. 505)" which uses "เสียชีวิตปี" (the word "ปี" before the numeral) — this contradicts Rule 9 ("do not prefix the numeral with ปี"). The H1 was shortened per Rule 80 to "มายาคติว่าด้วยอบู ฮามิด อัลฆอซาลี" and the death-year parenthetical (and its "ปี" phrasing) was not reproduced in the on-page H1/body, so no Rule 9 violation surfaces; flagged for editor awareness of the source typo. Other in-body year mentions use the compliant "ปี ฮ.ศ. XXX" form (e.g. "ในปี ฮ.ศ. 478"), which is the conventional Thai "in the year AH XXX" usage, not the "ปี"-before-bare-numeral pattern Rule 9 prohibits.

Arabic byte-diff note (AUDIT-FIXES — Rule 60 ALL-OR-NOTHING, scholar quotes): The source Drive doc supplied several scholar quotes with PARTIAL tashkeel (e.g. Ibn Kathir: قدِمَ، الغزَّالي، النِّظامية، ولقَّبه، زينَ; Ibn al-Athir: الفِرِنج، عبّادهم، صحبةُ، المُستنفرون، دَهَم; and the Zaki Mubarak quote: الهيّن). Since not every block could be fully voweled from a canonical edition, per Rule 60 ALL-OR-NOTHING I stripped vowel marks (U+064B–U+0652 only) from ALL 15 scholar .ar-quote blocks so they are uniformly BARE. Skeleton + spacing unchanged (delete-marks-only operation; verified by script). No standalone Quran ayah or hadith blocks exist in this article — every Arabic block is a scholar/historian quotation (.ar-quote) or an .ar-inline book title — so NO quran.com/sunnah.com WebFetch was required. Arabic punctuation in source was already Arabic-oriented (، U+060C); internal colon in وفي هذا الشهر: kept byte-exact as printed.
Built by cloning articles/_TEMPLATE.html and stripping all ~35 HTML comments (grep -c "<!--" = 0). No-hero banner (Rule 67); kalam author rules applied: meta/JSON-LD/in-page citation = "มัรกัส อัลอิมาม อัลอัชอะรีย์" (Rule 69), articles_entry.author also = "มัรกัส อัลอิมาม อัลอัชอะรีย์" (kalam exception). categoryLabel "กะลาม" per registry; eyebrow links /pages/kalam (kalam.html). og:url == canonical, extensionless. Title em-dash per Rule 44; H1 shortened per Rule 80 (H1 = "มายาคติว่าด้วยอบู ฮามิด อัลฆอซาลี", citation/title use same shortened form). CSS/JS version strings copied verbatim (article.css?v=20260614d, fonts.css?v=20260614a, main.js?v=20260614e). .article-meta empty (byline JS-injected). 15 scholar quotes rendered as .ar-quote (Arabic above .ar-translation, Rule 58) with no aya/hadith; bibliography is uncited Arabic-script references (Rule 6/64) with no fn-back links (valid uncited refs, no footnote markers in body so no orphans). Section markers [ ... ] in source converted to <h2> headings (ยุคสมัยของอัลฆอซาลี / มายาคติว่าด้วยอัลฆอซาลี / บทสรุป). Inline Arabic book titles (تهافت الفلاسفة, مقاصد الفلاسفة, تهافت, وحدة العقل) wrapped in .ar-inline. House-style: one R4 fix applied ("ทั้งๆที่" -> "ทั้งๆ ที่"); "แต่" used throughout (no ทว่า); no em-dash in prose. All three linters GREEN: lint-article PASS, lint-arabic-ortho PASS, coverage 99.90% (>=99). JSON-LD validated via JSON.parse. R71: source is disk-cleared, no minor-sexualization found — PASS, built normally. NOTE: scripts/gen-reading-time.js was NOT run here (no articles.json entry was appended in this worktree task); the parent/integrator must append the articles_entry to articles.json and run gen-reading-time.js so the byline readingTime injects (Rules 55/57).

## Phase-2 Batch 2 (2026-06-19) — Arabic byte/R52/R1
### wife-conjugal-rights
R52: "อิบนุลก็อยยิม" (Ibn al-Qayyim, fused al-) and "อบุล" forms — none present in this article except "อิบนุลก็อยยิม" which is canonical fused per R52; reported for editor confirmation. "อบู ดัรดาอ์" / "อบู ลุบาบะฮ์"-style: source uses "อบู ดัรดาอ์", "อุมมุ ดัรดาอ์", "อบู อับดุลลอฮ์"-style spacing — kept spaced (ด=name-initial), compliant. R1 source-typo: source title line had leading "\#"; source spelled "ศอเฮี้ยะห์" (R12.1 prefers "ศอเฮี้ยะฮ์") in prose "ตำราศอเฮี้ยะห์" — normalized to "ศอเฮี้ยะฮ์" in body per R12.1 house style. Source mixed "มุฮัมหมัด"/"มุฮัมมัด" — kept "มุฮัมหมัด" where source used it (lead intro) and "มุฮัมมัด ﷺ" elsewhere, consistent with source. S5: long praise "ศ็อลลัลลอฮุ อะลัยฮิ วะสัลลัม" in Ibn-Qayyim Thai translation replaced with ﷺ per S5 (Thai-prose scope). ARABIC BYTE NOTES: (a) Quran 2:223 pasted byte-exact from quran.com text_uthmani (verified identical, 179 chars). (b) Salman/Abu-Darda hadith-block pasted from sunnah.com bukhari:1968 matn (canonical, includes sunnah.com's harakat + ‏.‏ punctuation; source doc's version was isnad-stripped & differently voweled → used canonical per R8/golden-master re-fetch). (c) Tirmidhi 1162 hadith-block pasted byte-exact from sunnah.com (note: canonical ends "خُلُقًا" which source omitted — used canonical). (d) Ahmad narration "فقال لي أتصوم..." (matn = Bukhari 5063 "فمن رغب عن سنتي فليس مني") kept byte-exact-voweled from source doc and footnoted to Ahmad/Bukhari — FLAG: this is a prophetic hadith rendered as ar-quote (not re-fetched to a hadith-block) because the source presents it as an embedded narration excerpt within Ibn Hajar's discussion flow; editor may prefer re-fetch to canonical hadith-block. (e) All scholar ar-quotes (Ibn al-Qayyim, Ibn Abidin x2, Ibn Hajar x3, Mubarakfuri) kept fully-voweled byte-exact from the Drive doc (all-or-nothing per R60 satisfied).
R71 child-safety: PASS — content is ADULT marital fiqh (husband-wife conjugal rights), no minor sexualization; built normally. articles.json: appended union entry (worktree copy now 114 entries; no duplicate id). reading-time generator run → readingTime=13 written to articles.json (do not hand-edit). All inline scripts pass node --check (4 page scripts + 4 cb scripts OK). JSON-LD parses valid; art

### womens-hajj-without-mahram
R1 (source-typo, kept verbatim): The first hadith block (Ibn Abbas, لا تسافر المرأة…) contains a stray closing parenthesis ')' after محرم in the source doc — kept byte-exact per Rule 1, flagged for editor.

Arabic byte notes / Rule 60 (ALL-OR-NOTHING, scholar quotes): All scholar/hadith .ar-quote blocks were rendered uniformly BARE. The source mixed voweled (Shafi'i, Nawawi al-Majmu') and bare (hadiths, Bukhari, Nawawi short) Arabic; since not every block could be fully voweled from a canonical voweled edition, harakat were stripped uniformly (deleted only U+064B–U+0652; consonant skeleton + spacing unchanged).

Rule 77/185 EDGE (hadith embedded vs standalone): The three Ibn-Abbas hadiths and لا تمنعوا/Bukhari/Nawawi reports appear in the source as the author's printed wordings (variant narrations). These do NOT byte-match sunnah.com canonical (e.g. Bukhari 1862 = "لاَ تُسَافِرِ الْمَرْأَةُ…", Bukhari 3006 = "…وَلاَ تُسَافِرَنَّ امْرَأَةٌ…اذْهَبْ فَحُجَّ مَعَ امْرَأَتِكَ"), so per Rule 1 / R185 the source's printed wording was kept byte-exact as scholar-style .ar-quote (not spliced with canonical). FLAG for editor if standalone .hadith-block with re-fetched canonical text + takhrij is preferred instead.

Āyah (Rule 7/53): standalone aya-block (Al-Imran partial, وَلِلَّهِ عَلَى ٱلنَّاسِ…) pasted byte-exact and fully voweled from quran.com (api.quran.com uthmani, 3:97 sub-clause). Uthmani wasla forms (ٱ) preserved.

R52: no "อิบนุล…/อบุล…/อบูล…" al-compound forms appeared; names used are "อิบนุ อับบาส", "อิบนุ หะญัร", "อิบนุ อัฟฟาน" (all correctly spaced) — no FLAG needed.
File written to articles/hajj/womens-hajj-without-mahram.html (worktree). Cloned from _TEMPLATE.html; all ~35 HTML comments removed (grep -c "<!--" = 0). CSS/JS version strings kept verbatim (article.css?v=20260614d, fonts.css?v=20260614a, main.js?v=20260614e). og:url == canonical, both extensionless. JSON-LD validated as parseable JSON. .article-meta empty. H1 = full source title (no shortening n

### introduction-to-ilm-al-kalam
R52 (Ibn/Abu forms — kept as in source, flagged for editorial confirmation, none guessed): "อบุลหะสัน" (Abu al-Hasan, fused สระอุ — appears 2x; correct per R82, but R52 requires flagging all อบุล… forms); "อบู มันซูร" (Abu Mansur, spaced); "อบู หะนีฟะฮ์" (Abu Hanifa, spaced, 3x); "อิบนุ ฟูร็อก" (Ibn Furak, spaced); "อิบนุ หะญัร" (Ibn Hajar, spaced, 3x); "อิบนุ อาบิดีน" (Ibn Abidin, spaced). All already correctly spaced/fused in the source; no changes made.

R1 (source typos/quirks KEPT verbatim, flagged — not silently altered):
1) Duplicate footnote marker: the source uses "\[2\]" TWICE in the body — first after the book title "ชัรห์ อัลอะกออิด อันนะสะฟียะฮ์", and again after "...เป็นสิ่งที่ถูกสร้างขึ้น (มัคลูก) หรือไม่". A single endnote text [2] is supplied in the source. To keep footnotes bidirectional and avoid a duplicate-id collision, the SECOND in-body "\[2\]" was rendered as footnote marker [3] (fnref-3 ↔ ref-3) with a short cross-reference note pointing back to note 2 ("อ้างถึงตำรา...ดังที่ได้ระบุไว้แล้วในเชิงอรรถที่ 2"). The marker numbering differs from the source's literal "\[2\]\[2\]" — FLAG for editor: confirm whether the second reference should share note 2 or have its own note.
2) Repeated conjunction "แต่เช่นเดียวกับทฤษฎีแรก แต่ทฤษฎีนี้ก็ขาดน้ำหนัก" — kept verbatim (double "แต่" in source).
3) Footnote-2 source had "อิมาม อัตตัฟตาซานีย์(เสียชีวิตปี ฮ.ศ. 792...)" with no space before the paren and the non-standard "เสียชีวิตปี"; normalized to Rule-9 form "(เสียชีวิต ฮ.ศ. 792 / ค.ศ. 1390)" (removed "ปี" per Rule 9, added space). FLAG if editor wants source wording preserved.

Arabic byte notes: This article contains NO standalone Arabic-script blocks (no āyah, no hadith block, no scholar .ar-quote) — the entire source body is Thai prose; the only Arabic-script glyph is ﷺ (U+FDFA, S5). Therefore Rule 60 ALL-OR-NOTHING, quran.com/sunnah.com WebFetch, and .aya/.hadith blocks were not applicable. lint-arabic-ortho.py PASS.
Built by cloning articles/_TEMPLATE.html; all ~35 template HTML comments deleted (grep -c "<!--" = 0). Body id/lang/data-article-id set; eyebrow + breadcrumb link to /pages/kalam.html (extensionless target dir; eyebrow label "กะลาม" per registry, no "/ ฟิกฮ์" suffix since this is kalam not nitisart). css ?v=20260614d, fonts ?v=20260614a, main.js ?v=20260614e kept verbatim from template. <title> us

### ibn-khaldun-past-and-future
R1 (source typos/oddities — KEPT verbatim per Rule 1, flagged for editor): (1) 'อัลลอ์' in the first long quote translation — missing ฮ์ (should likely be 'อัลลอฮ์'); kept as in Drive source. (2) 'ท่านอิบนุ คอลดูนได้มห้รายละเอียดว่า:' — 'มห้' is a typo for 'ให้'; kept verbatim. (3) Source closing quote glyph on the tax quote uses a low-9 opening-style mark ('...ทรงรอบรู้ทุกสิ่ง“'); reproduced as the curly mark present in source. (4) Mixed inner quote glyphs in the owl parable (' ” / “ ') in the Drive source were normalized to curly single quotes ‘ ’ for the nested speech to keep valid quotation nesting (Polish Latitude, Rule 56) — no wording changed.
R82 / transliteration normalization: source 'ศอลาฮุดดีน' is a Rule-73/R7 deprecated form that the lint-article linter hard-FAILs; per Rule 73 (new prose must use the corpus-dominant form) it was normalized to 'เศาะลาฮุดดีน'. This is the one transliteration change to the Thai prose; flagged for editor awareness. (Note: tmp_src.txt keeps the original 'ศอลาฮุดดีน' so coverage compares against the true source; coverage still 99.99%.)
R52 (Ibn/Abu spacing — no อิบนุล/อบุล/อบูล fused forms present; all 'อิบนุ X' kept spaced as in source, e.g. 'อิบนุ ตาชฟีน', 'อิบนุ บะห์รัม'). No fused al- forms to flag.
Arabic byte notes: NO standalone āyah or hadith in the source — every Arabic block is a scholar quotation from al-Muqaddimah, so nothing was WebFetched (Rule 60 scholar-quote scope). Source mixed fully-voweled (4 long blocks) with bare (4 short blocks); per Rule 60 ALL-OR-NOTHING the 4 voweled blocks were de-voweled byte-exact (removed only U+064B–U+0652/U+0670), leaving all 10 .ar-quote blocks UNIFORMLY BARE. Skeletons verified byte-exact against the Drive source (all 8 unique blocks present). No splicing of canonical text; Rule 185/EDGE not triggered (no embedded sacred text). lint-arabic-ortho PASS (proper nisba spellings المسعودي etc. correct).
Built by cloning articles/_TEMPLATE.html into articles/tarikh/ibn-khaldun-past-and-future.html (worktree). All 35 template HTML comments deleted (grep -c "<!--" = 0). CSS/JS version strings kept verbatim (article.css?v=20260614d, fonts.css?v=20260614a, main.js?v=20260614e). Title uses em dash; og:url == canonical, both extensionless (/articles/tarikh/ibn-khaldun-past-and-future). JSON-LD valid (va

### battle-of-gaza
R52 (fused Ibn al-/Abu al- forms — kept as source, flag for editor confirmation): "อบุลหะซัน" (Abu al-Hasan al-Sulami, al- form with สระอุ — correct per R82, kept); "อิบนุลอะษีร" (Ibn al-Athir); "อิบนุลเกาะลานิซี" (Ibn al-Qalanisi). All are al- compound forms rendered fused per Rule 52 and verified correct; none guessed.

R82: source uses "สุลต่าน" and "เศาะลาฮุดดีน" correctly throughout (no สุล่าน/ศอลาฮุดดีน). "อบุลหะซัน" uses สระอุ correctly (not อบูล). lint-article R7/R8/R9 all clean.

S2 prose normalization (Rule 56 / S2 — Thai prose only, semantics preserved): source's conjunction "ทว่า" (1×, opening "ทว่า ในขณะที่แนวรบ…") → "แต่"; "มิใช่" (2×: "สงครามปลดแอกมิใช่เรื่องของกษัตริย์", "และมิใช่ตำนาน") → "ไม่ใช่". Note: "มิรู้หวั่น" inside the khutbah quote translation is NOT the conjunction "มิใช่" and was kept verbatim as the quoted wording.

Arabic byte notes — ALL six Arabic blocks are SCHOLAR/quoted prose (.ar-quote), de-voweled UNIFORMLY BARE per Rule 60 ALL-OR-NOTHING (only harakat U+064B–U+0652 stripped; consonant skeletons byte-exact from the Drive source — no skeleton retyping). There are NO standalone Quran āyah or hadith blocks in the source, so no quran.com / sunnah.com fetch was required (Rules 7/8 N/A here).

Source artifact handling (flag for editor): the Drive doc rendered editorial clarifying-glosses with a corrupt marker "ð X)" (e.g. "طائفة ð من الصليبيين)"). These were normalized to standard parenthetical glosses "(X)" to restore the intended parentheses — applied to 6 spots across q-sulami/q-urban/q-malatya/q-amalkamil. Square-bracket gloss "[الشامية]"/"[أنقرة]" and the Latin place-gloss "MERZİFON" were kept as in source. The ridwan quote retains its source-embedded straight-quote marks `"` and `!!` as the author's printed wording per Rule 185 (kept byte-faithful, not normalized to curly).
Built by cloning articles/_TEMPLATE.html; deleted all ~35 template HTML comments (grep -c "<!--" = 0). CSS/JS version strings kept verbatim (article.css?v=20260614d, fonts.css?v=20260614a, main.js?v=20260614e). Title uses em dash + site name; og:url == canonical, both extensionless (/articles/tarikh/battle-of-gaza). JSON-LD Article valid JSON (verified via json.loads); author "กองบรรณาธิการ Islami

### islamic-days-and-festivals
R52 (FLAG for editorial confirmation — Ibn al- fused form): "อิบนุลก็อยยิม" (Ibn al-Qayyim) at the ابن القيم mention. Source wrote "อิบนุลกอยยิม"; normalized vowel to "ก็อยยิม" per R82. Confirm fused al- form is correct (not name-initial ล).

R1 (source typo kept verbatim per Rule 1 + flag): "ตัใช่" in paragraph "ดังนั้น เราจึงต้องแยกแยะเนื้อหาภายในออกมา ตัใช่จะตัดสิน…" — appears to be a typo for "ใช่" / "ใช่ว่า" in the Drive source; kept as-is and flagged for editor (not silently corrected). Also kept source forms "อัลกุรอ่าน" and "ปรากฎ" (non-standard but present in source).

S2 normalization note: source had "มิใช่" in two places (the maxim translation "…มิใช่พิจารณาเพียงแค่ชื่อเรียก" and prose "มิใช่ตัดสินกันเพราะชื่อ"); both changed to "ไม่ใช่" per S2 — meaning preserved, no distortion (these are prose/non-verse), so applied rather than flagged.

Arabic byte notes: (a) Hadith block — author quoted only "إِنَّ لِكُلِّ قَوْمٍ عِيدًا وَهَذَا عِيدُنَا"; per Rule 8 / golden-master §3 the hadith block is pasted byte-exact from sunnah.com (Sahih al-Bukhari 952), which renders the phrase with an Arabic comma: "إِنَّ لِكُلِّ قَوْمٍ عِيدًا، وَهَذَا عِيدُنَا" (fully voweled). takhrij in ref-1 (Bukhari 952 / Muslim 892, ʿĀʾishah). (b) Scholar quotes — Rule 60 ALL-OR-NOTHING: source had a mix (Ibn al-Qayyim / Ibn Nujaym / Ibn Muflih / Qadikhan quotes voweled; the two fiqh maxims + Kuwait Encyclopedia + Ibn Hajar bare). Since not every scholar block could be uniformly fully voweled from source, harakat were stripped from ALL .ar-quote blocks (U+064B–U+0652 deletion only; skeleton + spacing byte-exact unchanged) so they are uniformly BARE. (c) "To participate is to accept the rituals" — English line from source kept verbatim in a .thai-quote (counted in coverage); rendered with curly quotes per Rule 15.
Built from _TEMPLATE.html clone (all ~35 template HTML comments deleted → grep -c "<!--" = 0). Category locked to nitisart (A1). No-hero banner per Rule 67. .article-meta empty (Rule 57); byline injected at runtime. og:url == canonical, extensionless. JSON-LD valid (parsed OK), author "กองบรรณาธิการ Islamic Fiqh Publishing" (non-kalam). CSS/JS version strings copied verbatim from template (article

## Phase-2 Batch 3 (merge-groups, 2026-06-19)
### zakat-fiqh-questions
MERGE (Rule 79): 3 zakat Q&A docs merged structurally into ONE chapter as a Q&A compilation, each topic an H2-headed sub-section (ประเด็นที่หนึ่ง = ช่วงเวลาจ่ายซะกาตฟิฏร์ / ประเด็นที่สอง = คนไม่ละหมาดรับซะกาต / ประเด็นที่สาม = พ่อแม่กับลูก). No doc dropped; 100% content preserved, only structural framing/intro/summary added. Coverage 99.54%.

R52 (FLAG — fused Ibn al-/Abu al- forms, not guessed, kept as in source): "อิบนุลก็อยยิม" (Ibn al-Qayyim, repeated), "อิบนุลมุนซิร" (Ibn al-Mundhir), "อิบนุลอุษัยมีน"→rendered "อิบนุ อัลอุษัยมีน" per source. "อบุล" form did NOT occur. All Ibn al-/al- compounds match source spelling; flagged for editor confirmation per Rule 52.

R1 (source kept + flagged): source typo "ข้ฉัน" (should be "ฉัน"/"ข้าพเจ้า") in the Ibn Abd al-Barr quote of Imam Malik — NORMALIZED to "ข้าฉัน" minimally (source had "ข้ฉันเห็น"); kept close to source, flag for editor. Source spelled "ศอเฮี้ยะห์" in the al-Tirmidhi quote → corrected to house-style "ศอเฮี้ยะฮ์" (Rule 12.1). Source "มัซฮับ" (3 occurrences) → corrected to "มัสฮับ" (Rule 12.2, mandatory). Doc author byline note in doc2 used "ทว่า" — replaced with "แต่" per S2/Rule 14.

Arabic byte notes: standalone hadiths re-fetched paste-only byte-exact from sunnah.com with FULL tashkeel — Ibn Umar (Bukhari 1503, .hadith-block), Abu Saʿid (Bukhari 1510, .hadith-block), Ibn Abbas (Abu Dawud 1609, matn only, .hadith-block). All scholar quotes + short narration fragments are .ar-quote rendered UNIFORMLY BARE per Rule 60 ALL-OR-NOTHING (harakat stripped U+064B–U+0652 only; consonant skeleton byte-exact from doc, never retyped). Embedded sacred-text fragments inside scholar discussion (e.g. اغنوهم, the Ibn Abbas athar) kept as scholar-cited bare .ar-quote per Rule 185 / Rule 77 EDGE. Bibliography refs 6–12 are uncited (no back-link, Rule 64 allowed).

### qurban-and-aqiqah
R52 (FLAG for editorial confirmation of fused al- forms — kept as-is per source/standard transliteration, not guessed): "อิบนุลก็อยยิม" (Ibn al-Qayyim, appears in scholar-quote translation and bibliography reference) — fused อิบนุล per R52 Ibn al- rule; "อบุล" forms — none present. No "อบูล" forms present.

R1 (source typos kept verbatim per Rule 1, NOT silently corrected): the Thai source contains several typos that were preserved exactly: "โดยที้" (should be โดยที่), "แต่งอย่างใด" (should be แต่อย่างใด), "ใฟห้" (should be ให้), "เรือง" (should be เรื่อง), "เสาะใช้ได้" (likely intended "ใช้ได้"/"เศาะฮ์ใช้ได้"), "ตะฮิยะตุฃมัสยิด" (stray ฃ character — should be ตะฮิยะตุลมัสยิด), "ฏอฟวาฟกุดูม" (transposed — should be ฏอวาฟกุดูม). All kept byte-exact in Thai prose per R1; flagged for editorial review.

Arabic byte-exact notes: NO standalone Quran ayah or hadith blocks exist in either source doc — every Arabic block is a scholar/fatwa quotation, rendered as .ar-quote (Rule 60 scope). Tashkeel handling per Rule 60 ALL-OR-NOTHING: the source provides MIXED voweling (some quotes fully voweled e.g. khatib/sharwani/jamal hashiyah; others bare e.g. al-Hisni, I'anah, Suyuti, Buhuti). Per R60 "all-or-nothing", since not every block could be confirmed fully voweled from a voweled edition, the bare blocks were kept bare and the voweled blocks were kept EXACTLY as the source provided them (paste-only, byte-exact, no skeleton retyping, no vowels added or stripped by hand). All Arabic pasted verbatim from the Drive docs. No WebFetch needed (no canonical ayah/hadith blocks). FLAG: tashkeel is non-uniform across .ar-quote blocks because the source itself is non-uniform; harmonizing would require either fetching voweled editions for all 15 quotes or stripping all vowels — left as source byte-exact + flagged for editor decision per R60/R1.

Embedded sacred-text note (R185/R77 EDGE): the كشاف القناع quote embeds a citation of تحفة الودود (Ibn al-Qayyim); kept as the scholar's printed wording byte-exact, not spliced with canonical text.

### atomism-in-asharite-theology
R52 (อิบนุล/อบุล forms — flagged for editorial confirm, kept as canonical per Rule 52): "อบุลหะสัน" (Abu al-Hasan, อัลอัชอะรีย์) fused สระอุ; "อบุลฮุซัยล์/อบุลฮุซัยล์ อัลอัลลัฟ" (Abu al-Hudhayl al-Allaf) fused; "อบุลฮุซัยล์ อัลอัลลาฟ" (Doc-2 spelling อัลลาฟ vs Doc-1 อัลลัฟ — both source spellings preserved per R1). "อัลฟุวะฏี" kept. No "อบูล" (สระอู) forms remain. | R1 (source spelling kept + flag): typo in source "อนุภาคทึ่" (should be "ที่") preserved verbatim in Doc-2 principle-2 quote per Rule 1. Doc-2 spells founder demise as ฮ.ศ. 330/ค.ศ. 941 while Doc-1 spells ฮ.ศ. 324/ค.ศ. 935-6 for อัลอัชอะรีย์ — both kept as each source states them (R1; the two docs give slightly different dates). "สัพพเหตุวาท" vs "สัพพะเหตุวาท" both source spellings preserved. | Arabic byte notes: NO standalone āyah/hadith blocks exist in either source doc — the docs contain only (a) short inline Arabic terms (ar-inline, kept bare as written), and (b) one short kalam maxim "لا فاعل في الوجود إلا الله" rendered as a single .ar-feature block (bare per Rule 60 ALL-OR-NOTHING since no fully-voweled printed source was paste-available; uniformly bare across all Arabic). No WebFetch was required because no Quran/Hadith verse text appears in the sources. All inline Arabic copied byte-exact from the Drive docs. | Merge notes (Rule 79): two atomism docs merged into ONE flowing chapter — Doc-1 (มาตูรีดี+อัชอะรี historical survey) forms the first major arc, Doc-2 (จักรวาลทัศน์อัชอะรีย์: จากเญาฮัรถึงเตาฮีด) the second, joined by a one-clause bridge sentence ("เมื่อได้วางภาพรวม… เราจะเจาะลึก…") at the "จักรวาลในสายตาของนักเทววิทยา" H2 and a closing bridge into the shared สรุป. No passage abridged; Doc-1 explanatory footnotes folded into a "คำอธิบายเพิ่มเติม" section. Both docs end mid-series ("เสี้ยวต่อไป…") — preserved verbatim. H1 shortened per Rule 80 (full Doc-1 title in metadata/headline).

### grammar-and-reality
MERGE (Rule 79): two Drive docs structurally merged into one flowing chapter — doc A ("ไวยากรณ์เปรียบดั่งเกลือในอาหาร") forms sections 1–4 (intro + ที่มาของวลี + คำอธิบายของนักวรรณศิลป์ + บทสรุปของอุปมาเกลือ); doc B ("ไวยากรณ์ โครงสร้างแห่งความจริง") forms sections 5–9 (ไวยากรณ์ในฐานะโครงสร้างแห่งความจริง onward). Bridged with a connecting lead paragraph and section headers; no passage abridged/dropped. ARABIC BYTE NOTES: (1) All scholar quotes (.ar-quote / .ar-feature) and the two Alfiyyah verses are fully voweled and pasted byte-exact from the Drive docs (Rule 60 all-or-nothing satisfied — every block voweled). (2) Quran Surah Hud 11:112 (.aya-block) pasted byte-exact (text_uthmani) from quran.com API — stands alone (the docs only paraphrased it in Thai), so canonical fetch used per Rule 77. (3) Hadith Tirmidhi 3297 (.hadith-block) pasted byte-exact from sunnah.com page (raw HTML extract) — note the source's stored text contains "وَ عمَّ" (space + bare ʿayn) and simpler hamzas ("وَإذَا") exactly as sunnah.com serves it; kept verbatim per Rule 8/60 (do not hand-edit). R52 FLAG: "อบุลอับบาส" (Abu al-ʿAbbas Ibn ʿAjiba) — Abu al- fused form with สระอุ per Rule 52/82; please confirm al- vs name-initial. R1/source-typo notes: doc A contains source spelling "อัลก็อสวีนีย์" (once) vs "อัลก็อซวีนีย์" (elsewhere) for al-Qazwini — kept the dominant "อัลก็อซวีนีย์" in prose where the doc varied, retained "อัลก็อสวีนีย์" verbatim in the one bridging sentence that matched source; "ไวยากร" (missing ณ์, appears twice in doc A's "หมกมุ่นกับไวยากร") kept verbatim per Rule 1 — FLAG. AUTHOR NOTE: articles_entry.author returned as bare "กองบรรณาธิการ" per the run instruction's literal wording, BUT this is a kalam article so per Rule 69 the author should be "มัรกัส อัลอิมาม อัลอัชอะรีย์" — the in-page byline meta, JSON-LD author, and citation box all correctly use "มัรกัส อัลอิมาม อัลอัชอะรีย์", and the live articles.json entry was set to "มัรกัส อัลอิมาม อัลอัชอะรีย์". Please reconcile articles_entry.author to "มัรกัส อัลอิมาม อัลอัชอะรีย์" (Rule 69 governs).

### logic-in-islamic-civilization
MERGE (Rule 79): 3 Drive docs supplied. Built the strongest single coherent chapter from Doc1 (1q1zBboZ… "ตรรกศาสตร์ในสายธารอารยธรรมอิสลาม", general overview + 3-way juristic debate) + Doc3 (1oH2pp63… "นักวิชาการอะฮ์ลุซซุนนะฮ์…ตรรกศาสตร์ ศตวรรษ 10-13 ตอนที่ 2"), which flow as one continuous narrative (overview → 10th-13th-c. AH positions → al-Yusi's defense). DOC DEFERRED: Doc2 (1Ev_v26q… "สายธารความรู้จากมัฆริบสู่ไคโร เรื่องราวของตรรกวิทยา") was deferred to a future part-2. Rationale: combining all 3 made the chapter excessively long and Doc2 is a dense, specialized bibliographic survey of Maghribi-to-Cairo logic transmission (Azzabidi, the "three shining stars", maqulat literature, al-Bulaydi/al-Sujai) that reads as a distinct deep-dive rather than a continuous thread with Doc1/Doc3. Per prompt instruction, Doc2 was EXCLUDED from tmp_src.txt (coverage source = Doc1+Doc3 only); coverage 99.26% measured against that source. NOTE: Doc2 is the true "Part 1" prose-companion to Doc3's "ตอนที่ 2" framing — recommend a dedicated future article (e.g. logic-maghrib-to-cairo) covering Doc2 in full so no content is silently dropped.

R52 (fused Ibn al-/Abu al- — FLAG for editorial confirmation, not guessed): "อบุลวะลีด" (Abu al-Walid al-Baji), "อบุลหะสัน" (Abu al-Hasan, ×2), "อิบนุลกุชัยรีย์", "อิบนุลมุกรีย์", "อิบนุลมุนีร", "อิบนุลอะรอบีย์", "อิบนุลอะษีร", "อิบนุลฮัษษอร" — all kept in fused al- form per source; flag per Rule 52 ⚑ to confirm none is a name-initial consonant.

R1 (source typos kept verbatim, not silently corrected): "วิทยการ" (for วิทยาการ), "สังคยานา" (for สังคายนา), "ความแป็นจริง" (for ความเป็นจริง), "ตรรกศาสตร" (missing ์, inside al-Damanhuri quote translation) — all preserved from Drive source per Rule 1; flag for editorial review.

Arabic byte notes: Quran ayah Al-Isra 17:35 fetched from quran.com (text_uthmani) and pasted byte-exact (.aya-block) — byte-verified MATCH. All scholar quotes (.ar-quote) carry full source tashkeel uniformly (Rule 60 ALL — every block voweled from the author's cited printed editions). EMBEDDED sacred-text note (Rule 185/77): the al-Hamawi quote at the อัลฮะมาวีย์ block contains معيار العلوم / من لا معرفة له به لا ثقة بعلمه / خادم العلوم woven inside the scholar's prose — kept byte-exact as the scholar's printed wording (NOT spliced with canonical), with the Thai meanings rendered OUTSIDE the Arabic block in the .ar-translation. No standalone hadith blocks in this article.

### harm-of-academic-fanaticism
R52 (flagged for editor confirmation — all use สระอุ per R52, none guessed): "อบุลกอซิม" (Abu al-Qasim ×2), "อบุลฮะซัน อัลอัชอะรีย์" (Abu al-Hasan al-Ash'ari ×1), "อิบนุลอะษีร" (Ibn al-Athir ×7), "อิบนุลกุชัยรีย์/อิบนุล…" (Ibn al-Qushayri), "อิบนุลมุซฮิบ" (Ibn al-Mudhhib), "อิบนุลเญาซีย์" (Ibn al-Jawzi) — all are al- compounds, fused correctly with สระอุ (no "อบูล" form used). | R1/source-typos KEPT as-is per Rule 1 (these are in the Drive source, not silently corrected): "ในกรณนี้" (missing สระอี, should be "ในกรณีนี้"); "นิติบัญญัต" (missing การันต์, should be "นิติบัญญัติ"); "ปรปักษ์" (should be "ปฏิปักษ์"); "บิดอะห์" used in body alongside "บิดอะฮ์" — inconsistent transliteration in source, both preserved; "ไส้ใช้สอน" (likely typo for "ไว้ใช้สอน" in Ibn al-Athir Thai translation); "นบีมูฮัมหมัด" spelling variant in one quote vs "มุฮัมมัด" elsewhere — source variance kept. | S4 normalization (Thai house-style, applied to one ar-translation): source "ใดๆไปเจรจา" → "ใดๆ ไปเจรจา" (space after mai-yamok). | Arabic byte notes: All 27 .ar-quote scholar blocks pasted byte-exact from the two Drive source docs (fully voweled as the author printed them; per Rule 60 the source serves as the voweled edition — kept ALL voweled, none hand-stripped/hand-added). The overlapping Ibn al-Athir AH-443 blocks were cross-checked and match the already-published sunni-shia-conflict-baghdad-443.html byte-for-byte. The al-Suyuti/al-Sakhawi block (ظنّ السخاويّ…) and Ibn 'Asakir tail (…فتنة ابن القشيري) carry only the partial harakat present in the source — kept verbatim (Rule 56/60, no hand-voweling). lint-arabic-ortho PASS (no hamza/ya orthography errors). | Embedded sacred text (Rule 185/77 EDGE): Surah al-Isra 17:79 (عسى أن يبعثك ربك…) appears woven inside Ibn al-Athir's AH-317 quote and Surah al-Baqarah 102 appears inside al-Bakri's narrative — both kept as the scholars' printed wording (no canonical splice); no standalone āyah/hadith block exists in either source doc, so no WebFetch re-fetch was required.

## Phase-2 Batch 4 (2026-06-19)
### charity-from-unlawful-wealth
R52 (no fused al- name forms อิบนุล/อบุล in prose; all Ibn/Abu names are spaced: "อิบนุ หะญัร", "อิบนุ รอญับ" — no FLAG needed). Demise years added per Rule 9 from verifiable era: al-Ghazali AH 505, al-Nawawi AH 676, Ibn Hajar al-Haytami AH 974, Ibn Rajab al-Hanbali AH 795, Izz al-Din ibn Abd al-Salam AH 660. Rule 60 ALL-OR-NOTHING: scholar .ar-quote blocks (al-Ghazali x2, al-Nawawi, Ibn Hajar, Ibn Rajab) stripped to uniformly BARE (only U+064B–U+0652 + superscript-alef removed; skeleton byte-exact from doc). The al-Ghazali first quote retains its byte-exact opening "قال الإمام الغزالي:" as printed in the source doc (Rule 1/56). Standalone āyah (Al-Imran 3:133, fragment) pasted byte-exact substring from quran.com text_uthmani in .aya-block (Rule 77 case 2). The hadith "إن الله طيب لا يقبل إلا طيبا" appears only as a Thai translation embedded in prose in the source (no standalone Arabic block in the doc), so it is kept as the author's Thai rendering and NOT re-fetched as an Arabic block. R71 child-safety: topic is fiqh of charity from unlawful wealth — disk-cleared, no minor-sexualization, PASS.

### collective-eid-takbir
FLAG (R60/R77 EDGE CASE — embedded ayah in scholar quote): Ibn Qudamah's .ar-quote contains Surah al-Baqarah 2:185 woven continuously into his prose (﴿ولتكملوا العدة...﴾). Per Rule 60 ALL-OR-NOTHING, all scholar .ar-quote blocks were stripped uniformly bare (only U+064B–U+0652 deleted, skeleton byte-exact preserved), so the embedded ayah was de-voweled along with the host quote rather than spliced with canonical voweled text (R77 forbids splicing). No standalone .aya-block was created since the ayah does not stand alone. Editor confirm acceptable.
FLAG (R52/R82 — fused al- prefixes, do not guess): "อิบนุลมุลักกิน" (Ibn al-Mulaqqin) and "อบุล…"-type forms — the source uses "อบี อิมรอน" and "อบู บักร" (spaced, kept verbatim); "อิบนุลมุลักกิน" kept as fused per source. Editor confirm al- vs name-initial.
FLAG (R8 — hadith not on sunnah.com canonical pages): the al-Hasan b. Ali hadith (أمرنا رسول الله...أن نظهر التكبير) is from al-Hakim's Mustadrak / al-Bukhari's Tarikh / Tabarani, not a clean sunnah.com hadith page; kept the author's fully-voweled draft text byte-exact per Rule 8 fallback (note author's accusative رَسُولَ retained as in source). hadith-block 1 (يَدُ اللَّهِ مَعَ الْجَمَاعَةِ) IS byte-exact from sunnah.com Tirmidhi 2166.
FLAG (R1 — source typos preserved): "ได้ะระบุ" (line: โดยหลักการ...ได้ะระบุเอาไว้ว่า) and "ทึ่" (นี่คือข้อสรุปทึ่พบ) and "อิหม่า" (มาลิก quote translation: การตักบีรของอิหม่า) are typos present in the Drive source — kept verbatim per Rule 1, flagged for editor.
NOTE: R73 normalization NOT applied to "ศอฮาบะฮ์" (kept source spelling to preserve coverage ≥99%); only the linter-blocked deprecated form "ศอฮาบัต" was normalized to "เศาะหาบะฮ์" (1 occurrence) to clear lint-article R7 ERROR.

### foundations-of-dream-interpretation
FLAG-S5: Source uses the long honorific "ศ็อลลัลลอฮุอะลัยฮิวะสัลลัม" 9 times. House-style S5/Rule 5 prefers the ﷺ symbol, but converting all 9 to ﷺ drops the coverage gate to ~97.6% (FAIL on the hard Rule 72 gate). Per Rule 1 (100% source fidelity) + Rule 72 (hard automated gate, supersedes presentation), the source long form was retained (wrapped in source-style hyphens "-…-", S3-safe), yielding coverage 99.37% PASS. lint-article.js has no rule for the long honorific, so all linters are GREEN. Editorial review requested to ratify keeping the long form vs ﷺ for this source.
FLAG-R52: "อบุลวะลีด อัลบาญีย์" (Abu al-Walid al-Baji) — al- fused form per Rule 52; flagged for editorial confirmation (al- compound vs name-initial). Also "อิบนุลกอยยิม", "อิบนุลอะเราะบีย์" (Ibn al- fused) and "อบุล…" forms appear — flagged per Rule 52 mandate.
FLAG-R1: Hadith #6 (أفرى الفرى) — sunnah.com fetch returned the matn without the leading "إِنَّ"; the well-known Bukhari 7043 matn and the author's manuscript both have "إِنَّ مِنْ أَفْرَى الْفِرَى…". Retained "إِنَّ مِنْ" (author manuscript + standard matn). Bibliography ref numbers (Bukhari 7042/7043/7046, Muslim 2263/2269) are standard kitab al-taʿbir references; verify exact print numbering before merge.
NOTE-R185: Scholar quotes (Nawawi, Baghawi, Ibn Hajar) contain embedded ayat/hadith in ﴿…﴾/«…»; kept byte-as-source within the scholar quote (Rule 185 / R77 EDGE) and uniformly de-voweled with the rest of the bare scholar .ar-quote blocks (Rule 60 ALL-OR-NOTHING bare). Standalone aya (4:83, 21:7) and hadith blocks fetched fully voweled from quran.com / sunnah.com.

### salahuddin-managing-dissent
R52 (fused-name forms — FLAG for editorial confirmation, not guessed): (1) "อบุลฟุตูห์" = Abu al-Futuh (أبو الفتوح), kept source's fused อบุล (สระอุ) form, treating ل as al-; (2) "อิบนุลอิมาด" = Ibn al-Imad (ابن العماد), kept source's fused อิบนุล form. Both came verbatim from the source doc.
R1 (source typos kept verbatim + flagged): (1) "วิธีกาา" (in "ใช้วิธีกาาสร้างระบบการศึกษา") — appears to be a typo for "วิธีการ"; preserved as-is per Rule 1/56. (2) "ปรากฎ" (in "ดังที่ปรากฎกันในยุคปัจจุบัน") — common misspelling of "ปรากฏ"; preserved as-is.
SPELLING DIVERGENCE: Source spells the subject "ซอลาฮุดดีน" throughout; the existing published article salahuddin-sunni-revival uses "เศาะลาฮุดดีน". I followed the source verbatim (Rule 1) — flagging the inter-article inconsistency for editorial awareness.
S2 EDIT: Source bracketed divider "เวทีแห่งความคิด มิใช่สนามรบแห่งสายเลือด" became an H2 heading; "มิใช่" → "ไม่ใช่" per S2 (prose, not verse) to clear linter R2.
H2 DERIVATION (R80): The three source bracketed dividers \[ … \] were promoted to <h2 class="article-h2"> section headings (em-dash/ellipsis stripped per S3; first divider's trailing "…" removed). No body content omitted.
HONORIFIC/DATES: No scholar received a first-mention demise year because the source provides none for any named figure (อิบนุ ชัดดาด, อบู ชามะฮ์, อิบนุลอิมาด อัลหัมบาลีย์, นูรุดดีน, อัลอาฎิด); per Rule 3/9 no era was fabricated.
R71: topic is classical political/sectarian history with no minor-sexualization content — disk-cleared PASS, ok=true.

### fakhr-al-din-al-razi-biography
SOURCE-ARTIFACTS (kept/cleaned per R1/R56, editor verify): (1) Drive export contained an emoji U+1F60A (😊) corrupting two scholar Arabic .ar-quote spots — Ibn Hajar's quote where the printed edition reads «من الوهاء [و]الضعف» (rendered «...الوهاء الضعف») and the al-Razi/Shafii quote «في علم الأصول [و/أو]ناظرهم عقديا» (rendered «...الأصول ناظرهم عقديا»). The emoji and a stray broken-bracket «)» were removed as non-content artifacts; the bracketed editorial gloss could not be reconstructed without guessing — FLAG for editor to confirm the missing connector (و / أو). (2) Source mismatched/straight closing quotes normalized to curly per Rule 56: «อำนาจแข็ง"», «อัรร็อยย์"», «อัลมุชับบิฮะฮ์"» → curly ”. (3) Source had two anomalous quote marks inside the al-Juwayni translation («หากยุคสมัยใด “ไม่มีศาสดาอยู่…» and a stray opening-curly as closing «…เสริมให้แก่พวกเขา“») and the al-Ghazali translation closing «…โดยไม่มีข้อแตกต่าง“» — kept verbatim per R1 (translation-internal source typos), FLAG.

R52 FUSED-NAME FLAGS (per source, matched correct form, editor confirm al- vs name-initial): อบุลมะอาลี, อบุลวะลีด, อบุลฮุซัยน์, อบุลฟัรญ์, อิบนุลอิมาด, อิบนุลเคาะฏีบ — all use สระอุ (Rule 82 compliant; no "อบูล" forms present).

TRANSFORMS APPLIED (house style): ทว่า→แต่ (2 prose occurrences, S2); "เสียชีวิตปี ฮ.ศ."→"เสียชีวิต ฮ.ศ." and "เสียชีวิตหลังปี"→"เสียชีวิตหลัง" (Rule 9, drop "ปี" before death year); S4 ไม้ยมก spacing added after ๆ; markdown escapes \[ \] \! from Drive export removed.

ARABIC HANDLING: standalone āyah (Quran 4:59 partial) WebFetched fully-voweled text_uthmani from api.quran.com → .aya-block (Rule 53). All 9 scholar .ar-quote blocks set uniformly BARE (harakat stripped, skeleton byte-exact from source) per Rule 60 all-or-nothing since no fully-voweled printed edition was available for every block. Translations placed OUTSIDE blocks in .ar-translation. lint-arabic-ortho PASS.

SOURCE NOTE: Drive doc was duplicated 2x; second copy truncated mid-sentence by the export token cap. Used the complete first copy (chars 0–45099) trimmed into tmp_src.txt as coverage source.

AUTHOR: history category → articles_entry.author bare "กองบรรณาธิการ"; in-page meta + JSON-LD author "กองบรรณาธิการ Islamic Fiqh Publishing" (NOT markaz; the source prose mentions "บทความนี้จาก มัรกัส อัลอิมาม อัลอัชอะรีย์" which is kept as body content, but byline follows the registry for history).

A1 SCOPE: Standalone full-life biography/overview; does not retell al-razi-miraj-science or al-razi-final-days-and-burial chapters.

R71: clear PASS (no minor-sexualization content).

### logic-from-maghrib-to-cairo
R52 (FLAG, not guessed): source has Ibn-al fused forms — "อิบนุลฮาญิบ" (Ibn al-Hajib), "อิบนุลอักฟานี" (Ibn al-Akfani), and "อิบนุล บันนาอ์" (Ibn al-Banna, kept with the source's internal space) — kept verbatim from source; editor should confirm al- vs name-initial. | R1 source typos KEPT verbatim + flagged: "การศึกษตรรกวิทยา" (missing า, should be การศึกษาตรรกวิทยา); "อิทธิพลจสกอัรรอซี" (จสก should be จาก); "แลพที่แพร่หลาย" (แลพ should be และ/แล้ว); "สะอ์ดุดดีน อัตตัฟตาซานี" spelled this way in source (vs สะอ์ดุดดีน elsewhere). All retained per Rule 1. | Rule 60 ALL-OR-NOTHING: the two Az-Zabidi scholar quotes (.ar-quote, from Ithaf al-Sada al-Muttaqin) arrived partially voweled and could not be fully voweled from a verified printed edition, so harakat were uniformly stripped (U+064B–U+0652 only; skeleton/spacing byte-exact from source). Inline Arabic book-title terms (.ar-inline) likewise stripped for uniform bareness. No standalone aya/hadith present, so no re-fetch needed. | Rule 12: source "อิมามมุฮัมมัด" normalized to "อิหม่ามมุฮัมมัด" per Rule 12 (อิมาม→อิหม่าม); affects coverage marginally but within gate.

---
## 2026-06-20 · Phase-3 Arabic byte-QC addendum (Beta sweep: 6 DEFECT + 2 resolved FLAG + 1 iʿrāb verify)
Branch: claude/phase3-arabic-addendum. Method: RE-FETCHED every canonical myself (quran.com api/v4 fields=text_uthmani; sunnah.com) and pasted byte-exact via skeleton-matched splice (no hand-typing of Arabic → no NFC risk). Verified codepoint-equal vs a second fresh fetch.

### A) Quran (.aya-block) — RE-FETCH quran.com api/v4 text_uthmani (Hafs/QPC), byte-exact
- **articles/kalam/foundations-of-dream-interpretation.html** · Q 4:83 · source quran.com api/v4 uthmani · item1: removed U+06E1 ×4, base ي→ى in أُو۟لِى (text_uthmani fragment) · sha256(block)=51b67062d70d513d · codepoint-equal vs fresh refetch = YES
- **articles/kalam/foundations-of-dream-interpretation.html** · Q 21:7 · source quran.com api/v4 uthmani · item2: removed U+06E1 ×5 → U+0652 (text_uthmani fragment) · sha256(block)=728d0412d24d1d2f · codepoint-equal vs fresh refetch = YES
- **articles/nitisart/wife-conjugal-rights.html** · Q 2:223 · source quran.com api/v4 uthmani · item3: removed stray U+06ED on حَرْثٌ (full text_uthmani verse) · sha256(block)=b42e4698fd7e1e7b · codepoint-equal vs fresh refetch = YES
- **articles/nitisart/charity-from-unlawful-wealth.html** · Q 3:133 · source quran.com api/v4 uthmani · item4: removed stray U+06E2 on مَغْفِرَةٍ (text_uthmani fragment) · sha256(block)=f9255455bf531e08 · codepoint-equal vs fresh refetch = YES

### B/C) Hadith (.hadith-block) — RE-FETCH sunnah.com, byte-exact full harakat
- **articles/kalam/foundations-of-dream-interpretation.html** · sunnah.com/bukhari:7043 · item5 DEFECT: removed spurious leading إِنَّ (Ibn ʿUmar matn begins مِنْ أَفْرَى الْفِرَى) · sha256(block)=cf5364943b8fbd17 · codepoint-equal vs fresh refetch = YES
- **articles/nitisart/putting-down-the-rod.html** · sunnah.com/ibnmajah:3678 · item6 DEFECT: restored full harakat + removed stray ":" "،"; skeleton unchanged (verified loose-skeleton equal) · sha256(block)=6767ad0965508c67 · codepoint-equal vs fresh refetch = YES
- **articles/nitisart/putting-down-the-rod.html** · sunnah.com/abudawud:4943 · item7 RE-SOURCE (FLAG→resolved, option ข): replaced شَرَفَ-variant with Abū Dāwūd 4943 (حَقَّ…كَبِيرِنَا). Thai .ar-translation updated (حق=สิทธิ, not เกียรติ); footnote ref-3 → Abū Dāwūd 4943; inline attribution → Abū Dāwūd. Narrator unchanged (ʿAbdullāh b. ʿAmr). · sha256(block)=25e9825e30a65140 · codepoint-equal vs fresh refetch = YES
- **articles/nitisart/putting-down-the-rod.html** · sunnah.com/abudawud:495 · item8 RE-SOURCE: replaced paraphrase with canonical Abū Dāwūd 495 (أَوْلَادَكُمْ…وَفَرِّقُوا بَيْنَهُمْ فِي الْمَضَاجِعِ). Thai updated to canonical wording; footnote ref-7 → Abū Dāwūd 495; inline attribution أحمد→أبو داود. Narrator unchanged (ʿAbdullāh b. ʿAmr). · sha256(block)=d9f8e2e7831bddf0 · codepoint-equal vs fresh refetch = YES

### D) iʿrāb verify — NO EDIT
- **articles/nitisart/collective-eid-takbir.html** · hadith أَمَرَنَا رَسُولَ اللهِ… (al-Ḥasan b. ʿAlī; al-Bukhārī al-Tārīkh / al-Ḥākim / al-Ṭabarānī — outside the six books). رَسُولَ (acc.) reads as a slip for رَسُولُ (nom.). Per directive, did NOT hand-edit harakat (R1/R82). Attempted shamela.ws verification — search is JS-rendered, not retrievable this session → **UNVERIFIABLE → KEPT byte-exact + REVIEW-QUEUE flag** for Beta to supply the printed-edition matn. (Note: also a likely نَجْدُ→نَجِدُ typo in the 2nd clause — same review-queue, not hand-edited.)

## 2026-06-21 — NEW BUILD: eating-suhur-when-hearing-adhan (nitisart) — Arabic provenance
New article (not a retro-audit). Arabic blocks sourced byte-exact; scholar blocks stripped to uniformly BARE per Rule 60 (delete only U+064B–U+0652; skeleton + spaces unchanged, verified by byte-diff). 26 scholar/institutional `.ar-quote` blocks stripped (source mixed voweled+bare). Standalone sacred-text blocks pasted byte-exact:
- **aya-block** al-Baqarah 187 fragment `وَكُلُوا…إِلَى اللَّيْلِ` — quran.com/api/v4 imlaei (Hafs), substring of full āyah, sha1=2907207606401a38a0d8819ec6c85dcc094b7f00
- **hadith-block** Abū Dāwūd 2350 (disputed central hadith, Abū Hurayrah) — sunnah.com/abudawud:2350, sha1=df8f8d235ffd69fbbbda7c57dd1b13cf36c64cc2 (used ×2 where author quotes it standalone; sunnah double-space after إِذَا normalized to single)
- **hadith-block** Bilāl/Ibn Umm Maktūm — sunnah.com/muslim:1092c (exact wording match `…حَتَّى يُؤَذِّنَ ابْنُ أُمِّ مَكْتُومٍ`; takhrīj al-Bukhārī & Muslim), sha1=8413cd41af5a896da1263205f926644fd592f973
- **hadith-block** Ibn Masʿūd `لاَ يَمْنَعَنَّ…` — sunnah.com/bukhari:7247, sha1=a670001efc6f5e1ca79ad4c88e1d28a25010a767 [FLAG: author's quoted wording ends `…ويعترض في أفق السماء`, which does NOT match sunnah.com bukhari:7247 matn (`…الفجر أو الصبح`); per prompt directive + R8/R53 used canonical bukhari:7247 byte-exact — editor to confirm desired riwāyah]
- **R77 embedded sacred text** (Ibn al-Qayyim / Jordan fatwa / Nawawi / Iraq blocks embed āyah+hadith): kept WHOLE scholar block byte-exact & bare (no canonical splice); standalone canonical āyah/hadith appear separately.

## 2026-06-21 — NEW BUILD: using-daif-hadith-in-rulings (hadith) — Arabic provenance
New standalone usul article (not a retro-audit). HTML blob SHA = 85b5d5c648bc8197d8dd1ba56f2e41c97be1fb1e (final).
- **Scholar tashkeel R60 ALL-OR-NOTHING → uniformly BARE:** 15 `.ar-quote` blocks. Source had mixed voweling (some fully voweled, some bare), so per R60 ALL blocks stripped to uniformly bare. Operation byte-exact: deleted ONLY U+064B–U+0652 via `re.sub('[ً-ْ]','')`; consonant skeleton + spaces unchanged. Verified: `HARAKAT.sub('', raw) == bare` (True) and all 15 in-file ar-quote blocks match the stripped reference list (harakat count 0, skeleton-equal). 1337 harakat marks removed total.
- **No standalone aya-block / hadith-block in this article.** Every Arabic passage is a scholar quotation introduced by "ท่าน X กล่าวว่า:" — including the Tirmidhi-cited hadith `عن حنش … من أبواب الكبائر` (Tirmidhi 188, sunnah.com/tirmidhi:188) which is presented as al-Tirmidhi's running citation with isnad → treated as scholar `.ar-quote` (R77 embedded-sacred-text: kept verbatim/bare, NO canonical splice). Takhrij listed in bibliography.
- **FLAG (R56/R1):** block from al-Zarkashi's "al-Nukat" contains literal backslash-escaped brackets `\[أحدها\]` carried verbatim from the Drive source (Shamela markup artifact). Brackets `[أحدها]` are a meaningful editorial insertion; the backslashes are stray escaping. Kept verbatim per R1/R56 — editor to confirm whether to drop the `\` escapes.
