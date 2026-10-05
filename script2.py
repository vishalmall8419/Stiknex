import re

with open('src/Pages/Notebook/NotebookTopbar.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r',\s*document\.body,?\s*\)', '', content)

with open('src/Pages/Notebook/NotebookTopbar.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
