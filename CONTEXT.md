# CONTEXT — islamicfiqhpublishing.com

เอกสารสรุป design decisions และสถานะงาน สำหรับ onboard เซสชันใหม่อย่างรวดเร็ว

## Stack & Workflow
- Static site บน Cloudflare Pages
- Repo: Genesis897/islamicfiqhpublishing
- Branch: main (production) + claude/rules-full-update-kGLfz (deploy/dev — ต้อง sync กับ main เสมอ)
- พัฒนาบน claude/rules-full-update-kGLfz เสมอ แล้ว merge เข้า main
- Components: components/header.html + components/footer.html inject ผ่าน main.js
- ก่อนแก้โค้ดทุกครั้ง อ่าน /mnt/skills/.claude/skills/debug-harris/SKILL.md และ CLAUDE.md (51 ข้อ)

## Design System
- Reference: SpaceX, Tesla — dark, minimal, ไม่มี decoration, typography เด่น
- Heading font: IBM Plex Sans Thai (300/400/500/600/700)
- Body: Sarabun (ไทย), Arabic: Amiri, English UI: Inter
- Accent words ใน heading: font-weight 700, color #d32f2f, ไม่ italic
- Background: #0a0907 flat ทุก subpage (ไม่มี gradient/navy/glow)
- Palette: bg #0a0907 · text #f5f1ea · accent #b31b1b · muted #9a907e
- Wordmark: "FIQH" (nav ซ้ายสุด desktop)
- ห้ามใช้ emoji ทุกที่ (SVG icon ใช้ได้)

## Nav Bar (desktop ≥1024px)
- Layout: FIQH (ซ้าย) | เมนู inline (กลาง) | inline search + dropdown (ขวา)
- Position fixed, height 72px, transparent overlay บน hero
- Gradient hero top 160px: linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)
- ขนาด: FIQH 28px · เมนู 16px weight 500 letter-spacing 0.1em · gap 24px
- Hide-on-scroll: เลื่อนลงซ่อน (.nav-hidden), เลื่อนขึ้นโชว์, threshold 80px
- Mobile <1024px: ซ่อน inline search, แสดง magnifier + hamburger

## Search
- Desktop: typeahead dropdown ใต้ช่อง inline (ไม่ใช้ overlay ตอนพิมพ์)
    พิมพ์ → dropdown สูงสุด 6 รายการ; Enter → เปิด full overlay; ArrowDown → เลือกใน dropdown
- Mobile: magnifier เปิด full overlay
- articles.json: preload ตั้งแต่ DOMContentLoaded
- filter logic กลาง: getMatches() ใช้ร่วมทั้ง dropdown และ overlay

## ไฟล์สำคัญ
- index.html — homepage (อย่าแตะถ้าไม่จำเป็น)
- components/header.html — nav bar + search overlay + CSS
- components/footer.html — footer
- main.js — header/footer fetch, theme, search, scroll, hide-on-scroll
- css/tokens.css, article.css — shared styles
- articles.json — search data source
- pages/kalam.html, pages/nitisart.html — article list pages
- pages/about.html — about (video hero /images/heroes/hero-about.mp4)

## กฎสำคัญ (CLAUDE.md)
- Rule 15: ใช้อัญประกาศโค้ง "..." ในเนื้อหาที่ผู้อ่านเห็น (ไม่ใช้ใน HTML attribute)
- Rule 24: Amiri (Arabic), Sarabun (Thai body), Inter (English) + IBM Plex Sans Thai (heading)
- Rule 51: QOTD setInterval = 19000ms ห้ามเปลี่ยน
- Rule 1-4: ห้ามตัดทอน/แต่งเติมเนื้อหาวิชาการ
- มาตรฐานวิชาการ: ทุก claim ต้องมีแหล่งปฐมภูมิจริง (ผู้แต่ง/ชื่อเรื่อง/สำนักพิมพ์/ปี/เลขหน้า) — ห้ามสร้าง citation ลอย

## งานค้าง (Pending)
- Article list layout kalam.html + nitisart.html: ทุก row สว่าง — สำเร็จแล้ว (3-col grid IBM Plex, 26px title)
