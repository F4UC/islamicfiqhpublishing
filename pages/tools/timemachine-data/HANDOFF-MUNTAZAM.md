# SESSION HANDOFF — สถานะล่าสุด (1 ก.ค. 2026, รอบ 31-32)

> ส่งมอบจากเซสชั่น Claude (context เต็ม) → เซสชั่นใหม่ทำต่อ
> **สรุป 1 บรรทัด:** อัลมุนตะซ็อมเดินถึง **สีเราะฮ์มักกะฮ์ - ปีที่สามจากการถือกำเนิด / การผ่าอก (ชักก์ศ็อดร์)** แล้ว; branch พร้อม merge; ทุก shard ผ่าน QC + byte-gate; สไตล์ถูกกฎ (ไม่มีไอคอน, เว้นวรรควงเล็บ S11)

## ตัวเลขปัจจุบัน
- **★ branch ใหม่ `claude/timemachine-muntazam-3`** (แตกสดจาก origin/main หลัง PR #301 squash-merge เข้า main แล้ว) · tip `4eda2089` (+banner) · push/sync · tree สะอาด
- **เหตุที่ย้าย branch:** muntazam-2 เดิม diverge จาก main (squash-divergence) → PR conflict ที่ glossary/index; muntazam-3 = delta สะอาด merge ได้ทันที. **เซสชั่นหน้าให้แตก branch ใหม่จาก origin/main ปัจจุบันเสมอ** (`git checkout -b claude/timemachine-muntazam-N origin/main`) หลัง One merge
- **delta บน branch นี้ = 8 ชาร์ดใหม่:** `pre-170`..`pre-177` (pre-02..pre-169 อยู่ใน main แล้ว) · **glossary 3965 persons / 650 places**
- ตรวจผ่านครบ: **tm_qc 0 findings (pre-170..175; pre-176 เหลือเฉพาะ R52 false-positive 'กอบูส' documented) · 0 ★ · 0 em-dash · byte-gate ทุก shard (re-fetch)** · S11 ok · R5/R52/R89/R92
- **PR:** เอเยนต์ create ได้ 403 (R74/R87 ยืนยัน) → **One เปิด + merge เองที่ `github.com/F4UC/islamicfiqhpublishing/pull/new/claude/timemachine-muntazam-3`** (อย่าใช้ muntazam-2 = conflict)

## จุดทำต่อ (RESUME)
- **RESUME: pid 691** (เล่ม 2 หน้า 286) — ต่อจบเรื่องหาติม อัฏฏออี → เดินทางชาม/บาทหลวงบะฮีรอ → ฮัรบุลฟิญาร → ฮิลฟุลฟุฎูล → แต่งเคาะดีญะฮ์ → สร้างกะอ์บะฮ์ → เผยพระวจนะ → ปี ฮ.ศ.1 (muntazam-hN.json) → อับดุลมุฏฏ็อลิบเลี้ยง → มรณะอับดุลมุฏฏ็อลิบ → อบู ฏอลิบเลี้ยง → พบบาทหลวงบะฮีรอ → ฮัรบุลฟิญาร → ฮิลฟุลฟุฎูล → แต่งเคาะดีญะฮ์ → สร้างกะอ์บะฮ์/ตัดสินหินดำ → เผยพระวจนะ ...
- **เสร็จรอบนี้ (8 ชาร์ด pre-170..177):** pre-177 (688-690) อบู ฏอลิบอุปถัมภ์/ปาฏิหาริย์น้ำ/เจว็ดบุวานะฮ์/เริ่มหาติม อัฏฏออี (+hatim-al-tai/safana-bint-hatim/buwana/dhu-al-majaz) · pre-176 (685-687) มรณะซัยฟ์+มรณกรรมอับดุลมุฏฏ็อลิบ (+umayma-bint-abd-al-muttalib/qabus-b-al-mundhir) · pre-175 (682-684) คำพยากรณ์ซัยฟ์เรื่องนบี ﷺ (+khuwaylid-b-asad/ghumdan) · pre-174 (679-681) อับดุลมุฏฏ็อลิบอุปถัมภ์+ฝันรุก็อยเกาะฮ์ (+ruqayqa-bint-sayfi/hisham-b-al-mughira/maqam-ibrahim/al-batha) · (เดิม:) pre-170 หะดีษฮะลีมะฮ์จบ+อุตบะฮ์ (+utba) · pre-171 ชัดดาด บิน เอาส์+อัรรอฟอุกาซ (+shaddad-b-aws/al-lat/ukaz) · pre-172 จบอัรรอฟ/กำเนิดอบู บักร/ปีที่สี่/แม่นมเยี่ยม · pre-173 ปีที่ห้า-เจ็ด: กาฮิน/เดินทางมะดีนะฮ์/มรณะอามินะฮ์ที่อัลอับวาอ์/เริ่มอับดุลมุฏฏ็อลิบอุปถัมภ์ (pre-172/173 ไม่เพิ่ม glossary) · **FLAG ค้าง:** R52 al-compound (อิบนุลหุศ็อยน์/อิบนุลมุษฮิบ/อบุลหะสัน/อิบนุสสัมมาก/อิบนุลบัรรออ์); محمد بن عمر=อัลวากิดีย์; al-shayma=أخته
- เมื่อถึง **ปี ฮ.ศ. 1** เปลี่ยนไฟล์เป็น `muntazam-hN.json` (hijriYear=N, เลิกใช้ pre-NN / era=pre-hijra) · คาดเริ่ม ~pid 690-720 (ต้องผ่านสีเราะฮ์มักกะฮ์ทั้งหมดก่อน)

## กฎสไตล์ที่ต้องระวัง (One ตำหนิรอบนี้ อย่าพลาดซ้ำ)
1. ห้ามใส่ไอคอน `★`/`☆` ใดๆ ในทุก field (ไม่มีในธรรมนูญ 92 กฎ)
2. **S11** เว้นวรรครอบวงเล็บ: ร้อยแก้วไทยต้องมีช่องว่างก่อน `(` และหลัง `)` เช่น `บ้าน (กะอ์บะฮ์) อันมีมุม` (ห้าม `บ้าน(กะอ์บะฮ์)`)
3. **S3** ห้าม em-dash `—` ในร้อยแก้ว (รวม title/RFX/detail/scope) ใช้ขีดสั้น `-` หรือ `:`
4. **S4** ไม้ยมก `ๆ` ติดคำหน้า เว้นวรรคหลัง เช่น `ลูก ๆ`
5. **R5** ห้ามราชาศัพท์กับมนุษย์/นบี (ใช้ ถือกำเนิด/เสียชีวิต/กิน ไม่ใช่ ประสูติ/สิ้นพระชนม์/เสวย) · `ทรง`/`พระองค์` เฉพาะอัลลอฮ์
6. **R2** `ไม่ใช่` (ห้าม `มิใช่`) · **R52** เว้นวรรค อิบนุ/อบู · **reviewFlags คงไว้** จนกว่า One merge รอบหน้า

## recipe ต่อ shard (ย่อ)
cwd = `pages/tools/timemachine-data` เสมอ · `clean_main_jawzi` (ไม่ใช่ `clean_main`) สำหรับ book 12406 ·
dump 3 หน้า → อ่าน → เช็ค glossary → build (sl() anchor byte-exact + R89 + ฝังอายะฮ์ `﴿...﴾`) → `tm_qc.py` → byte-gate (re-fetch, ลบ /tmp cache) → เช็ค stars=0 + em-dash=0 → commit → push.

---

# HANDOFF — Time Machine ingestion: อัลมุนตะศ็อม (อิบนุลเญาซีย์)

> เอกสารส่งมอบงานสำหรับ **เอเยนต์ใหม่** ที่จะทำงาน Time Machine ingestion แบบเดียวกับ Claude
> แต่กับตำราคนละเล่ม: **อัลมุนตะศ็อม ฟี ตารีคิลมุลูก วัลอุมัม** ของ **อิบนุลเญาซีย์** (เสียชีวิต ฮ.ศ. 597)
> Claude ทำ **อัลบิดายะฮ์ วันนิฮายะฮ์** (อิบนุ กะษีร) — ใช้กติกาเดียวกันกับเล่มนี้
> ร่างโดย Claude · 28 มิ.ย. 2026

---

## ★ สถานะล่าสุด (อัปเดต 29 มิ.ย. 2026 — อ่านก่อนเริ่ม) ★

- **✅ อัลบิดายะฮ์เสร็จสมบูรณ์แล้ว** — ปี ฮ.ศ. 1–768 ครบ (จบพงศาวดาร) + แปลคำเหตุการณ์ (ฆอซวะฮ์→การศึก, สะรียะฮ์→หน่วยรบ) **merge เข้า main แล้ว (PR #296, tip `9667db3`)**
- **🎯 เล่มนี้ (อัลมุนตะซ็อม) = โปรเจกต์ถัดไป** — เริ่มสดได้เลย ไม่ต้องรอใคร
- **branch:** branch เก่าทั้งหมด (654plus/638plus) **merge/ลบแล้ว** → **แตก branch ใหม่จาก `main` ปัจจุบัน** เช่น `claude/timemachine-muntazam` (push สาขาตัวเอง → PR draft → One merge; เอเยนต์ไม่ merge เอง R74/R87)
- **schema = v3 เสถียร** (เหมือนอัลบิดายะฮ์เป๊ะ) · `sources.json` มี entry `ibn-jawzi` แล้ว · `DATA-MODEL.md` framework รองรับหลายเล่ม (renderer อ่าน registry อัตโนมัติ)
- **ไม่ต้องรอรีดีไซน์ UI (PR #297 book-scoped):** เป็น UI-only ไม่แตะ schema → shard v3 ที่ผลิตตอนนี้ forward-compatible 100% (ทำข้อมูลคู่ขนานไปได้เลย ข้อมูลคือ long-pole)
- **glossary.json ใช้ร่วมกับอัลบิดายะฮ์** (append-only R86) — ชื่อที่อัลบิดายะฮ์ลงไว้แล้ว reuse ได้, ชื่อใหม่ append
- เครื่องมือพร้อม: `scripts/tm_lib.py` (`fetch`/`clean_main`), `scripts/tm_qc.py` (T1–T4), `scripts/check_source_immutable.py`, sl()-anchor recipe (ดู §5)

---

## 0. กฎเหล็กข้อแรก — อ่านก่อนเริ่ม

1. **อ่าน `CLAUDE.md` ทั้งไฟล์ (90 กฎ + S1–S8 + Push discipline)** ให้จบก่อนแตะงานใดๆ — เป็น single source of truth
   ★ **กฎ 71 (Child-Safety Override) อ่านก่อนเป็นข้อแรก** — เหนือกฎ fidelity/coverage ทุกข้อ
2. **กฎที่เกี่ยวข้องกับงานนี้โดยตรง:** R86 (glossary lock), R88 (byte-exact gate + sources registry),
   R89 (แปลตรงเต็มท่อน ไม่สรุป + R5 คำกลาง), R5 (ห้ามราชาศัพท์กับมนุษย์รวมนบี ﷺ),
   R52 (อิบนุ/อบู เว้นวรรค · อิบนุล/อบุล เชื่อม), R73 (corpus-dominant), R12/12.1/12.2,
   R75 (แปลถูกความหมาย — قام/خرج ตามบริบท), R60 (อาหรับ byte-exact), R9 (ปีเสียชีวิตในวงเล็บ)
3. **ความปลอดภัย (Push & safety discipline — ห้ามฝ่าฝืน):**
   - ห้ามอ่าน/ใช้ credential/token จาก config/env/disk ไปเรียก API ตรง · ห้ามเลี่ยง proxy/guardrail
   - push ล้มเหลว (503 / payload / auth) = **STOP แล้วรายงาน** ห้ามหาช่องทางอื่น
   - **ห้าม force-push · ห้ามสร้างเนื้อไฟล์จากความจำแชต** (อ่านจาก git tree จริง)
   - ส่งงานผ่าน **feature branch → PR → human review → merge** เท่านั้น · push main ตรงถูกบล็อก (503)
4. **★ เอเยนต์ห้าม merge `main` เด็ดขาด (R74/R87) — เฉพาะ One (เจ้าของ) เท่านั้น ★** · ห้าม Purge Everything

---

## 1. ภารกิจ

แปลตำรา **อัลมุนตะศ็อม** เป็นไทย ทำเป็น **Time Machine shard** (ทีละหน่วยข้อมูล: บทหัวข้อช่วงต้น → รายปีฮิจญ์เราะฮ์)
โดย **แปลตรงจากตัวบทจริงครบทุกประโยค (R89)** — ไม่ใช่สรุปเล่าเอง — ทุก excerpt อาหรับต้อง **byte-exact substring** ของแหล่ง (R88)
ทับศัพท์ทุกชื่อตาม **glossary กลาง (R86)** · ผ่าน QC ธรรมนูญ (`tm_qc.py`) + byte-gate ทุกหน่วยก่อน push

**เริ่มจาก:** บท **บดุลค็อลก์ (ذكر بداية الخلق — เริ่มแห่งการสร้าง)** — Shamela pid **99** (ตามที่ One กำหนด)
แล้วเดินหน้าตามลำดับเล่ม: การสร้าง → บรรดานบี → ก่อนอิสลาม → สีเราะฮ์ → ปี ฮ.ศ. 1, 2, 3 … จนจบเล่ม (อัลมุนตะศ็อมจบราวปี ฮ.ศ. **574**)

---

## 2. แหล่งของคุณ (locked source)

| | |
|---|---|
| **ตำรา** | المنتظم في تاريخ الملوك والأمم |
| **ผู้แต่ง** | อิบนุลเญาซีย์ (อบุลฟะร็อจญ์ อับดุรเราะห์มาน บิน อะลี) — เสียชีวิต ฮ.ศ. 597 |
| **ฉบับพิมพ์** | ط دار الكتب العلمية (تحقيق محمد عبد القادر عطا - مصطفى عبد القادر عطا) 19 เล่ม |
| **source id (ใน sources.json)** | **`ibn-jawzi`** ← ใช้ค่านี้ในฟิลด์ `accounts[].source` (ลงทะเบียนไว้แล้ว ไม่ต้องเพิ่ม) |
| **Shamela book** | **12406** · เริ่ม pid 99 (`https://shamela.ws/book/12406/99`) |
| **แหล่งรอง (urlAlt)** | ketabonline `https://ketabonline.com/ar/books/1326` |

⚠️ **อัลมุนตะศ็อมต่างจากอัลบิดายะฮ์ 2 อย่างที่ต้องระวัง:**
- **อิสนาด (สายรายงาน) หนาแน่นมาก** — ขึ้นต้นด้วย أخبرنا/حدثنا/قال ยาว ก่อนถึงเนื้อความ (มัตน์)
  → excerpt ต้องครอบทั้งท่อนที่ยกมา (รวมอิสนาดถ้าเป็นส่วนของท่อนนั้น) แปลตรงตาม R89 ไม่ตัดเป็นสรุป
- **ฮะเราะกาตเต็ม (voweled หนัก)** → การเลือก anchor ของ `sl()` ต้องใช้คำ **เปลือยสระ** (ดู §5 บทเรียน anchor)

---

## 3. โมเดลข้อมูล — อ่าน `DATA-MODEL.md` + `sources.json` ให้ครบ

- ตำราพงศาวดารรายปี (annal) ผูกกับ **EVENT** → `event.accounts[]` (renderer แสดงเป็น **แท็บ** เมื่อมี ≥ 2 แหล่ง)
- **วิสัยทัศน์:** ปีเดียวกันมีหลายสำนวน — ibn-kathir (อัลบิดายะฮ์), ibn-athir (อัลกามิล), **ibn-jawzi (อัลมุนตะศ็อม)** —
  วางเทียบกันใน event เดียว **บันทึกความต่างข้ามแหล่ง** (วันที่/จำนวน/สถานที่ที่ตำราระบุต่างกัน) = คุณค่าหลัก (R88)
- schema ของ shard = v3 (ดู §6) · `accounts[]` หนึ่ง entry ต่อหนึ่งแหล่ง:
  ```jsonc
  { "source": "ibn-jawzi", "detail": "<คำแปลไทยเต็ม>", "arabicExcerpt": "<อาหรับ byte-exact>",
    "loc": "เล่ม X หน้า Y", "url": "https://shamela.ws/book/12406/<pid>",
    "urlAlt": "https://ketabonline.com/ar/books/1326" }
  ```

### ★ การวางไฟล์ shard — One ตัดสินแล้ว: ทาง A (ไฟล์แยก) ✅

> **One อนุมัติ 28 มิ.ย. 2026:** ใช้ **ทาง A — ไฟล์แยก decoupled** สองเอเยนต์ = สองชุดไฟล์ แยกขาด

- **สร้างไฟล์ของตัวเอง `muntazam-hN.json`** (ช่วงก่อนฮิจญ์เราะฮ์ใช้ `muntazam-pre-NN.json` หรือสกีมที่ One กำหนด — ดูด้านล่าง) ·
  `meta.book = "al-muntazam"` · `accounts[].source = "ibn-jawzi"` · ใส่ entry ใน `index.json` แยกไฟล์
- **★ ห้ามแตะไฟล์ `bidayah-*.json`** ของ Claude/Antigravity เด็ดขาด → ศูนย์การชนไฟล์ระหว่างเอเยนต์ (R87)
- **ไฟล์เดียวที่แชร์กัน = `glossary.json`** (append-only · reuse canonicalThai เดิมเสมอ · `git pull` ก่อนทุก batch)
- การ "รวม account ibn-jawzi เข้า event ปีเดียวกับ ibn-kathir" (วิสัยทัศน์ DATA-MODEL — แท็บเทียบสำนวน) เป็นงาน
  **เฟส merge ที่ One/renderer จัดการทีหลัง** ไม่ใช่หน้าที่เอเยนต์ตอน ingest (renderer รวมได้ด้วยคีย์ hijriYear)

> **เหตุผล:** One สั่งให้เริ่มจาก *การสร้าง* (ก่อนฮิจญ์เราะฮ์) ซึ่งยังไม่มี bidayah shard อยู่แล้ว → ช่วงต้นต้องสร้างไฟล์ใหม่อยู่ดี ·
> decouple กันชนสองเอเยนต์ตาม R87 (แชร์งานผ่าน push สาขา ไม่ใช่แก้ไฟล์ทับกัน)

### ช่วงก่อนฮิจญ์เราะฮ์ (creation/prophets) — ไม่มี "hijriYear"
ต้องมีสกีมสำหรับหน่วยที่ไม่ใช่ปี ฮ.ศ. (เช่น `hijriYear: null` + `scope` บอกหัวข้อ, หรือคีย์ `era` ที่ One กำหนด) — **FLAG ถาม One** ก่อนตั้งมาตรฐาน

---

## 4. เครื่องมือ (tooling) — เหมือนกับที่ Claude ใช้

ทำงานในไดเรกทอรี `pages/tools/timemachine-data/` รันด้วย `PYTHONUTF8=1 python3 ...`

- **`scripts/tm_lib.py`** — ฟังก์ชันหลัก:
  - `fetch(book, pid)` → dict `{nass, nextId, prevId, pageId, pageNum, title}` (มี cache /tmp, retry 5)
  - `clean_main(nass)` → อาหรับล้วน ตัด HTML/chrome/เชิงอรรถ(hamesh)/ปุ่มของ Shamela ออก (R89)
  - `extract(raw, start, end)` → substring การันตี (ใช้แทน/ควบคู่ anchor helper)
  - `strip_dia(s)` → ลบฮะเราะกาต (ช่วยทำ anchor เปลือยสระ)
  - ใช้ `book=12406` เสมอ (ของคุณ) · ตรวจแล้วว่า pipeline ใช้ได้กับ 12406 (pid 99 = ذكر بداية الخلق)
- **`scripts/tm_qc.py <shard.json>`** → ตรวจกฎธรรมนูญ · exit 0 = `✓ PASS — no charter-rule errors`
  ⚠️ **tm_qc ผ่าน ≠ byte-exact ผ่าน** (R88) — ต้องตรวจ byte-gate แยกด้วยการ **re-fetch**:
- **byte-gate (R88) — บังคับทุก excerpt ก่อน push:** re-fetch หน้าต้นทางใหม่ แล้วเช็คว่า `arabicExcerpt in clean_main(fetch(12406,pid)['nass'])`
  ```python
  import json,sys; sys.path.insert(0,'scripts'); from tm_lib import fetch, clean_main
  s=json.load(open('muntazam-hN.json',encoding='utf-8')); cache={}; bad=0; n=0
  for e in s['events']:
      for a in e['accounts']:
          pid=a['url'].rstrip('/').split('/')[-1]
          if pid not in cache: cache[pid]=clean_main(fetch(12406,int(pid))['nass'])
          n+=1
          if a['arabicExcerpt'] not in cache[pid]: bad+=1; print('FAIL',e['id'])
  print(f'byte-gate: {n} excerpts, {bad} fail')
  ```

---

## 5. วิธีทำงานทีละ shard (recipe) + บทเรียนสำคัญ

**ขั้นตอนต่อหนึ่งหน่วย (บท/ปี):**
1. `git pull` ก่อนเริ่มเสมอ (กัน diverge — R87) · หา pid ขอบเขตหน่วยถัดไป
2. fetch หน้าทั้งหมดของหน่วยนั้น เก็บ `R[pid]=clean_main(fetch(12406,pid)['nass'])` + map เลขหน้า `pageNum`
3. ตัด excerpt ด้วย anchor helper `sl(pid,a,b)`:
   ```python
   def sl(pid,a,b=None):
       raw=R[pid]; i=raw.index(a); j=(raw.index(b,i)+len(b)) if b else len(raw)
       ex=raw[i:j].strip(); assert ex in raw; return ex   # b เป็น INCLUSIVE
   ```
4. แปลไทยเต็มท่อน 1:1 ลง `detail` (R89) — ความหมายแม่นตาม R75 · R5 คำกลางกับทุกคนรวมนบี ﷺ
5. ทุก person/place ที่อ้าง **ต้องอยู่ใน glossary ก่อน (R86)** — ถ้าใหม่ append เข้า `glossary.json`
6. เขียน shard JSON → `tm_qc.py` ต้อง PASS → **byte-gate ต้อง 0 fail** → commit
7. ทำหลายหน่วยแล้ว **push สาขาตัวเอง** (เช่น `claude-muntazam/...` หรือชื่อที่ One กำหนด) → เปิด PR (draft) ให้ One review/merge

**★ บทเรียน (gotchas) ที่ Claude เจอกับอัลบิดายะฮ์ — ใช้กับคุณด้วย:**
- **ขอบเขตปี false-match:** หา header ปีถัดไปด้วยสตริง **`'دخلت سنة <เลข>'` เท่านั้น** — เลขเปล่า match ผิดกลางชีวประวัติ
  ("وفاته في سنة...") ทำให้ตกท่อนวะฟิยาต · (อัลมุนตะศ็อมช่วงต้นเป็นหัวข้อ ذكر/فصل — ขอบเขตดูจาก title หน้าด้วย)
- **Anchor ต้องเปลือยสระ:** อย่าใส่คำที่มี shadda/kasra/tanwin/damma ใน anchor → "substring not found"
  ใช้คำเปลือย หรือ `strip_dia()` ช่วยหา · **a และ b ต้องอยู่ pid เดียวกัน** (ห้าม cross-page ในหนึ่ง account)
- **ห้ามเย็บข้อความคนละตำแหน่ง (R88/R60):** excerpt ต้อง **ต่อเนื่อง** เท่านั้น
- **glossary skip-logic:** ข้ามถ้า id ซ้ำ **หรือ** ฐาน canonicalThai (ก่อน ' (') ซ้ำ · ถ้าฐานซ้ำแต่คนละ id → ต้องแก้ ref ใน event ให้ชี้ id เดิม (เจอบ่อยมาก)
- **R3/S3 ห้าม em-dash/en-dash ใน detail** → ใช้ hyphen หรือวงเล็บ · **R2/S2 มิใช่→ไม่ใช่** (ยกเว้นบทกวี คง "มิใช่/ทว่า" ได้)
- **บทกวี:** ไม่แปลกลอน — แปลเฉพาะร้อยแก้ว แล้ว FLAG (PFLAG) ว่ามีบทกวีในต้นฉบับ
- **UTF-8:** อย่ารัน python ที่มีอักษรไทยผ่าน heredoc/stdin (จะ SyntaxError Non-UTF-8) — เขียนลงไฟล์ `/tmp/build_*.py` ที่มี `# -*- coding: utf-8 -*-` แล้วรัน
- **อิสนาดอัลมุนตะศ็อม:** ถ้าท่อนที่ยกมามีอิสนาดยาว ให้แปลตรงตามตัวบท (R89) — ระบุผู้รายงานตามจริง ไม่สรุปทิ้ง · ถ้าตัดสินใจยกเฉพาะมัตน์ ก็ยังต้องเป็น substring ต่อเนื่อง byte-exact

---

## 6. schema v3 (โครง shard) — คัดลอกแล้วเปลี่ยนค่า

```jsonc
{ "meta": {
    "book": "al-muntazam", "bookArabic": "المنتظم في تاريخ الملوك والأمم",
    "author": "ibn-jawzi", "edition": "ط دار الكتب العلمية (تحقيق محمد ومصطفى عبد القادر عطا)",
    "sourceBase": "https://shamela.ws/book/12406", "sourceBaseAlt": "https://ketabonline.com/ar/books/1326",
    "hijriYear": <int|null>, "ceYear": <int|null>, "ceSpan": "<...>", "schema": "v3",
    "scope": "<สรุปสั้นว่าหน่วยนี้ครอบอะไร>", "groupOrder": [ ... ],
    "reviewStatus": "DRAFT - แปลตรงจากตำรา (Rule 89)" },
  "events": [
    { "id": "muntazam-hN-001", "cat": "...", "group": "...", "order": 1,
      "title": "...", "persons": ["id1", ...], "places": ["id1", ...],
      "accounts": [ { "source": "ibn-jawzi", "detail": "...", "arabicExcerpt": "...",
                      "loc": "เล่ม X หน้า Y", "url": "https://shamela.ws/book/12406/<pid>",
                      "urlAlt": "https://ketabonline.com/ar/books/1326" } ],
      "book": "al-muntazam", "hijriYear": <int|null>, "ceYear": <int|null>,
      "type": "event", "confidence": "high", "reviewFlags": ["Rule 89: ..."] }
  ] }
```
แล้ว: append entry ใน `index.json['shards']` (`{file, book:"al-muntazam", hijriYear, events, eventsSchema:"v3", scope, reviewStatus:"DRAFT"}`)

---

## 7. ทรัพยากรที่ใช้ร่วมกัน (shared) — ระวังการชน

| ไฟล์ | สถานะ | กติกา |
|---|---|---|
| **`glossary.json`** | **แชร์ (R86)** ทั้งสองเอเยนต์ | reuse `canonicalThai` ที่มีอยู่เสมอ (ปัจจุบัน 2565 persons / 488 places) · ใหม่เท่านั้นที่ append · `git pull` ก่อนทุก batch · conflict แบบ "ต่างคนต่างเพิ่ม" One รวมง่าย (เก็บทั้งสองชุด) |
| **`sources.json`** | มี `ibn-jawzi` แล้ว | ไม่ต้องแก้ |
| **`index.json`** | แชร์ | append entry ของ shard ตัวเอง · ไฟล์ `muntazam-*` คนละชื่อ → ชนน้อย |
| **`bidayah-*.json`** | ของ Claude/Antigravity | **ห้ามแตะ** (ทาง A ที่ One เลือก) |

**R87 multi-agent:** GitHub feature branch = source of truth · แชร์งานด้วยการ **push สาขา ไม่ใช่ merge** ·
ก่อน push: self-check byte-exact (R60) + glossary lock (R86) + house-style (S1–S8) + ความหมาย (R75) · พบ violation = **FLAG** ไม่ปล่อยเงียบ

---

## 8. เช็กลิสต์ก่อน push (ทุก shard)
- [ ] `tm_qc.py <shard>` → PASS
- [ ] byte-gate → 0 fail (re-fetch จริง)
- [ ] persons/places ทุกตัวมีใน glossary · ref ตรง id
- [ ] detail แปลครบทุกประโยค ไม่สรุป (R89) · R5 คำกลาง · ไม่มี em-dash/มิใช่ (นอกบทกวี)
- [ ] `index.json` มี entry · JSON valid ทุกไฟล์
- [ ] `git pull` แล้วไม่ diverge · push สาขาตัวเอง (ไม่ใช่ main) · เปิด/อัปเดต PR (draft)
- [ ] **ไม่ merge เอง — รอ One**

---

## 9. งานแรกที่ควรทำ
1. อ่าน `CLAUDE.md` + `DATA-MODEL.md` + `sources.json` + ไฟล์นี้ให้จบ
2. เทสระบบ: `fetch(12406,99)` + `clean_main` + `tm_qc.py` กับ shard ตัวอย่างของ Claude (เช่น `bidayah-h637.json`)
3. **ถาม One ยืนยัน DECISION §3 (ทาง A/B) + สกีมก่อนฮิจญ์เราะฮ์ §3** ก่อนสร้าง shard แรก
4. เริ่มหน่วยแรก: บดุลค็อลก์ pid 99 → ทำตาม recipe §5 → QC + byte-gate → commit → push สาขา → PR draft

---
*หมายเหตุ: ตัวเลขสถานะ (2565 persons ฯลฯ) เป็น ณ วันที่ร่าง · ให้ยึดไฟล์จริงหลัง `git pull` เสมอ*
