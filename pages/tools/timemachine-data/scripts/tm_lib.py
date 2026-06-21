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
    """Strip HTML tags + unescape entities + collapse whitespace."""
    return re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', nass or ''))).strip()


def strip_dia(s):
    """Remove Arabic diacritics only (used for year-marker scanning, never for storage)."""
    return s.translate({ord(c): None for c in DIA})


def fetch(book, pid, cache='/tmp'):
    """Fetch one Shamela page via AJAX, cache to disk. `book` may be an id or a
    source key in BOOK. Returns the JSON dict {nass, pageNum, nextId, prevId, ...}."""
    bid = BOOK.get(book, book)
    fn = os.path.join(cache, f'sh_{bid}_{pid}.json')
    if not os.path.exists(fn):
        subprocess.run(['curl', '-sS', '-A', UA, '-H', 'X-Requested-With: XMLHttpRequest',
                        '--max-time', '25', f'https://shamela.ws/ajax/pageContent/{bid}/{pid}',
                        '-o', fn], check=True)
    return json.load(open(fn, encoding='utf-8'))


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
