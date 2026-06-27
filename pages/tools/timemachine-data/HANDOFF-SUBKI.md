# HANDOFF — Time Machine ingestion: ฏอบะกอต อัชชาฟิอียะฮ์ อัลกุบรอ (อัซซุบกี)

> เอกสารส่งมอบงานสำหรับ **เอเยนต์ใหม่ (คนที่ 3)** ที่จะทำงาน Time Machine ingestion แบบเดียวกับ Claude
> แต่กับตำราคนละเล่ม: **ฏอบะกอต อัชชาฟิอียะฮ์ อัลกุบรอ** ของ **ตาญุดดีน อัซซุบกี** (เสียชีวิต ฮ.ศ. 771)
> ขณะนี้มี 3 เอเยนต์เดินขนานกัน ใช้กติกาเดียวกัน (CLAUDE.md):
> - **Claude** → อัลบิดายะฮ์ วันนิฮายะฮ์ (อิบนุ กะษีร) — พงศาวดารรายปี (annal)
> - **เอเยนต์ 2** → อัลมุนตะศ็อม (อิบนุลเญาซีย์) — พงศาวดารรายปี (annal) · ดู `HANDOFF-MUNTAZAM.md`
> - **เอเยนต์ 3 (คุณ)** → ฏอบะกอต อัชชาฟิอียะฮ์ (อัซซุบกี) — **ตำราชีวประวัติ (tarajim) ← โมเดลต่างจากสองเล่มบน!**
> ร่างโดย Claude · 28 มิ.ย. 2026 · branch ของ Claude = `claude/timemachine-years-638plus`

---

## 0. กฎเหล็กข้อแรก — อ่านก่อนเริ่ม

1. **อ่าน `CLAUDE.md` ทั้งไฟล์ (90 กฎ + S1–S8 + Push discipline)** ให้จบก่อนแตะงานใดๆ — single source of truth
   ★ **กฎ 71 (Child-Safety Override) อ่านก่อนเป็นข้อแรก** — เหนือกฎ fidelity/coverage ทุกข้อ
2. **กฎที่เกี่ยวข้องโดยตรง:** R86 (glossary lock), R88 (byte-exact gate + sources registry),
   R89 (แปลตรงเต็มท่อน ไม่สรุป + R5 คำกลาง), R5 (ห้ามราชาศัพท์กับมนุษย์รวมนบี ﷺ — royal เฉพาะอัลลอฮ์),
   R52 (อิบนุ/อบู เว้นวรรค · อิบนุล/อบุล เชื่อม), R73 (corpus-dominant), R12/12.1/12.2,
   R75 (แปลถูกความหมาย), R60 (อาหรับ byte-exact), R9 (ปีเสียชีวิตในวงเล็บ)
3. **ความปลอดภัย (Push & safety discipline — ห้ามฝ่าฝืน):**
   - ห้ามอ่าน/ใช้ credential/token จาก config/env/disk ไปเรียก API ตรง · ห้ามเลี่ยง proxy/guardrail
   - push ล้มเหลว (503 / payload / auth) = **STOP แล้วรายงาน** ห้ามหาช่องทางอื่น
   - **ห้าม force-push · ห้ามสร้างเนื้อไฟล์จากความจำแชต** (อ่านจาก git tree จริง)
   - ส่งงานผ่าน **feature branch → PR → human review → merge** เท่านั้น · push main ตรงถูกบล็อก (503)
4. **★ เอเยนต์ห้าม merge `main` เด็ดขาด (R74/R87) — เฉพาะ One (เจ้าของ) เท่านั้น ★** · ห้าม Purge Everything

---

## 1. ภารกิจ

แปลตำรา **ฏอบะกอต อัชชาฟิอียะฮ์ อัลกุบรอ** เป็นไทย ทำเป็นข้อมูล Time Machine โดย **แปลตรงจากตัวบทจริงครบทุกประโยค (R89)**
ทุก excerpt อาหรับต้อง **byte-exact substring** ของแหล่ง (R88) · ทับศัพท์ทุกชื่อตาม **glossary กลาง (R86)** ·
ผ่าน QC ธรรมนูญ (`tm_qc.py`) + byte-gate ทุกหน่วยก่อน push

**เริ่มจาก:** **มุก็อดดิมะฮ์ (บทนำของผู้เขียน — المقدمة)** ที่ Shamela pid **1** (ตามที่ One กำหนด)
แล้วเดินหน้าตามลำดับเล่ม: บทนำ → ฏอบะกอตชั้นที่ 1 (สหายอิหม่ามชาฟิอี) → ชั้นถัด ๆ ไป (ชีวประวัติปราชญ์ชาฟิอีเรียงตามชั้น/รุ่น)

---

## 2. แหล่งของคุณ (locked source)

| | |
|---|---|
| **ตำรา** | طبقات الشافعية الكبرى |
| **ผู้แต่ง** | ตาญุดดีน อับดุลวะฮ์ฮาบ บิน อะลี อัซซุบกี — เสียชีวิต ฮ.ศ. 771 |
| **ฉบับพิมพ์** | ط دار هجر (تحقيق محمود محمد الطناحي - عبد الفتاح محمد الحلو) — ⚑ ยืนยันหน้าปก/ฉบับจาก Shamela ก่อนล็อกใน meta.edition |
| **source id (ใน sources.json)** | **`al-subki-tabaqat`** ← ใช้ค่านี้ในฟิลด์ `source` (ลงทะเบียนไว้แล้ว ไม่ต้องเพิ่ม) |
| **★ ชนิดแหล่ง (sources.json)** | **`tarajim`** (ตำราชีวประวัติ — ผูกกับ **บุคคล** ไม่ใช่ปี · ดู §3) |
| **Shamela book** | **6739** · เริ่ม pid 1 (`https://shamela.ws/book/6739/1`) |

⚠️ **อัซซุบกีต่างจากอัลบิดายะฮ์/อัลมุนตะศ็อม 2 อย่าง:**
- **เป็นตำราชีวประวัติ (tarajim) ไม่ใช่พงศาวดารรายปี** → หน่วยข้อมูลคือ "ชีวิตบุคคล" ผูกกับ glossary.persons ไม่ใช่ "เหตุการณ์ปี" (ดู §3 ให้ละเอียด)
- **อิสนาด (สายรายงาน) หนาแน่น + ฮะเราะกาตเต็ม** (เหมือนอัลมุนตะศ็อม) → anchor ของ `sl()` ต้องทนฮะเราะกาต (ดู §5)

---

## 3. ★ โมเดลข้อมูล — อ่าน `DATA-MODEL.md` + `sources.json` ให้ครบ (จุดที่ต่างจากเอเยนต์ annal)

`DATA-MODEL.md §1` แบ่งตำราเป็น 2 ธรรมชาติ:
- **annal (พงศาวดารรายปี):** อัลบิดายะฮ์/อัลมุนตะศ็อม → ผูกกับ **EVENT** → `event.accounts[]` (แท็บเทียบสำนวนในปีเดียวกัน)
- **tarajim (ชีวประวัติ/ฏอบะกอต):** **ฏอบะกอตอัซซุบกี (เล่มของคุณ)** → ผูกกับ **PERSON** → `glossary.persons[].tarajim[]`

`DATA-MODEL.md §3.3` schema ของ tarajim ต่อบุคคล:
```jsonc
"al-juwayni": {                    // person id ใน glossary
  "arabic": "...", "canonicalThai": "อัลญุวัยนี",
  "tarajim": [
    { "source": "al-subki-tabaqat", "loc": "ج.../ص ...", "url": "https://shamela.ws/book/6739/<pid>" }
  ]
}
```
→ renderer แสดงเป็น **ลิงก์ชีวประวัติ** ในบล็อก "บุคคลสำคัญ" ของทุกเหตุการณ์ที่บุคคลนี้ปรากฏ ·
`§3.4` **เหตุการณ์ "ผู้วายชนม์" (วะฟิยาต) เป็นสะพานเชื่อม:** ที่เหตุการณ์วะฟิยาต อนุญาตให้ tarajim ขึ้นเป็น
**account/แท็บ** ได้ด้วย (แท็บ "อัซซุบกี" ที่มี excerpt ชีวประวัติ byte-exact + คำแปลไทยเต็ม)

### ★ การวางไฟล์ — One ตัดสินแล้ว: ทาง A (ไฟล์แยก decoupled) ✅
> เหมือนเอเยนต์อัลมุนตะศ็อม — 3 เอเยนต์ = 3 ชุดไฟล์ แยกขาด ไฟล์เดียวที่แชร์ = `glossary.json`

- **สร้างไฟล์ของตัวเอง `subki-NNN.json`** (เรียงตามลำดับเล่ม/ชั้นฏอบะกอต) · `meta.book = "al-subki-tabaqat"` ·
  แต่ละ "หน่วย" = **ชีวประวัติหนึ่งคน** (หรือกลุ่มในหน้าเดียว) เก็บเป็น entry ที่มี `person` (id ใน glossary),
  `arabicExcerpt` (byte-exact), `detail` (คำแปลไทยเต็ม), `loc`, `url`, `source:"al-subki-tabaqat"`
- **★ ห้ามแตะไฟล์ `bidayah-*.json` / `muntazam-*.json`** ของเอเยนต์อื่น → ศูนย์การชนไฟล์
- **ไฟล์เดียวที่แชร์ = `glossary.json`** — เพิ่มบุคคล/สถานที่ **ใหม่** แบบ append-only · reuse `canonicalThai` เดิมเสมอ · `git pull` ก่อนทุก batch
- การ **wire ชีวประวัติเข้า `glossary.persons[].tarajim[]`** และเป็น **แท็บในเหตุการณ์วะฟิยาต** (วิสัยทัศน์ §3.3/§3.4)
  = งาน **เฟส merge ที่ One/renderer จัดการทีหลัง** ไม่ใช่หน้าที่เอเยนต์ตอน ingest (กันแก้ persons[] ทับกันสามเอเยนต์)

### มุก็อดดิมะฮ์ (บทนำ) — ไม่ใช่ชีวประวัติ
บทนำของผู้เขียน (เนื้อหาเชิงระเบียบวิธี/เทววิทยา/อิสนาด) ไม่ผูกกับบุคคลใดบุคคลหนึ่ง → ต้องมีสกีมสำหรับ "หน่วยบทนำ"
(เช่น `subki-intro-NN.json` ที่ `type:"preface"` ไม่มี `person`) — **FLAG ถาม One** ก่อนตั้งมาตรฐาน (เหมือนช่วงก่อนฮิจญ์เราะฮ์ของอัลมุนตะศ็อม)

---

## 4. เครื่องมือ (tooling) — เหมือนเอเยนต์อื่น

ทำงานในไดเรกทอรี `pages/tools/timemachine-data/` รันด้วย `PYTHONUTF8=1 python3 ...`

- **`scripts/tm_lib.py`**: `fetch(book, pid)` → `{nass, nextId, prevId, pageId, pageNum, title}` · `clean_main(nass)` → อาหรับล้วน (ตัด HTML/chrome/hamesh) · `extract(raw, start, end)` → substring การันตี · `strip_dia(s)` → ลบฮะเราะกาต · ใช้ `book=6739` เสมอ (ตรวจแล้ว pipeline ใช้ได้: pid 1 = المقدمة)
- **`scripts/tm_qc.py <shard.json>`** → exit 0 = `✓ PASS` (สแกนทั้ง dataset; มองหา ERROR ของไฟล์คุณ — WARN ของไฟล์อื่นไม่นับ)
- **byte-gate (R88) บังคับทุก excerpt ก่อน push** (tm_qc ผ่าน ≠ byte-exact ผ่าน — ต้อง re-fetch):
  ```python
  import json,sys; sys.path.insert(0,'scripts'); from tm_lib import fetch, clean_main
  s=json.load(open('subki-001.json',encoding='utf-8')); cache={}; bad=0; n=0
  for e in s['events']:
      for a in e['accounts']:
          pid=int(a['url'].rstrip('/').split('/')[-1])
          if pid not in cache: cache[pid]=clean_main(fetch(6739,pid)['nass'])
          n+=1
          if a['arabicExcerpt'] not in cache[pid]: bad+=1; print('FAIL',e['id'])
  print(f'byte-gate: {n} excerpts, {bad} fail')
  ```

---

## 5. วิธีทำงานทีละหน่วย (recipe) + บทเรียนสำคัญ

**ขั้นตอนต่อหนึ่งชีวประวัติ:**
1. `git pull` ก่อนเริ่มเสมอ (กัน diverge — R87) · หา pid ของชีวประวัติถัดไป (title หน้าจะบอกชื่อเจ้าของประวัติ)
2. fetch หน้าทั้งหมดของชีวประวัตินั้น เก็บ `R[pid]=clean_main(fetch(6739,pid)['nass'])` + map เลขหน้า/เล่ม
3. ตัด excerpt ด้วย anchor helper **ทนฮะเราะกาต** (สำคัญมากเพราะอัซซุบกีลงสระหนัก):
   ```python
   from tm_lib import strip_dia
   DEL=set(range(0x064B,0x0653))|{0x0640,0x0670}
   def _norm(c): return 'ا' if ord(c) in (0x0623,0x0625,0x0622,0x0671) else c
   def _strip(raw):
       s=[];idx=[]
       for k,ch in enumerate(raw):
           if ord(ch) in DEL: continue
           s.append(_norm(ch)); idx.append(k)
       return ''.join(s),idx
   def sl(pid,a=None,b=None):           # คืน substring byte-exact จาก raw แต่ match แบบไม่สนฮะเราะกาต
       raw=R[pid]; s,idx=_strip(raw)
       i_s=s.index(''.join(_norm(c) for c in a if ord(c) not in DEL)) if a else 0
       raw_i=idx[i_s] if a else 0
       if b:
           nb=''.join(_norm(c) for c in b if ord(c) not in DEL); raw_j=idx[s.index(nb,i_s)+len(nb)-1]+1
       else: raw_j=len(raw)
       ex=raw[raw_i:raw_j].strip(); assert ex in raw; return ex
   ```
4. แปลไทยเต็มท่อน 1:1 ลง `detail` (R89) — ความหมายแม่นตาม R75 · R5 คำกลางกับทุกคน (ถือกำเนิด/เสียชีวิต ไม่ใช่ประสูติ/สิ้นพระชนม์)
5. ทุก person/place ที่อ้าง **ต้องอยู่ใน glossary ก่อน (R86)** — เจ้าของประวัติ + คนที่เอ่ยถึง · ใหม่ → append เข้า `glossary.json`
6. เขียน shard JSON → `tm_qc.py` PASS → **byte-gate 0 fail** → commit
7. ทำหลายหน่วยแล้ว **push สาขาตัวเอง** (เช่น `claude-subki/...` หรือชื่อที่ One กำหนด) → PR (draft) ให้ One review/merge

**★ บทเรียน (gotchas) จากงานอัลบิดายะฮ์ — ใช้กับคุณด้วย:**
- **Anchor ต้องทนฮะเราะกาต:** ใช้ตัวจับแบบ §5 (อย่าใส่คำที่มี shadda/kasra/tanwin ตรง ๆ) · **a และ b ต้องอยู่ pid เดียวกัน** (ห้าม cross-page ในหนึ่ง account) · ระวัง **วงเล็บ `[...]` ของฉบับพิมพ์** คั่นใน text — เลี่ยง anchor ที่คร่อมวงเล็บ
- **ห้ามเย็บข้อความคนละตำแหน่ง (R88/R60):** excerpt ต้อง **ต่อเนื่อง** เท่านั้น
- **glossary skip-logic:** ข้ามถ้า id ซ้ำ **หรือ** ฐาน canonicalThai (ก่อน ' (') ซ้ำ · ★ถ้าฐานซ้ำแต่คนละ id → ต้องแก้ ref ให้ชี้ id เดิม (เจอบ่อยมาก — เช่นชื่อปราชญ์ที่มีหลายคนชื่อคล้าย ต้องตั้งฐานให้ต่างกัน)
- **R3/S3 ห้าม em-dash/en-dash** ใน detail/title/scope/reviewFlags (tm_qc สแกน reviewFlags ด้วย) → ใช้ hyphen "-"
- **R2/S2 มิใช่→ไม่ใช่** (ยกเว้นบทกวี) · **R5 ห้ามราชาศัพท์** (พระราชโองการ/ประสูติ/สิ้นพระชนม์/เสด็จ ฯลฯ) กับมนุษย์ — แม้เคาะลีฟะฮ์/สุลฏอน ใช้คำกลาง
- **บทกวี:** ไม่แปลกลอน — แปลเฉพาะร้อยแก้ว แล้ว FLAG (มีบทกวีในชีวประวัติบ่อย)
- **UTF-8:** อย่ารัน python ที่มีอักษรไทยผ่าน heredoc/stdin (จะ SyntaxError) — เขียนลงไฟล์ `/tmp/build_*.py` ที่มี `# -*- coding: utf-8 -*-` แล้วรัน
- **อิสนาดอัซซุบกี:** แปลตรงตามตัวบท (R89) ระบุผู้รายงานตามจริง ไม่สรุปทิ้ง · ถ้ายกเฉพาะมัตน์ชีวประวัติก็ยังต้องเป็น substring ต่อเนื่อง byte-exact

---

## 6. schema (โครงไฟล์) — คัดลอกแล้วเปลี่ยนค่า

```jsonc
{ "meta": {
    "book": "al-subki-tabaqat", "bookArabic": "طبقات الشافعية الكبرى",
    "author": "al-subki", "edition": "ط دار هجر (تحقيق الطناحي - الحلو)",   // ⚑ ยืนยันจากหน้าปก
    "sourceBase": "https://shamela.ws/book/6739", "schema": "v3",
    "tabaqaLayer": <int|null>,                 // ชั้นฏอบะกอต (null = บทนำ)
    "scope": "<สรุปสั้นว่าหน่วยนี้คือชีวประวัติใคร/บทนำส่วนใด>", "reviewStatus": "DRAFT - แปลตรงจากตำรา (Rule 89)" },
  "events": [                                  // ใช้ key 'events' ให้ tm_qc อ่านได้ (แต่ละ entry = 1 ชีวประวัติ)
    { "id": "subki-001-001", "cat": "ชีวประวัติ", "group": "ฏอบะกอตชั้นที่ N", "order": 1,
      "title": "<ชื่อเจ้าของประวัติ + (เสียชีวิต ฮ.ศ. ...)>",
      "person": "<person-id ใน glossary>",     // ★ tarajim ผูกกับบุคคล
      "persons": ["<person-id>", ...], "places": [...],
      "accounts": [ { "source": "al-subki-tabaqat", "detail": "<คำแปลไทยเต็ม>",
                      "arabicExcerpt": "<อาหรับ byte-exact>",
                      "loc": "เล่ม X หน้า Y", "url": "https://shamela.ws/book/6739/<pid>" } ],
      "book": "al-subki-tabaqat", "type": "tarajim", "confidence": "high", "reviewFlags": ["Rule 89: ..."] }
  ] }
```
แล้ว: append entry ใน `index.json['shards']` (`{file, book:"al-subki-tabaqat", tabaqaLayer, events, eventsSchema:"v3", scope, reviewStatus:"DRAFT"}`)

---

## 7. ทรัพยากรที่ใช้ร่วมกัน (shared) — ระวังการชน

| ไฟล์ | สถานะ | กติกา |
|---|---|---|
| **`glossary.json`** | **แชร์ (R86)** ทั้งสามเอเยนต์ | reuse `canonicalThai` ที่มีอยู่เสมอ · ใหม่เท่านั้นที่ append · `git pull` ก่อนทุก batch · ★**อย่าแก้ `tarajim[]` ของ person เดิมตอน ingest** (เลี่ยงแก้ persons[] ทับกัน → เฟส merge ของ One) · conflict แบบต่างคนต่างเพิ่ม One รวมง่าย |
| **`sources.json`** | มี `al-subki-tabaqat` แล้ว | ไม่ต้องแก้ |
| **`index.json`** | แชร์ | append entry ของ shard ตัวเอง (`subki-*`) → ชนน้อย |
| **`bidayah-*` / `muntazam-*`** | ของเอเยนต์อื่น | **ห้ามแตะ** |

**R87 multi-agent:** GitHub feature branch = source of truth · แชร์งานด้วยการ **push สาขา ไม่ใช่ merge** ·
ก่อน push: self-check byte-exact (R60) + glossary lock (R86) + house-style (S1–S8) + ความหมาย (R75) · พบ violation = **FLAG** ไม่ปล่อยเงียบ

---

## 8. เช็กลิสต์ก่อน push (ทุก shard)
- [ ] `tm_qc.py <shard>` → PASS (ไม่มี ERROR ของไฟล์คุณ)
- [ ] byte-gate → 0 fail (re-fetch จริง book 6739)
- [ ] เจ้าของประวัติ + persons/places ทุกตัวมีใน glossary · ref ตรง id · `person` ตั้งถูก
- [ ] detail แปลครบทุกประโยค ไม่สรุป (R89) · R5 คำกลาง · ไม่มี em-dash/มิใช่/ราชาศัพท์ (นอกบทกวี)
- [ ] `index.json` มี entry · JSON valid ทุกไฟล์
- [ ] `git pull` แล้วไม่ diverge · push สาขาตัวเอง (ไม่ใช่ main) · เปิด/อัปเดต PR (draft)
- [ ] **ไม่ merge เอง — รอ One**

---

## 9. งานแรกที่ควรทำ
1. อ่าน `CLAUDE.md` + `DATA-MODEL.md` (เน้น §1, §3.3, §3.4 เรื่อง tarajim) + `sources.json` + ไฟล์นี้ให้จบ
2. เทสระบบ: `fetch(6739,1)` + `clean_main` + `tm_qc.py` กับ shard ตัวอย่างของ Claude (เช่น `bidayah-h637.json`)
3. **ถาม One ยืนยัน:** (ก) สกีมหน่วย "บทนำ/มุก็อดดิมะฮ์" §3 · (ข) ยืนยันฉบับพิมพ์ (edition) ที่หน้าปก Shamela 6739
4. เริ่มหน่วยแรก: มุก็อดดิมะฮ์ pid 1 → ทำตาม recipe §5 → QC + byte-gate → commit → push สาขา → PR draft

---
*หมายเหตุ: สถานะ glossary (จำนวน persons/places) เป็น ณ วันที่ร่าง · ให้ยึดไฟล์จริงหลัง `git pull` เสมอ · โมเดล tarajim ต่างจาก annal — ถ้าสงสัยให้ FLAG ถาม One ไม่เดา (R3/R86)*
