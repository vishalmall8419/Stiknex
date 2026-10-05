import re

with open('src/Pages/Notebook/NotebookTopbar.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove createPortal import
content = re.sub(r'import\s+\{\s*createPortal\s*\}\s*from\s+[\'\"`]react-dom[\'\"`];?\s*', '', content)

# 2. Remove useAnchoredRect definition
content = re.sub(r'const useAnchoredRect =.*?return rect;\s*\};\s*', '', content, flags=re.DOTALL)

# 3. Remove useAnchoredRect usages
content = re.sub(r'const\s+\w+Rect\s*=\s*useAnchoredRect\([^)]+\);\s*', '', content)

# 4. For appsMenuRect, it's slightly different
content = re.sub(r'const appsMenuRect =.*?\n', '', content)

# 5. Remove portal refs inside useClickOutside
content = re.sub(r'useClickOutside\((.*?),\s*\[.*?PortalRef\]\)', r'useClickOutside(\1)', content)

# 6. Remove portal refs declarations
content = re.sub(r'const\s+\w+PortalRef\s*=\s*useRef\(null\);\s*', '', content)

# 7. Remove createPortal calls in JSX
content = re.sub(r'\w+Rect\s*&&\s*createPortal\(', '', content)
content = re.sub(r',\s*document\.body\s*\)', '', content)

# Remove ref={...PortalRef}
content = re.sub(r'ref=\{\w+PortalRef\}', '', content)

# We need to remove the dynamic style block completely:
content = re.sub(r'style=\{\{\s*position:\s*[\'\"`]fixed[\'\"`].*?\}\}', '', content, flags=re.DOTALL)

with open('src/Pages/Notebook/NotebookTopbar.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
