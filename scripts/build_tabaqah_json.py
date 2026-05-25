#!/usr/bin/env python3
"""
build_tabaqah_json.py
Splits the KASHAF narrator dataset into 12 per-tabaqah JSON files
for lazy-loading in the ISNĀD Tracer browser tool.

Output:
  /home/user/islamicfiqhpublishing/data/tabaqah-{1..12}.json
  /home/user/islamicfiqhpublishing/data/tabaqah-index.json
"""

import csv
import json
import os
import collections

# ── Paths ──────────────────────────────────────────────────────────────
NARRATORS_CSV = '/tmp/kashaf/data/neo4j/narrators_data.csv'
ASANEED_CSV   = '/tmp/kashaf/data/neo4j/asaneed_data.csv'
OUT_DIR       = '/home/user/islamicfiqhpublishing/data'

# ── Tabaqah metadata ───────────────────────────────────────────────────
TABAQAH_META = {
    1:  {'label_ar': 'الصَّحَابَة',                  'label_th': 'เศาะฮาบะฮ์'},
    2:  {'label_ar': 'كِبَارُ التَّابِعِين',          'label_th': 'กิบารุตตาบิอีน'},
    3:  {'label_ar': 'الوُسْطَى مِنَ التَّابِعِين',   'label_th': 'วุสฏออัตตาบิอีน'},
    4:  {'label_ar': 'صِغَارُ التَّابِعِين',           'label_th': 'ศิฆอรุตตาบิอีน'},
    5:  {'label_ar': 'أَصْحَابُ التَّابِعِين الكِبَار','label_th': 'อัศหาบุตตาบิอีนัลกิบาร'},
    6:  {'label_ar': 'أَتْبَاعُ التَّابِعِين',         'label_th': 'อัตบาอุตตาบิอีน'},
    7:  {'label_ar': 'الطَّبَقَةُ السَّابِعَة',        'label_th': 'ฏอบะเกาะฮ์ที่ 7'},
    8:  {'label_ar': 'الطَّبَقَةُ الثَّامِنَة',        'label_th': 'ฏอบะเกาะฮ์ที่ 8'},
    9:  {'label_ar': 'الطَّبَقَةُ التَّاسِعَة',        'label_th': 'ฏอบะเกาะฮ์ที่ 9'},
    10: {'label_ar': 'الطَّبَقَةُ العَاشِرَة',         'label_th': 'ฏอบะเกาะฮ์ที่ 10'},
    11: {'label_ar': 'الطَّبَقَةُ الحَادِيَة عَشْرَة', 'label_th': 'ฏอบะเกาะฮ์ที่ 11'},
    12: {'label_ar': 'الطَّبَقَةُ الثَّانِيَة عَشْرَة','label_th': 'ฏอบะเกาะฮ์ที่ 12'},
}

# Death-year → tabaqah mapping (AH ranges)
DEATH_RANGES = [
    (0,   70,  1),
    (70,  110, 2),
    (110, 150, 3),
    (150, 190, 4),
    (190, 230, 5),
    (230, 270, 6),
    (270, 310, 7),
    (310, 350, 8),
    (350, 390, 9),
    (390, 430, 10),
    (430, 470, 11),
    (470, 9999, 12),
]


def infer_tabaqah(death_val):
    """Assign tabaqah number from death year (AH)."""
    try:
        d = float(death_val)
    except (TypeError, ValueError):
        return 12
    for lo, hi, t in DEATH_RANGES:
        if lo <= d < hi:
            return t
    return 12


def round_death(death_val):
    """Return an integer AH death year, or None."""
    try:
        f = float(death_val)
        return int(round(f)) if f > 0 else None
    except (TypeError, ValueError):
        return None


# ── Load narrators ─────────────────────────────────────────────────────
print('Loading narrators…')
with open(NARRATORS_CSV, encoding='utf-8') as fh:
    raw = list(csv.DictReader(fh))

print(f'  {len(raw)} raw rows')

# Build narrator objects, keyed by rawi_index (int), keyed by rawi_index (int)
narrators = {}
skipped = 0
for r in raw:
    try:
        rid = int(r['rawi_index'])
    except (TypeError, ValueError):
        skipped += 1
        continue  # skip malformed rows
    death_ah = round_death(r.get('death'))
    tab = infer_tabaqah(r.get('death'))
    narrators[rid] = {
        'id':              rid,
        'name_ar':         r.get('name', ''),
        'shuhrah':         r.get('name', ''),      # KASHAF uses 'name' for full/known name
        'grade_ibn_hajar': r.get('grade', ''),
        'grade_thahabi':   '',                      # not in this dataset
        'death_ah':        death_ah,
        'tabaqah_num':     tab,
        'teachers':        [],
        'students':        [],
    }

# ── Load edges ─────────────────────────────────────────────────────────
print('Loading edges…')
edge_set = set()
with open(ASANEED_CSV, encoding='utf-8') as fh:
    for row in csv.DictReader(fh):
        f_raw = row['from_narrator']
        n_raw = row['n_id']
        if f_raw == '-1' or n_raw == '-1':
            continue
        try:
            f = int(f_raw)
            n = int(n_raw)
        except ValueError:
            continue
        if f in narrators and n in narrators:
            edge_set.add((f, n))

print(f'  {len(edge_set)} unique teacher→student edges')

# Populate teachers/students lists
for (teacher, student) in edge_set:
    narrators[teacher]['students'].append(student)
    narrators[student]['teachers'].append(teacher)

# ── Group narrators by tabaqah ─────────────────────────────────────────
groups = collections.defaultdict(list)
for n in narrators.values():
    groups[n['tabaqah_num']].append(n)

# ── Write per-tabaqah JSON files ───────────────────────────────────────
index_entries = []

for tab_num in range(1, 13):
    meta       = TABAQAH_META[tab_num]
    tab_narrs  = groups[tab_num]
    tab_ids    = {n['id'] for n in tab_narrs}

    # Edges: include edges where BOTH endpoints are in tabaqah ≤ current + 1
    # This shows cross-generational links to the next generation
    max_tab = tab_num + 1
    eligible_ids = {
        rid for rid, n in narrators.items()
        if n['tabaqah_num'] <= max_tab
    }
    tab_edges = [
        {'from': f, 'to': t}
        for (f, t) in edge_set
        if f in tab_ids and t in eligible_ids
        or t in tab_ids and f in eligible_ids
    ]

    # Deduplicate edges
    seen_edges = set()
    deduped_edges = []
    for e in tab_edges:
        key = (e['from'], e['to'])
        if key not in seen_edges:
            seen_edges.add(key)
            deduped_edges.append(e)

    # Build narrator list — only narrators in THIS tabaqah go in 'narrators'
    # but we include teachers/students IDs that may be in adjacent tabaqat
    narrator_list = [
        {
            'id':              n['id'],
            'name_ar':         n['name_ar'],
            'shuhrah':         n['shuhrah'],
            'grade_ibn_hajar': n['grade_ibn_hajar'],
            'grade_thahabi':   n['grade_thahabi'],
            'death_ah':        n['death_ah'],
            'teachers':        n['teachers'],
            'students':        n['students'],
        }
        for n in tab_narrs
    ]

    out = {
        'tabaqah':        tab_num,
        'label_ar':       meta['label_ar'],
        'label_th':       meta['label_th'],
        'narrator_count': len(narrator_list),
        'narrators':      narrator_list,
        'edges':          deduped_edges,
    }

    out_path = os.path.join(OUT_DIR, f'tabaqah-{tab_num}.json')
    with open(out_path, 'w', encoding='utf-8') as fh:
        json.dump(out, fh, ensure_ascii=False, separators=(',', ':'))

    size_kb = os.path.getsize(out_path) / 1024
    print(f'  tabaqah-{tab_num}.json  — {len(narrator_list):>5} narrators, '
          f'{len(deduped_edges):>6} edges  ({size_kb:.0f} KB)')

    index_entries.append({
        'tabaqah':  tab_num,
        'label_ar': meta['label_ar'],
        'label_th': meta['label_th'],
        'count':    len(narrator_list),
        'file':     f'tabaqah-{tab_num}.json',
    })

# ── Write index file ───────────────────────────────────────────────────
index_path = os.path.join(OUT_DIR, 'tabaqah-index.json')
with open(index_path, 'w', encoding='utf-8') as fh:
    json.dump(index_entries, fh, ensure_ascii=False, indent=2)

print(f'\ntabaqah-index.json written.')
print('Done.')
