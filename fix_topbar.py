with open("src/Pages/Notebook/NotebookTopbar.jsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace(", [titleMenuPortalRef]", "")
text = text.replace(",\n    [shortcutsPortalRef],\n  )", "\n  )")

with open("src/Pages/Notebook/NotebookTopbar.jsx", "w", encoding="utf-8") as f:
    f.write(text)
