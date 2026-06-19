#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
lint-arabic-ortho.py — Arabic-orthography checker (DETECTION / FLAG ONLY).

Scans Arabic text for high-confidence orthographic errors using a CURATED
whole-word map (zero-guess, near-zero false positive), the same philosophy as
the Rule-73 Thai corpus table:

  [H] hamza-on-alif dropped : bare alif where the word must carry hamza
        الامام → الإمام · اجازة → إجازة · الاجازة → الإجازة · الى → إلى
  [Y] final ya / alif-maqsura: nisba names must end ـي (two dots), not ـى
        الشافعى → الشافعي · البخارى → البخاري · النووى → النووي …
        (an ALLOW-LIST of correct ـى words — إلى/على/مصطفى/يحيى/عيسى … — guards
         against false positives; only curated known-wrong forms are flagged)

WHY DETECTION-ONLY (never auto-edit):
  - ijazah-data/ is byte-exact pinned from upstream (F4UC/-Transmission-Network,
    MANIFEST.sha256). Fixes must be made UPSTREAM then re-synced — editing here
    breaks the pin.
  - Quran (Rule 7/53) / Hadith (Rule 8) Arabic is byte-exact from quran.com /
    sunnah.com. A flagged error there means RE-FETCH from source, never retype.
  This tool only reports file:line + the correct form; it changes nothing.

Whole-word matching: tokens are harakat-stripped (U+064B–U+0652, superscript
alef U+0670, tatweel U+0640) before lookup, and an optional leading و/ف
conjunction is tried too — so والامام is caught as well as الامام. Substring
false matches are impossible (e.g. الى is NOT matched inside تعالى).

Usage:  python3 scripts/lint-arabic-ortho.py [file ...]
        (no args → scans pages/tools/ijazah-data/**.json)
Exit:   0 = clean (warnings allowed), 1 = any ERROR finding, 2 = usage/IO error.
"""
import sys, os, re, glob, json

HARAKAT = re.compile(r'[ً-ْٰـ]')
ARWORD  = re.compile(r'[؀-ۿ]+')

def bare(tok):
    """harakat-stripped form for lookup"""
    return HARAKAT.sub('', tok)

# ── Curated maps (whole-word, harakat-stripped keys) ─────────────────────────
# [H] hamza dropped — bare alif that must carry hamza. High confidence.
HAMZA = {
    # general isnād vocabulary (hamzat al-qaṭʿ written bare)
    'الامام': 'الإمام', 'امام': 'إمام',
    'اجازة': 'إجازة', 'الاجازة': 'الإجازة',
    'اسناد': 'إسناد', 'الاسناد': 'الإسناد', 'اسانيد': 'أسانيد', 'الاسانيد': 'الأسانيد',
    'اجماع': 'إجماع', 'الاجماع': 'الإجماع',
    'اسماعيل': 'إسماعيل', 'ابراهيم': 'إبراهيم',
    'اسحاق': 'إسحاق', 'ادريس': 'إدريس',
    'الاسلام': 'الإسلام', 'اسلام': 'إسلام', 'اسلامي': 'إسلامي',
    'الى': 'إلى',            # preposition — bare alif
    # names / adjectives confirmed in ijazah-data (counterpart spelled correctly elsewhere)
    'الاصفهاني': 'الأصفهاني', 'الاصبهاني': 'الأصبهاني',
    'الاصم': 'الأصم', 'الارض': 'الأرض',
    'اشعري': 'أشعري', 'الاشعري': 'الأشعري',
    'انس': 'أنس', 'اول': 'أول', 'ابي': 'أبي',
    'اندلسية': 'أندلسية', 'الاندلسية': 'الأندلسية', 'اندلسي': 'أندلسي',
    'بالاولية': 'بالأولية', 'الاولية': 'الأولية', 'اولية': 'أولية',
    # NOTE: hamzat al-WAṢL stays bare (correct) — never add: ابن، اسم، الاتحاد،
    #       الاعتبار، انظر، ارحموا، استخراج … (form-VIII/X verbal nouns & imperatives)
}
# [Y] nisba names that must end ـي, not ـى. Curated (known scholars/places).
NISBA = {
    'الشافعى': 'الشافعي', 'البخارى': 'البخاري', 'النووى': 'النووي',
    'الترمذى': 'الترمذي', 'البيهقى': 'البيهقي', 'الذهبى': 'الذهبي',
    'الطبرانى': 'الطبراني', 'العسقلانى': 'العسقلاني', 'الفادانى': 'الفاداني',
    'المقدسى': 'المقدسي', 'الكوثرى': 'الكوثري', 'الاشعرى': 'الأشعري',
    'الماتريدى': 'الماتريدي',
}
# ـى forms that are CORRECT (alif maqsura, not nisba) — guard / documentation.
ALLOW_MAQSURA = {
    'إلى','على','حتى','متى','لدى','مصطفى','مرتضى','موسى','عيسى','يحيى','صلى',
    'تعالى','أعلى','الأعلى','الأولى','الكبرى','العظمى','مولى','المعنى','شتى',
    'أدنى','أقصى','الأقصى','بشرى','هدى','تقى','الدنيا',
}

CHECKS = [
    ('H', HAMZA, 'error', 'ฮัมซะฮ์บนอลิฟหาย'),
    ('Y', NISBA, 'error', 'นิสบะฮ์ต้องลงท้าย ـي (ไม่ใช่ ـى)'),
]

def scan_string(s):
    """yield finding dicts (no location) for one piece of text"""
    out = []
    for m in ARWORD.finditer(s):
        tok = m.group(0)
        b = bare(tok)
        cands = [b]
        if b[:1] in ('و', 'ف'):         # optional leading conjunction
            cands.append(b[1:])
        for cid, mp, sev, desc in CHECKS:
            for c in cands:
                if c in mp:
                    good = mp[c]
                    if c != b and b[:1] in ('و', 'ف'):
                        good = b[:1] + good   # keep the stripped conjunction
                    out.append({'id': cid, 'sev': sev, 'desc': desc,
                                'bad': tok, 'good': good})
                    break
    return out

def walk_json(node, path, findings):
    """report errors by JSON path (e.g. groups[3].bab) so minified JSON is fixable"""
    if isinstance(node, str):
        for f in scan_string(node):
            f = dict(f, loc=path, ctx=node if len(node) <= 90 else node[:87] + '…')
            findings.append(f)
    elif isinstance(node, dict):
        key = node.get('gid') or node.get('id')           # label by gid/id when present
        for k, v in node.items():
            tag = f'{path}[{key}].{k}' if key else f'{path}.{k}'
            walk_json(v, tag, findings)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            walk_json(v, f'{path}[{i}]', findings)

def lint_file(path):
    try:
        raw = open(path, encoding='utf-8').read()
    except Exception as e:
        print(f'ERROR — {path}  ({e})'); return None
    findings = []
    if path.endswith('.json'):
        try:
            walk_json(json.loads(raw), os.path.basename(path).replace('.json', ''), findings)
            return findings
        except Exception:
            pass   # not valid JSON → fall back to line scan
    for i, line in enumerate(raw.split('\n')):
        for f in scan_string(line):
            findings.append(dict(f, loc=f'line {i+1}', ctx=''))
    return findings

def main():
    args = sys.argv[1:]
    if not args:
        here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        base = os.path.join(here, 'pages', 'tools', 'ijazah-data')
        args = sorted(glob.glob(os.path.join(base, 'graphs', '*.json'))
                      + glob.glob(os.path.join(base, '*.json')))
        if not args:
            print('usage: python3 scripts/lint-arabic-ortho.py <file ...>')
            sys.exit(2)

    any_error = False
    total = 0
    for path in args:
        findings = lint_file(path)
        if findings is None:
            any_error = True; continue
        rel = os.path.relpath(path)
        if not findings:
            print(f'PASS — {rel}')
            continue
        total += len(findings)
        has_err = any(f['sev'] == 'error' for f in findings)
        if has_err:
            any_error = True; print(f'FAIL — {rel}')
        else:
            print(f'PASS (warnings) — {rel}')
        for f in sorted(findings, key=lambda x: str(x['loc'])):
            tag = ('WARN ' if f['sev'] == 'warn' else 'ERROR') + ' ' + f['id']
            ctx = f'  «…{f["ctx"]}…»' if f.get('ctx') else ''
            print(f"  [{tag}] {f['loc']}: «{f['bad']}» → «{f['good']}»  ({f['desc']}){ctx}")
    if total:
        print(f'\nรวม {total} จุดที่ต้องแก้ (DETECTION เท่านั้น — แก้ที่ source/upstream แล้ว re-sync)')
    sys.exit(1 if any_error else 0)

if __name__ == '__main__':
    main()
