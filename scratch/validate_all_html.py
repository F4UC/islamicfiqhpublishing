import os
import sys
import html.parser

class HTMLValidator(html.parser.HTMLParser):
    def __init__(self, filename):
        super().__init__()
        self.filename = filename
        self.tags = []
        self.errors = 0

    def handle_starttag(self, tag, attrs):
        self_closing = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 
                        'link', 'meta', 'param', 'source', 'track', 'wbr']
        if tag not in self_closing:
            self.tags.append((tag, self.getpos()))

    def handle_endtag(self, tag):
        self_closing = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 
                        'link', 'meta', 'param', 'source', 'track', 'wbr']
        if tag in self_closing:
            return
        
        if not self.tags:
            print(f"[{self.filename}] Error: Unexpected closing tag </{tag}> at line {self.getpos()[0]}, col {self.getpos()[1]}")
            self.errors += 1
            return
            
        expected_tag, pos = self.tags.pop()
        if tag != expected_tag:
            print(f"[{self.filename}] Error: Expected closing tag </{expected_tag}> (opened at line {pos[0]}, col {pos[1]}), but got </{tag}> at line {self.getpos()[0]}, col {self.getpos()[1]}")
            self.errors += 1
            self.tags.append((expected_tag, pos))

def validate_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        validator = HTMLValidator(os.path.basename(filepath))
        validator.feed(content)
        return validator.errors
    except Exception as e:
        print(f"[{os.path.basename(filepath)}] Exception during parse: {e}")
        return 1

def main():
    root_dir = "/Users/fauci/Desktop/PUBLISH/islamicfiqhpublishing-main"
    total_errors = 0
    checked_count = 0
    
    for dirpath, _, filenames in os.walk(root_dir):
        # Skip node_modules or .git directories if present
        if '.git' in dirpath or '.claude' in dirpath:
            continue
        for filename in filenames:
            if filename.endswith('.html'):
                filepath = os.path.join(dirpath, filename)
                checked_count += 1
                errors = validate_file(filepath)
                total_errors += errors
                
    print(f"\nSummary: Checked {checked_count} HTML files. Total errors: {total_errors}")
    if total_errors == 0:
        print("All HTML files are structurally VALID! 🎉")
        sys.exit(0)
    else:
        print(f"HTML validation FAILED with {total_errors} error(s). Please check logs.")
        sys.exit(1)

if __name__ == '__main__':
    main()
