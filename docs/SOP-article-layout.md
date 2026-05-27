# SOP — มาตรฐานการขึ้นบทความใหม่
## islamicfiqhpublishing.com

เอกสารนี้คือมาตรฐานกลางสำหรับแปลงบทความ (จากไฟล์ .docx) ให้เป็นหน้า HTML บนเว็บ
แนบเอกสารนี้ไปพร้อมไฟล์ .docx ทุกครั้งที่สั่งเอเยนต์ขึ้นบทความใหม่

หลักการสูงสุด: **เอเยนต์มีหน้าที่ "จัดรูปแบบ" เท่านั้น ห้าม "เขียนเนื้อหาใหม่"** ทุกตัวอักษรในบทความต้องยกมาแบบคำต่อคำ (verbatim) ห้ามตัด ห้ามย่อ ห้ามเรียบเรียงใหม่ ห้ามแก้คำแปล

---

## ส่วน A — กฎเลย์เอาต์ (Layout Rules)

### A.1 บทบาทของแต่ละภาษา
- **ไทย** = ภาษาหลัก ผู้อ่านเสพเนื้อหาทั้งหมดผ่านภาษาไทย — แสดงตลอด ไม่มีการซ่อน
- **อาหรับ** = ตัวบทปฐมภูมิ (อายะฮ์/หะดีษ/คำพูดอุละมาอ์/นิยามศัพท์) — แสดงหรือซ่อนตามกฎ A.2
- **อังกฤษ** = transliteration หรืออ้างอิงงานวิชาการตะวันตก — แสดง inline ตามปกติ

### A.2 กฎ แสดง / ซ่อน / inline ของตัวบทอาหรับ

ตัดสินจาก **บทบาทของตัวบท** เป็นหลัก และใช้ **ความยาว** เป็นตัวช่วย:

| ประเภทตัวบทอาหรับ | การแสดงผล |
|---|---|
| อายะฮ์อัลกุรอาน, หะดีษ (ตัวบท), นิยามศัพท์แกนที่กำลังวิเคราะห์ — **ความยาว ≤ 280 ตัวอักษร** | **แสดงเต็ม** (บล็อก `.ar-feature`) |
| ตัวบทแกนข้างต้น แต่ **ยาว > 280 ตัวอักษร** | **แสดงแบบพับได้-เปิดค้าง** (`<details open>`) |
| คำพูดอุละมาอ์ยาว ๆ, ข้อความคัดจากตำราที่มีคำแปลไทยครบแล้ว — **(ค่าเริ่มต้นของตัวบทอาหรับส่วนใหญ่)** | **ซ่อนใน toggle** (`<details>` ปิด) |
| คำศัพท์เทคนิคเดี่ยวในประโยค เช่น الجِسْم | **inline** (`<span lang="ar">`) |

**กฎยกเว้น (สำคัญที่สุด):** ถ้าผู้เขียนใส่วงเล็บกำกับไว้ในต้นฉบับว่า "(ไม่ต้องซ่อน)" หรือ "(โชว์)" ที่ก้อนอาหรับใด → **แสดงเต็มเสมอ** ไม่ว่าจะยาวแค่ไหน ให้ลบเครื่องหมายกำกับนี้ออกจากผลลัพธ์ที่ผู้อ่านเห็น

**กฎเหล็ก:** ตอนซ่อน/พับตัวบทอาหรับ — **คำแปลไทยที่อยู่ใต้มันต้องแสดงตลอด** ไม่ว่ากรณีใด ซ่อนได้เฉพาะ "ต้นฉบับอาหรับ" เท่านั้น ห้ามซ่อนคำแปลไทย

### A.3 หัวข้อย่อย
- ข้อความที่อยู่ในวงเล็บเหลี่ยม เช่น `[ กรณีศึกษา ... ]`, `[ สรุป ]` → แปลงเป็นหัวข้อย่อย `<h2>` (ลบวงเล็บเหลี่ยมออก)

### A.4 รายการสรุปแบบมีลำดับ
- ย่อหน้าที่ขึ้นต้นด้วย "ประเด็นที่หนึ่ง...", "ประเด็นที่สอง...", "ประเด็นสุดท้าย..." (หรือลำดับทำนองนี้) → แปลงเป็นรายการมีเลขกำกับ `<ol>` โดยส่วนหัวของแต่ละข้อ (เช่น "ว่าด้วยหลักฐานของการแยกแยะ") ทำเป็นตัวหนา/หัวข้อย่อยของ `<li>` นั้น

---

## ส่วน B — HTML Patterns (ใช้เป็นแม่แบบ)

> หมายเหตุสำหรับเอเยนต์: ถ้า `article.css` มี class เหล่านี้อยู่แล้ว ให้ reuse; ถ้ายังไม่มี ให้เพิ่มตาม spec ด้านล่าง ใช้ design token ของเว็บ: bg `#0a0907`, text `#f5f1ea`, accent `#b31b1b`, muted `#9a907e`, อาหรับ = Amiri, ไทย body = Sarabun, heading = IBM Plex Sans Thai

### B.1 คำอาหรับ inline
```html
<p>แนวคิดเรื่องญิสม์ (<span lang="ar" dir="rtl" class="ar-inline">الجِسْم</span>) นั้น...</p>
```

### B.2 บล็อกอาหรับ "แสดงเต็ม" (อายะฮ์/หะดีษ/นิยามแกนสั้น ≤280)
```html
<blockquote class="ar-feature" lang="ar" dir="rtl">
  يسألونك عن الأهلة قل هي مواقيت للناس والحج
</blockquote>
<p class="ar-translation">{พวกเขาจะถามเจ้าเกี่ยวกับดวงจันทร์ข้างขึ้น ...}</p>
```
CSS แนะนำ:
```css
.ar-feature{
  font-family:'Amiri',serif; direction:rtl; text-align:right;
  font-size:1.6rem; line-height:2.1; color:#f5f1ea;
  border-right:3px solid #b31b1b; padding:16px 20px; margin:24px 0;
  background:rgba(255,255,255,0.02);
}
.ar-translation{ color:#cfc8bb; margin:0 0 24px; }
```

### B.3 บล็อกอาหรับ "ซ่อนใน toggle" — ค่าเริ่มต้นของตัวบทส่วนใหญ่
ใช้ `<details>` ของ HTML ล้วน (ไม่พึ่ง JavaScript — เสถียร ทำงานทุกเบราว์เซอร์)
**คำแปลไทยอยู่นอก `<details>` เสมอ จึงแสดงตลอด**
```html
<p class="ar-translation">"ข้าพเจ้าได้พิจารณาใคร่ครวญหะดีษบทนี้ และพบว่า..."</p>
<details class="ar-toggle">
  <summary>ดูต้นฉบับภาษาอาหรับ</summary>
  <blockquote lang="ar" dir="rtl" class="ar-block">
    وقد تأملت هذا الحديث فوجدت معناه ...
  </blockquote>
</details>
```
CSS แนะนำ:
```css
.ar-toggle{ margin:8px 0 24px; }
.ar-toggle > summary{
  cursor:pointer; list-style:none;
  font-family:'IBM Plex Sans Thai',sans-serif; font-size:.9rem;
  color:#9a907e; padding:6px 0; user-select:none;
  border-bottom:0.5px solid rgba(255,255,255,0.12); display:inline-block;
}
.ar-toggle > summary:hover{ color:#b31b1b; }
.ar-toggle[open] > summary{ color:#b31b1b; margin-bottom:10px; }
.ar-toggle .ar-block{
  font-family:'Amiri',serif; direction:rtl; text-align:right;
  font-size:1.45rem; line-height:2.1; color:#e8e0d0;
  padding:8px 16px; border-right:2px solid rgba(179,27,27,0.5);
}
```

### B.4 บล็อกอาหรับแกน "ยาว > 280 แต่ต้องแสดง" — พับได้ เปิดค้าง
เหมือน B.3 แต่ใส่ `open` ให้เปิดค้างไว้ (ผู้อ่านพับเก็บเองได้) และเปลี่ยน label
```html
<details class="ar-toggle" open>
  <summary>ย่อ/ขยายต้นฉบับ</summary>
  <blockquote lang="ar" dir="rtl" class="ar-block"> ... </blockquote>
</details>
<p class="ar-translation"> ...คำแปลไทย... </p>
```

### B.5 หัวข้อย่อย
```html
<h2 class="article-h2">กรณีศึกษา เมื่อพยานบอกว่าเห็น แต่ดาราศาสตร์บอกว่าเป็นไปไม่ได้</h2>
```

### B.6 รายการสรุปแบบมีเลข
```html
<ol class="article-summary">
  <li><strong>ว่าด้วยหลักฐานของการแยกแยะ:</strong> การคำนวณทางดาราศาสตร์ถูกนำมาใช้...</li>
  <li><strong>ว่าด้วยลำดับชั้นของหลักฐาน:</strong> ทัศนะนี้ตั้งอยู่บนหลักญาณวิทยา...</li>
</ol>
```

---

## ส่วน C — Protocol กัน Data Loss (ห้ามตัดเนื้อหา)

นี่คือหัวใจที่ป้องกันเนื้อหาตกหล่น/ถูกดัดแปลง ต้องทำทุกขั้น:

### C.1 แปลงด้วยการสกัดข้อความ ไม่ใช่ "อ่านแล้วพิมพ์ใหม่"
- เอเยนต์ต้องสกัดข้อความจาก .docx ด้วยสคริปต์ (เช่น `python-docx`) ดึงทีละย่อหน้า
- ห่อ HTML tag รอบข้อความที่สกัดมาแบบ verbatim — **ห้ามพิมพ์เนื้อหาขึ้นใหม่จากการอ่าน**
- การตัดสินใจเดียวที่เอเยนต์ทำคือ "ก้อนนี้ภาษาอะไร" และ "แสดง/ซ่อน/inline ตามกฎ A.2" — ไม่แตะตัวอักษร

### C.2 Checksum — นับก่อน/หลัง ต้องตรงกัน
ก่อนแปลง ให้เอเยนต์นับจากต้นฉบับ .docx แล้วรายงาน:
- จำนวนย่อหน้าที่ไม่ว่าง (non-empty paragraphs)
- จำนวนก้อนอาหรับ
- จำนวนตัวอักษรไทยรวม และตัวอักษรอาหรับรวม

หลังแปลงเป็น HTML ให้นับซ้ำจากผลลัพธ์ แล้ว**เทียบให้ตรงเป๊ะ**:
- จำนวนย่อหน้าไทยใน HTML = จำนวนย่อหน้าไทยใน docx
- จำนวนก้อนอาหรับใน HTML (รวมที่อยู่ใน details) = จำนวนก้อนอาหรับใน docx
- ผลรวมตัวอักษร (ไม่นับ tag) ควรตรงกับต้นฉบับ (ต่างได้เฉพาะวงเล็บกำกับ "(ไม่ต้องซ่อน)" ที่ลบออก และวงเล็บเหลี่ยมของหัวข้อ)

**ถ้าตัวเลขไม่ตรง = มีเนื้อหาตกหล่น → ห้าม commit ต้องหาสาเหตุและแก้ก่อน**

### C.3 รายงานเทียบ
เอเยนต์ต้องรายงานตาราง before/after (ย่อหน้า, ก้อนอาหรับ, จำนวนตัวอักษร) ให้เห็นว่าตรงกันก่อนจึง commit

---

## ส่วน D — Command Template (คัดลอกไปสั่งเอเยนต์)

แทนที่ `<ชื่อไฟล์>`, `<หมวด>`, `<slug>` ตามบทความจริง แล้วแนบไฟล์ SOP นี้ + ไฟล์ .docx ไปด้วย

```
Read /mnt/skills/.claude/skills/debug-harris/SKILL.md, CLAUDE.md,
and the attached SOP-article-layout.md first.
Develop on branch claude/rules-full-update-kGLfz, merge to main when done.

TASK: Convert the attached article <ชื่อไฟล์>.docx into a new HTML
article page following SOP-article-layout.md EXACTLY.

ABSOLUTE RULE — NO CONTENT CHANGES:
- You are FORMATTING ONLY, not rewriting. Every paragraph must be
  carried over verbatim (byte-for-byte). Do NOT shorten, summarize,
  rephrase, merge, drop, or "improve" any Thai, Arabic, or English text.
- Extract text from the .docx with a script (python-docx), wrap each
  paragraph in HTML per the SOP. Never retype content from reading.

LAYOUT (per SOP section A + B):
- Thai = always visible body text
- Arabic blocks: apply the show / collapse / inline rules in A.2
  - aya/hadith/core definition ≤280 chars → .ar-feature (full show)
  - core but >280 chars → <details open>
  - everything else (ulama quotes etc. with Thai translation) → <details> collapsed
  - inline single terms → <span lang="ar">
  - EXCEPTION: if the source marks a block "(ไม่ต้องซ่อน)" / "(โชว์)",
    always show it full and remove that marker from output
  - Thai translation ALWAYS stays outside <details> (always visible)
- [ ... ] bracket lines → <h2>
- "ประเด็นที่หนึ่ง / สอง / ..." summary → numbered <ol> with bold lead-in

DATA-LOSS PROTOCOL (per SOP section C) — MANDATORY:
1. Before converting, count from the .docx: non-empty paragraphs,
   Arabic blocks, total Thai chars, total Arabic chars. Report it.
2. After converting, count the same from the HTML output. Report it.
3. The counts MUST match (allowing only removed "(ไม่ต้องซ่อน)" markers
   and stripped [ ] brackets). If anything is missing, DO NOT commit —
   find the cause and fix.
4. Show the before/after comparison table.

OUTPUT:
- Create the article at the correct path used by existing articles
  (match the structure of an existing kalam article), category <หมวด>, slug <slug>
- Reuse existing article.css classes where present; add SOP classes if missing
- bump version query strings in main.js to today's date

CONSTRAINTS:
- All 51 rules in CLAUDE.md remain in force
- Strict citation integrity — do not alter author, title, dates, or any reference
- After deploy, also confirm the new article appears in the category list
  and (later) gets added to sitemap.xml

Report: before/after checksum table, what classes were added, and the file path.
Commit and push when done.
```

---

## หมายเหตุท้ายเอกสาร
- เมื่อขึ้นบทความใหม่แล้ว อย่าลืมเพิ่ม URL ของบทความเข้า `sitemap.xml`
- ภายหลังเมื่อบทความครบทุกหมวดแล้ว ค่อยฝัง JSON-LD แบบ `ScholarlyArticle` รายบทความทีเดียว (ดู roadmap SEO)
- ถ้าต้องการปรับกฎความยาว 280 ตัวอักษร หรือเพิ่มประเภทตัวบทใหม่ ให้แก้ที่เอกสารนี้จุดเดียว แล้วใช้ฉบับปรับปรุงแนบครั้งต่อไป
