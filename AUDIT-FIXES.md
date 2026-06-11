# AUDIT-FIXES — บันทึกการแตะตัวอักษรอาหรับ (Arabic-touch ledger)

> บันทึกทุกครั้งที่ตัวแทน AI แตะตัวอักษรอาหรับในงาน audit/แก้บทเก่า ตาม **Arabic-Authority Scope** ใน `CLAUDE.md`
> แตะได้ 2 กรณีเท่านั้น: **(1)** strip ฮะเราะกาตตามกฎ 60 (ลบเฉพาะ U+064B–U+0652, skeleton/ช่องว่างคงเดิม) · **(2)** vowel อายะฮ์/หะดีษด้วย byte-exact copy จาก canonical (quran.com imlaei/Hafs · sunnah.com) — ★ห้ามพิมพ์สระเอง ห้ามแก้ skeleton★
> ทุก entry ต้องมีผล **byte-diff** (skeleton ก่อน=หลัง=แหล่ง) และ ★ห้าม Purge★ จนกว่าเจ้าของสั่ง

รูปแบบ entry: `ไฟล์ › บล็อก › การกระทำ › แหล่ง/เลขอ้างอิง › byte-diff result`

---

<!-- entries appended per content-pass PR below -->
