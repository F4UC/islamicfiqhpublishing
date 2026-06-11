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
- **FLAG-2 — เลข `19` ปนในตัวอาหรับ (scholar quote):** บล็อก `.ar-quote` ของอัชชาฏิบีย์ (เดิมประมาณบรรทัด 517 `…البطلةُ19والمباحيةُ…`) มีเลข `19` ฝังกลางตัวอาหรับ ดูเป็น artifact เลขเชิงอรรถที่หลุดมา — **อยู่นอกขอบเขตอำนาจอาหรับ 2 กรณี (เป็น scholar quote ไม่ใช่อายะฮ์/หะดีษ การลบเลขถือเป็นแก้ skeleton)** จึง **คงไว้ + FLAG** ขอบรรณาธิการตัดสิน
