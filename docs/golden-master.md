# Golden Master — เกณฑ์ "ความเป็นดาราศาสตร์"

> บทความอ้างอิง (golden master): `articles/nitisart/moon-sighting-vs-astronomy.html` (main @ 559d4c7)
> โครงเปล่า: `articles/_TEMPLATE.html`
> เอกสารนี้ = เช็คลิสต์ที่ **บทความใหม่ทุกบท** ต้องผ่านก่อน merge เข้า main
> ขอบเขต: บังคับใช้กับบทใหม่ตั้งแต่ ดาราศาสตร์ เป็นต้นไป (บทเก่าไม่ย้อนทำ)

ทุกข้อต้องผ่าน (PASS) ครบก่อน publish — ถ้าข้อใด FAIL ให้แก้บน feature branch + Cloudflare preview แล้ว verify ก่อน ห้าม push ตรง main

---

## 1. โครงไฟล์ & meta
- [ ] สร้างไฟล์โดย **ก๊อป `_TEMPLATE.html`** ไม่ใช่เขียนใหม่จากศูนย์ หรือก๊อปบทอื่นที่อาจ drift
- [ ] `<head>` ครบและเรียงลำดับเหมือน template: theme-bootstrap script, description/keywords/author, OG (title/description/image/type=article/url), twitter:card, theme-color `#e3edf7`, viewport, fonts, favicons
- [ ] โหลด `article.css?v=…` และ `main.js?v=…` ด้วย **เวอร์ชันสตริงล่าสุด** ตรงกับ golden master (ปัจจุบัน `v=20260603a`) — ถ้า bump เวอร์ชันต้อง bump พร้อมกันทั้งเว็บ
- [ ] `<body id="article-page" … data-article-id="SLUG">` — `SLUG` = ชื่อ slug จริงของบทความ และต้องมี entry ใน `articles.json`
- [ ] meta-og:url + canonical ชี้ path จริง `…/articles/<category>/<slug>.html`
- [ ] asset paths ใช้ `../../` (root-clamp) ไม่ใช้ absolute domain

## 2. Hero / feature image
- [ ] hero block โครงเหมือน golden master: รูป feature, แคปชันเครดิตภาพ ("ภาพ: …"), ลิงก์หมวด ("นิติศาสตร์ / ฟิกฮ์" → `/pages/<category>.html`)
- [ ] `<h1>` = ชื่อบทความล้วน (ไม่มีชื่อเว็บ) — ชื่อเว็บอยู่ใน <title> และ OG เท่านั้น ตามโครง golden master จริง สอดคล้อง Rule 44
- [ ] รูป hero อยู่บน CDN `images.islamicfiqhpublishing.com/articles/<slug>.…` ไม่ฝัง base64/ไม่ลิงก์นอก
- [ ] มีเครดิตภาพจริง (ผู้ถ่าย/แหล่ง) — ห้ามปล่อย placeholder

## 3. Arabic — byte-exact (วิกฤต)
- [ ] Arabic ทุกตัว **คัดลอกจาก primary source แบบ byte-exact ห้ามพิมพ์ใหม่/พิมพ์ทับ** (Rule 60)
- [ ] consonant skeleton ตรงต้นฉบับเป๊ะ; harakat ใส่เฉพาะที่ canonical — บล็อกคำพูดปราชญ์ปล่อย bare สม่ำเสมอ
- [ ] อายะฮ์อัลกุรอาน + หะดีษเท่านั้นที่มี tashkeel เต็ม (ตามต้นฉบับ); ไม่ไปเติม/ลดเอง
- [ ] Arabic เรนเดอร์ RTL ฟอนต์ Amiri, flush-right, หลายบรรทัดได้ตาม Rule 62
- [ ] ห้ามมีเลขอ้างอิงหรือคอมเมนต์แทรกกลางบล็อก Arabic เว้นแต่อยู่ในต้นฉบับจริง

## 4. ร้อยแก้วไทย & การจัดย่อหน้า
- [ ] เนื้อหาไทยตรงกับ Google Doc ต้นฉบับ **ทุกบรรทัด** (เทียบ A1 ↔ Doc ก่อน publish)
- [ ] จัดย่อหน้าตาม Doc เป๊ะ: บรรทัดว่างใน Doc = `<p>` ใหม่ / ข้อความติดกัน-คั่นจุลภาค = `<p>` เดียว — **ห้ามแตกรายการในประโยคเดียวเป็นย่อหน้าลอย** (บทเรียนจาก EDIT 4)
- [ ] ใช้ ทว่า แทน แต่ ตามบริบทยกระดับภาษา (Rule 14) ที่เหมาะสม ไม่หว่าน
- [ ] ไม่มี artifact หลงเหลือ: `**bold**`, code fence, TODO, เลขอ้างอิงค้าง, ช่องว่างเกินก่อน `</p>`

## 5. บล็อกประเภทต่าง ๆ — ใช้เมื่อไหร่
- [ ] `aya-block` = อายะฮ์อัลกุรอาน (1 ครั้ง/บทโดยทั่วไป), `hadith-block` = หะดีษ — bg แบน ตาม Rule 53/61
- [ ] `ar-quote` = คำพูดปราชญ์แบบ blockquote ตามด้วย `<p class="ar-translation">` คำแปลไทย (Arabic-above-Thai model)
- [ ] `ar-feature` = บล็อก Arabic เด่น/ยกพิเศษ (ใช้สงวน ตรงตาม golden master = 2 จุด)
- [ ] ทุก ar-quote มีคำแปลไทยกำกับเสมอ ไม่ปล่อย Arabic ลอยไร้แปล
- [ ] tag counts สมดุล ไม่มี wrapper เปิดค้าง/ซ้ำ
- [ ] ระยะห่าง Arabic↔Thai แคบและสม่ำเสมอตาม Rule 68 (margin บน=ล่างเท่ากัน, line-height ไม่กว้างเกิน) — กำหนดใน article.css ที่เดียว

## 6. Footnote & บรรณานุกรม
- [ ] footnote ลิงก์สองทาง: `#ref-N` ↔ `#fnref-N` ครบทุกคู่ ไม่มี orphan
- [ ] บรรณานุกรมเป็น Arabic, เรียงเลข, มี back-link ↑ กลับไปจุดอ้างใน body
- [ ] กล่อง "อ้างอิงบทความนี้" (citation) มี APA ไทย + ปุ่มคัดลอก ตามรูปแบบ golden master
- [ ] **ห้ามกุ quote ปราชญ์** — อ้างเฉพาะ primary source ที่ verify แล้ว; จะค้านต้นฉบับได้ต่อเมื่อมี counter-source จริง

## 7. เวลาอ่าน (Rule 55/57)
- [ ] **ห้ามใส่ inline JS คำนวณเวลาอ่าน** — รัน `scripts/gen-reading-time.js` (900 cpm) → เขียนค่าใน `articles.json`
- [ ] `.article-meta` ว่างใน source; byline inject โดย `main.js` ตอน runtime
- [ ] รัน generator แล้ว verify ตัวเลขนาทีใน `articles.json` ตรงกับเนื้อหาจริง

## 8. Control bar & alignment
- [ ] cb- control bar ครบ: กลางคืน/กลางวัน, ขนาด A−/Normal/A+, อาหรับ ع toggle — beam แดง `#e8403d`
- [ ] โหมดกลางวัน: พื้นสว่าง/ตัวอักษรเข้ม, beam แดงคงอยู่, ไม่มีขาวบนขาว, ไม่มี night-flash ตอนโหลด
- [ ] `prefers-reduced-motion` หยุด beam
- [ ] `ifpAlign` ทำงาน: บรรทัดเดียว center, หลายบรรทัด flush ตาม Rule 62
- [ ] reveal script + chrome (header/footer placeholder, progress bar, back-to-top) ครบ

## 9. QC เรนเดอร์ (agent)
- [ ] `node --check` ผ่านทุก inline `<script>`
- [ ] Desktop (~1280px): title/byline, control bar, Arabic RTL, footnote, bibliography, ไม่มี overflow, ไม่มี console error (ยกเว้น cert ของ sandbox)
- [ ] Mobile (~380px): control bar wrap/stick, โหมดกลางวันพลิกถูก, Arabic ไม่ overflow แนวนอน, font toggle ทำงาน, tap target โอเค
- [ ] HTML valid: ไม่มี tag เปิดค้าง, encoding ถูก, ปิดด้วย `</html>\n`

## 10. Merge gate
- [ ] ทุกข้อ 1–9 PASS แล้วเท่านั้น
- [ ] A1 fetch per-deployment URL (ไม่ใช่ branch alias ที่อาจ cache เก่า / ไม่ใช่ production ที่ WAF 403) verify เนื้อหา + เวลาอ่าน
- [ ] ผู้ใช้ eyeball control bar บนมือถือ (โหมดกลางวัน + สลับสองโหมด)
- [ ] merge ผ่าน GitHub API/PR (push ตรง main ถูกบล็อก 503)
- [ ] หลัง merge: Custom Purge production URL (อย่า Purge Everything)
- [ ] ลบ feature branch หลัง merge
