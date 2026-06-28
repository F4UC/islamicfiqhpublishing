#!/usr/bin/env python3
"""
scripts/tm_qc.py — Time Machine shard QC gate (R88/R89/R92).

Structural checks (BLOCKING — exit 1 on failure):
  S1  Valid JSON
  S2  Required top-level keys: meta, events
  S3  meta has: hijriYear (int), schema (str)
  S4  Every event has: id (str), accounts (list, non-empty)
  S5  Every account has: source (str), detail (str), arabicExcerpt (str)
  S6  Every account.source appears in sources.json registry
  S7  No duplicate event ids within a shard

Translation quality checks:
  T1  Arabic-heavy detail: ratio of Arabic chars >= 0.40 → ERROR (BLOCKING)
                           ratio 0.15–0.39 → WARN (non-blocking)
      (detail should be Thai translation, not Arabic text — R89)
  T2  Honorific/ligature leakage in detail field — R92 (BLOCKING on ERROR)
      Two sub-checks:
        (a) Arabic ligature glyphs U+FD40–U+FDFF (except ﷺ U+FDFA per S5/R5)
        (b) Full-word Arabic honorific phrases (sorted longest-first to prevent
            subpattern shadowing — e.g. سبحانه وتعالى matched before سبحانه):
              صلى الله عليه وسلم → ﷺ (S5)
              سبحانه وتعالى      → ซุบหานะฮูวะตะอาลา
              رضي الله عنه       → เราะฎิยัลลอฮุอันฮุ (ผันตามบริบท)
              عليه السلام        → อะลัยฮิสสลาม
              رحمه الله          → เราะหิมะฮุลลอฮ์
              جل جلاله           → FLAG (not yet in R92 table)
              عز وجل             → อัซซะวะญัลละ
              تعالى              → ตะอาลา
              سبحانه             → ซุบหานะฮู
        FLAG-severity patterns emit WARN (non-blocking); all others emit ERROR.
  T3  Translation brevity: len(detail) / len(arabicExcerpt) < 0.60 → WARN
      (very short Thai vs long Arabic may indicate summary — R89, non-blocking)
  T4  Ornate-bracket spacing: ﴿…﴾ (U+FD3F/U+FD3E) must have exactly 1 space
      before ﴿ and 1 space after ﴾, content flush inside — R92 (non-blocking)
  T5  Month canonical check: detail uses a variant spelling from glossary.json
      months[*].variantsFound instead of the canonicalThai form → WARN (non-blocking,
      glossary must be loaded; silently skipped if glossary absent — R86)

Exit codes:
  0  All structural checks pass AND T1-ERROR = 0 AND T2-ERROR = 0
  1  Any structural (S1-S7) failure, OR T1-ERROR > 0, OR T2-ERROR > 0
  T3, T4, and T5 findings are always non-blocking (printed but exit 0).

Usage:
  python3 scripts/tm_qc.py <shard.json> [<shard2.json> ...]
  python3 scripts/tm_qc.py --all          # scan all bidayah-h*.json shards
  python3 scripts/tm_qc.py --report       # scan all, print summary table
"""
import argparse
import json
import re
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
REPO_ROOT = Path(__file__).resolve().parent.parent
SHARD_DIR = REPO_ROOT / "pages" / "tools" / "timemachine-data"
SOURCES_FILE = SHARD_DIR / "sources.json"
CHRONICLES_FILE = SHARD_DIR / "chronicles.json"  # legacy fallback
GLOSSARY_FILE = SHARD_DIR / "glossary.json"

# ---------------------------------------------------------------------------
# Unicode helpers
# ---------------------------------------------------------------------------
ARABIC_BLOCK = re.compile(r'[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]')
# Ligatures in Arabic Presentation Forms-A that are honorifics/decorative
# U+FD40–U+FDFF — but ﷺ (U+FDFA) is EXEMPT (S5/R5)
LIGATURE_RE = re.compile(r'[﵀-ﷹﷻ-﷿]')
FDFA = 'ﷺ'  # ﷺ — exempt

# Ornate brackets (R92)
ORNATE_OPEN = '﴿'   # U+FD3F (visually closes in RTL — opener in LTR Thai context)
ORNATE_CLOSE = '﴾'  # U+FD3E (visually opens in RTL — closer in LTR Thai context)

# Full-word honorific patterns — sorted longest-first so longer phrases shadow
# their own substrings (e.g. سبحانه وتعالى matched before سبحانه alone).
# severity 'ERROR' = must transliterate (T2 blocking);
# severity 'FLAG'  = not yet in R92 table, emit WARN for editor.
_RAW_HONORIFIC_PATTERNS = [
    ('صلى الله عليه وسلم', 'ﷺ (S5/R5)',                                   'ERROR'),
    ('سبحانه وتعالى',      'ซุบหานะฮูวะตะอาลา (R92)',                     'ERROR'),
    ('رضي الله عنه',       'เราะฎิยัลลอฮุอันฮุ (ผันตามบริบท R92)',        'ERROR'),
    ('عليه السلام',        'อะลัยฮิสสลาม (R92)',                           'ERROR'),
    ('رحمه الله',          'เราะหิมะฮุลลอฮ์ (R92)',                        'ERROR'),
    ('جل جلاله',           '(ยังไม่อยู่ตาราง R92 — FLAG ขอบรรณาธิการ)',    'FLAG'),
    ('عز وجل',             'อัซซะวะญัลละ (R92)',                           'ERROR'),
    ('سبحانه',             'ซุบหานะฮู (R92)',                              'ERROR'),
    ('تعالى',              'ตะอาลา (R92)',                                 'ERROR'),
]
HONORIFIC_PATTERNS = sorted(_RAW_HONORIFIC_PATTERNS, key=lambda x: len(x[0]), reverse=True)


def arabic_ratio(text: str) -> float:
    if not text:
        return 0.0
    arabic_chars = sum(1 for c in text if ARABIC_BLOCK.match(c))
    return arabic_chars / len(text)


def find_ligature_leakage(detail: str) -> list:
    """Return list of (char, codepoint, position) for forbidden ligature glyphs in detail."""
    findings = []
    for i, ch in enumerate(detail):
        if LIGATURE_RE.match(ch) and ch != FDFA:
            findings.append((ch, f'U+{ord(ch):04X}', i))
    return findings


def find_fullword_honorific_leakage(detail: str) -> list:
    """
    Return list of (phrase, canonical_thai, severity, position) for full-word
    Arabic honorific phrases found in detail.

    Patterns are checked longest-first so that سبحانه وتعالى is consumed
    before سبحانه can match as a separate find within the same span.
    Matched spans are masked with null bytes so substrings don't double-fire.
    Only searches `detail` — arabicExcerpt is never touched.
    """
    findings = []
    chars = list(detail)

    for phrase, canonical, severity in HONORIFIC_PATTERNS:
        start = 0
        while True:
            haystack = ''.join(chars)
            idx = haystack.find(phrase, start)
            if idx == -1:
                break
            findings.append((phrase, canonical, severity, idx))
            # Mask matched span to prevent subpattern firing
            for k in range(idx, idx + len(phrase)):
                chars[k] = '\x00'
            start = idx + len(phrase)

    return findings


def check_ornate_spacing(detail: str) -> list:
    """
    Return list of issues with ﴿…﴾ spacing in detail.
    Rules:
      - Before ORNATE_OPEN: must have exactly 1 space (or be at string start)
      - After ORNATE_CLOSE: must have exactly 1 space (or be at string end)
      - Content immediately after ORNATE_OPEN: must NOT be a space
      - Content immediately before ORNATE_CLOSE: must NOT be a space
      - Bracket order: ﴿ must appear before ﴾ in each pair
    """
    issues = []
    for i, ch in enumerate(detail):
        if ch == ORNATE_OPEN:
            if i > 0 and detail[i-1] != ' ':
                issues.append(f'pos {i}: ﴿ (U+FD3F) not preceded by space (got {repr(detail[i-1])})')
            if i + 1 < len(detail) and detail[i+1] == ' ':
                issues.append(f'pos {i}: ﴿ (U+FD3F) followed by space (content must be flush)')
        elif ch == ORNATE_CLOSE:
            if i > 0 and detail[i-1] == ' ':
                issues.append(f'pos {i}: ﴾ (U+FD3E) preceded by space (content must be flush)')
            if i + 1 < len(detail) and detail[i+1] != ' ':
                issues.append(f'pos {i}: ﴾ (U+FD3E) not followed by space (got {repr(detail[i+1])})')
    opens = [i for i, c in enumerate(detail) if c == ORNATE_OPEN]
    closes = [i for i, c in enumerate(detail) if c == ORNATE_CLOSE]
    if closes and opens and closes[0] < opens[0]:
        issues.append(f'bracket order reversed: ﴾ at pos {closes[0]} before ﴿ at pos {opens[0]}')
    return issues


# ---------------------------------------------------------------------------
# Glossary month-variant map loader (for T5)
# ---------------------------------------------------------------------------
def load_month_variant_map() -> dict:
    """
    Return {variant_thai: canonical_thai} built from glossary.json months section.
    Silently returns {} if the file or 'months' key is absent.
    """
    if not GLOSSARY_FILE.exists():
        return {}
    try:
        data = json.loads(GLOSSARY_FILE.read_text(encoding='utf-8'))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return {}
    month_variant_map = {}
    for entry in data.get('months', []):
        canonical = entry.get('canonicalThai', '')
        for variant in entry.get('variantsFound', []):
            if variant and variant != canonical:
                month_variant_map[variant] = canonical
    return month_variant_map


# ---------------------------------------------------------------------------
# Source registry loader
# ---------------------------------------------------------------------------
def load_sources() -> set:
    if SOURCES_FILE.exists():
        data = json.loads(SOURCES_FILE.read_text(encoding='utf-8'))
        # sources.json schema: { "meta": {...}, "sources": { "id": {...}, ... } }
        if 'sources' in data and isinstance(data['sources'], dict):
            return set(data['sources'].keys())
        return set(k for k in data.keys() if k != 'meta')
    if CHRONICLES_FILE.exists():
        data = json.loads(CHRONICLES_FILE.read_text(encoding='utf-8'))
        if 'sources' in data and isinstance(data['sources'], dict):
            return set(data['sources'].keys())
        return set(data.keys())
    return set()


# ---------------------------------------------------------------------------
# Structural checks (BLOCKING)
# ---------------------------------------------------------------------------
def structural_check(path: Path, known_sources: set) -> list:
    """Return list of (severity, msg) for structural violations. 'ERROR' = blocking."""
    errors = []

    try:
        raw = path.read_text(encoding='utf-8')
        data = json.loads(raw)
    except (json.JSONDecodeError, UnicodeDecodeError) as e:
        return [('ERROR', f'S1 JSON parse error: {e}')]

    for key in ('meta', 'events'):
        if key not in data:
            errors.append(('ERROR', f'S2 missing top-level key: {key!r}'))
    if errors:
        return errors

    meta = data['meta']
    if not isinstance(meta.get('hijriYear'), int):
        errors.append(('ERROR', 'S3 meta.hijriYear must be an integer'))
    if not isinstance(meta.get('schema'), str):
        errors.append(('ERROR', 'S3 meta.schema must be a string'))

    events = data['events']
    if not isinstance(events, list):
        errors.append(('ERROR', 'S4 events must be a list'))
        return errors

    seen_ids = set()
    for ei, event in enumerate(events):
        eid = event.get('id', f'<event[{ei}]>')
        if not isinstance(event.get('id'), str):
            errors.append(('ERROR', f'S4 event[{ei}] missing or non-string id'))
        if not isinstance(event.get('accounts'), list) or len(event.get('accounts', [])) == 0:
            errors.append(('ERROR', f'S4 event {eid!r} must have non-empty accounts list'))
            continue
        if eid in seen_ids:
            errors.append(('ERROR', f'S7 duplicate event id: {eid!r}'))
        seen_ids.add(eid)

        for ai, account in enumerate(event['accounts']):
            loc = f'event {eid!r} account[{ai}]'
            for field in ('source', 'detail', 'arabicExcerpt'):
                if not isinstance(account.get(field), str):
                    errors.append(('ERROR', f'S5 {loc} missing or non-string {field!r}'))
            if known_sources and isinstance(account.get('source'), str):
                if account['source'] not in known_sources:
                    errors.append(('ERROR', f'S6 {loc} source {account["source"]!r} not in sources registry'))

    return errors


# ---------------------------------------------------------------------------
# Translation quality checks
# ---------------------------------------------------------------------------
def translation_checks(path: Path, data: dict,
                       month_variants: dict | None = None) -> list:
    """
    Return list of (severity, loc, check_code, msg).
    T1 ERROR and T2 ERROR are blocking (caller inspects severity).
    T1 WARN, T3, T4, T5 are always non-blocking.

    month_variants: {variant_thai: canonical_thai} from load_month_variant_map().
                    Pass None or {} to skip T5.
    """
    if month_variants is None:
        month_variants = {}
    findings = []
    events = data.get('events', [])

    for ei, event in enumerate(events):
        eid = event.get('id', f'<event[{ei}]>')
        accounts = event.get('accounts', [])
        for ai, account in enumerate(accounts):
            detail = account.get('detail', '')
            arabic = account.get('arabicExcerpt', '')
            loc = f'{eid}[{ai}]'

            # T1 — Arabic-heavy detail
            ratio = arabic_ratio(detail)
            if ratio >= 0.40:
                findings.append(('ERROR', loc, 'T1',
                    f'detail is {ratio:.0%} Arabic chars (≥40%); expected Thai translation (R89)'))
            elif ratio >= 0.15:
                findings.append(('WARN', loc, 'T1',
                    f'detail is {ratio:.0%} Arabic chars (15–39%); verify it is full Thai translation (R89)'))

            # T2a — ligature glyph leakage
            for ch, cp, pos in find_ligature_leakage(detail):
                findings.append(('ERROR', loc, 'T2',
                    f'Arabic ligature {ch!r} ({cp}) at pos {pos} in detail — must be Thai honorific per R92'))

            # T2b — full-word honorific phrase leakage
            for phrase, canonical, severity, pos in find_fullword_honorific_leakage(detail):
                if severity == 'FLAG':
                    findings.append(('WARN', loc, 'T2',
                        f'FLAG: Arabic honorific {phrase!r} at pos {pos} in detail — '
                        f'not yet in R92 table, FLAG for editor (canonical TH unknown)'))
                else:
                    findings.append(('ERROR', loc, 'T2',
                        f'Arabic honorific {phrase!r} at pos {pos} in detail — '
                        f'must use Thai: {canonical} (R92)'))

            # T3 — Translation brevity
            if arabic and detail:
                brevity = len(detail) / len(arabic)
                if brevity < 0.60:
                    findings.append(('WARN', loc, 'T3',
                        f'detail/arabicExcerpt length ratio = {brevity:.2f} (<0.60); '
                        f'verify full 1:1 translation not summary (R89) '
                        f'[Thai={len(detail)}, Arabic={len(arabic)}]'))

            # T4 — Ornate bracket spacing
            if ORNATE_OPEN in detail or ORNATE_CLOSE in detail:
                for issue in check_ornate_spacing(detail):
                    findings.append(('WARN', loc, 'T4',
                        f'ornate-bracket spacing error — {issue} (R92)'))

            # T5 — Month canonical check (non-blocking, skipped if no glossary)
            for variant, canonical in month_variants.items():
                if variant in detail:
                    findings.append(('WARN', loc, 'T5',
                        f'เดือนนอก canonical: {variant!r} → ใช้ {canonical!r} (R86)'))

    return findings


# ---------------------------------------------------------------------------
# Per-file runner
# ---------------------------------------------------------------------------
def run_file(path: Path, known_sources: set, verbose: bool = True,
             month_variants: dict | None = None) -> dict:
    """Run all checks on one shard. Returns result dict."""
    result = {
        'path': str(path),
        'structural_errors': [],
        'translation_findings': [],
        'data': None,
    }

    struct = structural_check(path, known_sources)
    result['structural_errors'] = struct
    if any(s == 'ERROR' for s, _ in struct):
        if verbose:
            for sev, msg in struct:
                print(f'  [{sev}] {msg}')
        return result

    try:
        data = json.loads(path.read_text(encoding='utf-8'))
        result['data'] = data
    except Exception:
        return result

    findings = translation_checks(path, data, month_variants=month_variants)
    result['translation_findings'] = findings
    if verbose and findings:
        for sev, loc, check, msg in findings:
            print(f'  [{sev}] {check} {loc}: {msg}')

    return result


def has_blocking_findings(result: dict) -> bool:
    """Return True if the result has any blocking error (structural, T1-ERROR, T2-ERROR)."""
    if any(s == 'ERROR' for s, _ in result['structural_errors']):
        return True
    for sev, loc, check, msg in result['translation_findings']:
        if sev == 'ERROR' and check in ('T1', 'T2'):
            return True
    return False


# ---------------------------------------------------------------------------
# Multi-file report
# ---------------------------------------------------------------------------
def run_report(shards: list, known_sources: set,
               month_variants: dict | None = None) -> int:
    """Run all shards, print summary. Returns exit code (1 if any blocking errors)."""
    if month_variants is None:
        month_variants = {}
    total = len(shards)
    struct_fail = 0
    t_counts = {
        'T1_ERROR': 0, 'T1_WARN': 0,
        'T2_ERROR': 0, 'T2_FLAG': 0,
        'T3': 0, 'T4': 0, 'T5': 0,
    }
    t3_worst = []

    for path in sorted(shards):
        result = run_file(path, known_sources, verbose=False,
                          month_variants=month_variants)

        if any(s == 'ERROR' for s, _ in result['structural_errors']):
            struct_fail += 1
            print(f'STRUCTURAL FAIL: {path.name}')
            for sev, msg in result['structural_errors']:
                print(f'  [{sev}] {msg}')
            continue

        for sev, loc, check, msg in result['translation_findings']:
            if check == 'T1' and sev == 'ERROR':
                t_counts['T1_ERROR'] += 1
                print(f'  [ERROR] T1 {path.name}/{loc}: {msg}')
            elif check == 'T1' and sev == 'WARN':
                t_counts['T1_WARN'] += 1
            elif check == 'T2' and sev == 'ERROR':
                t_counts['T2_ERROR'] += 1
                print(f'  [ERROR] T2 {path.name}/{loc}: {msg}')
            elif check == 'T2' and sev == 'WARN':
                t_counts['T2_FLAG'] += 1
                print(f'  [FLAG]  T2 {path.name}/{loc}: {msg}')
            elif check == 'T3':
                t_counts['T3'] += 1
                m = re.search(r'ratio = ([\d.]+)', msg)
                if m:
                    t3_worst.append((float(m.group(1)), path.name, loc))
            elif check == 'T4':
                t_counts['T4'] += 1
                print(f'  [WARN] T4 {path.name}/{loc}: {msg}')
            elif check == 'T5':
                t_counts['T5'] += 1
                print(f'  [WARN] T5 {path.name}/{loc}: {msg}')

    print()
    print('=' * 60)
    print(f'Time Machine QC Report — {total} shards scanned')
    print('=' * 60)
    print(f'Structural failures (blocking) : {struct_fail}')
    print(f'T1 Arabic-heavy detail  ERROR  : {t_counts["T1_ERROR"]}  [blocking]')
    print(f'T1 Arabic-heavy detail  WARN   : {t_counts["T1_WARN"]}')
    print(f'T2 Honorific leakage    ERROR  : {t_counts["T2_ERROR"]}  [blocking]')
    print(f'T2 Honorific leakage    FLAG   : {t_counts["T2_FLAG"]}  [non-blocking, editor review]')
    print(f'T3 Translation brevity  WARN   : {t_counts["T3"]}')
    print(f'T4 Ornate-bracket spac. WARN   : {t_counts["T4"]}')
    print(f'T5 Month canonical      WARN   : {t_counts["T5"]}  [non-blocking, R86]')

    if t3_worst:
        t3_worst.sort()
        print()
        print('T3 worst-ratio cases (lowest first):')
        for ratio, fname, loc in t3_worst[:10]:
            print(f'  {ratio:.2f}  {fname}/{loc}')

    blocking_fail = struct_fail > 0 or t_counts['T1_ERROR'] > 0 or t_counts['T2_ERROR'] > 0
    exit_code = 1 if blocking_fail else 0
    print()
    if exit_code:
        print('RESULT: FAIL (blocking errors — see T1/T2 ERROR or structural above)')
    else:
        print('RESULT: PASS')
    return exit_code


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser(description='Time Machine shard QC gate (R88/R89/R92).')
    ap.add_argument('shards', nargs='*', help='Shard JSON file paths')
    ap.add_argument('--all', action='store_true', help='Scan all bidayah-h*.json shards')
    ap.add_argument('--report', action='store_true', help='Scan all shards and print summary table')
    a = ap.parse_args()

    known_sources = load_sources()
    month_variants = load_month_variant_map()

    if a.report or a.all:
        shards = sorted(SHARD_DIR.glob('bidayah-h*.json'))
        if not shards:
            print('No bidayah-h*.json shards found under', SHARD_DIR)
            sys.exit(1)
        sys.exit(run_report(shards, known_sources, month_variants=month_variants))

    if not a.shards:
        ap.print_help()
        sys.exit(0)

    overall_exit = 0
    for raw_path in a.shards:
        path = Path(raw_path)
        print(f'--- {path.name} ---')
        result = run_file(path, known_sources, verbose=True,
                          month_variants=month_variants)
        if has_blocking_findings(result):
            overall_exit = 1
        elif not result['translation_findings']:
            print('  [OK] T1-T5 clean')

    sys.exit(overall_exit)


if __name__ == '__main__':
    main()
