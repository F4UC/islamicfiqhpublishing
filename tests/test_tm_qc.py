#!/usr/bin/env python3
"""
tests/test_tm_qc.py — Self-tests for scripts/tm_qc.py checks T1–T4.

Run with:  python3 tests/test_tm_qc.py
Exit 0 if all tests pass, 1 if any fail.

Fixtures test:
  T1a  Arabic-only detail            → T1 ERROR
  T1b  Mostly-Arabic detail (>= 40%) → T1 ERROR
  T1c  Clean Thai detail             → no T1
  T2a  ﷿ (U+FDFF) in detail          → T2 ERROR
  T2b  ﷺ (U+FDFA) in detail          → NOT flagged (S5 exempt)
  T3   Very short detail vs long ar  → T3 WARN
  T4a  ﴿text﴾ with no spaces         → T4 WARN
  T4b  ﴾text﴿ reversed brackets      → T4 WARN
  T4c  ﴿text﴾ with correct spacing   → no T4
"""
import sys
from pathlib import Path

# Allow import from repo root
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'scripts'))

from tm_qc import (
    arabic_ratio,
    find_ligature_leakage,
    find_fullword_honorific_leakage,
    check_ornate_spacing,
    translation_checks,
    ORNATE_OPEN,
    ORNATE_CLOSE,
    FDFA,
)

# ---------------------------------------------------------------------------
# Minimal shard builder
# ---------------------------------------------------------------------------

def make_shard(event_id: str, detail: str, arabic_excerpt: str) -> dict:
    return {
        'meta': {'hijriYear': 1, 'schema': 'v3'},
        'events': [{
            'id': event_id,
            'accounts': [{
                'source': 'ibn-kathir',
                'detail': detail,
                'arabicExcerpt': arabic_excerpt,
                'loc': 'test',
                'url': 'https://example.com',
            }]
        }]
    }


# ---------------------------------------------------------------------------
# Test cases
# ---------------------------------------------------------------------------

TESTS_PASSED = []
TESTS_FAILED = []


def check(name: str, condition: bool, hint: str = ''):
    if condition:
        TESTS_PASSED.append(name)
        print(f'  PASS  {name}')
    else:
        TESTS_FAILED.append(name)
        print(f'  FAIL  {name}' + (f'  ({hint})' if hint else ''))


def findings_for(detail: str, arabic: str = 'أ' * 50, event_id: str = 'test-001'):
    data = make_shard(event_id, detail, arabic)
    return translation_checks(Path('test.json'), data)


def checks_of_type(findings, check_code: str):
    return [(sev, loc, c, msg) for sev, loc, c, msg in findings if c == check_code]


# ---------------------------------------------------------------------------
# T1 tests
# ---------------------------------------------------------------------------

def test_t1():
    # T1a — Arabic-only detail → ERROR
    arabic_only = 'وَفِي هَذِهِ السَّنَةِ كَانَ كَذَا وَكَذَا وَكَانَ أَيْضًا هَكَذَا وَبَعْدَ ذَلِكَ'
    f = findings_for(arabic_only)
    t1 = checks_of_type(f, 'T1')
    check('T1a: Arabic-only detail → T1 ERROR',
          any(sev == 'ERROR' for sev, *_ in t1),
          f'got {t1}')

    # T1b — 50% Arabic → ERROR
    half_arabic = 'وَكَانَ' * 5 + 'ก' * 5   # roughly equal
    f2 = findings_for(half_arabic)
    t1b = checks_of_type(f2, 'T1')
    ratio = arabic_ratio(half_arabic)
    if ratio >= 0.40:
        check('T1b: ≥40% Arabic detail → T1 ERROR',
              any(sev == 'ERROR' for sev, *_ in t1b), f'ratio={ratio:.2f}, got {t1b}')
    else:
        check('T1b: ≥40% Arabic detail → T1 ERROR',
              any(sev in ('ERROR', 'WARN') for sev, *_ in t1b), f'ratio={ratio:.2f}, got {t1b}')

    # T1c — Clean Thai → no T1
    thai = 'ในปีนั้นเกิดเหตุการณ์สำคัญหลายอย่างขึ้นในดินแดนอิสลาม'
    f3 = findings_for(thai)
    t1c = checks_of_type(f3, 'T1')
    check('T1c: Clean Thai detail → no T1 finding', len(t1c) == 0, f'got {t1c}')


# ---------------------------------------------------------------------------
# T2 tests
# ---------------------------------------------------------------------------

def test_t2():
    # T2a — ﷿ (U+FDFF, عز وجل ligature) in detail → ERROR
    detail_with_ligature = 'อัลลอฮ์ ﷿ ทรงสร้างสรรพสิ่ง'
    f = findings_for(detail_with_ligature)
    t2 = checks_of_type(f, 'T2')
    check('T2a: ﷿ (U+FDFF) in detail → T2 ERROR',
          any(sev == 'ERROR' for sev, *_ in t2),
          f'got {t2}')

    # T2b — ﷺ (U+FDFA) in detail → NOT flagged (S5/R5 exempt)
    detail_with_salla = f'ท่านนบีมุฮัมมัด {FDFA} กล่าวว่า: ประพฤติดีต่อเพื่อนบ้าน'
    f2 = findings_for(detail_with_salla)
    t2b = checks_of_type(f2, 'T2')
    check('T2b: ﷺ (U+FDFA) in detail → NOT flagged (S5 exempt)',
          len(t2b) == 0,
          f'got {t2b}')

    # T2c — رضي الله عنه (full-word honorific) in detail → T2 ERROR
    detail_with_radi = 'อับดุลลอฮ์ رضي الله عنه กล่าวว่า: จงซื่อสัตย์'
    fw = find_fullword_honorific_leakage(detail_with_radi)
    check('T2c: رضي الله عنه in detail → full-word honorific detected',
          len(fw) > 0, f'got {fw}')
    f3 = findings_for(detail_with_radi)
    t2c = checks_of_type(f3, 'T2')
    check('T2c: رضي الله عنه in detail → T2 ERROR in findings',
          any(sev == 'ERROR' for sev, *_ in t2c), f'got {t2c}')

    # T2d — عز وجل (full-word, shorter pattern) → detected, not shadowed by longer match
    detail_azza = 'อัลลอฮ์ عز وجل ผู้ทรงยิ่งใหญ่'
    fw2 = find_fullword_honorific_leakage(detail_azza)
    check('T2d: عز وجل in detail → full-word honorific detected (not shadowed)',
          any(phrase == 'عز وجل' for phrase, *_ in fw2), f'got {fw2}')


# ---------------------------------------------------------------------------
# T3 tests
# ---------------------------------------------------------------------------

def test_t3():
    # T3 — very short Thai vs long Arabic → WARN
    short_thai = 'เหตุการณ์สงคราม'   # 15 chars
    long_arabic = 'وَكَانَ فِي هَذِهِ السَّنَةِ غَزْوَةٌ عَظِيمَةٌ وَقَدْ جَرَتْ أُمُورٌ جَلِيلَةٌ'  # 80+ chars
    ratio = len(short_thai) / len(long_arabic)
    f = findings_for(short_thai, long_arabic)
    t3 = checks_of_type(f, 'T3')
    check('T3: short detail vs long Arabic → T3 WARN',
          any(sev == 'WARN' for sev, *_ in t3),
          f'ratio={ratio:.2f}, got {t3}')


# ---------------------------------------------------------------------------
# T4 tests
# ---------------------------------------------------------------------------

def test_t4():
    # T4a — ﴿text﴾ with no spaces → WARN
    no_space = f'ประทานลงมาว่า:{ORNATE_OPEN}แท้จริงเราเห็น{ORNATE_CLOSE}เมื่อนั้น'
    issues = check_ornate_spacing(no_space)
    check('T4a: ﴿text﴾ no spaces → T4 spacing issues detected',
          len(issues) > 0, f'got {issues}')

    f = findings_for(no_space)
    t4 = checks_of_type(f, 'T4')
    check('T4a: ﴿text﴾ no spaces → T4 WARN in findings',
          any(sev == 'WARN' for sev, *_ in t4), f'got {t4}')

    # T4b — reversed brackets ﴾text﴿ → WARN
    reversed_brackets = f'ประทานลงมาว่า: {ORNATE_CLOSE}แท้จริงเราเห็น{ORNATE_OPEN} เมื่อนั้น'
    issues_r = check_ornate_spacing(reversed_brackets)
    check('T4b: reversed ﴾text﴿ → spacing issues detected',
          len(issues_r) > 0, f'got {issues_r}')

    # T4c — correct spacing ﴿text﴾ → no T4
    correct = f'ประทานลงมาว่า: {ORNATE_OPEN}แท้จริงเราเห็น{ORNATE_CLOSE} เมื่อนั้น'
    issues_c = check_ornate_spacing(correct)
    check('T4c: correct ﴿text﴾ spacing → no spacing issues',
          len(issues_c) == 0, f'got {issues_c}')


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print('Running tm_qc self-tests ...')
    print()
    print('=== T1 Arabic-heavy detail ===')
    test_t1()
    print()
    print('=== T2 Honorific/ligature leakage ===')
    test_t2()
    print()
    print('=== T3 Translation brevity ===')
    test_t3()
    print()
    print('=== T4 Ornate-bracket spacing ===')
    test_t4()
    print()
    print('=' * 40)
    print(f'Results: {len(TESTS_PASSED)} passed, {len(TESTS_FAILED)} failed')
    if TESTS_FAILED:
        print('FAILED tests:', ', '.join(TESTS_FAILED))
        sys.exit(1)
    print('ALL PASS')
    sys.exit(0)


if __name__ == '__main__':
    main()
