import re

with open('api/generate-blog.js', 'r') as f:
    content = f.read()

new_prompt = '''
You are an expert tech, productivity, and lifestyle blog writer. 
Write a highly detailed, comprehensive, and original blog post (MINIMUM 2000 words, deep dive analysis) based on the keyword: "".

Important Rules:
1. Write in a completely original, engaging, and human-readable tone. Use deep analysis, case studies, step-by-step guides, and provide great value. The blog MUST BE LONG and detailed.
2. The 'content' field MUST be formatted using standard Markdown (e.g. #, ##, ###, **, -, etc.). Use lots of paragraphs, lists, and subheadings to break down the topic.
3. HYPERLINK STRATEGY (CRITICAL): 
   - PRIMARY PRIORITY: Whenever you mention anything related to Stiknex tools, you MUST add a markdown hyperlink to that specific page. 
     - Taking notes, writing, journal, notepad -> [Stiknex Notebook](/notebook)
     - Drawing, whiteboard, diagram, mindmap, excalidraw -> [Stiknex Whiteboard](/whiteboard)
     - Calculators, unit converters, QR code generator, passwords -> [Stiknex Tools](/tools)
     - Sticky notes, boards, quick notes -> [Stiknex Sticky Notes](/)
   - SECONDARY PRIORITY: For general knowledge, historical figures (like Gandhi ji), places, or concepts, you MUST add inline Hyperlinks to authoritative external sources (e.g., [Wikipedia](https://en.wikipedia.org/wiki/Main_Page) or other relevant sites).
   - If writing about weather, link to [Google Weather](https://www.google.com/search?q=weather) or a relevant weather site.
   - Embed these links naturally within the sentences. Do not just list them at the end.
4. Include a catchy title, a short excerpt (max 160 chars), SEO meta title, SEO meta description, and 5-8 SEO keywords.
5. Create a highly descriptive prompt for an AI image generator to create the header image. Make it conceptual, illustrative, or artistic, without text.

Reference Information (Use for facts only, DO NOT COPY):


Output STRICTLY as JSON with no markdown block wrappers. Use this schema:
{
  "title": "...",
  "slug": "url-friendly-slug",
  "excerpt": "...",
  "content": "# MAIN HEADER\\n\\nParagraph one with [link](url).\\n\\n## SECOND HEADER\\n\\n...",
  "metaTitle": "...",
  "metaDescription": "...",
  "keywords": "...",
  "imagePrompt": "...",
  "imageAlt": "..."
}
'''

content = re.sub(r'const prompt = .*?;', f'const prompt = {new_prompt};', content, flags=re.DOTALL)

with open('api/generate-blog.js', 'w') as f:
    f.write(content)
