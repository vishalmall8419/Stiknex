import re

files = {
    'src/Pages/Landing/LandingPage.jsx': """<PageSEO
  title="Stiknex - Free Sticky Notes, Online Notebook & Productivity Tools"
  description="Stiknex is a free online productivity platform with infinite sticky boards, AI-powered notebook, Excalidraw whiteboard, calculators, QR code generator and more. No sign-up needed."
  path="/"
  type="webapp"
  keywords="sticky notes, online sticky notes, free sticky notes app, online notebook, digital whiteboard, productivity tools, excalidraw, note taking app, free online tools"
  faqs={[
    { q: 'What is Stiknex?', a: 'Stiknex is a free online productivity platform featuring infinite sticky boards, a rich-text notebook, Excalidraw whiteboard, calculators, converters, QR code generator, password generator, and color picker.' },
    { q: 'Is Stiknex free to use?', a: 'Yes, Stiknex is completely free with no sign-up required.' },
    { q: 'What tools does Stiknex offer?', a: 'Stiknex offers sticky notes, a notebook editor, an Excalidraw whiteboard, calculators, unit converters, QR code generator, password generator, and color picker.' },
    { q: 'Does Stiknex work on mobile?', a: 'Yes, Stiknex is a Progressive Web App (PWA) that works on all devices including mobile, tablet and desktop.' }
  ]}
/>""",
    'src/Pages/About/About.jsx': """<PageSEO
  title="About Stiknex - Free Productivity App by Vishal Mall"
  description="Learn about Stiknex, a free online productivity platform built by Vishal Mall. Discover the story, mission, and technology behind Stiknex sticky notes, notebook, whiteboard and tools."
  path="/about"
  type="website"
  keywords="about stiknex, stiknex developer, vishal mall, productivity app, free notes app"
/>""",
    'src/Pages/Tools/Tools.jsx': """<PageSEO
  title="Free Online Tools - Calculator, Converter, QR Code Generator | Stiknex"
  description="Access 10+ free online tools: scientific calculator, unit converter, currency converter, QR code generator, password generator, color picker, data converter and more. No sign-up needed."
  path="/tools"
  type="webapp"
  keywords="free online calculator, scientific calculator, unit converter, currency converter, QR code generator, password generator, color picker, online tools"
  faqs={[
    { q: 'What free tools are on Stiknex?', a: 'Scientific calculator, unit converter, currency converter, QR code generator, password generator, color picker, temperature and data converters.' },
    { q: 'Is the QR code generator free?', a: 'Yes, completely free with no sign-up.' }
  ]}
/>""",
    'src/Pages/Blog/Blog.jsx': """<PageSEO
  title="Blog - Productivity Tips, Notes & Tools Guides | Stiknex"
  description="Read the Stiknex blog for productivity tips, note-taking guides, digital workspace advice, and tutorials on sticky notes, notebooks, whiteboards and online tools."
  path="/blog"
  type="website"
  keywords="productivity blog, note taking tips, sticky notes guide, online tools blog, digital workspace tips, stiknex blog"
/>""",
    'src/Pages/Notebook/Notebook.jsx': """<PageSEO
  title="Free Online Notebook & Digital Note Editor | Stiknex"
  description="Write, organize and save your notes in Stiknex free online notebook. Rich text editor with headings, lists, bold, italic formatting. No sign-up required."
  path="/notebook"
  type="webapp"
  keywords="online notebook, free digital notebook, note editor, rich text editor, online notepad, note taking app online"
/>""",
    'src/Pages/Whiteboard/Whiteboard.jsx': """<PageSEO
  title="Free Online Whiteboard - Draw & Collaborate | Stiknex"
  description="Use Stiknex free online whiteboard powered by Excalidraw. Sketch, diagram, brainstorm and collaborate. No sign-up required."
  path="/whiteboard"
  type="webapp"
  keywords="free online whiteboard, excalidraw, digital whiteboard, online drawing board, whiteboard app, free sketch tool"
/>""",
    'src/Pages/BuyMeACoffee/BuyMeACoffee.jsx': """<PageSEO
  title="Support Stiknex - Buy Me a Coffee | Vishal Mall"
  description="Support the development of Stiknex, the free online productivity platform. Your contribution keeps Stiknex free and helps build new features."
  path="/buy-me-a-coffee"
  type="website"
  keywords="support stiknex, buy me a coffee, support developer, vishal mall"
/>"""
}

for file_path, replacement in files.items():
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if '<PageSEO' in content:
            content = re.sub(r'<PageSEO[^>]*/>', replacement, content, count=1, flags=re.DOTALL)
        else:
            import_statement = 'import PageSEO from "../../components/PageSEO";\n'
            content = import_statement + content
            content = re.sub(r'return\s*\(', f'return (\n    {replacement}\n', content, count=1)
            
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file_path}")
    except Exception as e:
        print(f"Error in {file_path}: {e}")

