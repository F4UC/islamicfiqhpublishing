#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
strip_scholar_tashkeel.py — A1 ALL-OR-NOTHING tashkeel for moon-sighting.

No fully-voweled primary source ("the Doc") is available for ALL scholar
passages, and the charter forbids auto-generating/guessing vowels (Rule 53).
ALL-OR-NOTHING therefore resolves to: scholar blocks uniformly BARE.

Removes ONLY the Arabic vowel diacritics U+064B..U+0652 (fathatan, dammatan,
kasratan, fatha, damma, kasra, shadda, sukun) from scholar blocks:
  - all .ar-quote blockquotes
  - all .ar-feature blockquotes (scholar/question text)

The consonant/orthographic skeleton is never retyped — only diacritic
codepoints are deleted. Quran (.aya-block) and hadith (.hadith-block) are
NOT touched and stay fully voweled.
"""
import re
import sys

ARTICLE = "articles/nitisart/moon-sighting-vs-astronomy.html"
VOWELS = dict.fromkeys(range(0x064B, 0x0653), None)  # U+064B..U+0652 -> delete


def strip(s):
    return s.translate(VOWELS)


def main():
    t = open(ARTICLE, encoding="utf-8").read()

    def repl(m):
        return m.group(1) + strip(m.group(2)) + m.group(3)

    t, n1 = re.subn(r'(class="ar-quote">)(.*?)(</blockquote>)', repl, t, flags=re.S)
    t, n2 = re.subn(r'(class="ar-feature"[^>]*>)(.*?)(</blockquote>)', repl, t, flags=re.S)

    # Verify: no vowel marks remain in scholar blocks; aya/hadith untouched.
    scholar = re.findall(r'class="ar-quote">(.*?)</blockquote>', t, re.S) + \
              re.findall(r'class="ar-feature"[^>]*>(.*?)</blockquote>', t, re.S)
    left = sum(1 for b in scholar for ch in b if 0x064B <= ord(ch) <= 0x0652)
    if left:
        print(f"FAIL: {left} vowel marks remain in scholar blocks")
        sys.exit(1)

    open(ARTICLE, "w", encoding="utf-8").write(t)
    print(f"PASS bare: ar-quote stripped={n1}, ar-feature stripped={n2}, scholar vowel-marks left=0")


if __name__ == "__main__":
    main()
