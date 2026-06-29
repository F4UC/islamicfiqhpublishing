# -*- coding: utf-8 -*-
"""
tm_lib.py — Time Machine (R86) ingestion/QC shared library.

Core helpers for fetching classical-chronicle pages from Shamela, extracting
BYTE-EXACT Arabic excerpts (Rule 60), applying the Thai house-style guard
(S2/S3 + Rules 5/12/73), and the source-ordering used by the renderer.

Run scripts with PYTHONUTF8=1 (Thai heredocs need it on Python 3.9).
WebFetch 403s on Shamela; the AJAX endpoint below works.
"""
import json, re, os, subprocess
import html as H

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.normpath(os.path.join(HERE, '..'))          # the timemachine-data/ dir
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
      "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36")

# Diacritics (harakat/tatweel/Quranic marks) ignored for diacritic-insensitive anchors.
DIA = ''.join(chr(c) for c in list(range(0x064B, 0x0660)) + [0x0670, 0x0640]
              + list(range(0x06D6, 0x06EE)))
# Full ignore-set for anchor matching: diacritics + brackets + footnote digits +
# punctuation + space + stray symbols. Lets anchors span footnote markers/brackets.
IGN = set(DIA) | set('[](){}،؛:.0123456789٠١٢٣٤٥٦٧٨٩«»"- ﵀=ﷺ!؟')

# Source registry order (annal chronicles → account tab order). Mirrors sources.json.
ORDER = {'ibn-kathir': 1, 'ibn-athir': 2, 'ibn-jawzi': 3, 'sibt-ibn-al-jawzi': 4}

# Shamela book ids (see DATA-MODEL.md / HANDOFF.md for islamweb + page maps).
BOOK = {'ibn-kathir': 30097, 'ibn-athir': 21712, 'ibn-jawzi': 12406}
BOOK_THAI = {'ibn-kathir': 'อัลบิดายะฮ์ วันนิฮายะฮ์', 'ibn-athir': 'อัลกามิล ฟิตตารีค',
             'ibn-jawzi': 'อัลมุนตะซ็อม', 'sibt-ibn-al-jawzi': 'มิรอาตุซซะมาน'}


def clean(nass):
    """Strip HTML tags + unescape entities + collapse whitespace.
    NOTE: keeps footnote/apparatus TEXT (used for year-marker scanning only)."""
    return re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', nass or ''))).strip()


def clean_main(nass):
    """Pure MAIN-TEXT Arabic for excerpts (Rule 89): drop the footnote apparatus
    (`<p class="hamesh">…</p>` blocks + `<hr>`), inline footnote-ref digits
    (`<span class="c2">(٢)</span>`), and Shamela copy-buttons (`<a class="btn_tag">`)
    BEFORE stripping the remaining tags. Keeps meaningful spans (c4/c5 phrases, Quran
    refs). Use this — not clean() — to build/verify arabicExcerpt so the stored Arabic
    has no chrome/footnotes. Byte-exact gates must compare against clean_main() too."""
    s = nass or ''
    # Drop the bottom-of-page footnote apparatus (class="hamesh"), the inline
    # footnote-ref digits (<span class="c2">(٢)</span>), and Shamela copy-buttons
    # (<a class="btn_tag">). NOTE: Shamela also uses class="hamesh" with a leading
    # "=" for footnotes that OVERFLOW from the previous page — these are apparatus
    # too (citations / manuscript variants / hadith-chain elaborations), so dropping
    # the whole hamesh block is correct; main NARRATIVE text is never in hamesh.
    s = re.sub(r'<p[^>]*class="[^"]*\bhamesh\b[^"]*"[^>]*>.*?</p>', ' ', s, flags=re.S)
    s = re.sub(r'<span[^>]*class="[^"]*\bc2\b[^"]*"[^>]*>.*?</span>', ' ', s, flags=re.S)
    s = re.sub(r'<a[^>]*class="[^"]*\bbtn_tag\b[^"]*"[^>]*>.*?</a>', ' ', s, flags=re.S)
    s = re.sub(r'<hr\s*/?>', ' ', s)
    return re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', s))).strip()


def clean_main_jawzi(nass):
    """Pure MAIN-TEXT Arabic for al-Muntazam (Ibn al-Jawzi, Shamela book 12406).

    ★ Book 12406 uses a DIFFERENT class template from al-Bidayah (book 30097), so
    clean_main() is WRONG here: in al-Muntazam `class="c2"` wraps the actual hadith
    MATN («...») — the core narration — while the footnote-ref digits ([١][٢]…) live
    in `class="c4"`. Using clean_main() would silently DELETE every matn (R89/byte-exact
    catastrophe). Verified class roles on pid 99/100/101:
      c2 = matn «...» (KEEP)   ·   c5 = connectives قَالَ:/قَالُوا: (KEEP)
      c4 = footnote-ref [N] (DROP) · hamesh = footnote apparatus block (DROP)
      btn_tag = Shamela copy buttons (DROP)
    Use THIS — not clean_main() — to build AND byte-gate al-Muntazam excerpts so the
    stored Arabic is a contiguous, chrome-free, footnote-free substring (Rule 60/88)."""
    s = nass or ''
    s = re.sub(r'<p[^>]*class="[^"]*\bhamesh\b[^"]*"[^>]*>.*?</p>', ' ', s, flags=re.S)
    s = re.sub(r'<span[^>]*class="[^"]*\bc4\b[^"]*"[^>]*>.*?</span>', ' ', s, flags=re.S)
    s = re.sub(r'<a[^>]*class="[^"]*\bbtn_tag\b[^"]*"[^>]*>.*?</a>', ' ', s, flags=re.S)
    s = re.sub(r'<hr\s*/?>', ' ', s)
    return re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', s))).strip()


def strip_dia(s):
    """Remove Arabic diacritics only (used for year-marker scanning, never for storage)."""
    return s.translate({ord(c): None for c in DIA})


def fetch(book, pid, cache='/tmp', tries=5):
    """Fetch one Shamela page via AJAX, cache to disk. `book` may be an id or a
    source key in BOOK. Returns the JSON dict {nass, pageNum, nextId, prevId, ...}.
    Robust against transient rate-limits: Shamela sometimes returns an EMPTY body,
    which would otherwise be cached and break json.load — so we validate `nass`,
    discard a bad/empty cache file, sleep, and retry up to `tries` times."""
    import time as _t
    bid = BOOK.get(book, book)
    fn = os.path.join(cache, f'sh_{bid}_{pid}.json')
    for t in range(tries):
        if os.path.exists(fn) and os.path.getsize(fn) > 10:
            try:
                d = json.load(open(fn, encoding='utf-8'))
                if d.get('nass') is not None:
                    return d
            except Exception:
                pass
        if os.path.exists(fn):
            os.remove(fn)
        subprocess.run(['curl', '-sS', '-A', UA, '-H', 'X-Requested-With: XMLHttpRequest',
                        '--max-time', '30', f'https://shamela.ws/ajax/pageContent/{bid}/{pid}',
                        '-o', fn])
        if t < tries - 1 and (not os.path.exists(fn) or os.path.getsize(fn) <= 10):
            _t.sleep(3)
    raise RuntimeError(f'fetch failed for {bid}/{pid} after {tries} tries')


def page_text(book, pid, cache='/tmp'):
    """Cleaned (HTML-stripped) raw text + pageNum for a Shamela page."""
    d = fetch(book, pid, cache)
    return clean(d['nass']), d.get('pageNum')


def extract(raw, start, end):
    """BYTE-EXACT excerpt (Rule 60). Matches `start`/`end` anchors ignoring diacritics
    and punctuation/brackets, then slices the ORIGINAL diacritized span — so the result
    is guaranteed to be a substring of `raw`. Raises ValueError if an anchor is absent."""
    st, idx = [], []
    for i, ch in enumerate(raw):
        if ch in IGN:
            continue
        st.append(ch); idx.append(i)
    s = ''.join(st)
    ns = ''.join(c for c in start if c not in IGN)
    ne = ''.join(c for c in end if c not in IGN)
    a = s.find(ns)
    if a < 0:
        raise ValueError(f"START anchor not found: {start[:40]!r}")
    b = s.find(ne, a)
    if b < 0:
        raise ValueError(f"END anchor not found: {end[:40]!r}")
    out = raw[idx[a]:idx[b + len(ne) - 1] + 1]
    assert out in raw, "internal: extracted span is not a substring of source"
    return out


# House-style guard — Thai PROSE ONLY (title/detail/scope/reviewFlags). NEVER pass an
# arabicExcerpt through this. Folds S2 (มิใช่/ทว่า), S3 (em/en-dash), Rule 5 (no royal
# language for humans — Allah keeps reverent ทรง), Rule 12/73 (หัจญ์), and the stray
# coinage ราชยา→การรุก. Keep extending the table as new deprecated forms appear.
_ROYAL = [('การสิ้นพระชนม์', 'การถึงแก่กรรม'), ('สิ้นพระชนม์', 'ถึงแก่กรรม'),
          ('ทอดพระเนตร', 'มอง'), ('พระองค์', 'เขา'), ('เสด็จ', 'เดินทาง'),
          ('พระชนม์', 'อายุ'), ('พระกรรณ', 'หู'), ('สวรรคต', 'ถึงแก่กรรม'),
          ('ราชยา', 'การรุก')]


def house_style(s):
    """Normalise Thai prose to house style (S2/S3/Rule 5/12/73)."""
    s = (s.replace('—', '-').replace('–', '-')
         .replace('มิใช่', 'ไม่ใช่').replace('ทว่า', 'แต่').replace('หุจญ์', 'หัจญ์'))
    for a, b in _ROYAL:
        s = s.replace(a, b)
    return s


def load_shard(year):
    f = os.path.join(DATA, f'bidayah-h{year}.json')
    return json.load(open(f, encoding='utf-8')), f


def save_json(obj, path):
    json.dump(obj, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    open(path, 'a').write('\n')
