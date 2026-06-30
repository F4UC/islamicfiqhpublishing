# Verification Report — al-Bidāyah wa al-Nihāyah Dataset
**Date:** 2026-06-27  
**Role:** VERIFIER (read-only · no shard edits)  
**Branch:** `claude/bidayah-dataset-verification-7wqd1j`  
**Commit HEAD:** `fd0c9f2` (Claude/timemachine years 638plus, 2026-06-28)

---

## 1. Frontier Confirmed

| Item | Value |
|---|---|
| Shard files | **632** (`bidayah-h1.json` → `bidayah-h641.json`) |
| Events | **1,874** |
| Accounts | **2,465** |
| Multi-source events | **455** |
| Year range | **ฮ.ศ. 1 – 641** |
| Glossary — persons | **2,597** |
| Glossary — places | **491** |
| Source registry | **8** (4 annal + 4 tarajim) |

### Intentionally Empty Years (9 total — not errors)

`30, 32, 38, 42, 52, 58, 82, 92, 303`

These years have no discrete content section in al-Bidāyah (Ibn Kathīr skips directly to adjacent years). Documented in `HANDOFF-al-bidayah.md` and `HANDOFF-YEARS-1-100.md`. **Do not create shards for these.**

---

## 2. QC Results Summary

### 2a. Charter QC — `scripts/tm_qc.py`

```
Exit code: 0  →  ✓ PASS
```

| Category | Count |
|---|---|
| Warnings | 648 |
| Errors | **0** |

No charter-rule blockers. All 648 warnings are **non-blocking review items** (see §4).

### 2b. Extended Structural + Translation Verifier

Checks run: JSON validity, meta required fields, schema version, hijriYear consistency, event order, duplicate event IDs, URL domain, Arabic-char leak in Thai detail, arabicExcerpt:detail ratio, Arabic-Indic numeral leak, hard royal language (R5), confidence/reviewFlags contradiction.

| Level | Count |
|---|---|
| BLOCKER | **0** |
| ERROR | **0** |
| WARN | 1,357 |
| INFO | 0 |

**No structural blockers or errors. Dataset passes all hard gates.**

---

## 3. Warning Categories

### 3.1 CONFIDENCE-FLAGS — 1,342 events ⚠ (pattern analysis required)

**Nature:** 1,342 events have `confidence: "high"` AND non-empty `reviewFlags[]`. The verifier flagged these as potential contradictions, but analysis of the flag content reveals a consistent authoring pattern:

| Category | Count | Example flag |
|---|---|---|
| Rule 89 scope note | 1,326 | `"แปลตรงตามตำรา (Rule 89); บทกวีตัดออก"` |
| Scope-selection note | 14 | `"ปีนี้ยาว 17 หน้า; คัดเหตุการณ์เรือธง 4 เหตุการณ์"` |
| Continuation note | 1 | `"ฉากการตายอยู่หน้าถัดไป (จะแปลในชาร์ดต่อเนื่อง)"` |
| Other | 1 | — |

**Interpretation:** The authoring agent uses `reviewFlags` as **scope documentation**, not as an uncertainty marker, while `confidence: "high"` refers to translation quality. This is by design (1,326/1,342 = 98.8% are Rule 89 notes).

**Human action:** Confirm this is the intended semantic for `reviewFlags`. If the field should only encode uncertainty, the flags carrying scope notes should be moved to a different field (e.g. `scopeNotes`). No shard data is wrong as-is — this is a data-model clarification question.

**Shards with editorial-sensitivity flags (need human review):**
- `bidayah-h144` (001–004): Ibn Kathīr strongly condemns al-Mansūr — translations follow Rule 89 verbatim
- `bidayah-h158-003`: Caliphate authority claims debated by scholars
- `bidayah-h218-004`: Ibn Kathīr criticizes al-Maʾmūn for not recanting the Muʿtazilite position

---

### 3.2 ARABIC-LEAK — 10 accounts ⚠

Arabic characters detected in Thai `detail` field (excluding ﷺ and Quran verse brackets ﴿﴾).

| Event ID | Chars | Interpretation |
|---|---|---|
| `bidayah-h2-009` | `﵁` (U+FD41 ALLAH ligature), `﷿` (U+FDFF ×2) | ﵁ after "Ibn ʿAbbās" is an honorific ligature; U+FDFF appears to be a Shamela page artifact |
| `bidayah-h101-002` | `ع م ر` (U+0639 0x645 0x631) | **Intentional:** translator wrote spaced Arabic letters to illustrate that "ع م ر" (Umar) was written on the ground — pedagogically appropriate |
| `bidayah-h139-001` | `﷿` (U+FDFF) | Shamela artifact |
| `bidayah-h144-002` | `﷿` (U+FDFF) | Shamela artifact |
| `bidayah-h145-004` | `﷿` (U+FDFF) | Shamela artifact |
| `bidayah-h181-001` | `﷿` (U+FDFF) | Shamela artifact |
| `bidayah-h210-001` | `﷿` (U+FDFF) | Shamela artifact |
| `bidayah-h526-003` | `﷿` (U+FDFF) | Shamela artifact |
| `bidayah-h530-003` | `﷿` (U+FDFF) | Shamela artifact |
| `bidayah-h569-005` | `فصلٌ` (U+0641 0x0635 0x0644) | **Genuine leak:** Arabic section header `فصلٌ: في وفاة…` was not stripped from the detail field |

**Human action required:**
- **U+FDFF (8 accounts):** This codepoint is in Arabic Presentation Forms-A (U+FB50–FDFF) and appears to be a Shamela page-separator artifact that `tm_lib.clean_main()` did not filter. Review whether `clean_main()` should strip U+FDFF.
- **`bidayah-h569-005`:** The Arabic section header `فصلٌ: في وفاة الملك العادل…` leaked into `detail`. This is a genuine translation error — the Arabic header should not appear in the Thai translation. **Needs correction.**
- **`bidayah-h101-002`:** Intentional pedagogical usage — verifier agrees no action needed, but human confirmation is welcome.

---

### 3.3 RATIO-SHORT — 5 accounts ⚠

Thai `detail` is unusually short relative to `arabicExcerpt` (ratio < 0.30, threshold: Thai is normally 1.5–5× Arabic in characters).

| Event ID | Source | ar_chars | th_chars | ratio | Notes |
|---|---|---|---|---|---|
| `bidayah-h62-001` | ibn-kathir | 271 | 76 | 0.28 | Detail appears truncated — Arabic describes full delegation visit; Thai has only the opening sentence |
| `bidayah-h412-004` | ibn-kathir | 576 | 168 | 0.29 | Possibly a summary rather than full translation |
| `bidayah-h532-003` | ibn-kathir | 1,345 | 363 | 0.27 | Long Arabic excerpt on al-Harīrī composing al-Maqāmāt; Thai detail much shorter |
| `bidayah-h623-005` (acc 1) | ibn-kathir | 1,348 | 329 | 0.24 | — |
| `bidayah-h623-005` (acc 2) | ibn-kathir | 1,027 | 231 | 0.22 | — |

**Human action:** These 5 accounts may have incomplete translations. Cross-check `detail` against `arabicExcerpt` to verify Rule 89 compliance (full 1:1 translation required). Note that some are long Arabic lists of obituaries where a summary introduction is deliberately brief — confirm intent.

---

### 3.4 R5 "พระองค์" — ~534 warnings (tm_qc) ℹ

Regex `พระองค์` flagged as ambiguous royal language. These are **non-blocking** — the charter explicitly notes that `พระองค์` is legitimate when referring to Allah (in Quran/khutbah translations) and only forbidden for humans.

**Pattern:** Shards ฮ.ศ. 2–101 contain narrative sections where Quranic verses and prophetic traditions are quoted, naturally using `พระองค์` for Allah. The tm_qc.py warning message itself says: *"ยืนยันว่าหมายถึงอัลลอฮ์ (อนุญาต) ไม่ใช่มนุษย์"*.

**Human action:** Spot-check a sample to confirm `พระองค์` consistently refers to Allah, not to historical human figures. No systematic issue found by automated check.

---

### 3.5 R86 Named-but-Unlinked — ~114 warnings (tm_qc) ℹ

Persons mentioned by canonical Thai name in `detail` prose are not linked in the event's `persons[]` array. This is non-blocking — the display renders correctly; `persons[]` drives the person-tag sidebar only.

**Notable unlinked persons (frequently appearing):**
`said-b-jubayr`, `amr-b-abd-wadd`, `anas-b-malik`, `ibn-al-zubayr`, `muhammad-b-muslim`, `amr-b-al-as`, `abd-al-malik-b-marwan`, `umar-ii`, `uthman-b-affan`, `hisham-b-abd-al-malik`, `jabir-b-abd-allah`, `yahya-b-said-al-ansari`, `husayn-b-ali`, `abd-allah-b-abbas`, `marwan-b-al-hakam`

**Human action (optional):** Add these person IDs to the relevant events' `persons[]` arrays to improve sidebar linking. Not required for display correctness.

---

## 4. What Was NOT Checked (Scope Exclusions)

| Check | Reason Excluded |
|---|---|
| `arabicExcerpt` byte-exact against live Shamela pages | Requires network + `--byte` flag in tm_qc.py; off by default per design |
| Translation semantic correctness (Rule 75) | Cannot judge academically — VERIFIER role |
| Source URL reachability | Network-dependent |
| Quranic verse diacritics (Rule 53) | Requires canonical Quran source comparison |

---

## 5. Overall Assessment

| Gate | Result |
|---|---|
| JSON validity | ✅ PASS — all 632 shards parse |
| Schema v3 | ✅ PASS — all shards |
| hijriYear filename↔meta | ✅ PASS — all shards |
| Required fields present | ✅ PASS — no missing required fields |
| Duplicate event IDs | ✅ PASS — no duplicates |
| Sequential event order | ✅ PASS — all shards |
| URL domains | ✅ PASS — all shamela.ws |
| Hard royal language (R5) | ✅ PASS — no سيِّن|เสด็จ|ประสูติ in Thai detail |
| Arabic-Indic numerals in detail | ✅ PASS — none found |
| Charter QC (tm_qc.py) | ✅ PASS (exit 0) |
| **BLOCKERS** | **0** |
| **ERRORS** | **0** |
| Warnings (non-blocking) | 2,005 total (648 tm_qc + 1,357 extended) |

**The dataset is structurally sound. All hard gates pass.** The 2,005 warnings are review items, not blockers. Two specific items need human resolution before deep-pass ingestion continues:

1. **`bidayah-h569-005`** — Arabic section header leaked into Thai `detail` (genuine translation artifact)
2. **U+FDFF (8 accounts)** — Shamela artifact in `detail`; verify `clean_main()` coverage or accept as cosmetic

---

## 6. Files Produced

| File | Description |
|---|---|
| `reports/VERIFY-REPORT-bidayah-2026-06-27.md` | This human-readable report |
| `reports/verify-findings.json` | Machine-readable findings (all 1,357 structured findings + tm_qc summary) |

*No shard files were modified. This is a read-only verification pass.*
