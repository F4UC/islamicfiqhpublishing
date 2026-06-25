# Handoff — al-Bidayah wa al-Nihayah ingestion (Time Machine)

อัปเดต: 2026-06-25 · branch `claude/timemachine-years-1-100` (HEAD `ab5ae83`)

## สถานะปัจจุบัน
- **ทำเสร็จ: ปี ฮ.ศ. 1 → 430** = **421 shards** (ไฟล์ `bidayah-h{N}.json`)
- ปีว่าง (ไม่มีเหตุการณ์ในตำรา เว้นไว้ตามจริง ไม่แต่ง): **9 ปี** — 30, 32, 38, 42, 52, 58, 82, 92, 303
- glossary: **1,226 persons + 278 places** (`glossary.json`)
- ทุก shard ผ่าน `tm_qc.py` (exit 0) + byte-gate (Arabic byte-exact) แล้ว push ครบ

## เหลืออีกเท่าไรถึงจบ
- เป้าหมาย: ปีสุดท้าย ≈ **ฮ.ศ. 767** (จุดจบของ al-Bidayah เล่มสุดท้าย)
- **เหลือ ปี 431 → ~767 = ~337 ปี** (ก่อนหักปีว่างที่จะเจอระหว่างทาง)
- ความคืบหน้า ≈ 56% ของช่วงปี (430/767)

## โครงสร้างข้อมูล (สำหรับทำ Subscriptions)
- `index.json` → `shards[]`: `{file, book, hijriYear, events, eventsSchema:"v3", scope, reviewStatus:"DRAFT"}`
- แต่ละ shard `bidayah-h{N}.json`: `{meta, events[]}`
  - `events[]`: `{id, cat, group, order, title, persons[], places[], accounts[], book, hijriYear, ceYear, ...}`
  - `accounts[]`: `{source:"ibn-kathir", detail (แปลไทย Rule 89), arabicExcerpt (byte-exact), loc, url (shamela)}`
- `persons[]`/`places[]` อ้าง id ใน `glossary.json` (`{id, arabic, canonicalThai, note}`)
- **แยกหนังสือต่อ subscription**: ทุก shard มี `meta.book = "al-bidayah-wa-al-nihayah"` — กรองด้วยฟิลด์นี้เพื่อแยก al-Bidayah ออกจากตำราเล่มอื่น (โมเดล subscription รายเล่ม)

## ไฮไลต์ช่วงท้าย (ปี 411–430) — จุดเปลี่ยนประวัติศาสตร์
- 411 ★★ลอบสังหารอัลหากิม บิอัมริลลาฮ์ (ฟาฏิมียะฮ์) ที่ญะบัลอัลมุก็อฏฏ็อม
- 420 ★★ประกาศ **อะกีดะฮ์อัลกอดิรี** ที่วังเคาะลีฟะฮ์
- 421 ★★ตายมะห์มูดแห่งฆ็อซนะฮ์ + ★★ไบแซนไทน์พ่ายที่อะซาซ
- 422 ★★ตายอัลกอดิร (ครอง 41 ปี) → เคาะลีฟะฮ์ **อัลกออิม**
- 428 ★★วะฟิยาต **อิบนุ ซีนา (อะวิเซนนา)**
- 429 ★★**จุดเริ่มราชวงศ์สัลญูก** (ฏุฆรุลบักยึดนัยซาบูร) + ข้อพิพาทฉายา "มะลิกุลมุลูก"
- 430 ★บนูสัลญูกยึดคุรอซาน + ★★อะบูนุอัยม์ อัลอัศบะฮานี (หิลยะตุลเอาลิยาอ์)

## วิธีทำต่อ (harness ปี-ต่อ-ปี)
1. สแกน header ทั้งสองรูป `ثم دخلت سنة` / `ثم استهلَّت سنة` (อาจอยู่กลางหน้า → ใช้ pos) หาปีปัจจุบัน + ปีถัดไปเพื่อจำกัด pid
2. อ่าน pid → แปล Rule 89 (แปลเต็มท่อน + ทับศัพท์/ขยายความวงเล็บ) → `arabicExcerpt` = `extract(RAW[pid], start, end)` (byte-exact, ห้ามพิมพ์เอง)
3. build JSON → `tm_qc.py` (exit 0) + byte-gate → fix → commit → push → อัปเดต pointer
4. **★ต่อไป = ปี 431** (header pid 5942 pos351 `ثم دخلت سنة إحدى وثلاثين وأربعمئة`; 432 = pid5943 pos458) — ปี 431 คือ **สมรภูมิดันดานกอน** (สัลญูกชนะฆ็อซนะฮ์เด็ดขาด)

## กฎสำคัญ (เลือกที่เคยพลาด)
- R52 เว้นวรรคหลัง อบู/อิบนุ — ระวัง false-positive เช่น "กอบูส"→ใช้ "กาบูส", ชื่อที่มี substring "อบู"
- R2 ห้าม "มิใช่"→"ไม่ใช่" · R3 ห้าม em-dash (—) **แม้ในชื่อ/scope** · R6 ห้าม "มัซฮับ"→"สำนัก/แนวทาง"
- R5 ห้ามคำราชาศัพท์กับมนุษย์ (เช่น في الموكب ≠ "เสด็จ" → ใช้ "ขบวนพิธี") · "พระองค์" ได้เฉพาะอัลลอฮ์
- R86 id ซ้ำ canonicalThai (หลัง strip วงเล็บ) = ERROR → ใช้ id เดิม. id ที่พลาดบ่อย: `kerman`(ไม่ใช่ kirman), `al-jabal`(ไม่ใช่ jibal), `al-raqqa`(ไม่ใช่ raqqa)
- เช็ค corrupt char `�` ในข้อความไทยยาวก่อน commit
