# Vendored graph libraries (self-hosted)

ไลบรารีกราฟสำหรับเครื่องมือ `ijazah-network.html` — **self-host** ในเขตเว็บไซต์เอง
ไม่พึ่ง CDN ภายนอกตอนรันไทม์ (ตัด supply-chain risk + รองรับแผน PWA/offline)
เวอร์ชัน pin ไว้ในชื่อไฟล์ · ดาวน์โหลดตอน build แล้ว commit เข้า repo

| ไฟล์ | เวอร์ชัน | ลิขสิทธิ์ | ที่มา (build-time) |
|---|---|---|---|
| `cytoscape-3.30.2.min.js` | 3.30.2 | MIT | cdnjs |
| `dagre-0.8.5.min.js` | 0.8.5 | MIT | cdnjs |
| `cytoscape-dagre-2.5.0.min.js` | 2.5.0 | MIT | npm (build ทางการ; cdnjs ไม่เผยแพร่แพ็กเกจนี้) |

ทั้งสามตัวเป็นสัญญาอนุญาต **MIT** (เผยแพร่/แก้ไข/รวมแพ็กเกจได้)

## การอัปเกรด
ดาวน์โหลดเวอร์ชันใหม่ → ตั้งชื่อไฟล์ตามเวอร์ชัน → อัปเดต `<script src>` ใน
`../ijazah-network.html` → ลบไฟล์เก่า → รัน `sha256sum *.js > MANIFEST.sha256` ใหม่
ในคอมมิตเดียวกัน · `node --check` ทุกไฟล์ก่อน commit
