def process():
    with open('/Users/fauci/Desktop/PUBLISH/islamicfiqhpublishing-main/scratch_draft.txt', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    print("All Arabic Lines in Draft:")
    for idx in range(len(lines)):
        line = lines[idx]
        line_num = idx + 1
        has_arabic = any('\u0600' <= c <= '\u06ff' for c in line)
        if has_arabic:
            print(f"Line {line_num}: {repr(line.strip())}")

if __name__ == '__main__':
    process()

