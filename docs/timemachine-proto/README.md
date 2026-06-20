# Time Machine — Classical-text Ingestion Pipeline (PROTOTYPE)

Proof-of-concept for ingesting large classical Arabic works (al-Bidayah wa al-Nihayah,
al-Kamil, al-Isabah, …) into the Hijri Time Machine as structured, translated, **verifiable** records.

## Why this shape
Classical chronicles are organized **by Hijri year** (`ثم دخلت سنة …`) with an obituaries
section (`وممن توفي فيها`) per year — so they segment deterministically and map straight
onto the Time Machine's `{ year, cat, title, desc }` model.

## The 6-stage pipeline (all stages proven on this slice)
1. **INGEST** — fetch existing digital Arabic text (no OCR/retype). Source: المكتبة الشاملة
   (Shamela) `book/30097` = al-Bidayah, ط دار ابن كثير. Public domain (Ibn Kathir d.774 H).
2. **SEGMENT** — page-id ↔ Hijri-year map built from the book TOC. Years 130–140 H =
   Shamela page-ids ~4765–4819. (Year 132 opens at page-id 4772 / printed p.259.)
3. **EXTRACT** — split each year's prose into discrete records (events / deaths).
4. **TRANSLATE** — AR→TH per record, **locked to `glossary-seed.json`** so every name is
   spelled one way (proposed **R86**). Arabic excerpt kept beside each record (R60 spirit:
   Arabic is byte-exact reference, never edited).
5. **QC (human)** — `confidence` + `reviewFlags` per record; owner reviews before publish
   (fits existing `REVIEW-QUEUE.md` discipline). Child-safety gate R71 applies.
6. **PUBLISH** — emit Time Machine JSON. At scale, move the inline `const EVENTS` array in
   `pages/tools/hijri-time-machine.html` to external sharded JSON (one file per book/year-range),
   lazy-loaded — mirroring the existing `pages/tools/ijazah-data/graphs/*.json` pattern.

## Files in this prototype
- `bidayah-h132.json` — 6 events from year 132 H opening narrative (Shamela pp.259–260),
  each with Thai translation + Arabic excerpt + vol/page/url + confidence + review flags.
- `glossary-seed.json` — canonical transliteration lock (11 persons, 10 places, 1 book).

## Scope & honesty
This is **year 132's opening 2 pages only** (proof-of-concept). NOT done yet: the rest of
year 132 (~22 pages incl. obituaries), years 130–141, and the data-model migration.
Translations are **DRAFT — owner review pending** ("ผมแปล คุณตรวจ").

## Scale-up path
Each year is independent → a multi-agent workflow can translate many years in parallel,
each agent holding the same glossary, with an adversarial QC pass. (Opt-in: requires the
owner to request a workflow / "ultracode" run — large token cost.)
