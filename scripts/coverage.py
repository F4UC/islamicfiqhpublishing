#!/usr/bin/env python3
"""
scripts/coverage.py — Rule 72 content-coverage gate.

Measures char-diff coverage between a published article's `.article-body` Thai
prose and its Drive source text, to confirm no substantive content was dropped
(≥ 99% required before publish).

Method (per Rule 72):
  - Compare published `.article-body` against the Drive source.
  - Harakat-normalized: strip U+064B–U+0652 (+ U+0670) on BOTH sides so that
    de-voweling per Rule 60 does NOT register as a diff.
  - Whitespace-normalized.
  - Excluded zones (NOT counted): Arabic-script blocks (anything with lang="ar"
    / dir="rtl" or classes ar, ar-block, ar-feature, ar-inline, ar-toggle,
    quote-container, aya-block, hadith-block, ar-quote, block-ar, block-source),
    the bibliography section, and footnotes. EXCEPTION: `.thai-quote` is always
    counted, even nested inside an otherwise-excluded subtree.
  - Because every excluded block is Arabic-script while countable prose is Thai,
    coverage is computed over Thai-script characters only: this naturally drops
    Arabic source blocks / bibliography on both sides while keeping all Thai
    prose (including `.ar-translation` and `.thai-quote`, which mirror Thai that
    is present in the source).

Coverage = (chars of source matched in published) / (total source chars),
computed with difflib over the normalized Thai-only strings.

Usage:
  python3 scripts/coverage.py --article articles/<cat>/<slug>.html --source <source.txt>
  python3 scripts/coverage.py --article ... --source ...  --min 99
Exit code 0 if coverage >= --min (default 99.0), else 1.
"""
import argparse
import difflib
import re
import sys

HARAKAT = re.compile(r'[ً-ْٰ]')
THAI = re.compile(r'[฀-๿]')          # Thai block
THAI_KEEP = re.compile(r'[^฀-๿]+')   # everything that is NOT Thai


def strip_html_noise(html: str) -> str:
    """Remove script/style/comments, then drop the bibliography + footnote
    subtrees from the published side so their (few) Thai chars don't count."""
    html = re.sub(r'<!--.*?-->', ' ', html, flags=re.S)
    html = re.sub(r'<script\b.*?</script>', ' ', html, flags=re.S | re.I)
    html = re.sub(r'<style\b.*?</style>', ' ', html, flags=re.S | re.I)
    # drop bibliography-section .. end (it carries the Thai header "บรรณานุกรม")
    html = re.sub(r'<section class="bibliography-section".*?</section>', ' ', html, flags=re.S | re.I)
    html = re.sub(r'<(?:div|section|ol|ul)\b[^>]*class="[^"]*(?:fn-list|footnotes)[^"]*".*?</(?:div|section|ol|ul)>',
                  ' ', html, flags=re.S | re.I)
    return html


def article_body(html: str) -> str:
    """Extract the .article-body region; fall back to <body> if not found."""
    m = re.search(r'<(\w+)[^>]*class="[^"]*\barticle-body\b[^"]*"[^>]*>(.*)', html, flags=re.S | re.I)
    region = m.group(2) if m else html
    # cut at the article footer / bibliography if present
    region = re.split(r'<section class="bibliography-section"', region, flags=re.I)[0]
    region = re.split(r'<footer\b', region, flags=re.I)[0]
    return region


def thai_only(text: str) -> str:
    text = HARAKAT.sub('', text)
    text = re.sub(r'<[^>]+>', ' ', text)        # strip tags
    text = re.sub(r'&[a-zA-Z]+;|&#\d+;', ' ', text)  # entities
    text = THAI_KEEP.sub('', text)              # keep only Thai script
    return text


def coverage(article_path: str, source_path: str) -> float:
    html = open(article_path, encoding='utf-8').read()
    src = open(source_path, encoding='utf-8').read()
    pub_norm = thai_only(article_body(strip_html_noise(html)))
    src_norm = thai_only(HARAKAT.sub('', src))
    if not src_norm:
        raise SystemExit('coverage: source has no Thai content to compare')
    sm = difflib.SequenceMatcher(None, src_norm, pub_norm, autojunk=False)
    matched = sum(b.size for b in sm.get_matching_blocks())
    return 100.0 * matched / len(src_norm), len(src_norm), len(pub_norm), matched


def main():
    ap = argparse.ArgumentParser(description='Rule 72 content-coverage gate.')
    ap.add_argument('--article', required=True)
    ap.add_argument('--source', required=True)
    ap.add_argument('--min', type=float, default=99.0)
    a = ap.parse_args()
    pct, nsrc, npub, matched = coverage(a.article, a.source)
    print(f'source Thai chars : {nsrc}')
    print(f'published Thai chars: {npub}')
    print(f'matched chars     : {matched}')
    print(f'coverage          : {pct:.2f}%  (gate >= {a.min:.2f}%)')
    if pct + 1e-9 < a.min:
        print('RESULT: FAIL', file=sys.stderr)
        sys.exit(1)
    print('RESULT: PASS')


if __name__ == '__main__':
    main()
