# -*- coding: utf-8 -*-
import re

with open('/Users/fauci/Desktop/PUBLISH/islamicfiqhpublishing-main/scratch_draft.txt', 'r', encoding='utf-8') as f:
    text = f.read()

words = re.findall(r'\S+', text)
for idx, word in enumerate(words):
    has_arabic = any('\u0600' <= c <= '\u06ff' for c in word)
    has_thai = any('\u0e00' <= c <= '\u0e7f' for c in word)
    if has_arabic and has_thai:
        print(f"Word {idx}: contains both Arabic and Thai: {repr(word)}")
