# IMAGE CREDITS — เครดิตภาพ

เอกสารภายใน (ซ่อนจากเว็บสาธารณะผ่าน `robots.txt → Disallow: /docs/`, ไม่อยู่ใน `sitemap.xml`)

> บันทึกแหล่งที่มา ผู้ถ่าย และสัญญาอนุญาตของภาพทุกภาพที่ฝัง/โฮสต์บนเว็บ — หนึ่งแถวต่อหนึ่งภาพ
> เมื่อเพิ่ม/เปลี่ยนภาพ ต้องอัปเดตไฟล์นี้ในคอมมิตเดียวกัน

| ใช้ที่ (หน้า) | File / URL | แหล่งที่มา | ผู้ถ่าย / เจ้าของ | สัญญาอนุญาต |
|---|---|---|---|---|
| `articles/nitisart/moon-sighting-vs-astronomy.html` (hero) | `https://commons.wikimedia.org/wiki/Special:FilePath/Crescent_Moon.JPG` (embed ผ่าน Special:FilePath ของ Wikimedia Commons, โหลดในเบราว์เซอร์ผู้อ่าน) | Wikimedia Commons — [File:Crescent Moon.JPG](https://commons.wikimedia.org/wiki/File:Crescent_Moon.JPG) | Y0kwetahoe (Wikimedia user) | Public Domain — เจ้าของสละสิทธิ์ ใช้ได้ทุกวัตถุประสงค์รวมเชิงพาณิชย์ ไม่ต้องระบุที่มา |

## หมายเหตุการเลือกภาพ (hero ของบทความ moon-sighting)
- **โจทย์:** จันทร์เสี้ยว / ดาราศาสตร์อิสลาม — โทนสงบ มีศักดิ์ศรี ไม่ sci-fi
- **เลือก** ภาพจันทร์เสี้ยวจริงบนท้องฟ้ามืด (greyscale-on-black) ตรงธีมบทความ "การดูจันทร์เสี้ยว" โดยตรง
- **วิธีฝัง:** ใช้ Wikimedia `Special:FilePath` (endpoint redirect ที่เสถียร) แทนการ self-host เพราะ sandbox มี allowlist เครือข่าย เข้าถึง Unsplash/NASA/Wikimedia upload ไม่ได้ (403 ทั้งหมด) จึงดาวน์โหลดมา self-host ไม่ได้ — ภาพจะโหลดในเบราว์เซอร์ผู้อ่านซึ่งเข้าถึง Wikimedia ได้ตามปกติ
- **License:** Public Domain (ยืนยันจากหน้าไฟล์ Commons) — ปลอดภัยเชิงพาณิชย์ ไม่ต้อง attribution แต่บันทึกเครดิตไว้ที่นี่เพื่อความโปร่งใส
- **ควรตรวจสายตา** ครั้งแรกหลัง deploy ว่าองค์ประกอบ/อัตราส่วนภาพเข้ากับ overlay ข้อความล่างซ้าย
