# CONSISTENCY AUDIT — Beta Phase A report (PR-1, docs-only)

**Scope:** transliteration consistency across **137 articles @ origin/main `2adb1f6`**.
**Mode:** READ-ONLY on articles · detection-only on Arabic · deliverable = docs (`GLOSSARY.md` + this report).
**Pipeline:** Beta detects (Phase A) → A1 gate → **One merges** → Phase B applies normalizations (separate PR, gated).

---

## 1. Method (codepoint/script, ไม่ใช่สายตา)
- อ่านทั้ง 137 บทจาก committed tree (`git show origin/main:<path>`), batch สแกน.
- นับ #occ ต่อ variant + รายไฟล์ (substring-safe: ตัด double-count เช่น `อัตตัฟตาซานี` ⊂ `อัตตัฟตาซานีย์`, `อิบนุซซุบัยร` ⊂ `อิบนุซซุบัยร์`).
- **Discovery:** ดึง token นำหน้าด้วย al-/assimilated (`อัล/อัต/อัฏ/อัด/อัษ/อัร/อัซ/อัส/อัศ/อัน/อัช/อัฎ/อัถ/อัฐ`) + fold-key (ตัด tone, รวม ซ≈ส≈ษ≈ศ, ฮ≈ห, ฏ≈ต, สระสั้น≈ยาว) → flag key ที่ map ≥2 surface form.
- **Arabic blocks ไม่นับ/ไม่แตะ** (Thai token ไม่ปรากฏในบล็อก `lang="ar"` อยู่แล้ว → grep ปลอดภัย).

## 2. ผลรวม (ดูตารางเต็มใน `GLOSSARY.md`)
| หมวด | สถานะ |
|---|---|
| A LOCKED | บะฏูเฏาะฮ์/ซุบัยร์ conformant ✅ · เศาะลาฮุดดีน เหลือ deviation **2 ไฟล์** · หัศกะฟีย์ 0-occ · มุฮัมมัด เหลือ deprecated 3 รูป |
| B HOUSE-STYLE | มัสฮับ conformant ✅ · เหลือ deprecated ปลีกย่อย (ศอเฮี้ยะห์×2, ศอฮาบัต×3, ฮะนาฟี×3) + **เศาะฮาบะฮ์(ฮ)×19** ใหม่ |
| C R52 fused | inventory 32 รูป (Ibn al-/Abu al-) + Arabic · 2 fused inconsistency = D14/D15 · 1 ⚑ |
| D OPEN | **21 inconsistency** (7 seed + 14 discovered) + 9 typo 1-off · **6 รายการ FLAG One** (D16–D21) |
| R88 date | "เสียชีวิตปี" deprecated **×67 / 10 ไฟล์** |

## 3. ข้อเสนอกฎใหม่ R86–R89 (ถัดจาก R85 ปัจจุบัน)

> **R86 — [GLOSSARY single-source of truth]**
> `docs/GLOSSARY.md` เป็นแหล่งอ้างอิงเดียวสำหรับการทับศัพท์ ชื่อปราชญ์/หนังสือ/สถานที่/ศัพท์เทคนิค เป็นภาษาไทย.
> บทใหม่ทุกบท **ต้อง conform** กับ §A/§B/§C และรูป canonical ใน §D ที่ One อนุมัติแล้ว.
> §A/§B = **LOCKED** (เฉพาะ One แก้ได้) · linter บังคับภายหลัง (งานแยก, ดู R76/S9).
> ขอบเขต: **ร้อยแก้วไทยเท่านั้น** — ห้ามแตะ Arabic block (R60) และ typo เนื้อไทยทั่วไป (R1).

> **R87 — [R52 fused-name canonical registry]**
> รูป fused ใน `GLOSSARY.md §C` เป็น canonical: keep fused, **สระอุ** (อบุล- ไม่ใช่ อบูล-), **sun-letter assimilation** (อิบนุศศอลาห์, อัซซุบกีย์).
> ทุกเคส `อิบนุล…/อบุล…/อบูล…` ที่ยังไม่อยู่ใน registry **ต้อง FLAG** ให้บรรณาธิการชี้ขาด al- vs name-initial ก่อน (สอดคล้อง R52) — ห้ามเดา.

> **R88 — [date-format unification]**
> ปีมรณกรรมต้องรูปเดียวทั้งเว็บ: **"(เสียชีวิต ฮ.ศ. X / ค.ศ. Y)"** (หรือปฏิทินเดียวตามหลักฐานที่มี per R9).
> **ห้าม** "เสียชีวิตปี X" (คำว่า "ปี" นำเลขเปล่า) — ขัด R9 โดยตรง. (พบ ×67 / 10 ไฟล์ → แก้ใน Phase B)

> **R89 — [transliteration conflict-resolution protocol]**
> เมื่อ 1 รูปอาหรับ → ไทย ≥2 surface: (1) เลือก **corpus-dominant** (R73); (2) ถ้ารูปเด่นผิดสัทศาสตร์/อักขรวิธี → แก้เป็นรูปถูก (R82/R83);
> (3) **เสมอกัน / ขัดข้าม fused-standalone / กระทบชื่อเรื่อง → FLAG One** ห้ามตัดสินเอง.
> Beta **detect** (audit นี้) → One **decide** → Phase B **apply** (byte-diff + log) · Arabic ไม่แตะ.

## 4. ⚑ Conflicts ที่ต้องให้ One ชี้ขาดก่อน Phase B (6)
- **D16 al-Hasan (الحسن):** root ขัดกัน — fused `อบุลหะสัน` (ห+ส) vs standalone เด่น `อัลฮะซัน` (ฮ+ซ). ต้องเลือก root เดียวใช้ทั้ง fused+standalone+`อิบนุลหะสัน`. (Beta เสนอ `หะสัน`: ح→ห, س→ส)
- **D17 al-Hafiz (الحافظ):** 5 รูป (ح→ฮ/ห × ظ→ศ/ซ/ส). Beta เสนอ corpus-dominant `อัลฮาฟิศ`.
- **D18 al-Andalus (الأندلس):** bare เด่น `อันดาลุส` (ดา) แต่ al- เด่น `อัลอันดะลุส` (ดะ) — ต้องเลือกสระเดียว.
- **D19 al-Hanbali (الحنبلي):** 3 รูป (บา/บะ × ฮ/ห). Beta เสนอ `อัลฮัมบะลีย์`.
- **D20 Abu al-Fath (أبو الفتح):** `อบุลฟัตฮ์` (4) vs `อบุลฟัตห์` (2) — ح ท้าย → ฮ์/ห์.
- **D21 Ibn al-Imad (ابن العماد):** `อิบนุลอิมาด` vs `อิบนุลอิม้าด` (tone ้) เสมอ 2:2 — Beta เสนอตัด ้ (typo).
- ⚑ **อบุลอิบัร** (C): al- vs name-initial ไม่ชัด.

## 5. ขอบเขตที่ "ไม่ทำ" ในงานนี้ (กันความเข้าใจผิด)
- ❌ ไม่แก้บทความใดๆ (docs-only) — การ normalize = Phase B.
- ❌ ไม่แตะ Arabic block / อายะฮ์ / หะดีษ (Beta-Arabic list แยก, R60/R8/R53).
- ❌ ไม่แก้ typo เนื้อความไทยทั่วไปที่ไม่ใช่ทับศัพท์ชื่อ/ศัพท์ (คง R1).
- ❌ ไม่ตัดสิน 6 ⚑ conflict — รอ One.

## 6. Phase B (เสนอ — งานแยก, หลัง One lock GLOSSARY)
batch 20 บท/รอบ · ต่อ variant ที่ One อนุมัติ: replace ในร้อยแก้วไทย (mask `<style>/<script>/<head>`/Arabic block) · byte-diff ก่อน-หลัง · regression vs บทอื่น · cache-bust ไม่เกี่ยว (HTML no-store) · PR แยกต่อ batch → A1 → One.
