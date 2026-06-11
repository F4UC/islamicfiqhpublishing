# Ijāzah dataset — provenance & licensing

ชุดข้อมูล **สายอิญาซะฮ์ (ijāzah chains)** ที่ใช้ขับเคลื่อนเครื่องมือเครือข่ายสายอิญาซะฮ์
บนหน้า `pages/tools/` — คัดลอกแบบ **byte-exact** จากต้นทาง ไม่มีการแก้ตัวอักษรอาหรับใดๆ

## ต้นทาง (upstream)
- repo: **F4UC/-Transmission-Network**
- path: `docs/data/ijazah/`
- **pinned commit:** `a12aed3d10afd7665f312b1b956453c20ed9cc0a` · นำเข้าเมื่อ **2026-06-11**
- ยืนยันแล้วว่าไฟล์ที่ก๊อปมา **byte-identical** กับ `docs/data/ijazah/` ที่ commit นี้ (diff ผ่าน)
  และ pin ซ้ำด้วย sha256 ใน `MANIFEST.sha256` (ตรวจด้วย `sha256sum -c MANIFEST.sha256`)
- **การอัปเดต:** ทำผ่าน PR ที่เปลี่ยน commit SHA นี้ + ดึงไฟล์ใหม่ + รัน `validate_chains.py`
  ฝั่งต้นทางซ้ำทุกครั้ง แล้วสร้าง `MANIFEST.sha256` ใหม่ในคอมมิตเดียวกัน
- สคริปต์ฝั่งต้นทางที่ผลิต/ตรวจข้อมูลนี้: `rebuild-ijazah-index.py` (สร้าง `index.json`),
  `validate_chains.py` (เช็ค invariants: srcId มีจริงใน sources.json, ลำดับเวลา, ความต่อเนื่อง,
  byte-exact ไม่ซ้ำ id/full)

## โครงไฟล์
- `index.json` — รายการ 23 สายอิญาซะฮ์ (gid, bab, books, n_nodes, n_edges, n_hadith, continuous)
- `sources.json` — ทะเบียนแหล่งอ้างอิง: `srcId → {title, author, medium, needsSource}`
- `graphs/<gid>.json` — กราฟต่อสาย (meta / nodes / edges) ตาม schema ด้านล่าง
- `NOTICE` — ข้อความ attribution จากต้นทาง
- `MANIFEST.sha256` — แฮชยืนยันความครบถ้วน byte-exact

## Schema (locked — ห้ามแก้รูปแบบ)
- **node**: `id`, `disp` (ชื่อย่ออาหรับ byte-exact), `full`, `gc`
  (`prophet|sahabi|thiqa|saduq|maqbul|daif|majhul|unknown|gap`), `grade`, `gradeBy`,
  `death`, `places`
- **edge** (source = ครู/ก่อน → target = ศิษย์/หลัง): `source`, `target`, `w`, `type`
  (`sama|ijaza|musalsal`), `srcId` (โยงเข้า `sources.json`), `status`
  (`unverified | transcription-checked | scholarship-verified | demo`)
- **meta**: `gid, books, bab, matn, n_hadith, n_nodes, n_edges, continuous, srcId, srcLoc`

## หลักการใช้งานในเครื่องมือ
- **Provenance:** ทุก edge ต้องตามรอยได้ว่ามาจาก `srcId` ใด และแสดง `status` (ระดับการตรวจสอบ)
  ไม่กลบสายที่ยัง `unverified`/`needsSource`
- **Byte-exact:** ข้อความอาหรับ (disp/full/grade/bab/matn) เป็น source data — โหลด ณ รันไทม์
  จาก JSON เท่านั้น **ห้ามพิมพ์ทับใน HTML** (สอดคล้องกฎข้อ 7/8/53/56/60)
- **ลิขสิทธิ์:** ข้อมูลฝั่ง KASHAF เป็น GPL-3 (ดู `NOTICE`); สายอิญาซะฮ์ชุดนี้ curate จากตำราที่
  ระบุชื่อใน `sources.json` — คงข้อความ attribution ไว้เสมอ

## การ re-sync
รัน `sha256sum -c MANIFEST.sha256` เพื่อเช็คความครบถ้วน; เมื่อต้นทางอัปเดต ให้ดึงไฟล์ใหม่จาก
`docs/data/ijazah/` แล้วสร้าง `MANIFEST.sha256` ใหม่ในคอมมิตเดียวกัน
