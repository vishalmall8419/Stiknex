import re

with open("src/Pages/Admin2/BlogManager.jsx", "r", encoding="utf-8") as f:
    text = f.read()

# Remove import createPortal
text = re.sub(r'import\s*\{\s*createPortal\s*\}\s*from\s*[\'"]react-dom[\'"];?\s*\n', '', text)

# Remove createPortal( from JSX
text = text.replace('{isManualModalOpen && createPortal(', '{isManualModalOpen && (')

# Remove , document.body) at the end of the modal
text = text.replace('</div>\n        ,\n        document.body\n      )}', '</div>\n      )}')
text = text.replace('</div>,\n        document.body\n      )}', '</div>\n      )}')

# Just in case, let's do a regex replacement for document.body
text = re.sub(r'</div>\s*,\s*document\.body\s*\)', '</div>', text)

with open("src/Pages/Admin2/BlogManager.jsx", "w", encoding="utf-8") as f:
    f.write(text)
