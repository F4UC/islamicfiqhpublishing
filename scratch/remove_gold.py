import os

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    
    # 1. Handle Isnād Tracer specifically
    if "isnad-tracer.html" in filepath:
        if '"บรมศาสดา": "#d4af37"' in content:
            content = content.replace('"บรมศาสดา": "#d4af37"', '"บรมศาสดา": "#b31b1b"')
            modified = True
        if '"อัครปราชญ์ฟิกฮ์": "#c49a45"' in content:
            content = content.replace('"อัครปราชญ์ฟิกฮ์": "#c49a45"', '"อัครปราชญ์ฟิกฮ์": "#1e40af"')
            modified = True
        if '"อัครปราชญ์หะดีษ": "#c49a45"' in content:
            content = content.replace('"อัครปราชญ์หะดีษ": "#c49a45"', '"อัครปราชญ์หะดีษ": "#3b82f6"')
            modified = True
        if '"ประมุขวิชาหะดีษ": "#f59e0b"' in content:
            content = content.replace('"ประมุขวิชาหะดีษ": "#f59e0b"', '"ประมุขวิชาหะดีษ": "#2563eb"')
            modified = True
        if "edgeActive: '#c49a45'" in content:
            content = content.replace("edgeActive: '#c49a45'", "edgeActive: '#2563eb'")
            modified = True
        if "accent: '#c49a45'" in content:
            content = content.replace("accent: '#c49a45'", "accent: '#2563eb'")
            modified = True
            
    # 2. General CSS & HTML variables
    if "--accent-color: #c49a45;" in content:
        content = content.replace("--accent-color: #c49a45;", "--accent-color: #3b82f6;")
        modified = True
    if "--accent-color: #d4af37;" in content:
        content = content.replace("--accent-color: #d4af37;", "--accent-color: #3b82f6;")
        modified = True
        
    # 3. Replace any hardcoded gold hex codes globally in styling/text
    # c49a45
    if "#c49a45" in content:
        content = content.replace("#c49a45", "#3b82f6")
        modified = True
    if "%23c49a45" in content:
        content = content.replace("%23c49a45", "%233b82f6")
        modified = True
    # d4af37
    if "#d4af37" in content:
        content = content.replace("#d4af37", "#3b82f6")
        modified = True
    if "%23d4af37" in content:
        content = content.replace("%23d4af37", "%233b82f6")
        modified = True
        
    # 4. Replace gold RGB values in CSS (196,154,69 -> 59,130,246)
    if "196,154,69" in content:
        content = content.replace("196,154,69", "59,130,246")
        modified = True
    if "196, 154, 69" in content:
        content = content.replace("196, 154, 69", "59, 130, 246")
        modified = True
        
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {filepath}")

def walk_and_replace(directory):
    for root, dirs, files in os.walk(directory):
        # Skip git and scratch directories
        if ".git" in root or "scratch" in root:
            continue
        for file in files:
            if file.endswith(('.html', '.css', '.js')):
                process_file(os.path.join(root, file))

if __name__ == "__main__":
    base_dir = "/Users/fauci/Desktop/PUBLISH/islamicfiqhpublishing-main"
    walk_and_replace(base_dir)
    print("Gold removal complete!")
