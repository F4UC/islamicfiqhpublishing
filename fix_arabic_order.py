#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
fix_arabic_order.py — Arabic-display rework for the canonical article
articles/nitisart/moon-sighting-vs-astronomy.html

For each scholar quote currently in the Rule-49 collapsed shape:

    <p class="ar-translation">“…ไทย…”</p>
    <details class="ar-toggle">
      <summary>ดูต้นฉบับภาษาอาหรับ</summary>
      <blockquote lang="ar" dir="rtl" class="ar-block">…عربي…</blockquote>
    </details>

this script:
  1. MOVES the Arabic block ABOVE its Thai translation,
  2. DELETES the per-block <details> toggle (and its <summary>),
  3. re-tags the Arabic block class  ar-block -> ar-quote,
  4. injects a `.ar-quote` style + the global no-arabic hide rule into the
     article's inline <style> (replacing the now-dead SOP B.3 ar-toggle CSS).

The Arabic and Thai text are carried verbatim through regex capture groups —
they are cut/pasted byte-for-byte, never retyped (Rules 7, 8, 53, 56).

Prints "PASS" with converted= and toggles-left counts, or "FAIL" + reason.
"""
import re
import sys

ARTICLE = "articles/nitisart/moon-sighting-vs-astronomy.html"

NEW_CSS = (
    "/* SOP B.3 — ar-quote: scholar Arabic shown above its Thai translation */\n"
    ".ar-quote {\n"
    "  font-family: 'Amiri', serif;\n"
    "  direction: rtl; text-align: right;\n"
    "  font-size: 1.45rem; line-height: 2.1;\n"
    "  color: var(--text-secondary);\n"
    "  padding: 8px 16px;\n"
    "  border-right: 2px solid rgba(179,27,27,0.5);\n"
    "  margin: 28px 0 4px;\n"
    "}\n"
    "/* Global Arabic On/Off — single source of truth: html.no-arabic */\n"
    "html.no-arabic .ar-feature,\n"
    "html.no-arabic .aya-block,\n"
    "html.no-arabic .hadith-block,\n"
    "html.no-arabic .ar-quote { display: none; }\n\n"
)

# Cluster: ar-translation <p> immediately followed (only whitespace between) by
# the ar-toggle <details> that holds its Arabic. No DOTALL: thai/ar stay on
# their single source lines; \s* spans the inter-element newlines/indent.
CLUSTER = re.compile(
    r'(?P<indent> *)<p class="ar-translation">(?P<thai>.*?)</p>\s*'
    r'<details class="ar-toggle">\s*'
    r'<summary>ดูต้นฉบับภาษาอาหรับ</summary>\s*'
    r'<blockquote lang="ar" dir="rtl" class="ar-block">(?P<ar>.*?)</blockquote>\s*'
    r'</details>'
)

# CSS section to replace: from the SOP B.3 comment up to (not incl.) SOP B.1.
CSS_SECTION = re.compile(
    r'/\* SOP B\.3 — ar-toggle: ulama quotes collapsed \*/.*?(?=/\* SOP B\.1 — ar-inline \*/)',
    re.DOTALL,
)


def fail(msg):
    print("FAIL: " + msg)
    sys.exit(1)


def main():
    with open(ARTICLE, "r", encoding="utf-8") as fh:
        text = fh.read()

    original_blocks = text.count('<blockquote lang="ar" dir="rtl" class="ar-block">')
    original_toggles = text.count('<details class="ar-toggle">')

    # 1-3. Move Arabic above Thai, drop the toggle, re-tag class.
    def repl(m):
        ind = m.group("indent")
        return (
            f'{ind}<blockquote lang="ar" dir="rtl" class="ar-quote">{m.group("ar")}</blockquote>\n'
            f'{ind}<p class="ar-translation">{m.group("thai")}</p>'
        )

    text, converted = CLUSTER.subn(repl, text)

    # 4. Inject .ar-quote style + no-arabic rule (replaces dead SOP B.3 CSS).
    text, css_subs = CSS_SECTION.subn(NEW_CSS, text)

    # Verify
    toggles_left = text.count('<details class="ar-toggle">')
    summaries_left = text.count('ดูต้นฉบับภาษาอาหรับ')
    arblocks_left = text.count('class="ar-block"')
    arquotes = text.count('class="ar-quote"')

    if converted != original_toggles:
        fail(f"converted={converted} but original toggles={original_toggles}")
    if css_subs != 1:
        fail(f"CSS injection replaced {css_subs} sections (expected 1)")
    if toggles_left or summaries_left:
        fail(f"toggles left={toggles_left}, summaries left={summaries_left}")
    if arblocks_left:
        fail(f"{arblocks_left} stray class=\"ar-block\" remain")
    if arquotes != converted:
        fail(f"ar-quote count={arquotes} != converted={converted}")
    if "html.no-arabic .ar-quote { display: none; }" not in text:
        fail("no-arabic hide rule not present after injection")

    with open(ARTICLE, "w", encoding="utf-8") as fh:
        fh.write(text)

    print(f"PASS (converted={converted}, toggles left={toggles_left})")
    print(f"  original ar-block blocks : {original_blocks}")
    print(f"  ar-quote blocks now      : {arquotes}")
    print(f"  CSS sections injected    : {css_subs}")


if __name__ == "__main__":
    main()
