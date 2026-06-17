# Golden Master — เกณฑ์ "ความเป็นดาราศาสตร์"

> บทความอ้างอิง (golden master): `articles/nitisart/moon-sighting-vs-astronomy.html` (main @ 4b208b2)
> โครงเปล่า: `articles/_TEMPLATE.html`
> เอกสารนี้ = เช็คลิสต์ที่ **บทความใหม่ทุกบท** ต้องผ่านก่อน merge เข้า main
> ขอบเขต: บังคับใช้กับบทใหม่ตั้งแต่ ดาราศาสตร์ เป็นต้นไป (บทเก่าไม่ย้อนทำ)

ทุกข้อต้องผ่าน (PASS) ครบก่อน publish — ถ้าข้อใด FAIL ให้แก้บน feature branch + Cloudflare preview แล้ว verify ก่อน ห้าม push ตรง main

---

## 1. โครงไฟล์ & meta
- [ ] สร้างไฟล์โดย **ก๊อป `_TEMPLATE.html`** ไม่ใช่เขียนใหม่จากศูนย์ หรือก๊อปบทอื่นที่อาจ drift
- [ ] **รวมต้นฉบับหลายส่วน (Rule 79):** ถ้าต้นฉบับมา 2–3 ส่วนที่เชื่อมโยงกันเชิงตรรกะ → **รวมเป็นบทความเดียว**, เนื้อหาคง **100%** (Rule 1/56), รวมเชิง**โครงสร้างเท่านั้น** ห้ามย่อ/สรุป/ตัด passage; ถ้าเชื่อมไม่สนิท → คงแยกไว้ หรือ **FLAG**
- [ ] `<head>` ครบและเรียงลำดับเหมือน template: theme-bootstrap script, description/keywords/author, OG (title/description/image/type=article/url), twitter:card, theme-color `#e3edf7`, viewport, fonts, favicons
- [ ] โหลด `article.css?v=…` และ `main.js?v=…` ด้วย **เวอร์ชันสตริงล่าสุด** ตรงกับ golden master (ยึดเวอร์ชันจาก `articles/_TEMPLATE.html` ปัจจุบันเป็นความจริง — เอกสารนี้ไม่ระบุเลขตายตัว ห้ามอ้างเลขในเอกสารนี้แทนไฟล์จริง) — ถ้า bump เวอร์ชันต้อง bump พร้อมกันทั้งเว็บ
- [ ] `<body id="article-page" … data-article-id="SLUG">` — `SLUG` = ชื่อ slug จริงของบทความ และต้องมี entry ใน `articles.json`
- [ ] **`articles.json`: เพิ่มเป็น union-entry** (append) — **ห้าม `id` ซ้ำ**, JSON parse ผ่าน, แก้ merge-conflict โดยคงทุก entry เดิม (Rule 55/57); diff ต้องแตะเฉพาะ entry ใหม่ ไม่กระทบ `readingTime` บทอื่น
- [ ] meta-og:url **และ `<link rel="canonical">`** ต้องมีทั้งคู่และ**ตรงกันเป๊ะ** **★extensionless★** ชี้ `…/articles/<category>/<slug>` (**★ไม่มี `.html`★** — Cloudflare Pages serve แบบ extensionless; ลิงก์ที่มี `.html` จะถูก **308 redirect**) และต้องตรงกับ URL ใน `sitemap.xml` (N-A)
- [ ] **JSON-LD Article** (`<script type="application/ld+json">` ใน `<head>`): กรอก `ARTICLE_TITLE`, **`ARTICLE_DATE` (ISO `YYYY-MM-DD` จาก `articles.json` — ต้องใส่ทั้ง `datePublished` และ `dateModified`)**, `CATEGORY`/`SLUG` — **★ห้ามปล่อย token ค้าง (ARTICLE_DATE ฯลฯ)★**
- [ ] JSON-LD ครบฟิลด์: `headline`, `author`, `image`, `publisher` (+ `logo`), `mainEntityOfPage` (extensionless, ตรง canonical) · **★ parse เป็น JSON valid ★** (เช่น `node -e "JSON.parse(require('fs')...)"`)
- [ ] **บท kalam: JSON-LD `author.name` = "มัรกัส อัลอิมาม อัลอัชอะรีย์"** (Rule 69) — หมวดอื่นคง `"กองบรรณาธิการ Islamic Fiqh Publishing"`
- [ ] asset paths ใช้ `../../` (root-clamp) ไม่ใช้ absolute domain

## 2. Hero / feature image
- [ ] hero block โครงเหมือน golden master: รูป feature, แคปชันเครดิตภาพ ("ภาพ: …"), ลิงก์หมวด ("นิติศาสตร์ / ฟิกฮ์" → `/pages/<category>.html`)
- [ ] `<h1>` = ชื่อบทความล้วน (ไม่มีชื่อเว็บ) — ชื่อเว็บอยู่ใน <title> และ OG เท่านั้น ตามโครง golden master จริง สอดคล้อง Rule 44
- [ ] **ชื่อเรื่อง/H1 ย่อได้ (Rule 80):** อาจกระชับ/ย่อจากชื่อต้นฉบับที่ยาวได้ถ้าความหมายคงอยู่ — **แต่ H1 ห้ามตัดทิ้งเด็ดขาด (Rule 67)**; ชื่อต้นฉบับเต็มเก็บไว้ใน metadata/citation ได้
- [ ] รูป hero อยู่บน CDN `images.islamicfiqhpublishing.com/articles/<slug>.…` ไม่ฝัง base64/ไม่ลิงก์นอก
- [ ] มีเครดิตภาพจริง (ผู้ถ่าย/แหล่ง) — ห้ามปล่อย placeholder

## 3. Arabic — byte-exact (วิกฤต)
- [ ] Arabic ทุกตัว **คัดลอกจาก primary source แบบ byte-exact ห้ามพิมพ์ใหม่/พิมพ์ทับ** (Rule 60)
- [ ] consonant skeleton ตรงต้นฉบับเป๊ะ; harakat ใส่เฉพาะที่ canonical — บล็อกคำพูดปราชญ์ปล่อย bare สม่ำเสมอ
- [ ] อายะฮ์อัลกุรอาน + หะดีษเท่านั้นที่มี tashkeel เต็ม (ตามต้นฉบับ); ไม่ไปเติม/ลดเอง
- [ ] Arabic เรนเดอร์ RTL ฟอนต์ Amiri, flush-right, หลายบรรทัดได้ตาม Rule 62
- [ ] ห้ามมีเลขอ้างอิงหรือคอมเมนต์แทรกกลางบล็อก Arabic เว้นแต่อยู่ในต้นฉบับจริง
- [ ] **เครื่องหมายวรรคตอนอาหรับ (Rule 77):** ใช้แบบอาหรับ — จุลภาค `،` (U+060C) ไม่ใช่ `,` ลาติน · ปรัศนี `؟` (U+061F) · อัฒภาค `؛` (U+061B) · ลบจุด `.` ลาตินที่หลงเหลือ. **จัดการตามชนิดบล็อก:** `.aya-block`/`.hadith-block` ผิด → **RE-FETCH จาก quran.com / sunnah.com (ห้ามแก้มือ, paste-only, byte-exact)** เพราะแหล่งถูกอยู่แล้ว เครื่องหมายผิด = copy พลาด · `.ar-quote`/`.ar-feature` → normalize ได้ **แต่ต้องมี byte-diff + log `AUDIT-FIXES.md`** · `.ar-translation` (ไทย) = ไม่เกี่ยว · **★ห้าม blind whole-file replace★** (มาส head/style/script/comment เหมือน linter) · **EDGE:** อายะฮ์แทรกในคำพูดปราชญ์ = ช่วงนั้นเป็นอายะฮ์ → re-fetch ช่วงนั้น, แยกไม่ออก → **FLAG** · สอดคล้อง **Arabic-Authority scope กรณี (3)** ใน CLAUDE.md

## 4. ร้อยแก้วไทย & การจัดย่อหน้า
- [ ] เนื้อหาไทยตรงกับ Google Doc ต้นฉบับ **ทุกบรรทัด** (เทียบ A1 ↔ Doc ก่อน publish)
- [ ] **Coverage gate (Rule 72): char-diff coverage ≥ 99%** เทียบต้นฉบับ Drive — **harakat-normalized** (ลบ U+064B–U+0652 สองฝั่ง) + normalize ช่องว่าง; วัดด้วยสคริปต์ (`scripts/coverage.py`) ห้ามด้วยตา · **ส่วนที่ตัดตาม Rule 71 (child-safety) ไม่นับ denominator** · รายงาน % ใน PR
- [ ] **ความถูกต้องของคำแปล (Rule 75 — แยกขอบเขตจาก coverage 72):** คำแปลไทยของตัวบทอาหรับทุกชนิด (`.ar-translation`, คำแปลอายะฮ์/หะดีษ, คำแปลคำพูดปราชญ์) ต้องถูกต้อง **เชิงความหมาย (semantic)** เทียบตัวบทอาหรับต้นทาง ไม่ใช่แค่ครบ/มี · แปลผิด / ความหมายตกหล่น = **FLAG** · ใช้คำแปลไทยเชิงวิชาการที่ยอมรับ; ไม่แน่ใจ → **FLAG ขอเจ้าของ**
- [ ] จัดย่อหน้าตาม "หน่วยความคิด" ของ Doc ไม่ใช่ตามบรรทัดว่างทางกายภาพ:
      Doc ต้นฉบับมักคั่นบรรทัดว่างแทบทุกประโยค ห้าม map 1:1 จนได้ย่อหน้าประโยคเดียว
      เรียงเป็นท่อนสั้นๆ — ประโยคที่อยู่ใน argument/ประเด็นเดียวกันต่อเนื่องกัน
      ให้รวมเป็น `<p>` เดียวที่อ่านลื่น (อำนาจตาม Rule 56 Polish Latitude)
      ขอบเขตที่ยังบังคับเข้ม: (1) ห้ามยุบรวมข้ามประเด็น/ข้ามหัวข้อ
      (2) ห้ามแตกรายการในประโยคเดียวเป็นย่อหน้าลอย (บทเรียนจาก EDIT 4)
      (3) สาระครบทุกถ้อยคำตามกฎข้อ 1 — เปลี่ยนเฉพาะการจัดกลุ่มย่อหน้า
      ห้ามสลับลำดับ/ตัด/เรียบเรียงถ้อยคำใหม่
      จุดที่ต้องขึ้นย่อหน้าใหม่เสมอ: เปลี่ยนประเด็น, เข้า/ออกบล็อกอาหรับ-คำแปล,
      ก่อน H2, เปลี่ยนผู้พูด/แหล่งอ้างอิง
- [ ] ใช้ "แต่" เท่านั้น (ห้าม "ทว่า") และ "ไม่ใช่" (ห้าม "มิใช่") — **S2** (ลบล้าง Rule 14)
- [ ] ไม่มี artifact หลงเหลือ: `**bold**`, code fence, TODO, เลขอ้างอิงค้าง, ช่องว่างเกินก่อน `</p>`
- [ ] **House style ร้อยแก้วไทย (S1–S10 — ไทยเท่านั้น ห้ามแตะอาหรับ):**
      (S1) "…กล่าวว่า" ที่นำเข้า quote ตามด้วย ":" เสมอ ·
      (S3) ไม่มี em-dash "—" ในร้อยแก้ว ใช้ "-" (ยกเว้น `<title>` Rule 44; em-dash ในชื่อ H1 → FLAG) ·
      (S4) ไม้ยมก "ๆ" ติดคำหน้า เว้นวรรคหลัง เช่น "ต่างๆ นานา" ·
      (S5) นามท่านนบีมี ﷺ เสมอ ไม่มีคำสรรเสริญแบบยาว ("ศ็อลลัลลอฮุ…") ·
      (S9 — placeholder, linter งานแยก) ไม่มีอักขระพิเศษ `#` `|` `@` ในร้อยแก้ว (Rule 76) ·
      (S10 — placeholder, linter งานแยก) เครื่องหมายวรรคตอน**ในบล็อกอาหรับ**เป็นแบบอาหรับ `،` `؟` `؛` ไม่ใช่ลาติน (Rule 77 — ดู §3)

## 5. บล็อกประเภทต่าง ๆ — ใช้เมื่อไหร่
- [ ] `aya-block` = อายะฮ์อัลกุรอาน (1 ครั้ง/บทโดยทั่วไป), `hadith-block` = หะดีษ — bg แบน ตาม Rule 53/61
- [ ] `ar-quote` = คำพูดปราชญ์แบบ blockquote ตามด้วย `<p class="ar-translation">` คำแปลไทย (Arabic-above-Thai model)
- [ ] `ar-feature` = บล็อก Arabic เด่น/ยกพิเศษ (ใช้สงวน ตรงตาม golden master = 2 จุด)
- [ ] ทุก ar-quote มีคำแปลไทยกำกับเสมอ ไม่ปล่อย Arabic ลอยไร้แปล
- [ ] tag counts สมดุล ไม่มี wrapper เปิดค้าง/ซ้ำ
- [ ] ระยะห่าง Arabic↔Thai แคบและสม่ำเสมอตาม Rule 68 (margin บน=ล่างเท่ากัน, line-height ไม่กว้างเกิน) — กำหนดใน article.css ที่เดียว
- [ ] Arabic block gap equal above & below (~8px); Thai translation/verse non-italic. (**S6/S8**)
- [ ] **S6** — คำแปลไทยของบล็อกอาหรับไม่เอียง; บรรทัดเดียว = กึ่งกลาง, หลายบรรทัด = ชิดซ้าย (ผ่าน `.is-1line`/`ifpAlign`, ห้าม inline `style=`)
- [ ] **S7** — อ้างอิงอายะฮ์ไม่แขวน inline ท้ายคำแปล: ใช้ footnote → บรรณานุกรม (golden master) หรือ `.block-source`; คำแปลเหลือเนื้อแปลล้วน

## 6. Footnote & บรรณานุกรม
- [ ] footnote ลิงก์สองทาง: `#ref-N` ↔ `#fnref-N` ครบทุกคู่ ไม่มี orphan
- [ ] บรรณานุกรมเป็น Arabic, เรียงเลข, มี back-link ↑ กลับไปจุดอ้างใน body
- [ ] กล่อง "อ้างอิงบทความนี้" (citation) มี APA ไทย + ปุ่มคัดลอก ตามรูปแบบ golden master
- [ ] **exemplar มาตรฐานอยู่ใน `articles/_TEMPLATE.html`** (footnote `<sup class="fn-ref">` → `<section class="bibliography-section"><ol class="bibliography">`); ใช้เมื่อบทมีอายะฮ์/หะดีษหรืออ้างแหล่งที่ต้องเชิงอรรถ — บทประวัติศาสตร์ที่ใช้ inline attribution ล้วน (ไม่มีอายะฮ์/หะดีษ) ไม่ต้องมี footnote/bibliography
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
- [ ] **คุณภาพการจัดรูปแบบหน้า (Rule 81):** heading hierarchy ชัดเจน, บล็อกอาหรับ/ไทยตาม **S6/S8**, ไม่มี layout พัง (overflow/ทับซ้อน), hero/no-hero ตาม Rule 67

## 10. Merge gate
- [ ] ทุกข้อ 1–9 PASS แล้วเท่านั้น
- [ ] **★ Child-safety (Rule 71): ถ้ามี child-safety flag ห้าม merge เด็ดขาด ★** — route ให้ One ตัดสิน เอเยนต์ห้าม self-merge
- [ ] **Beta byte-QC** ผ่าน: Arabic skeleton byte-exact (byte-diff + blob SHA), coverage ≥ 99% (Rule 72) — ก่อนถึงขั้น owner-merge
- [ ] A1 fetch per-deployment URL (ไม่ใช่ branch alias ที่อาจ cache เก่า / ไม่ใช่ production ที่ WAF 403) verify เนื้อหา + เวลาอ่าน
- [ ] ผู้ใช้ eyeball control bar บนมือถือ (โหมดกลางวัน + สลับสองโหมด)
- [ ] merge ผ่าน GitHub API/PR (push ตรง main ถูกบล็อก 503)
- [ ] **★ หลัง merge: re-deploy (trigger Cloudflare Pages build ใหม่) ★** — จำเป็นเสมอสำหรับบทใหม่ เพราะ:
      · `functions/api/collect.js` ฝัง id-set จาก `articles.json` ตอน **build/deploy** — ถ้าไม่ re-deploy analytics จะ **ไม่นับ view บทใหม่**
      · `scripts/gen-sitemap.js` regenerate `sitemap.xml` (commit ใน PR) แล้ว deploy ใหม่ให้ sitemap สด → **บทใหม่เข้า Google**
      · `index.html` `<noscript>` link list อัปเดตให้รวมบทใหม่
- [ ] หลัง merge: Custom Purge production URL (อย่า Purge Everything)
- [ ] ลบ feature branch หลัง merge
