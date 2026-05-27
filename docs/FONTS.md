# FONTS.md — ทะเบียนฟอนต์กลาง (Font Registry)
## islamicfiqhpublishing.com

เอกสารภายใน (ซ่อนจากเว็บสาธารณะผ่าน `robots.txt → Disallow: /docs/`, ไม่อยู่ใน `sitemap.xml`)

> **กฎเหล็กของไฟล์นี้:** งานใด ๆ ที่ **เพิ่ม / ลบ / เปลี่ยน** ฟอนต์บนเว็บ ต้องอ่านไฟล์นี้ก่อน และ **อัปเดตไฟล์นี้ในคอมมิตเดียวกัน** ทุกครั้ง — ไฟล์นี้คือแหล่งความจริงเดียว (single source of truth) ของระบบฟอนต์ทั้งเว็บ
>
> สอดคล้องกับ **กฎข้อที่ 24** ใน `CLAUDE.md`: Amiri (อาหรับ), Sarabun (ไทย), Inter (อังกฤษ)

---

## A. ฟอนต์ที่ใช้บนเว็บ (Fonts in use)

| Family | Role | Source / loading | License | CSS variable | Files in repo (if self-hosted) |
|---|---|---|---|---|---|
| **Sarabun** | Thai body text (เนื้อหาหลักภาษาไทย) | Google Fonts `<link>` ในทุกหน้า (`index.html`, `pages/*.html`, `articles/**/*.html`, `article-template.html`) | SIL OFL 1.1 (Google Fonts) | `--thai`, `--ph-thai` | — (ไม่ได้ self-host) |
| **IBM Plex Sans Thai** | Thai display / heading (หัวเรื่อง, page-display, UI ค้นหา) | Google Fonts `<link>` ในทุกหน้า | SIL OFL 1.1 (Google Fonts) | `--serif`, `--ph-serif` | — |
| **Amiri** | Arabic (อายะฮ์/หะดีษ/คำพูดอุละมาอ์/คำศัพท์) | Google Fonts `<link>` ในทุกหน้า | SIL OFL 1.1 (Google Fonts) | `--arabic` | — |
| **Inter** | English / Latin UI (ข้อความอังกฤษ, ป้าย UI, fallback ของ `--ui`) | Google Fonts `<link>` ในทุกหน้า | SIL OFL 1.1 (Google Fonts) | (ผ่าน `--ui` fallback; ใช้ตรง ๆ ในหลาย selector) | — |
| **D-DIN** (Datto) | Latin display / UI ตัวเลข-ป้าย (ตัวเลือกแรกของ `--ui`) | **Self-hosted `@font-face`** ใน `index.html` (inline `<style>`) และ `css/tokens.css` | SIL OFL 1.1 (Datto Inc., Reserved Font Name "D-DIN") | ตัวเลือกแรกของ `--ui` | `/D-DIN.e58c68e58b09fc0e.woff2`, `/D-DIN.105cb3e9fde868e3.woff`, `/D-DIN.e77db3e5eeb79c76.otf` |
| `monospace` | คีย์บอร์ดฮินต์ในกล่องค้นหา (`<kbd>`, `.search-esc-badge`) | ฟอนต์ระบบ (ไม่โหลด) | — | — | — |

**หมายเหตุการโหลด Google Fonts** — `<link>` เดียวกันโหลด 4 ตระกูลพร้อมกัน:
```
https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300..700
  &family=Amiri:ital,wght@0,400;0,700;1,400;1,700
  &family=Sarabun:ital,wght@(full range)
  &family=Inter:ital,opsz,wght@(variable)&display=swap
```

---

## B. บทบาทของฟอนต์ตามภาษา (Role by language)

| บทบาท | ฟอนต์ | ตัวแปร | Fallback chain |
|---|---|---|---|
| **Thai body** (เนื้อหาหลัก) | Sarabun | `--thai` / `--ph-thai` | `'Sarabun', system-ui, sans-serif` |
| **Thai display / heading** | IBM Plex Sans Thai | `--serif` / `--ph-serif` | `'IBM Plex Sans Thai', system-ui, sans-serif` |
| **Arabic** | Amiri | `--arabic` | `'Amiri', serif` |
| **English / Latin UI** | D-DIN → Inter | `--ui` (และ Inter ตรง ๆ) | `'D-DIN', 'Inter', system-ui, sans-serif` |

**สำคัญ:** Latin glyph อาจถูกเรนเดอร์ด้วยฟอนต์ไทยได้ — เมื่ออักษร Latin ปรากฏในบริบท `--thai` (Sarabun) หรือ `--serif` (IBM Plex Sans Thai) จะใช้ glyph Latin ของฟอนต์ไทยนั้น ทั้งสองฟอนต์มี Latin ครบ จึงไม่ตกไปที่ system-ui ในกรณีปกติ

---

## C. CSS variables (font-related)

| Variable | นิยามที่ไฟล์ | Resolves to | Pitfalls |
|---|---|---|---|
| `--serif` | `index.html` `:root`, `css/tokens.css`, `pages/tools/*.html` | `'IBM Plex Sans Thai', system-ui, sans-serif` | — |
| `--thai` | เหมือนข้างบน | `'Sarabun', system-ui, sans-serif` | — |
| `--arabic` | เหมือนข้างบน | `'Amiri', serif` | — |
| `--ui` | `index.html` `:root`, `css/tokens.css`, `pages/tools/hijri-time-machine.html` | `'D-DIN', 'Inter', system-ui, sans-serif` | **D-DIN เคยขาดไฟล์** จนถึงรอบนี้ (2026-05-27) — `@font-face` ชี้ไปไฟล์ที่ไม่มีจริง ทำให้ตกไป Inter เงียบ ๆ ตอนนี้ติดตั้งไฟล์ครบแล้ว |
| `--ui` (เฉพาะ isnad-tracer) | `pages/tools/isnad-tracer.html` | `'Inter', system-ui, sans-serif` | ไฟล์นี้ **ไม่มี** D-DIN ในสแตก (ใช้ Inter ตรง ๆ) — ตั้งใจให้ต่างจากหน้าอื่น |
| `--ph-serif` | `article.css` `:root`, และ inline `:root` ของแต่ละ category page | `'IBM Plex Sans Thai', system-ui, sans-serif` | category page นิยามซ้ำใน inline `<style>` ของตัวเอง ถ้าจะเปลี่ยนต้องแก้ทุกหน้า |
| `--ph-thai` | เหมือน `--ph-serif` | `'Sarabun', sans-serif` | เหมือนข้างบน |

---

## D. ฟอนต์แต่ละตัวถูกอ้างที่ไหน (Where each font is referenced)

เพื่อรู้ว่า "ถ้าเปลี่ยนฟอนต์นี้ อะไรพังบ้าง":

- **Sarabun** (`--thai` / `--ph-thai` / ตรง ๆ) → `body` ทุกหน้า, นิติศาสตร์/กะลาม article body, nav link บนเดสก์ท็อป (`nav.chrome-nav .nav-item` ≥1024px), cat-nav links (`tokens.css`), pagination (`.page-btn`), article list (`.item-title`, `.list-title`), `.date-line`, `.foot-colophon`, QOTD `.th`
- **IBM Plex Sans Thai** (`--serif` / `--ph-serif`) → `.page-display` (hero title ทุก category page), `.about-content h2`, article `<h2>` / `.article-h2`, search overlay (`.search-input`, `.search-result-*`, `.search-modal-title`), inline search dropdown (`.inline-dd-*`)
- **Amiri** (`--arabic` / ตรง ๆ) → `.ar-feature`, `.ar-block`, `.ar-inline`, `.arabic-text`, `.quote-text-ar`, ตัวอักษรอาหรับประดับขนาดใหญ่บน index, `.logo-ar`, `.footer-ar`, QOTD `ar`
- **Inter** → `.chrome` (nav bar base font, header.html), `.chrome-wordmark` ("FIQH"), `.topbar`, `.logo-en`, `.footer-logo`, `.footer-copy`, `.en-text` (อังกฤษแทรกในบทความ), `.numbered-section .num`, `--ui` fallback ทุกที่
- **D-DIN** → ตัวเลือกแรกของ `--ui` ใน `index.html`, `css/tokens.css`, `pages/tools/hijri-time-machine.html` (เช่น `.topbar`, `.logo-en`, `.footer-logo`, `.footer-copy` เมื่อหน้านั้นใช้ `var(--ui)`); **footer (`components/footer.html`)** ใช้ stack ตรง ๆ `'D-DIN','Inter',system-ui` ที่ brand wordmark (`.foot-mark`), บรรทัดลิขสิทธิ์ (`.foot-bottom`), และ Latin substring ในลิงก์ (`.footer-en` — เช่น HIJRI TIME MACHINE, Facebook) เหตุที่ใช้ stack ตรง ๆ ไม่ใช่ `var(--ui)` เพราะ footer ถูกฉีดทุกหน้ารวมหน้าบทความที่ `article.css` ไม่ได้นิยาม `--ui`

---

## E. วิธีเพิ่มฟอนต์ใหม่ (How to add a new font) — checklist

1. **ตรวจ license**: ยืนยันว่าอนุญาต **web embedding** (ไม่ใช่แค่ desktop use) — ระวัง DIN ของ Linotype/Monotype ที่เป็นเชิงพาณิชย์
2. **เลือกวิธีโหลด**: Google Fonts `<link>` หรือ self-host ผ่าน `@font-face` (แนะนำ self-host เพื่อควบคุมเวอร์ชันและความเป็นส่วนตัว)
3. **ถ้า self-host**: วางไฟล์ที่ `/fonts/<family>/` (หรือ repo root ตามคอนเวนชันเดิมของ D-DIN), ใส่ไฟล์ license ไปด้วย
4. **เพิ่ม `@font-face`** ใน `css/tokens.css` (หรือ CSS ที่เหมาะสม) พร้อม `font-display: swap` (ยกเว้นกรณีที่จงใจใช้ `block` เหมือน D-DIN ปัจจุบัน)
5. **ผูกกับ CSS variable** ใน `:root` ถ้าฟอนต์มีบทบาทซ้ำ ๆ มิฉะนั้นอ้างตรง ๆ
6. **อัปเดตไฟล์นี้ (`/docs/FONTS.md`) ในคอมมิตเดียวกัน** — ทุก section A–G
7. **bump เวอร์ชันใน `main.js`** (query string `?v=YYYYMMDD…`) เพื่อให้เบราว์เซอร์โหลด CSS/component ใหม่

---

## F. License notes — ที่อยู่ของไฟล์ลิขสิทธิ์

| Font | License | ที่อยู่ในเว็บ / วิธีหา |
|---|---|---|
| D-DIN | SIL OFL 1.1 | `/OFL.txt` (root) — ต้นฉบับ `OFL-1.1.txt` จาก `github.com/amcchord/datto-d-din`, Copyright (C) 2017 Datto Inc., Reserved Font Name "D-DIN" |
| Sarabun | SIL OFL 1.1 | โหลดผ่าน Google Fonts — license: https://fonts.google.com/specimen/Sarabun/about |
| IBM Plex Sans Thai | SIL OFL 1.1 | Google Fonts — https://fonts.google.com/specimen/IBM+Plex+Sans+Thai/about |
| Amiri | SIL OFL 1.1 | Google Fonts — https://fonts.google.com/specimen/Amiri/about |
| Inter | SIL OFL 1.1 | Google Fonts — https://fonts.google.com/specimen/Inter/about |

ทุกฟอนต์บนเว็บอยู่ภายใต้ **SIL Open Font License 1.1** — ใช้ฟรีรวมถึงเชิงพาณิชย์

---

## G. Last verified

- **วันที่:** 2026-05-27
- **สถานะ:** ติดตั้งไฟล์ D-DIN (woff2 / woff / otf) ครบที่ path ที่ `@font-face` เดิมคาดหวัง + เพิ่ม `/OFL.txt` — ไม่ได้แก้ CSS / `@font-face` / ตัวแปรใด ๆ
- **Baseline commit (ก่อนรอบนี้):** `93e4741`
- **ที่มาไฟล์ D-DIN:** `github.com/amcchord/datto-d-din` branch `main` (D-DIN Regular, family "D-DIN", 251 glyphs, magic `wOF2`/`wOFF`/`OTTO` ผ่านการตรวจด้วย fonttools)
