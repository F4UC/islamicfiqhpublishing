# Time Machine chronicle data (R86 ingestion pipeline)

External data consumed by `pages/tools/hijri-time-machine.html`. The page ships an
inline `EVENTS` base (always available); the files here are **lazy-loaded** at page
load and merged in, so the timeline can grow without bloating the HTML.

## Files
- **`glossary.json`** — the **R86 Transliteration Glossary Lock**. Canonical Thai
  spelling for every person / place / book name (`{id, arabic, canonicalThai,
  variantsFound[]}`). Arabic is **byte-exact reference only — never edited**. Every
  new name appends here; reuse an existing `canonicalThai` rather than re-romanising.
- **`index.json`** — manifest of chronicle shards (file, book, hijriYear, event count).
- **`bidayah-*.json`** — one shard per Hijri year of *al-Bidāyah wa al-Nihāyah*
  (Ibn Kathīr, Shamela book 30097). **Schema v2**, each event carries: Thai `title`
  (+ optional `titleArabic`), a detailed Thai `detail` (full translation, not a
  summary), a thematic `group` (rendered as a collapsible section per
  `meta.groupOrder`), `order` (sort within group), byte-exact `arabicExcerpt`,
  `persons`/`places` (glossary ids → resolved to figure name + Arabic at load),
  `sources[]` (each `{work, loc, url (Shamela), urlAlt (islamweb), note}`),
  `confidence`, `reviewFlags`.

## Load-time mapping (in the page)
`hijriYear → year`, `detail → desc`; `persons[]` are resolved against `glossary.json`
into a **บุคคลสำคัญ** block showing `canonicalThai — العربية`; `sources[]` render as a
**ที่มา** list with Shamela + islamweb links. The renderer is a **grouped accordion**:
year → thematic group (`<details>`) → event card (`<details>`), so a year with many
events stays compact. Failure to fetch degrades gracefully to the inline events.

## Pipeline to add a year
1. `ingest` — fetch pages via `https://shamela.ws/ajax/pageContent/30097/<pageId>`
   (returns `{nass, pageNum, nextId, prevId}`); walk `nextId` to the next-year marker
   `ثم دخلت سنة …`.
2. `segment` — keep one Hijri year per shard.
3. `extract` — discrete events + the obituaries section (`ذكر من توفي فيها`).
4. `translate` — AR→TH **glossary-locked**; new names append to `glossary.json`.
5. `QC` — `arabicExcerpt` must be a byte-exact substring of the source page; resolve
   every `persons`/`places` id against the glossary.
6. `publish` — append the shard + bump `index.json`.

## Status
**DRAFT — ผมแปล คุณตรวจ** (translations await owner review). Do not treat the Thai
text as final until reviewed.
