# AGENTS.md — แนวทางสำหรับ AI ที่ทำงานกับรีโปนี้ (รวม Codex code review)

โปรเจกต์: เว็บเผยแพร่ตำราอิสลามคลาสสิกภาษาไทย (static site, Cloudflare Pages)
เอกสาร authoritative: CLAUDE.md (74 ข้อ: 1–74 + ข้อย่อย 12.1/12.2 + House Style S1–S8) + golden-master.md + docs/SECURITY.md
บทอ้างอิงมาตรฐาน: articles/nitisart/moon-sighting-vs-astronomy.html

★ ก่อนแตะเนื้อหา: (1) **Child-safety (Rule 71)** เหนือทุกกฎ — เจอเนื้อ sexualize ผู้เยาว์ = drop+flag, ห้าม surface/quote, route One+Claude, ห้าม self-merge · (2) **Coverage ≥99% (Rule 72)** harakat-normalized · (3) **Normalize ทับศัพท์ (Rule 73)** corpus-dominant (เศาะหาบะฮ์ ไม่ใช่ ศอฮาบัต)

## ตั้งใจให้เป็นเช่นนั้น — อย่า flag เป็น bug
- อาหรับ byte-exact จากต้นฉบับ (Rule 1): ห้ามเสนอ "แก้" สะกด/ไวยากรณ์/อักขรวิธี — variant และ orthography ต้นฉบับ (เช่น อียิปต์ دينى/فى/التى) เป็นความตั้งใจ
- ar-quote (คำพูดปราชญ์) เปลือยสระโดยตั้งใจ (Rule 53/60): อย่า flag ว่า "ขาด harakat"
- aya-block สระเต็มจาก quran.com (imlaei/Ḥafṣ); hadith-block สระเต็มจาก sunnah.com: waqf / dagger-alef ไม่ใช่ error
- readingTime ใน articles.json สร้างจาก scripts/gen-reading-time.js เท่านั้น: อย่าเสนอแก้มือ
- ไม่มี related-section markup รายบท (by-design ทั้งเว็บตาม golden-master): อย่าเสนอให้เพิ่ม
- typo ภาษาไทยในต้นฉบับคงไว้ตาม Rule 1 จนกว่า maintainer อนุมัติ: อย่า auto-flag ทุกคำ
- deploy: push ตรงเข้า main ถูกบล็อก, ทุกอย่างผ่าน PR, purge = Custom Purge by URL

## อยากให้ช่วยตรวจจริง (มีประโยชน์มาก)
- อายะฮ์/หะดีษถูกตัดไม่ครบ (truncated)
- คำแปลไทย ↔ อาหรับ ไม่ตรง
- HTML/แท็กพัง, อัญประกาศโค้งไม่สมดุล
- สายรายงาน/การพาดพิง (isnad) ผิด
- ลิงก์เสีย, articles.json ไม่ valid / id ซ้ำ / ไม่ใช่ union-entry
- coverage < 99% เทียบต้นฉบับ (Rule 72), Arabic skeleton ไม่ byte-exact (เทียบ byte-diff + blob SHA)
