# -*- coding: utf-8 -*-
"""
tm_add_account.py — add a cross-chronicle account (Ibn al-Athir / Ibn al-Jawzi /
Sibt ibn al-Jawzi) to an existing Time Machine event, with a BYTE-EXACT excerpt.

Usage (PYTHONUTF8=1 python3):

    from tm_add_account import add
    add(year=128, additions=[
        ("bidayah-h128-001", "ibn-athir", 21712, 2317,
         "ذكر قتل الحارث بن سريج",          # start anchor (in the source page)
         "ولا يجيز مروان أمان يزيد، فلا آمنه",  # end anchor
         "อิบนุลอะษีร พาดหัวว่า ..."),         # Thai comparative account (house-styled)
    ])

Each addition = (event_id, source_id, shamela_book, page_id, start, end, thai_detail).
The excerpt is pulled byte-exact from the live page; accounts are kept sorted by
source order; the Thai detail is run through the house-style guard. Re-running is
idempotent (an account for the same source is not duplicated).
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tm_lib import fetch, clean, extract, house_style, ORDER, BOOK_THAI, load_shard, save_json


def add(year, additions, cache='/tmp'):
    shard, path = load_shard(year)
    by_id = {e['id']: e for e in shard['events']}
    for eid, src, book, pid, a1, a2, detail in additions:
        d = fetch(book, pid, cache)
        raw = clean(d['nass'])
        exc = extract(raw, a1, a2)                 # raises if anchors missing
        ev = by_id[eid]
        if any(a.get('chronicle') == src or a.get('source') == src for a in ev['accounts']):
            continue                               # idempotent
        ev['accounts'].append({
            "chronicle": src,                       # renderer also accepts "source"
            "detail": house_style(detail),
            "arabicExcerpt": exc,
            "loc": f"{BOOK_THAI.get(src, src)} เล่ม - หน้า {d.get('pageNum')}",
            "url": f"https://shamela.ws/book/{book}/{pid}",
            "urlAlt": "",
        })
        ev['accounts'].sort(key=lambda a: ORDER.get(a.get('source') or a.get('chronicle'), 9))
    save_json(shard, path)
    return sum(len(e['accounts']) for e in shard['events'])


if __name__ == '__main__':
    print("import this module; see the docstring for usage.")
