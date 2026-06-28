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

Translation quality checks (NON-BLOCKING — print findings, exit 0):
  T1  Arabic-heavy detail: ratio of Arabic chars >= 0.40 → ERROR
                           ratio 0.15–0.39 → WARN
      (detail should be Thai translation, not Arabic text — R89)
  T2  Honorific/ligature leakage in detail field — R92
      Arabic ligatures (U+FD40–U+FDFF) or Arabic-script honorific words
      that belong in arabicExcerpt only, not in the Thai detail field.
      Exception: ﷺ (U+FDFA) is ALLOWED per S5/R5.
  T3  Translation brevity: len(detail) / len(arabicExcerpt) < 0.60 → WARN
      (very short Thai vs long Arabic may indicate summary, not full translation — R89)
  T4  Ornate-bracket spacing: ﴿…﴾ (U+FD3F/U+FD3E) must have exactly 1 space
      before ﴿ and 1 space after ﴾, content flush inside — R92

Usage:
  python3 scripts/tm_qc.py <shard.json> [<shard2.json> ...]
  python3 scripts/tm_qc.py --all          # scan all bidayah-h*.json shards
  python3 scripts/tm_qc.py --report       # scan all, print summary table

Exit code 0 if all STRUCTURAL checks pass (T1-T4 are non-blocking).
Exit code 1 if any structural check (S1-S7) fails.
"""
import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
REPO_ROOT = Path(__file__).resolve().parent.parent
SHARD_DIR = REPO_ROOT / "pages" / "tools" / "timemachine-data"
SOURCES_FILE = SHARD_DIR / "sources.json"
CHRONICLES_FILE = SHARD_DIR / "chronicles.json"  # legacy fallback

# ---------------------------------------------------------------------------
# Unicode helpers
# ---------------------------------------------------------------------------
ARABIC_BLOCK = re.compile(r'[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]')
# Ligatures in Arabic Presentation Forms-A that are honorifics/decorative
# U+FD40–U+FDFF — but ﷺ (U+FDFA) is EXEMPT (S5/R5)
LIGATURE_RE = re.compile(r'[﵀-ﷹﷻ-﷿]')
FDFA = 'ﷺ'  # ﷺ — exempt

# Ornate brackets (R92)
ORNATE_OPEN = '﴿'   # ﴿  (visually closes in RTL — opener in LTR Thai context)
ORNATE_CLOSE = '﴾'  # ﴾  (visually opens in RTL — closer in LTR Thai context)


def arabic_ratio(text: str) -> float:
    if not text:
        return 0.0
    arabic_chars = sum(1 for c in text if ARABIC_BLOCK.match(c))
    return arabic_chars / len(text)


def find_ligature_leakage(detail: str) -> list:
    """Return list of (char, codepoint, position) for forbidden ligatures in detail."""
    findings = []
    for i, ch in enumerate(detail):
        if LIGATURE_RE.match(ch) and ch != FDFA:
            findings.append((ch, f'U+{ord(ch):04X}', i))
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
            # Check space before (unless at start)
            if i > 0 and detail[i-1] != ' ':
                issues.append(f'pos {i}: ﴿ (U+FD3F) not preceded by space (got {repr(detail[i-1])})')
            elif i > 1 and detail[i-2] == ' ':
                pass  # double space before — not an error, just unusual
            # Check no space after
            if i + 1 < len(detail) and detail[i+1] == ' ':
                issues.append(f'pos {i}: ﴿ (U+FD3F) followed by space (content must be flush)')
        elif ch == ORNATE_CLOSE:
            # Check no space before
            if i > 0 and detail[i-1] == ' ':
                issues.append(f'pos {i}: ﴾ (U+FD3E) preceded by space (content must be flush)')
            # Check space after (unless at end)
            if i + 1 < len(detail) and detail[i+1] != ' ':
                issues.append(f'pos {i}: ﴾ (U+FD3E) not followed by space (got {repr(detail[i+1])})')
    # Check for reversed bracket pairs: ﴾ before ﴿
    opens = [i for i, c in enumerate(detail) if c == ORNATE_OPEN]
    closes = [i for i, c in enumerate(detail) if c == ORNATE_CLOSE]
    if closes and opens:
        first_close = closes[0]
        first_open = opens[0]
        if first_close < first_open:
            issues.append(f'bracket order reversed: ﴾ at pos {first_close} before ﴿ at pos {first_open}')
    return issues


# ---------------------------------------------------------------------------
# Source registry loader
# ---------------------------------------------------------------------------
def load_sources() -> set:
    if SOURCES_FILE.exists():
        data = json.loads(SOURCES_FILE.read_text(encoding='utf-8'))
        # sources.json schema: { "meta": {...}, "sources": { "id": {...}, ... } }
        if 'sources' in data and isinstance(data['sources'], dict):
            return set(data['sources'].keys())
        # flat fallback (legacy format)
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

    # S1 — valid JSON
    try:
        raw = path.read_text(encoding='utf-8')
        data = json.loads(raw)
    except (json.JSONDecodeError, UnicodeDecodeError) as e:
        return [('ERROR', f'S1 JSON parse error: {e}')]

    # S2 — required top-level keys
    for key in ('meta', 'events'):
        if key not in data:
            errors.append(('ERROR', f'S2 missing top-level key: {key!r}'))
    if errors:
        return errors

    # S3 — meta fields
    meta = data['meta']
    if not isinstance(meta.get('hijriYear'), int):
        errors.append(('ERROR', 'S3 meta.hijriYear must be an integer'))
    if not isinstance(meta.get('schema'), str):
        errors.append(('ERROR', 'S3 meta.schema must be a string'))

    # S4/S5 — events and accounts
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
        # S7 — duplicate ids
        if eid in seen_ids:
            errors.append(('ERROR', f'S7 duplicate event id: {eid!r}'))
        seen_ids.add(eid)

        for ai, account in enumerate(event['accounts']):
            loc = f'event {eid!r} account[{ai}]'
            for field in ('source', 'detail', 'arabicExcerpt'):
                if not isinstance(account.get(field), str):
                    errors.append(('ERROR', f'S5 {loc} missing or non-string {field!r}'))
            # S6 — source in registry
            if known_sources and isinstance(account.get('source'), str):
                if account['source'] not in known_sources:
                    errors.append(('ERROR', f'S6 {loc} source {account["source"]!r} not in sources registry'))

    return errors


# ---------------------------------------------------------------------------
# Translation quality checks (NON-BLOCKING)
# ---------------------------------------------------------------------------
def translation_checks(path: Path, data: dict) -> list:
    """Return list of (severity, event_id, account_idx, check, msg). Never blocking."""
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

            # T2 — Honorific/ligature leakage
            leaks = find_ligature_leakage(detail)
            for ch, cp, pos in leaks:
                findings.append(('ERROR', loc, 'T2',
                    f'Arabic ligature {ch!r} ({cp}) at pos {pos} in detail — must be Thai honorific per R92'))

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
                spacing_issues = check_ornate_spacing(detail)
                for issue in spacing_issues:
                    findings.append(('WARN', loc, 'T4',
                        f'ornate-bracket spacing error — {issue} (R92)'))

    return findings


# ---------------------------------------------------------------------------
# Per-file runner
# ---------------------------------------------------------------------------
def run_file(path: Path, known_sources: set, verbose: bool = True) -> dict:
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

    # Only run T1-T4 if structural checks passed
    try:
        data = json.loads(path.read_text(encoding='utf-8'))
        result['data'] = data
    except Exception:
        return result

    findings = translation_checks(path, data)
    result['translation_findings'] = findings
    if verbose and findings:
        for sev, loc, check, msg in findings:
            print(f'  [{sev}] {check} {loc}: {msg}')

    return result


# ---------------------------------------------------------------------------
# Multi-file report
# ---------------------------------------------------------------------------
def run_report(shards: list, known_sources: set) -> int:
    """Run all shards, print summary. Returns exit code."""
    total = len(shards)
    struct_fail = 0
    t_counts = {'T1_ERROR': 0, 'T1_WARN': 0, 'T2': 0, 'T3': 0, 'T4': 0}
    t3_worst = []  # (ratio, path, loc)
    t_total = 0

    for path in sorted(shards):
        result = run_file(path, known_sources, verbose=False)

        if any(s == 'ERROR' for s, _ in result['structural_errors']):
            struct_fail += 1
            print(f'STRUCTURAL FAIL: {path.name}')
            for sev, msg in result['structural_errors']:
                print(f'  [{sev}] {msg}')
            continue

        for sev, loc, check, msg in result['translation_findings']:
            t_total += 1
            if check == 'T1' and sev == 'ERROR':
                t_counts['T1_ERROR'] += 1
                print(f'  [ERROR] T1 {path.name}/{loc}: {msg}')
            elif check == 'T1' and sev == 'WARN':
                t_counts['T1_WARN'] += 1
            elif check == 'T2':
                t_counts['T2'] += 1
                print(f'  [ERROR] T2 {path.name}/{loc}: {msg}')
            elif check == 'T3':
                t_counts['T3'] += 1
                # Extract ratio for worst-list
                m = re.search(r'ratio = ([\d.]+)', msg)
                if m:
                    t3_worst.append((float(m.group(1)), path.name, loc))
            elif check == 'T4':
                t_counts['T4'] += 1
                print(f'  [WARN] T4 {path.name}/{loc}: {msg}')

    print()
    print('=' * 60)
    print(f'Time Machine QC Report — {total} shards scanned')
    print('=' * 60)
    print(f'Structural failures (blocking) : {struct_fail}')
    print(f'T1 Arabic-heavy detail  ERROR  : {t_counts["T1_ERROR"]}')
    print(f'T1 Arabic-heavy detail  WARN   : {t_counts["T1_WARN"]}')
    print(f'T2 Honorific leakage    ERROR  : {t_counts["T2"]}')
    print(f'T3 Translation brevity  WARN   : {t_counts["T3"]}')
    print(f'T4 Ornate-bracket spac. WARN   : {t_counts["T4"]}')

    if t3_worst:
        t3_worst.sort()
        print()
        print('T3 worst-ratio cases (lowest first):')
        for ratio, fname, loc in t3_worst[:10]:
            print(f'  {ratio:.2f}  {fname}/{loc}')

    exit_code = 1 if struct_fail > 0 else 0
    print()
    print('RESULT:', 'FAIL (structural errors)' if exit_code else 'PASS')
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

    if a.report or a.all:
        shards = sorted(SHARD_DIR.glob('bidayah-h*.json'))
        if not shards:
            print('No bidayah-h*.json shards found under', SHARD_DIR)
            sys.exit(1)
        sys.exit(run_report(shards, known_sources))

    if not a.shards:
        ap.print_help()
        sys.exit(0)

    overall_exit = 0
    for raw_path in a.shards:
        path = Path(raw_path)
        print(f'--- {path.name} ---')
        result = run_file(path, known_sources, verbose=True)
        if any(s == 'ERROR' for s, _ in result['structural_errors']):
            overall_exit = 1
        if not result['translation_findings']:
            print('  [OK] T1-T4 clean')

    sys.exit(overall_exit)


if __name__ == '__main__':
    main()
