# Time Machine — HANDOFF: เล่ม 12 เสร็จสมบูรณ์ (al-Bidayah wa al-Nihayah)

> วางไว้เพื่อ resume งานได้แม้ประวัติแชทไม่อยู่ (เช่น หลังเปลี่ยน API key) — อัปเดต 2026-06-26

## ✅ สถานะ: เล่ม 12 จบเล่มแล้ว

- **เล่ม 12 = ปี ฮ.ศ. 1 → 500 ครบทุกปี · รวม 491 shards** (`bidayah-h{1..500}.json`, เว้นปีว่าง 8 ปีที่ต้นฉบับไม่มี: 30/32/38/42/52/58/82/92)
- branch: **`claude/timemachine-years-1-100`** — push ที่นี่เท่านั้น · **One ทำ merge เข้า main เอง · agent ห้าม merge** (กฎ 74/87)
- ปีปิดเล่ม 500 commit `42f767d` · ดู `git log` สำหรับ HEAD ล่าสุด

### ขอบเขตเล่ม
- Shamela book id **30097** vol 12 → **pid 6131 = หน้าสุดท้าย** (จบด้วย `* * *`), pid 6132 = หน้าปกเล่มถัดไป
- ปี 500 = pid 6127→6131 · ไม่มี header ปี 501 ในเล่มนี้ (500 เป็นปีสุดท้าย)

## ▶️ ทำต่อยังไง (ถ้า One สั่งทำเล่มถัดไป — ปี 501+)
1. เล่มใหม่เริ่ม pid **6132+** → หา pid ที่มี `سنة إحدى وخمسمئة` (501) แล้วทำต่อด้วย harness เดิม
2. เป็น **เล่มใหม่** ไม่ใช่ขอบเขต /goal "จบเล่ม" เดิม — รอ One ยืนยันก่อนเริ่ม

## 🛠 harness ต่อปี
```
cd ~/islamicfiqhpublishing/pages/tools/timemachine-data
# 1) อ่านหน้า via tm_lib.fetch(30097,pid)+clean_main()
# 2) เขียน /tmp/build_hN.py: extract() byte-exact + แปลไทย 1:1 (กฎ 89) + เพิ่ม glossary/index
# 3) PYTHONUTF8=1 python3 /tmp/build_hN.py
# 4) python3 scripts/tm_qc.py bidayah-hN.json  → ต้อง PASS (exit 0)
# 5) byte-gate: ทุก arabicExcerpt ต้องเป็น substring ของ clean_main(fetch(pid))
# 6) git commit (ลงท้าย Co-Authored-By: Claude Opus 4.8 (1M context)) + push branch
# 7) อัปเดต memory pointer (~/.claude/.../memory/islamicfiqh-antigravity-handoff.md)
```

## 📐 กฎสำคัญที่ต้องเคร่ง (อ่าน CLAUDE.md เต็มทุกครั้ง)
- **กฎ 89:** แปลตรงเต็มทุกประโยค ไม่สรุป · arabicExcerpt=อาหรับล้วน byte-exact contiguous substring · detail=แปลไทย 1:1
- **กฎ 60/88:** byte-exact substring ผ่าน re-fetch (QC ผ่าน ≠ byte-exact ผ่าน — ตรวจแยก)
- **กฎ 86:** glossary lock — persons/places ลงทะเบียนก่อนอ้าง · canonicalThai ห้ามซ้ำหลัง paren-strip (ซ้ำ→ใส่ชื่อใน base)
- **กฎ 11:** sun-letter/ชัมซียะฮ์ + อิบนุล/อบุล เชื่อม
- **กฎ 52:** เว้นวรรค อิบนุ/อบู · ระวัง false-positive คำที่มี substring "อบู"/"อบูร" (al-Khabur→คาบูร ใช้ า ไม่ใช่ คอบูร)
- **กฎ 12.1:** صحيح → **"ศอเฮี้ยะฮ์"** เท่านั้น (ศอเฮี้ยะฮ์อัลบุคอรี/มุสลิม/ทั้งสอง) — กวาดแก้ทั้ง corpus แล้ว 2026-06-26
- **กฎ 12.2:** مذهب → **"มัสฮับ"** (tm_qc R6)
- **กฎ 5/89:** คำกลางกับมนุษย์ทุกคนรวมนบี ﷺ (ถือกำเนิด/เสียชีวิต/วะฟาต) · ราชาศัพท์ (พระองค์/ทรง) เฉพาะอัลลอฮ์
- **กฎ 75:** polysemy قام/خرج/أقام/الصائفة/بايع แปลตามบริบท
- **House-style:** ห้าม em/en-dash (—/–) แม้ใน reviewFlags · ไม้ยมก ๆ เว้นวรรคหลัง · ใช้ "แต่/ไม่ใช่"

## 🔒 กฎ 71 (Child-Safety) — One ตัดสินแล้ว
- `h478-004` (วะฟิยาตอิบนุลวะลีด เชคมุอ์ตะซิละฮ์, หน้า 6068): **One ตัดสินให้คงต้นฉบับ/แปลเต็มตามกฎ 89** (เป็นตำราคลาสสิกที่อิบนุ กะษีรยกทัศนะมุอ์ตะซิละฮ์มาเพื่อหักล้าง, "วิลดาน"=สภาวะอัลกุรอาน ไม่ใช่เด็กจริง) → **คืนคำแปลเต็มแล้ว**, ลบ child-safety flag
- **แนวปฏิบัติต่อไป:** เนื้อหาที่ทำให้**ผู้เยาว์จริง**เป็นวัตถุทางเพศ → DROP+flag+route ต่อ One (กฎ 71 ยังบังคับ); ตำราเชิงเทววิทยา/ประวัติศาสตร์ที่ยกมาเพื่อวิจารณ์ ไม่เข้าข่าย

## 🗂 ไฟล์สำคัญ (ใน pages/tools/timemachine-data/)
- `bidayah-h{N}.json` (schema v3: meta + events[].accounts[]) · `glossary.json` (lock กฎ 86) · `index.json` (total 491)
- `scripts/tm_lib.py` (fetch/clean_main/extract) · `scripts/tm_qc.py` (exit 0=PASS)
- memory pointer: `~/.claude/projects/-Users-fauci/memory/islamicfiqh-antigravity-handoff.md`
- handoff เก่า (อ้างอิงประวัติ): `HANDOFF.md`, `HANDOFF-al-bidayah.md`, `HANDOFF-YEARS-1-100.md`, `DATA-MODEL.md`

## ↩️ Resume เซสชันบนเครื่องเดิม
ประวัติแชทเก็บใน `~/.claude/projects/-Users-fauci/a5920e55-*.jsonl` (ผูกกับ**เครื่อง** ไม่ผูกกับ API key)
→ `claude --continue` (ต่อเซสชันล่าสุด) หรือ `claude --resume` (เลือกเซสชัน) บนเครื่องเดิม **จะเห็นประวัตินี้** แม้เปลี่ยน API key
(API key = auth/billing เท่านั้น ไม่กระทบ session บนดิสก์) · งานจริงทั้งหมด durable ใน git + ไฟล์นี้
