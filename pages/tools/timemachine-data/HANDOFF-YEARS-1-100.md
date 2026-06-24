# HANDOFF — al-Bidayah ปี ฮ.ศ. 1–100 (Time Machine ingestion)

> สถานะ ณ 2026-06-24/25 · branch `claude/timemachine-years-1-100` HEAD `890d55d` · origin/main `14c5dc7`
> รับช่วงจาก Antigravity (years 1–100) — ทำใหม่ทั้งหมดตามมาตรฐาน **Rule 89** (อาหรับ byte-exact)

---

## 1. งานคืออะไร
แปลพงศาวดาร **al-Bidayah wa al-Nihayah** (Ibn Kathir, Shamela book **30097**) ปี ฮ.ศ. 1–100 ลง Time Machine
- แต่ละ "เหตุการณ์" = สรุปไทยตรงตามตำรา + `arabicExcerpt` ที่เป็น **substring byte-exact** ของหน้า Shamela จริง
- 1 ปี = 1 ไฟล์ shard `bidayah-h{ปี}.json` (มี `meta` + `events[]`)
- ทุก shard ลงทะเบียนใน `index.json`; บุคคล/สถานที่ลงใน `glossary.json`

## 2. สถานะปัจจุบัน — 85/100 ปี
- **มี:** 1–21, 23–28, 31, 33–37, 40, 41, 43–49, 51, 53–57, 59–69, 71, 73–81, 83–89, 91, 93–100
- **ขาด 15 ปี:** `22, 29, 30, 32, 38, 39, 42, 50, 52, 58, 70, 72, 82, 90, 92`
- **ต้องทำใหม่ (ยังเป็นโมเดลสรุปเก่า ไม่ใช่ Rule 89):** ปี **94, 95, 96** (97–100 ทำใหม่แล้ว)
- 285 shards · 554 เหตุการณ์ · 557 accounts · ทุกก้อน **tm_qc PASS + byte-gate PASS**
- ต่อเนื่องจริงปี 1→21 (สีเราะฮ์ลึก), จากนั้นเป็นเหตุการณ์ใหญ่รายปี

## 3. ★ แผนที่นำทาง source (สำคัญที่สุด) ★
pid offset (= pid − pageNum) **กระโดดทุกเล่ม** — ต้อง re-derive ที่ขอบเล่มโดยอ่าน `pageNum` จาก `fetch()`:

| เล่ม | offset (pid = น. + X) | ครอบคลุมปี |
|---|---|---|
| vol9  | **+1489** | สีเราะฮ์ ปี 1–9 (มะฆอซี) |
| vol10 | **+2184** | สีเราะฮ์ ปี 9–11 + การจากไป (pid2208=ص24) |
| vol11–12 | +2709 / +3146 | ชะมาอิล/ดะลาอิล/มะนากิบ (ไม่ใช่พงศาวดารรายปี) + **พงศาวดารรอชิดีนเริ่ม vol12 off+3146 ที่ pid3151 (خلافة أبي بكر)** |
| vol12 | **+3146** | ปี 12–40 (รอชิดีน) |
| vol13 | **+3761** | ปี 41–65 (อุมัยยะฮ์ตอนต้น) |
| vol14 | **+4123** | ปี 66–100 |
| vol15 | **+4513** | ปี 101+ (งานเก่า) |

**Year markers ที่ทราบ (ใช้หาเร็ว):**
vol12: Y12=pid3208, Y13=3228, Y14=3252, Y15=3259, Y16=3303/hdr3314, Y17=3329, Y18=3348, Y19=3356, Y20=3360, Y23=3404, Y24=3426, Y26=3434, Y28=3436, Y31=3442, Y33=3454, Y35=3460, Y36=3566, Y37=3589, Y39=3680, Y40=3691
vol13: Y41=3769, Y43=3774, Y44=3780, Y45=3783, Y46=3787, Y49=3792, Y51=3824, Y53=3845, Y60=3980, Y62=4063, Y63=4068, Y64=4078, Y65=4114
vol14: Y66=4134, Y67=4156, Y68=4172, Y69=4193, Y71=4205, Y73=4241, Y74=4253...Y79=4290, Y80=4296, Y81=4301, Y83=4319...Y89=4362, Y91=4368, Y93=4373, Y95=4420, Y97=4484, Y98=4490, Y99=4494, Y100=pid4509(ص386), Y101=pid4518(vol15)

**หาปีใหม่:** `for pid in range(...): t=clean_main(fetch(30097,pid)['nass']); strip_dia ค้น "ثم دخلت سنة N" / "[سنة N]"` — early-futuh หนาแน่น (~6 pid/yr), ยุคหลังบางลง

## 4. วิธีสร้าง 1 เหตุการณ์ (per-event workflow)
```
1) อ่านหน้า: clean_main(fetch(30097, pid)['nass'])
2) extract byte-exact: tm_lib.extract(C, START_anchor, END_anchor)  → R; assert R in C
3) แปลไทย Rule 89 (ดูข้อ 5) + sanitize title (.replace em-dash, อบู/อิบนุ เว้นวรรค)
4) glossary: lookup id ด้วยชื่อ EXACT (split(' (')[0]) — อย่าใช้ substring (จับญาติผิดคน!)
5) เขียน bidayah-h{ปี}.json (meta+event) + เพิ่ม index.json + glossary.json
6) ★ tm_qc ใน bash block แยก ★ → อ่านผล ต้อง "PASS" (ไม่มี ERROR)
7) byte-gate แยก: arabicExcerpt in clean_main(fetch(...))  → True
8) commit + push ใน block แยก (อย่าเชน tm_qc กับ commit!)
```
**Batch ได้** (เร็วกว่า): หา markers หลายปี → อ่าน → สร้างทีละหลาย shard ใน script เดียว → QC ครั้งเดียว → byte-gate batch → commit รวม

## 5. กติกาคุณภาพ (charter + Rule 89)
- **R89:** arabicExcerpt = pure Arabic byte-exact (ผ่าน clean_main/extract); ห้าม hand-type/แก้อาหรับ
- **R5 คำกลาง:** การจากไปของท่านนบี/เคาะลีฟะฮ์ ใช้ "สิ้นชีพ/ถึงแก่กรรม" (ห้าม สิ้นพระชนม์/ประสูติ); "ทรง" เฉพาะอัลลอฮ์
- **R1/R2:** ห้าม "ทว่า"→ใช้ "แต่"; ห้าม "มิใช่"→ใช้ "หาใช่...ไม่ / ไม่ใช่"
- **R3:** ห้าม em/en-dash → "-" (sanitize ทั้ง title และ detail)
- **R52:** "อบู"/"อิบนุ" + พยัญชนะ ต้องเว้นวรรค (อบู บักร, อิบนุ อุมัร); "อบี/อะลี/อบุล(สระสั้น)" ผ่าน
- **R86:** ทุก id ใน persons[]/places[] ต้องมีใน glossary; ห้ามชื่อ canonicalThai ซ้ำ
- **POETRY (qasida/rajaz) = ไม่แปล** เก็บแค่ร้อยแก้ว
- **gloss ทับศัพท์** (feedback ล่าสุด): ครั้งแรกที่ใช้ → ใส่ความหมายไทยในวงเล็บ
  - ฆอซวะฮ์(การศึก) [กลางทุกยุค — อย่าใส่ "ท่านนบีนำเอง" เพราะถูกเฉพาะปี1-11]
  - สะรียะฮ์(กองกำลังที่ส่งไป), ฟุตูห/ฟุตูหาต(การพิชิต), ญิซยะฮ์(ภาษีคุ้มครอง), เคาะรอจ(ภาษีที่ดิน), คุมุส(หนึ่งในห้า), อัศศออิฟะฮ์(กองทัพหน้าร้อน), ซิมมะฮ์(พันธะคุ้มครอง), ตัลบิยะฮ์, กุรรออ์(นักอ่านกุรอาน)
  - group label: "มะฆอซี · ฆอซวะฮ์"→"การศึก (ฆอซวะฮ์)" ฯลฯ (ต้อง sync ทั้ง field group + meta.groupOrder)

## 6. ★ บทเรียน (กับดักที่เคยเจอ) ★
- **glossary substring จับผิดคน:** "yazid-b-muawiya" เผลอ match "atika-bint-yazid" (ลูกสาว); "มัสละมะฮ์" match maslama-b-abd-al-malik (คนอื่น) → ใช้ EXACT split(' (')[0]==name เสมอ
- **id ที่มีอยู่แล้ว (จากงาน 101-300) — เช็คก่อนเพิ่ม:** iraq (NOT al-iraq), damascus (canonicalThai="ดิมัชก์ (ดามัสกัส)"), bayt-al-maqdis, ibn-al-zubayr, al-hajjaj, abd-al-malik-b-marwan, umar-b-abd-al-aziz, maslama-b-abd-al-malik ฯลฯ
- **ห้ามลบ glossary entry ที่ถูกอ้างอิง** (เคยลบ damascus พัง 23 refs)
- **R86 duplicate place name:** balqa/al-balqa, อิรัก ซ้ำ → dedup ใช้ id เดิม
- **commit-gate:** อย่าเชน tm_qc กับ git commit ใน block เดียว (echo ไม่ gate) — แยก block อ่านผลก่อน
- **ปี 94-100 มี shard เก่าอยู่แล้ว** — การ "สร้าง" = OVERWRITE (shard count ไม่เพิ่ม, accounts อาจลด)

## 7. การแสดงผล + การ merge
- เรนเดอร์ `pages/tools/hijri-time-machine.html` **fetch JSON static ฝั่ง client** (index.json→shards→glossary), **ไม่มีตัวกรอง DRAFT** → merge เข้า main + Cloudflare deploy = **ขึ้นทันที**, graceful degradation
- **branch พร้อม merge สะอาด** (merge origin/main ล่าสุดเข้าแล้ว ไม่ conflict → fast-forward ได้)
- ⚠️ **ทำ merge เองไม่ได้:** gh ไม่มี · GitHub PR API 403 · push ตรง main ถูก guardrail บล็อก → **เจ้าของต้อง merge เอง** (เปิด PR claude/timemachine-years-1-100 → main บน GitHub แล้วกด Merge)
- 123 R86 **warnings** (ชื่อบุคคลในเนื้อหาไม่ได้ลิงก์ persons[]) = ไม่บล็อก แสดงผลปกติ

## 8. งานที่เหลือ — สถานะ 92/100 (อัปเดต)
- ✅ ปี 94, 95, 96 ทำใหม่ Rule 89 แล้ว (ครบ 94-100 = Rule 89, multi-source=0)
- ✅ เติมแล้ว: 19,20,22,24,25,27,28,29,31,33,34,39,43-49,50,51,53-57,59-72,73-81,83-91,93
- ★ **8 ปีที่ al-Bidayah (30097) ไม่มีเนื้อหารายปีแยก** (ตำรากระโดด/รวมกับปีข้างเคียง ไม่มีหัวข้อ "[ثم دخلت سنة X]"): **30, 32, 38, 42, 52, 58, 82, 92** ★
  - ยืนยันแล้วโดยอ่านหน้า gap จริง (เช่น ปี 31 obituary ยาวถึง pid3453 แล้วข้ามไปปี 33 pid3454 เลย — ปี 32 ไม่มี)
  - ปี 30 มีแต่ obituary/กวี; ปี 38 (สังหารมุฮัมมัด บิน อบีบักร/อียิปต์) อยู่ในเล่าปี 37/39
  - **ถ้าต้องการ 100/100:** ดึงจากแหล่งอื่น — al-Kamil (Shamela **21712**) หรือ al-Muntazam (**12406**) ที่ shard เก่าเคยใช้ — แต่จะเป็น mixed-source (ไม่ใช่ al-Bidayah ล้วน). owner ต้องตัดสินใจ
- (option) ลด 123 R86 warnings โดยเพิ่มชื่อ named-but-unlinked ลง persons[]

## 9. Tooling
- `scripts/tm_lib.py`: `fetch(30097,pid)`→{nass,pageNum,nextId,prevId}; `clean_main(nass)`→อาหรับล้วน; `extract(raw,start,end)`→byte-exact substring (anchor ทน diacritic/วงเล็บ; IGN มี ﷺ ﵀ แต่ไม่มี ﵁﵂﷿﴿﴾ — เลี่ยง symbol พวกนี้ใน anchor แต่อยู่ใน span ได้); `strip_dia`
- `scripts/tm_qc.py`: รัน `PYTHONUTF8=1 python3 scripts/tm_qc.py` — exit 0=PASS (warnings ได้), 1=มี ERROR
- env: `export PYTHONUTF8=1 PYTHONIOENCODING=utf-8 LANG=en_US.UTF-8` + heredoc ใส่ `# -*- coding: utf-8 -*-`
- memory pointer สด: `~/.claude/projects/-Users-fauci/memory/islamicfiqh-antigravity-handoff.md`
