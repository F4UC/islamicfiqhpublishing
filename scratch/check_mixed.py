# -*- coding: utf-8 -*-
import re

with open('/Users/fauci/Desktop/PUBLISH/islamicfiqhpublishing-main/scratch_draft.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find characters in the Arabic block that might be Thai or vice versa
# Let's print out lines with both Arabic and Thai
lines = text.split('\n')
for idx, line in enumerate(lines):
    has_arabic = any('\u0600' <= c <= '\u06ff' for c in line)
    has_thai = any('\u0e00' <= c <= '\u0e7f' for c in line)
    if has_arabic and has_thai:
        print(f"Line {idx+1}: contains both Arabic and Thai: {repr(line.strip())}")
