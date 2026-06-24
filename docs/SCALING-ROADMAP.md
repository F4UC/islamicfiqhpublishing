# Time Machine — SCALING ROADMAP

> สถานะ ณ 24 มิ.ย. 2026 · main HEAD `b14123b` (ก่อน lazy-load) · เลขทั้งหมดวัดจาก clone จริง ไม่ใช่ประมาณ
> ปลายทาง: Time Machine จะโตเกินปี 1–300 อาจถึง ฮ.ศ. ~1447 → ฐานข้อมูลโตไม่หยุด
> เอกสารนี้เก็บใน `docs/` (middleware Item 3 บล็อกไม่ให้ public serve)

---

## เลขฐาน (24 มิ.ย. 2026)

| ไฟล์ | ขนาด | จำนวน | หมายเหตุ |
|---|---|---|---|
| `glossary.json` | 264 KB | 741 คน / 234 ที่ / 1 หนังสือ | โหลดทั้งก้อนทุก page-load · เกินกับดัก push 100KB แล้ว 2.6× |
| `index.json` | 107 KB | 285 shard entries | โหลดทุก page-load · เกิน 100KB แล้ว |
| `bidayah-h2.json` (บะดัร) | 315 KB | 52 events | shard เดียวเกิน 100KB 3× |
| shard รวม 285 ไฟล์ | 2.71 MB | 554 events / 557 accounts | — |
| **โปรไฟล์ต่อ 1 page-load** | **~3.1 MB** | **~288 requests** | index+glossary+sources + 285 shard ยิงขนาน |

**คอขวด history page (ยืนยันจากโค้ดจริง):**
1. **network gate** — `Promise.all(shards.map(fetch))` รอครบ 285 shard ก่อน `initTimelineView()` จึงทำงาน → จอว่างจน 288 request เสร็จ
2. **render ทีเดียว** — ต่อ html ของทุกปี/ทุก 554 event แล้ว `content.innerHTML = html` ครั้งเดียว + ทุก `<details open>` = layout 554 การ์ดพร้อมกัน
3. glossary merge **ไม่ใช่** คอขวด (loop เบา)

---

## 3 แกนที่ scale จะกัด (เรียงตามที่จะเจอ)

### แกน A — คุณภาพ (✅ ปิดแล้ว PR #275)
ของเสียสะสมเงียบเมื่อโตเป็นพัน · **สายแล้วแก้ไม่ได้** = ทำก่อน · `tm_qc.py` เป็น blocking gate ใน CI `validate` job แล้ว
เหลือ: audit เนื้อหา R1–R90 + ขยายความวงเล็บ (งานคน, ไม่ใช่ scaling)

### แกน B1 — browser loading (🔴 ACTIVE — trigger ถึงแล้ว: One ยืนยัน history page หน่วง)
fix = **lazy-load by year** (สเปกเต็มด้านล่าง) · ทำได้โดยไม่ต้องมี build step (static-root) · แก้คอขวด 1+2 พร้อมกัน

### แกน B2 — glossary/index monolith (🟡 เฝ้า)
glossary โตทุก PR, โหลดทั้งก้อนทุกครั้ง, ชนกับดัก push 100KB
**trigger:** glossary > ~1 MB **หรือ** push-truncate กลับมากวนบ่อย
**fix:** แตก partition (ตามอักษร/ยุค/prefix) + fetch เฉพาะส่วนที่ใช้ (lazy-load รองรับอยู่แล้ว)

### แกน B3 — flat-JSON → D1/KV (⬆️ ถูกดึงขึ้นโดย Axis C, ไม่ใช่ scale)
เดิมเลื่อนได้ถึงหลักหมื่น event · **แต่ membership (Axis C) ต้องการ Worker+D1 ก่อนเพื่อ gate** → B3 กลายเป็นส่วนหนึ่งของ C
**fix:** ETL flat-JSON → Cloudflare D1; persons/places/source id → foreign key; Worker เสิร์ฟ + กรองสิทธิ์
**enabler:** schema normalized + gate (แกน A) ทำให้ ETL ถูก — *gate ก่อนคือฐานของ migration นี้*

> ★ B2 ยังเลื่อนได้ (ข้อมูลไม่หาย) · B3 ถูกดึงขึ้นเพราะ paywall ไม่ใช่ scale ★

---

## DECISIONS (locked)

- **(ก) UX:** ทุกปีเริ่มแบบ **closed** ยกเว้น auto-open ปีแรก (หรือปีใน `location.hash` `#year-N`)
- **(ข) Search:** ทาง **ข1** — `performDeepSearch` ครั้งแรก โหลดทุก shard ทีเดียวก่อน filter (ไม่ regress search) · อัปเป็น title-index ทีหลังตอน corpus ใหญ่

---

## Phase B1 — Lazy-load v1 implementation spec (ACTIVE)

> Builder = Alpha (Claude Code). Gate = A1 (verify diff against the seam checklist below).
> File: `pages/tools/hijri-time-machine.html` (94 KB working file — rewrite of the loader/render path only; do NOT touch the calendar-converter, CSS, or article content).

### Confirmed current symbols (do not rename)
`EVENTS` (const, ~L635, inline-seed) · `TM_CHRONICLES` (~L740) · `tmObserver` (~L742) ·
`initTimelineView()` (~L744) · `renderYearGroups(evs,isFocus)` (~L858) · `renderEventCard(e)` (~L881) ·
`performDeepSearch(query)` (~L815) · `indexGlossary(g)`, `BASE`, `seen` (currently **IIFE-local**, ~L977–982).
DOM ids/classes: `tm-content`, `tm-nav-list`, `tm-sidebar`, `.tm-year-section`, `.tm-year`, `.tm-year-head`, `.tm-nav-link`.

### STEP 0 — scope hoist (REQUIRED — this is the breaking seam)
Lift `BASE`, `seen`, and `indexGlossary` OUT of the bootstrap IIFE into the shared `<script>` scope (where `EVENTS`/`initTimelineView` live) so the new lazy functions can reach them. Add shared globals:
```
let   SHARD_INDEX = [];     // = manifest.shards
let   GMAP = {};            // = indexGlossary(glossary)
const YEAR_LOADED = {};     // hijriYear -> true once its shard merged
let   ALL_LOADED = false;   // true after a search-triggered full load
```
Keep seeding `seen` from the inline `EVENTS` (preserve the existing `EVENTS.forEach(e=>{if(e.id)seen[e.id]=true})`) so inline events are never double-merged.

### STEP 0.5 — fetch indirection (API-ready; REQUIRED for Axis C)
Route ALL shard data access through TWO functions and nothing else:
```
function tmFetchYear(entry) { return fetch(BASE + entry.file).then(r=>r.ok?r.json():null); }
function tmFetchAll()       { return Promise.all(SHARD_INDEX.map(tmFetchYear)); }
```
STEP 3 and STEP 6 MUST call these, never fetch inline. Rationale: when Axis C
ships, the static→gated-API swap (`BASE+file` → `API + session token`, add
locked-stub handling) touches ONLY these two functions, not the loader logic.

### STEP 1 — bootstrap (replace the fetch-all block, ~L990–1052)
Fetch ONLY `index.json` + `glossary.json` + `sources.json` (+`chronicles.json` fallback). Do NOT fetch shards.
Set `SHARD_INDEX = manifest.shards`, `GMAP = indexGlossary(glossary)`, `TM_CHRONICLES` as today.
Then call `renderSkeleton()`.
`.catch` → keep inline `EVENTS` and call the OLD `initTimelineView()` as fallback (page still works offline-ish).

### STEP 2 — `renderSkeleton()`  (new; replaces upfront role of initTimelineView)
- Build year list = union of `SHARD_INDEX[].hijriYear` AND any year present only in inline `EVENTS` (lose nothing). Sort asc.
- Per year render a CLOSED details (no `open`):
  `<section class="tm-year-section" id="year-{y}"><div class="century-badge">…</div><details class="tm-year" data-year="{y}"><summary class="tm-year-head">{yearHead} <span class="tm-count">{count} เหตุการณ์</span></summary><div class="tm-year-body"></div></details></section>`
  (count from SHARD_INDEX entry; for inline-only years use EVENTS count.)
- Rebuild `tm-nav-list` as today.
- Re-attach the SAME IntersectionObserver (`tmObserver`) for nav active-state and the nav-click scroll handler.
- Wire each `<details>` `toggle` event: when `details.open && !YEAR_LOADED[y]` → `openYear(y)`.
- nav-click handler: set target details `.open = true`, scroll, then `openYear(y)`.
- After build: auto-open first year (or the `#year-N` from `location.hash` if present): set its details open + `openYear(y)`.

### STEP 3 — `openYear(y)`  (new, async)
```
if (YEAR_LOADED[y]) { renderYearBody(y); return; }
// spinner into that year's .tm-year-body
const entry = SHARD_INDEX.find(s => s.hijriYear === y);
if (!entry) { YEAR_LOADED[y] = true; renderYearBody(y); return; }   // inline-only year
fetch(BASE + entry.file) -> shard
  // merge shard.events into EVENTS using the EXISTING merge logic (skip seen[id];
  // figures via GMAP; normalize accounts; push); set seen[id]=true
YEAR_LOADED[y] = true;
renderYearBody(y);
// on fetch fail: show a small retry message in the body; never throw past here
```

### STEP 4 — `renderYearBody(y)`  (new)
`evs = EVENTS.filter(e => e.year === y)` → `body.innerHTML = renderYearGroups(evs, true)` (reuse existing renderer untouched).

### STEP 5 — `performDeepSearch(query)`  (modify)
- If `query` and `!ALL_LOADED`: show "กำลังโหลดข้อมูลทั้งหมดเพื่อค้นหา…" → `await loadAllShards()` → `ALL_LOADED = true` → then existing filter/render (unchanged).
- Empty query → `renderSkeleton()` (collapsed; `YEAR_LOADED` retained so re-open is instant) + show sidebar.

### STEP 6 — `loadAllShards()`  (new)
`Promise.all` over `SHARD_INDEX` entries where `!YEAR_LOADED[y]` → fetch+merge each (same dedup) → mark all `YEAR_LOADED` → `ALL_LOADED = true`.

### A1 GATE — seam checklist (verify on the PR diff)
- [ ] BASE/seen/indexGlossary hoisted; no remaining IIFE-local ref breaks
- [ ] inline-only years (no shard entry) still render
- [ ] dedup holds: a year's events never double-pushed (seen[id])
- [ ] nav-click to an UNLOADED year loads + scrolls
- [ ] `#year-N` deep-link on landing opens+loads that year
- [ ] `tmObserver` still drives nav active-state after skeleton render
- [ ] delegated per-account source-tab listener (on persistent `#tm-content`) still works after per-year render
- [ ] ข1: search after lazy returns SAME results as the old all-loaded search
- [ ] `.catch` fallback keeps page usable on fetch failure
- [ ] post-load profile: page paints from index+glossary only (~3 req) before any shard
- [ ] file may cross 100 KB after edit → re-fetch + blob-SHA compare after push
- [ ] single PR; CSS/converter/articles untouched; CI green (validate + secrets + Pages)

---

## Axis C — Membership / entitlement (subscription) — ARCHITECTURE

> ★ ความจริงที่กำหนดทุกอย่าง: paywall จริง = ข้อมูลห้ามเป็น static public อีกต่อไป ★
> กรอง browser-side = หลอกตา (เปิด network tab bypass ได้) → ต้องมี **server (Worker) คั่น auth ก่อนส่งข้อมูล**

### ขอบเขต + โมเดล (LOCKED 24 มิ.ย. 2026)
- **ฟรี / public ต่อ:** หมวดบทความ (168 บท HTML) ทั้งหมด — static เดิม ไม่แตะ
- **ฟรี:** อิญาซะฮ์ (`pages/tools/ijazah-data`) — หน้าเดียว value ต่ำ, gate ไม่คุ้ม → ปล่อยฟรีเป็น funnel/credibility, ไม่ต้อง build gate
- **Gated:** เฉพาะ Hijri Time Machine corpus (shards/glossary/sources) → หลัง Worker+D1 เท่านั้น
- **บิลลิ่ง = SUBSCRIPTION ล้วน** (ไม่มีขายขาด) — เพราะ corpus โตต่อเนื่อง (~285→~1447 shard) = ฐานข้อมูลวิชาการที่โตเรื่อยๆ ไม่ใช่ ebook เสร็จแล้ว · subscribe = เข้าถึงเนื้อ + ทุกปีที่แปลเพิ่มในอนาคต ตลอดที่ active
- **หน่วยขาย = "ตัวงาน" (work) ไม่ใช่ปี ไม่ใช่เล่ม ไม่ใช่ยุค** — ตามตลาดจริง (อัลบิดายะฮ์, อัลมุนตะซ็อม ฯลฯ) · subscribe รายงาน = grant `{work_id}` · all-access bundle = union ทุก work, ราคา < ผลรวมรายตัว
- **กลไก = tag-based** (กันรื้อ schema ไม่ว่า One จัดแพ็กยังไง): content ติด tag (`source`=work มีแล้ว) · plan ให้ grants (เซ็ต tag) · เช็ก = `content.source ∈ grants ของ user ที่ subscription active`
- **กรองระดับ account ไม่ใช่ event:** event มีหลายแหล่ง → ส่ง account ที่สิทธิ์ครอบเต็ม, ที่เหลือ 🔒 locked-stub (title+arabicExcerpt เป็น teaser ได้, **ไม่ส่ง detail ไทย/glossary**) = upsell ข้ามงาน · **search กรองฝั่ง server**
- **moat = ชั้นไทย** (แปล+ขยายความ+glossary+multi-source) · อาหรับหาฟรีบน shamela ได้ → gate ที่ detail ไทย, ปล่อย arabic/title เป็น teaser ฟรี (SEO/funnel)

### 5 ชิ้น (= ก้าวจาก static site เป็น SaaS จริง — commitment ต่อเนื่อง)
1. **Auth** — login/session (Workers+JWT เอง หรือ Clerk/Supabase Auth)
2. **Payment** — subscription recurring (Stripe สากล / Omise ไทย) · webhook จ่าย/ต่อ/ยกเลิก → อัปเดต entitlement · **ค่าธรรมเนียม/ภาษี/เงื่อนไขผู้ให้บริการ ต้อง One เช็กเอง — ผมไม่ใช่ที่ปรึกษากฎหมาย/การเงิน**
3. **Entitlement store (D1):**
   ```sql
   users(id, email, created_at)
   subscriptions(id, user_id, provider, status, current_period_end)
   plans(id, name)                         -- e.g. 'al-bidayah', 'all-access'
   plan_grants(plan_id, work_id)           -- which works a plan unlocks (all-access = every work)
   subscriptions.plan_id -> plans.id
   ```
   read-check = user has a subscription with `status=active` AND `current_period_end > now`,
   whose plan_grants include the content's `work_id` (= account.source). recurring → สิทธิ์หมดอายุได้ → ต้องมี grace + re-subscribe flow.
   **★ JSON = canonical, D1 = derived ★** author แก้ JSON (gate ด้วย tm_qc ใน CI เหมือนเดิม) → ETL push เข้า D1 → Worker เสิร์ฟจาก D1 · repo JSON (private) = ต้นฉบับจริง, D1 = cache สร้างใหม่ได้ (disaster-recovery ฟรี) · **นี่จบยุค no-build ของ corpus — มี ETL step (บทความยัง no-build static)**
4. **Gated data Worker/API** — session → entitlement → ส่งเฉพาะ account ที่ owned + locked-stub ที่เหลือ + server-side search filter · `WHERE source_id IN (owned)` สะอาดบน D1
5. **Front-end** — login, "แพ็คของฉัน", buy/upgrade/re-subscribe flow, loader ยิง API พร้อม token (= สลับ `tmFetchYear/All` จาก STEP 0.5)

### SEQUENCE (locked — เรียงตาม "ทำก่อนผลกระทบ")
1. **B1 lazy-load (API-ready)** — เดี๋ยวนี้ · แก้หน่วงทันที + วาง fetch-indirection ให้ swap ง่าย · **lazy-load = perf ไม่ใช่ security** (ไม่กันรั่ว)
2. **Flip repo → private** — ดึงขึ้น **ทันทีหลัง B1 merge** (ไม่รอ full audit) · ปิดช่องรั่ว source บน GitHub
   - ผลต่อ gate ของ A1: anon clone พัง → **full-tree simulation (clone+grep seam+รัน tm_qc ทั้ง repo) ทำไม่ได้** · เหลือ MCP read ทีละไฟล์ใน diff
   - ข้อตกลงที่ต้องวาง **ก่อน** flip (ไม่งั้น gate มีรู): **Alpha รัน harness (tm_qc + scrutinize) แล้วแปะ output ให้ A1 ตรวจ** + A1 อ่าน diff/blob ผ่าน MCP · One verify Cloudflare Pages OAuth ยัง linked หลัง flip
3. **Axis C build** (ก่อน public launch) — order: auth → D1 entitlement → gated Worker (swap tmFetch* มาที่นี่ + locked-stub + server search) → payment+webhook → front-end
4. **ปิด public serving ของ TM corpus** — timed to launch · TM JSON หยุด serve สาธารณะ (ออกจาก static path → หลัง Worker/D1) · เหมือนที่ Item 3 บล็อก dev files · **บทความยัง public**
   > ⚠️ TM JSON ตอนนี้ public อยู่แล้ว (ทั้ง deployed + repo) — ของที่หลุดไปแล้วเรียกคืนไม่ได้ · corpus ยัง DRAFT/ไม่ครบ → value-at-risk โตตามที่ corpus เสร็จ · นี่คือเหตุผลข้อ 2 (flip private) ถูกดึงขึ้น

### ยังต้อง One ตัดสิน (business — เมื่อถึง Axis C, ไม่ต้องตอนนี้)
- payment provider (Stripe/Omise) + **ต้องรองรับ PromptPay** (สำคัญต่อ conversion ไทย — ยืนยันเอง)
- โครงสร้างราคา: ค่า subscription ราย work + all-access bundle (bundle < ผลรวมรายตัว) · **อย่า anchor กับราคา ebook อาหรับ** (คนละตลาด — ของเราขายชั้นไทย) · ผมหา comparable ฐานข้อมูล/แอปอิสลามไทยมาเทียบได้ถ้าต้องการ
- legal: critical-edition apparatus/tashkeel ของ muhaqqiq บางฉบับอาจมีลิขสิทธิ์ฉบับพิมพ์ (ตัวบทคลาสสิก public domain) — เช็กก่อน commercial · *ไม่ใช่คำปรึกษากฎหมาย/การเงิน*
- A1 ลงสเปก Axis C ลึก (D1 final, API contract, buy flow) เมื่อ B1+flip เสร็จ + One เลือก provider/ราคา
