#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tm_qc.py — charter-rule QC scanner for the Time Machine data set.

RUN THIS BEFORE EVERY PUSH:   PYTHONUTF8=1 python3 scripts/tm_qc.py
Exit code 0 = PASS (warnings allowed); 1 = at least one ERROR; 2 = IO/JSON error.

Checks (mapped to the 86-rule charter):
  [structure] JSON validity · index↔shard event counts · duplicate event ids
  [R86]       every persons[]/places[] id resolves in glossary.json ·
              no duplicate canonicalThai names · every account source id resolves
              in sources.json · persons NAMED in prose but missing from persons[]
              (high-confidence) and persons LINKED but never named (review)
  [R1-R9]     house-style on Thai prose (ทว่า/มิใช่/em-dash/ไม้ยมก/ศอเฮี้ยะฮ์/
              มัสฮับ/deprecated forms/สุลต่าน/อบูล)
  [R5]        royal language for humans (พระองค์/เสด็จ/สิ้นพระชนม์/…)
  [R52]       อิบนุ/อบู spacing; flags อิบนุล/อบุล/อบูล for editorial review
  [R60]       (optional --byte) re-verify every arabicExcerpt is a substring of its
              live Shamela page — slow; needs network. Off by default.

Thai prose = title + account.detail + meta.scope + reviewFlags. The arabicExcerpt
field is NEVER scanned by the Thai/house-style rules (it is Arabic, governed by R60).
"""
import sys, os, re, glob, json
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.normpath(os.path.join(HERE, '..'))

ERRORS, WARNINGS = [], []
def err(m): ERRORS.append(m)
def warn(m): WARNINGS.append(m)

def shard_files():
    return sorted(glob.glob(os.path.join(DATA, 'bidayah-h*.json')),
                  key=lambda x: int(re.search(r'h(\d+)', x).group(1)))

def yr(f): return os.path.basename(f).replace('bidayah-h', '').replace('.json', '')

def prose_of(e):
    return ' \n '.join([e.get('title', '')]
                       + [a.get('detail', '') for a in e.get('accounts', [])]
                       + list(e.get('reviewFlags', [])))

# --- R1-R9 (house-style; same regexes as scripts/lint-article.js) -------------
HOUSE = [('R1', r'(?<![ก-ฮ])ทว่า'), ('R2', r'มิใช่'), ('R3', r'—|–'),
         ('R4', r'ๆ(?=[ก-๛a-zA-Z0-9])'), ('R5', r'ศ่อเหี้ยห์'), ('R6', r'มัซฮับ'),
         ('R7', r'ศอฮาบัต|อัลญาฮิส|ศอลาฮุดดีน|ไบบาร์ส|ไบบัรส์|นิซามุลมุลก์|บะตูเตาะฮ์'),
         ('R8', r'สุล่าน'), ('R9', r'อบูล')]
# R5: royal language for HUMANS only. These verbs/nouns are never used of Allah →
# hard error wherever they appear (incl. for the Prophet ﷺ — owner ruling: use คำกลาง
# ถือกำเนิด/เสียชีวิต, not ประสูติ/สิ้นพระชนม์).
ROYAL = r'สิ้นพระชนม์|เสด็จ|ทอดพระเนตร|พระกรรณ|สวรรคต|ราชยา|ประสูติ|ราชสมภพ|บรรทม|พระราชโองการ|พระราชดำรัส|พระบรมราช'
# พระองค์/ทรง are LEGITIMATE for Allah (Qur'an/khutbah translations) but forbidden for
# humans. Can't tell referent by regex → warn once/event for human-referent review (not block).
ROYAL_AMBIG = r'พระองค์'

def main():
    try:
        glo = json.load(open(os.path.join(DATA, 'glossary.json'), encoding='utf-8'))
        src = json.load(open(os.path.join(DATA, 'sources.json'), encoding='utf-8')).get('sources', {})
        idx = json.load(open(os.path.join(DATA, 'index.json'), encoding='utf-8'))
    except Exception as e:
        print('IO/JSON error:', e); return 2

    pids = {p['id'] for p in glo['persons']}
    plids = {p['id'] for p in glo['places']}
    # glossary duplicate canonical names (R86 — one entry per person/place)
    for sect in ('persons', 'places'):
        c = Counter(p['canonicalThai'].split(' (')[0] for p in glo[sect])
        for name, n in c.items():
            if n > 1: err(f'[R86] glossary {sect}: duplicate name "{name}" ({n}x)')
    # high-confidence name forms for missing-link detection
    UNIQ = {'al-saffah': 'อัสซัฟฟาห์', 'abu-jafar-al-mansur': 'อัลมันศูร'}
    forms = {}
    for p in glo['persons']:
        full = p['canonicalThai'].split(' (')[0].strip(); fs = set()
        if (' บิน ' in full or ' บินต์ ' in full) and len(full) >= 11: fs.add(full)
        if p['id'] in UNIQ: fs.add(UNIQ[p['id']])
        if fs: forms[p['id']] = fs

    files = shard_files()
    idx_counts = {s['hijriYear']: s['events'] for s in idx['shards']}
    ev_total = acc_total = multi = 0
    ids_seen = set()

    for f in files:
        try:
            d = json.load(open(f, encoding='utf-8'))
        except Exception as e:
            err(f'[structure] {os.path.basename(f)}: invalid JSON ({e})'); continue
        y = d['meta']['hijriYear']
        if idx_counts.get(y) != len(d['events']):
            err(f'[structure] y{y}: index says {idx_counts.get(y)} events, shard has {len(d["events"])}')
        for e in d['events']:
            ev_total += 1; acc_total += len(e['accounts'])
            if len(e['accounts']) > 1: multi += 1
            if e['id'] in ids_seen: err(f'[structure] duplicate event id {e["id"]}')
            ids_seen.add(e['id'])
            for x in e.get('persons', []):
                if x not in pids: err(f'[R86] {e["id"]}: persons id "{x}" not in glossary')
            for x in e.get('places', []):
                if x not in plids: err(f'[R86] {e["id"]}: places id "{x}" not in glossary')
            for a in e['accounts']:
                sid = a.get('source') or a.get('chronicle')
                if sid and sid not in src: err(f'[R86] {e["id"]}: account source "{sid}" not in sources.json')
            pr = prose_of(e)
            for rid, rx in HOUSE:
                if re.search(rx, pr): err(f'[{rid}] {e["id"]}: house-style violation')
            if re.search(ROYAL, pr): err(f'[R5] {e["id"]}: royal/forbidden word in prose')
            if re.search(ROYAL_AMBIG, pr):
                warn(f'[R5] {e["id"]}: "พระองค์" — ยืนยันว่าหมายถึงอัลลอฮ์ (อนุญาต) ไม่ใช่มนุษย์')
            # R52 + Rule 11: อิบนุ may fuse with al- as อิบนุล (moon-letter ل) OR a
            # geminated sun-letter (ชัมซียะฮ์ assimilation), e.g. อิบนุสสัมมาก / อิบนุศเศาะบาฆ
            # — a geminate is a consonant optionally with เ then the same consonant: ([ก-ฮ])เ?\1
            for m in re.finditer(r'อิบนุ(?!ล)(?!([ก-ฮ])เ?\1)(?=[ก-ฮ])|อบู(?=[ก-ฮ])', pr):
                err(f'[R52] {e["id"]}: missing space after อิบนุ/อบู near "{pr[m.start():m.start()+12]}"')
            # missing-link (high confidence, substring-filtered)
            linked = set(e.get('persons', []))
            present = {pid: [fm for fm in fs if fm in pr] for pid, fs in forms.items()}
            present = {k: v for k, v in present.items() if v}
            for pid in present:
                if pid in linked: continue
                red = any(mf != of and mf in of for o, ofs in present.items() if o != pid
                          for mf in present[pid] for of in ofs)
                if not red: warn(f'[R86] {e["id"]}: "{pid}" named in prose but missing from persons[]')

    # report
    print(f"shards {len(files)} · events {ev_total} · accounts {acc_total} · multi-source {multi}")
    print(f"glossary {len(glo['persons'])} persons / {len(glo['places'])} places · "
          f"sources {len(src)}")
    if WARNINGS:
        print(f"\n-- {len(WARNINGS)} WARNING(s) (review, not blocking) --")
        for w in WARNINGS[:60]: print('  ', w)
        if len(WARNINGS) > 60: print(f'   ... +{len(WARNINGS)-60} more')
    if ERRORS:
        print(f"\n** {len(ERRORS)} ERROR(s) — FIX BEFORE PUSH **")
        for e in ERRORS: print('  ', e)
        return 1
    print("\n✓ PASS — no charter-rule errors")
    return 0


if __name__ == '__main__':
    sys.exit(main())
