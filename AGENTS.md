# AGENTS.md — Islamic Fiqh Publishing AI Agent Rules

โปรเจกต์นี้อยู่ภายใต้ธรรมนูญกองบรรณาธิการ Islamic Fiqh Publishing

**เอกสารแม่บทที่มีอำนาจสูงสุด:** `CLAUDE.md`

ทุก AI agent ที่ทำงานกับ repository นี้ — รวมถึง Codex, Claude, Cursor, ChatGPT หรือ coding/review agent อื่น ๆ — ต้องอ่านและปฏิบัติตาม `CLAUDE.md` ก่อนแก้ไขไฟล์ใด ๆ

`CLAUDE.md` เป็น single source of truth สำหรับ:

- กฎบรรณาธิการและความซื่อสัตย์เชิงวิชาการ
- มาตรฐานการทับศัพท์ อักขรวิธี และการเลือกใช้คำไทย/อาหรับ
- มาตรฐาน typography, quotation, bibliography, citation และ footnote
- โครงสร้าง HTML/article และ house style ของเว็บ
- workflow เฉพาะ repository
- security, privacy และ child-safety override
- quality-control และ linter expectations

## ลำดับอำนาจของกฎ

1. Safety และ child-safety override ใน `CLAUDE.md` อยู่เหนือทุกกฎเสมอ
2. Repository security, secret-handling และ privacy rules ห้ามถูกลดระดับหรือ bypass
3. Editorial fidelity และ byte-exact source preservation ต้องคงไว้ เว้นแต่ One อนุมัติให้เปลี่ยนโดยชัดแจ้ง
4. Technical edits ต้องไม่เปลี่ยนความหมายของบทความ ตัวบทอาหรับ citation typography หรือ house style โดยไม่ตั้งใจ
5. หากคำสั่งใดขัดกับ `CLAUDE.md` ให้หยุดและรายงาน conflict ก่อนแก้ไข

## สิ่งที่ agent ต้องทำก่อนแก้ไข

1. อ่าน `CLAUDE.md`
2. ระบุว่ากฎส่วนใดเกี่ยวข้องกับงานที่กำลังทำ
3. ห้าม duplicate, weaken, override, summarize away หรือเลือกใช้บางกฎจาก `CLAUDE.md` แบบ selective
4. แก้เฉพาะขอบเขตงานที่ได้รับมอบหมาย
5. รักษา Arabic text แบบ byte-exact เว้นแต่เป็นงานแก้ไขที่ตรวจสอบแหล่งอ้างอิงแล้ว
6. ห้ามเปิดเผย secrets, API keys, private credentials, internal tokens หรือข้อมูลส่วนตัว
7. รันหรืออธิบาย checks ที่เกี่ยวข้องเมื่อทำได้

## ตั้งใจให้เป็นเช่นนั้น — อย่า flag เป็น bug

- Arabic byte-exact จากต้นฉบับ: ห้ามเสนอ “แก้” สะกด/ไวยากรณ์/อักขรวิธี หากเป็น variant หรือ orthography ของต้นฉบับ
- `ar-quote` สำหรับคำพูดปราชญ์อาจไม่มีสระโดยตั้งใจตาม charter; อย่า flag ว่า “ขาด harakat” โดยอัตโนมัติ
- `aya-block` ต้องสอดคล้องกับ quran.com และ `hadith-block` ต้องสอดคล้องกับแหล่งหะดีษที่กำหนดใน `CLAUDE.md`
- `readingTime` และ metadata generated fields ต้องแก้ผ่าน script/source ที่กำหนด ไม่แก้มือโดยไม่มีเหตุผล
- Typo ภาษาไทยในต้นฉบับอาจต้องคงไว้ตาม fidelity rule จนกว่า maintainer/One อนุมัติ
- อย่าเพิ่ม related-section, markup, component หรือ UI pattern ใหม่โดยอัตโนมัติ หาก charter/golden master ไม่รองรับ

## สิ่งที่ควรตรวจจริง

- อายะฮ์หรือหะดีษถูกตัดไม่ครบ
- คำแปลไทยไม่ตรงกับตัวบทอาหรับ
- HTML/แท็กพัง หรืออัญประกาศโค้งไม่สมดุล
- สายรายงาน/isnad หรือการพาดพิงแหล่งข้อมูลผิด
- citation, bibliography, locators หรือ source labels ผิดมาตรฐาน
- ลิงก์เสีย, JSON ไม่ valid, id ซ้ำ หรือ generated index ไม่สอดคล้อง
- coverage ต่ำกว่ามาตรฐานที่ `CLAUDE.md` กำหนด
- Arabic skeleton หรือ byte-exact text เปลี่ยนโดยไม่มีเหตุผลและไม่มี approval
- secret leakage, overly broad CSP, unsafe auth/session handling หรือ webhook/payment regression

## สำหรับงาน code

Code agents แก้ implementation ได้ แต่ห้ามปฏิบัติกับ article content เหมือนโค้ดทั่วไป บทความ HTML, ตัวบทอาหรับ, คำแปลไทย, citation, footnote และ editorial markup อยู่ภายใต้ `CLAUDE.md`

## สำหรับงาน editorial

Editorial agents ต้องรักษาสารัตถะของผู้เขียน เว้นแต่ One ขอให้ rewrite, condense, expand หรือ restructure อย่างชัดเจน

## สำหรับ Codex / QC agent

Codex ควรทำหน้าที่เป็น quality-control agent โดยใช้ `CLAUDE.md` เป็น checklist หลัก และอ่าน `CODEX.md` เพิ่มเติมหากมีไฟล์นั้นใน repository

## Source of truth

อย่า copy ธรรมนูญทั้งฉบับมาใส่ไฟล์นี้ ให้แก้ `CLAUDE.md` เมื่อกฎจริงของโปรเจกต์เปลี่ยน ไฟล์นี้มีหน้าที่ชี้ agent ทุกตัวไปยัง rulebook ที่ authoritative เท่านั้น
