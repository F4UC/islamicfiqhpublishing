# -*- coding: utf-8 -*-
with open('/Users/fauci/Desktop/PUBLISH/islamicfiqhpublishing-main/scratch_draft.txt', 'r', encoding='utf-8') as f:
    text = f.read()

typos = [
    'نَحْسُบُ', 'نَحْسُบ', 'نَحْسُ', 'บ', 
    'مفารقة', 'بعدม', 'وجบ', 'الตบين', 'أจรา', 'الغรوب', 'الغรอบ',
    'أوมีเหตุสงสัย', 'หรือความผิดพลาด', 'والتمودرات', 'وأมา', 'السามع',
    'من عمل داري', 'أتحรص', 'أتحรศ', 'وعدมها'
]

for typo in typos:
    count = text.count(typo)
    print(f"Typo {repr(typo)}: count = {count}")
