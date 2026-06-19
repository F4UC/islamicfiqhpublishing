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
