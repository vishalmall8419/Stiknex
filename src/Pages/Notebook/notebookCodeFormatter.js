/**
 * Stiknex Notebook Code Formatter
 * Beautifies HTML, CSS and JavaScript with clean 2-space indentation,
 * proper nesting, and preserved syntax. Triggered by Alt+Shift+F.
 */

function formatCssBlock(css, baseIndent = '    ') {
  if (!css || !css.trim()) return '';
  const lines = [];
  const rules = css
    .replace(/\/\*[\s\S]*?\*\//g, (m) => `\n${m}\n`)
    .split('}')
    .map((r) => r.trim())
    .filter(Boolean);

  rules.forEach((rule) => {
    if (rule.startsWith('/*')) {
      lines.push(`${baseIndent}${rule}`);
      return;
    }
    const parts = rule.split('{');
    if (parts.length >= 2) {
      const selector = parts[0].trim();
      const body = parts.slice(1).join('{').trim();
      lines.push(`${baseIndent}${selector} {`);
      const declarations = body.split(';').map((d) => d.trim()).filter(Boolean);
      declarations.forEach((decl) => {
        lines.push(`${baseIndent}  ${decl};`);
      });
      lines.push(`${baseIndent}}`);
    } else {
      lines.push(`${baseIndent}${rule}`);
    }
  });
  return lines.join('\n');
}

function formatJs(js, baseIndent = '') {
  if (!js || !js.trim()) return '';
  const lines = js.split('\n');
  let indent = 0;
  const tab = '  ';
  const formatted = [];

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      formatted.push('');
      return;
    }
    if (line.startsWith('}') || line.startsWith(']') || line.startsWith(')')) {
      indent = Math.max(0, indent - 1);
    }
    formatted.push(`${baseIndent}${tab.repeat(indent)}${line}`);
    if (
      (line.endsWith('{') || line.endsWith('[') || line.endsWith('(')) &&
      !line.startsWith('//')
    ) {
      indent++;
    }
  });

  return formatted.join('\n');
}

function formatHtml(html) {
  const tab = '  ';
  let indent = 0;
  const lines = [];

  // Temporarily preserve <style> and <script> blocks
  const styleBlocks = [];
  const scriptBlocks = [];

  let clean = html.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (match, p1) => {
    const placeholder = `__STIKNEX_STYLE_${styleBlocks.length}__`;
    styleBlocks.push({ content: p1 });
    return `<style>\n${placeholder}\n</style>`;
  });

  clean = clean.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (match, attrs, p1) => {
    if (!p1.trim()) return match;
    const placeholder = `__STIKNEX_SCRIPT_${scriptBlocks.length}__`;
    scriptBlocks.push({ attrs, content: p1 });
    return `<script${attrs}>\n${placeholder}\n</script>`;
  });

  // Normalize HTML tag whitespace
  clean = clean.replace(/>\s*</g, '><').trim();

  const tokens = clean.split(/(<[^>]+>)/g).filter(Boolean);
  const voidTags = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].trim();
    if (!token) continue;

    if (token.startsWith('<') && token.endsWith('>')) {
      const isClosing = token.startsWith('</');
      const isSelfClosing = token.endsWith('/>');
      const tagNameMatch = token.match(/<\/?([a-zA-Z0-9-]+)/);
      const tagName = tagNameMatch ? tagNameMatch[1].toLowerCase() : '';
      const isVoid = voidTags.test(tagName);

      // Compact inline tags if short (e.g. <title>Hello</title> or <a href="#">Home</a>)
      if (
        tagName !== 'style' &&
        tagName !== 'script' &&
        !isClosing &&
        !isSelfClosing &&
        !isVoid &&
        i + 2 < tokens.length
      ) {
        const nextToken = tokens[i + 1].trim();
        const thirdToken = tokens[i + 2].trim();
        if (
          !nextToken.startsWith('<') &&
          thirdToken.toLowerCase() === `</${tagName}>` &&
          nextToken.length < 80
        ) {
          lines.push(`${tab.repeat(indent)}${token}${nextToken}${thirdToken}`);
          i += 2;
          continue;
        }
      }

      if (isClosing) {
        indent = Math.max(0, indent - 1);
        lines.push(`${tab.repeat(indent)}${token}`);
      } else if (isSelfClosing || isVoid) {
        lines.push(`${tab.repeat(indent)}${token}`);
      } else if (token.startsWith('<!')) {
        lines.push(token);
      } else {
        lines.push(`${tab.repeat(indent)}${token}`);
        indent++;
      }
    } else {
      // Style / Script placeholder or Text node
      if (token.startsWith('__STIKNEX_STYLE_') && token.endsWith('__')) {
        const idx = parseInt(token.replace('__STIKNEX_STYLE_', '').replace('__', ''), 10);
        if (styleBlocks[idx]) {
          const formattedCss = formatCssBlock(styleBlocks[idx].content, tab.repeat(indent));
          lines.push(formattedCss);
        }
      } else if (token.startsWith('__STIKNEX_SCRIPT_') && token.endsWith('__')) {
        const idx = parseInt(token.replace('__STIKNEX_SCRIPT_', '').replace('__', ''), 10);
        if (scriptBlocks[idx]) {
          const formattedJs = formatJs(scriptBlocks[idx].content, tab.repeat(indent));
          lines.push(formattedJs);
        }
      } else {
        lines.push(`${tab.repeat(indent)}${token}`);
      }
    }
  }

  return lines.join('\n');
}

/**
 * Main export: formatCode
 * Accepts raw code string, detects format, and returns cleanly formatted code.
 */
export function formatCode(sourceCode) {
  if (!sourceCode) return '';
  const code = sourceCode
    .replace(/\u00A0/g, ' ')
    .replace(/\u200B/g, '')
    .replace(/\r\n/g, '\n')
    .trim();

  // If HTML document or contains HTML tags
  if (
    /<\/?(?:html|head|body|div|p|span|h[1-6]|ul|ol|li|table|button|input|form|a|img|style|script|link|meta|section|header|footer|nav)\b/i.test(code) ||
    /<!DOCTYPE\b/i.test(code)
  ) {
    return formatHtml(code);
  }

  // Pure CSS
  if (code.includes('{') && code.includes('}') && code.includes(':')) {
    return formatCssBlock(code, '');
  }

  // Pure JavaScript
  return formatJs(code, '');
}
