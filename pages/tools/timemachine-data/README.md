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
  (Ibn Kathīr, Shamela book 30097). Each event carries Thai `title`/`summary`,
  byte-exact `arabicExcerpt`, `source` (vol/page/url), `persons`/`places` (glossary
  ids), `confidence`, and `reviewFlags`.

## Load-time mapping (in the page)
`hijriYear → year`, `summary → desc`; `source.url` renders as a "ที่มา" link on the
event card. Failure to fetch degrades gracefully to the inline events.

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
