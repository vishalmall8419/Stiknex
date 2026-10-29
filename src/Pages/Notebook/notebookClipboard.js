// Rich Clipboard Paste & Table Management Engine for Stiknex Notebook
// Preserves Excel, Google Sheets, MS Word, Google Docs formatting.
// For generic web-page pastes: strips all page-specific colors/fonts so content
// blends naturally with the notebook's own font/color settings.
// Fully sanitizes HTML with DOMPurify and handles responsive, editable tables.

import DOMPurify from 'dompurify';
import { plainTextToHtml } from './notebookEditorUtils';
import { lazyLoadFont, resolveFontFamily } from './notebookFonts';

// ---------------------------------------------------------------------------
// Source Detection
// ---------------------------------------------------------------------------

/**
 * Detects whether the HTML came from an Office / Docs productivity app.
 * These sources get full formatting preserved (fonts, colors, indentation, tables).
 * Anything else (web pages, browser tabs) goes through aggressive cleaning.
 */
function detectPasteSource(rawHtml) {
  if (!rawHtml) return 'unknown';
  // Microsoft Word / Excel
  if (/urn:schemas-microsoft-com|mso-|xmlns:o=|xmlns:w=|xmlns:x=|<w:|<o:/i.test(rawHtml)) return 'office';
  // Google Docs
  if (/docs-internal-guid/i.test(rawHtml)) return 'gdocs';
  // Google Sheets (.waffle is Sheets' root table class)
  if (/class="[^"]*waffle[^"]*"|sheets-userContent/i.test(rawHtml)) return 'gsheets';
  // Likely a regular web page (Google search, article, etc.)
  return 'web';
}

/**
 * Extracts CSS rules from <style> blocks and inlines them onto matching elements
 * Essential for Google Sheets (.waffle .s0) and Excel (.xl65) where styles are class-based
 */
function inlineStyleSheets(doc) {
  const styleTags = Array.from(doc.querySelectorAll('style'));
  
  styleTags.forEach((styleTag) => {
    const cssText = styleTag.textContent || '';
    // Regex matching: selector { declarations }
    const ruleRegex = /([^{]+)\{([^}]+)\}/g;
    let match;

    while ((match = ruleRegex.exec(cssText)) !== null) {
      const selector = match[1].trim();
      const declarations = match[2].trim();

      // Skip media queries, keyframes, pseudo-selectors, font-face
      if (selector.startsWith('@') || selector.includes(':hover') || selector.includes('::')) {
        continue;
      }

      try {
        const elements = doc.body.querySelectorAll(selector);
        elements.forEach((el) => {
          declarations.split(';').forEach((decl) => {
            const colonIdx = decl.indexOf(':');
            if (colonIdx > 0) {
              const prop = decl.slice(0, colonIdx).trim().toLowerCase();
              const val = decl.slice(colonIdx + 1).trim();

              // Filter out proprietary office prefixes
              if (
                !prop.startsWith('mso-') &&
                !prop.startsWith('-ms-') &&
                !prop.startsWith('panose-') &&
                val
              ) {
                // Only apply if element does not already have an inline style for this property
                if (!el.style.getPropertyValue(prop)) {
                  el.style.setProperty(prop, val);
                }
              }
            }
          });
        });
      } catch {
        // Ignore invalid selectors safely
      }
    }

    styleTag.remove();
  });
}

/**
 * Cleans Office / Google Docs specific proprietary wrappers and normalizes table attributes
 */
function cleanOfficeAndDocsMarkup(doc) {
  // 1. Remove XML namespaces, Office metadata, conditional comments, scripts, links
  doc.querySelectorAll('xml, o\\:p, meta, link, script, title, head').forEach((el) => el.remove());

  // 2. Unwrap Google Docs root wrapper: <b id="docs-internal-guid-..." style="font-weight:normal">
  doc.querySelectorAll('b[id^="docs-internal-guid-"]').forEach((b) => {
    const parent = b.parentNode;
    if (parent) {
      while (b.firstChild) {
        parent.insertBefore(b.firstChild, b);
      }
      parent.removeChild(b);
    }
  });

  // 3. Normalize Word Page Breaks
  doc.querySelectorAll('br[style*="page-break"], div[style*="page-break"], p[style*="page-break"], hr[class*="page-break"]').forEach((el) => {
    const pageBreak = doc.createElement('div');
    pageBreak.className = 'nb-page-break';
    pageBreak.setAttribute('data-page-break', 'true');
    const label = doc.createElement('span');
    label.className = 'nb-page-break-label';
    label.textContent = 'Page Break';
    pageBreak.appendChild(label);
    if (el.parentNode) {
      el.parentNode.replaceChild(pageBreak, el);
    }
  });

  // 4. Scan all elements to detect font-family and lazy-load web fonts, and normalize pt font sizes
  // Also remove bgcolor / background attributes from non-table elements
  doc.querySelectorAll('*').forEach((el) => {
    // Strip bgcolor/background from non-table elements (e.g. web page dark backgrounds)
    const isTableEl = ['TABLE', 'TR', 'TD', 'TH', 'THEAD', 'TBODY', 'TFOOT', 'COL', 'COLGROUP'].includes(el.tagName);
    if (!isTableEl) {
      el.removeAttribute('bgcolor');
      el.removeAttribute('background');
    }
    const styleAttr = el.getAttribute('style');
    if (styleAttr) {
      let normalizedStyle = styleAttr;

      // Extract font-family and trigger dynamic font loading
      const fontMatch = styleAttr.match(/font-familys*:s*([^;]+)/i);
      if (fontMatch) {
        const rawFamily = fontMatch[1].trim();
        const resolved = resolveFontFamily(rawFamily);
        if (resolved && resolved.isGoogle) {
          lazyLoadFont(resolved.name);
        }
      }

      // Replace windowtext border colors with clean border colors
      if (normalizedStyle.includes('windowtext')) {
        normalizedStyle = normalizedStyle.replace(/windowtext/gi, '#cbd5e1');
      }

      // Normalize font sizes: convert Word/Excel pt units to crisp px units (1pt = 1.333px)
      normalizedStyle = normalizedStyle.replace(/font-sizes*:s*(d+(?:.d+)?)pt/gi, (match, ptVal) => {
        const px = Math.round(parseFloat(ptVal) * 1.333);
        return `font-size: ${px}px`;
      });

      // Filter out proprietary office prefixes AND unwanted background/page styles
      // Keep: font-*, color, text-align, text-indent, font-weight, font-style,
      //        text-decoration, vertical-align, white-space (for tables)
      // Strip: background-color, background, margin, padding (non-table), border (non-table),
      //        width, height on block elements, page-break, display:block overrides
      const isTableEl = ['TABLE', 'TR', 'TD', 'TH', 'THEAD', 'TBODY', 'TFOOT', 'COL', 'COLGROUP'].includes(el.tagName);

      const cleaned = normalizedStyle
        .split(';')
        .filter((rule) => {
          const colonIdx = rule.indexOf(':');
          if (colonIdx < 0) return false;
          const prop = rule.slice(0, colonIdx).trim().toLowerCase();
          const trimmed = rule.trim().toLowerCase();
          if (!trimmed) return false;
          // Always strip proprietary prefixes
          if (prop.startsWith('mso-') || prop.startsWith('-ms-') || prop.startsWith('panose-')) return false;
          // Strip background-color and background from non-table elements (removes dark bg from web paste)
          if (!isTableEl && (prop === 'background-color' || prop === 'background')) return false;
          // Strip margin, padding, border from inline spans and anchors (keep block layout clean)
          if (!isTableEl && (prop === 'margin' || prop === 'padding' || prop === 'border')) return false;
          // Strip width/height from inline elements (let notebook control layout)
          if (!isTableEl && (prop === 'width' || prop === 'height' || prop === 'max-width' || prop === 'min-width')) return false;
          return true;
        })
        .join('; ');

      el.setAttribute('style', cleaned);
    }
  });

  // 5. Normalize table attributes and financial/numeric alignments
  doc.querySelectorAll('table, th, td, tr').forEach((el) => {
    // Convert bgcolor attribute to inline style
    const bgcolor = el.getAttribute('bgcolor');
    if (bgcolor && !el.style.backgroundColor) {
      el.style.backgroundColor = bgcolor;
      el.removeAttribute('bgcolor');
    }

    // Convert align attribute to text-align
    const align = el.getAttribute('align');
    if (align && !el.style.textAlign) {
      el.style.textAlign = align;
      el.removeAttribute('align');
    }

    // Convert valign attribute to vertical-align
    const valign = el.getAttribute('valign');
    if (valign && !el.style.verticalAlign) {
      el.style.verticalAlign = valign;
      el.removeAttribute('valign');
    }

    // If table cell contains monetary, numeric, percentage, or debit/credit values, align right
    if (el.tagName === 'TD' && !el.style.textAlign) {
      const txt = (el.textContent || '').trim();
      // Matches: $1,200.00, ₹50,000, 12.5%, 4500, (500.00), etc.
      const isNumericOrFinancial = /^[\$€£₹¥]?\s*\(?[\d,]+(?:\.\d+)?%?\)?$/.test(txt);
      if (isNumericOrFinancial) {
        el.style.textAlign = 'right';
      }
    }
  });

  // 4. Wrap all tables in a responsive, styled container
  doc.querySelectorAll('table').forEach((table) => {
    table.classList.add('nb-table');
    table.setAttribute('contenteditable', 'true');

    // Only wrap if not already wrapped
    const parent = table.parentElement;
    if (!parent || !parent.classList.contains('nb-table-container')) {
      const container = doc.createElement('div');
      container.className = 'nb-table-container';
      if (table.parentNode) {
        table.parentNode.insertBefore(container, table);
        container.appendChild(table);
      }
    }
  });
}

// ---------------------------------------------------------------------------
// Web-page paste cleaner
// ---------------------------------------------------------------------------

/**
 * Aggressively cleans generic web-page HTML so it adopts the notebook's own
 * font / color / line-height settings rather than the source site's styles.
 *
 * What is KEPT:
 *   • Text content (all of it)
 *   • Semantic bold / italic / underline / strikethrough
 *   • Headings (h1-h6) — re-styled by notebook CSS
 *   • Ordered & unordered lists, list items
 *   • Hyperlinks (href preserved so they remain clickable)
 *   • Tables (borders/colours stripped but structure kept)
 *   • line breaks / paragraphs
 *
 * What is STRIPPED:
 *   • ALL inline colors (color, background-color)
 *   • ALL font-family / font-size overrides
 *   • ALL margin / padding / width / height on non-table elements
 *   • Small images ≤ 32 px (favicons, site logos, inline icons)
 *   • Elements that carry only decorative/UI content: nav, header, footer,
 *     aside, [role="navigation"], [aria-hidden="true"], .sr-only, etc.
 */
function cleanWebPageMarkup(doc) {
  // 1. Remove decorative / navigation elements
  const decorSelectors = [
    'nav', 'header', 'footer', 'aside',
    '[role="navigation"]', '[role="banner"]', '[role="complementary"]',
    '[aria-hidden="true"]',
    '.sr-only', '.visually-hidden', '.screen-reader-only',
    'button', 'input', 'select', 'textarea', 'form',
    'svg[aria-hidden]', 'svg.icon',
  ];
  doc.querySelectorAll(decorSelectors.join(',')).forEach((el) => el.remove());

  // 2. Remove tiny images (favicons, inline icons, logos ≤ 32 px)
  doc.querySelectorAll('img').forEach((img) => {
    const w = parseInt(img.getAttribute('width') || img.style.width || '999', 10);
    const h = parseInt(img.getAttribute('height') || img.style.height || '999', 10);
    if (w <= 32 || h <= 32) {
      img.remove();
    }
  });

  // 3. Strip ALL inline styles from every element — notebook CSS will handle looks
  doc.querySelectorAll('*').forEach((el) => {
    el.removeAttribute('style');
    el.removeAttribute('class');
    el.removeAttribute('bgcolor');
    el.removeAttribute('color');
    el.removeAttribute('face');    // old <font face="...">
    el.removeAttribute('size');    // old <font size="...">
    el.removeAttribute('width');
    el.removeAttribute('height');
    el.removeAttribute('align');
    el.removeAttribute('valign');
    el.removeAttribute('background');
  });

  // 4. Unwrap purely decorative wrappers that add no semantic value
  //    (div, span, section, article, main, figure, figcaption, aside)
  //    but keep their children
  const unwrapTags = new Set(['div', 'span', 'section', 'article', 'main', 'figure', 'figcaption', 'center']);
  // We do multiple passes because unwrapping can nest
  let changed = true;
  while (changed) {
    changed = false;
    doc.querySelectorAll([...unwrapTags].join(',')).forEach((el) => {
      // Only unwrap if not a table-related element and has children
      if (el.childNodes.length === 0) {
        el.remove();
        changed = true;
      } else {
        const parent = el.parentNode;
        if (parent) {
          while (el.firstChild) {
            parent.insertBefore(el.firstChild, el);
          }
          el.remove();
          changed = true;
        }
      }
    });
  }

  // 5. Ensure links open in new tab and look clean
  doc.querySelectorAll('a').forEach((link) => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    // Strip everything except href so link adopts notebook color
    const href = link.getAttribute('href');
    // Remove all attributes then restore only href/target/rel
    [...link.attributes].forEach((attr) => link.removeAttribute(attr.name));
    if (href) link.setAttribute('href', href);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });

  // 6. Collapse excessive blank lines: more than 2 consecutive <br> or empty <p>
  //    (common in web pastes from rich article pages)
  doc.querySelectorAll('p, br').forEach((el) => {
    if (el.tagName === 'P' && (!el.textContent || !el.textContent.trim()) && el.children.length === 0) {
      // Empty paragraph — remove extra blank lines but keep one spacing break
      const prev = el.previousElementSibling;
      if (prev && prev.tagName === 'P' && (!prev.textContent || !prev.textContent.trim())) {
        el.remove();
      }
    }
  });
}

/**
 * Detects whether plain text content is Tab-Separated Values (TSV) from Excel/Sheets
 */
export function isTsvTable(text) {
  if (!text || typeof text !== 'string') return false;
  if (!text.includes('\t')) return false;

  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return false;

  // Check if at least one row has tab-delimited columns
  const columnCounts = lines.map((l) => l.split('\t').length);
  const maxCols = Math.max(...columnCounts);
  return maxCols >= 2;
}

/**
 * Converts raw Tab-Separated Values into a clean, editable HTML table
 */
export function tsvToHtmlTable(tsvText) {
  const lines = tsvText.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return '';

  const rows = lines.map((line) => line.split('\t'));
  let html = '<div class="nb-table-container"><table class="nb-table" contenteditable="true"><tbody>';

  rows.forEach((row, rowIdx) => {
    html += '<tr>';
    row.forEach((cellText) => {
      const clean = cellText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

      // If first row has multiple columns, format header
      if (rowIdx === 0 && rows.length > 1) {
        html += `<th>${clean || '<br>'}</th>`;
      } else {
        html += `<td>${clean || '<br>'}</td>`;
      }
    });
    html += '</tr>';
  });

  html += '</tbody></table></div><p><br></p>';
  return html;
}

/**
 * Processes rich HTML from clipboard.
 *
 * Sources are detected automatically:
 *   • office / gdocs / gsheets  →  full formatting preserved (fonts, colors, tables)
 *   • web (anything else)       →  notebook-native look; only semantic structure kept
 */
export async function processRichHtml(rawHtml, saveImageFn) {
  if (!rawHtml || typeof rawHtml !== 'string') return '';

  const source = detectPasteSource(rawHtml);
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  if (source === 'office' || source === 'gdocs' || source === 'gsheets') {
    // ── OFFICE / DOCS PATH ──────────────────────────────────────────────────
    // Step 1: Inline styles from <style> blocks before stripping
    inlineStyleSheets(doc);

    // Step 2: Clean Office/Word/Docs proprietary attributes & wrap tables
    cleanOfficeAndDocsMarkup(doc);

    // Step 3: Handle embedded images (base64)
    const imgs = Array.from(doc.querySelectorAll('img'));
    for (const img of imgs) {
      const src = img.getAttribute('src') || '';
      if (src.startsWith('data:image/') && saveImageFn) {
        const imgId = `img_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        try {
          await saveImageFn(imgId, src);
          img.setAttribute('data-img-id', imgId);
        } catch (err) {
          console.warn('Could not persist pasted image to IndexedDB:', err);
        }
      }
      img.classList.add('nb-resizable-image', 'align-center');
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
    }

    // Step 4: Ensure links open safely in new tab
    doc.querySelectorAll('a').forEach((link) => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });

    // Step 5: Sanitize securely with DOMPurify (full tag/attr set for docs)
    return DOMPurify.sanitize(doc.body.innerHTML, {
      ALLOWED_TAGS: [
        'p', 'br', 'b', 'strong', 'i', 'em', 'u', 's', 'strike', 'del',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li',
        'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
        'a', 'img', 'span', 'div', 'mark', 'blockquote', 'code', 'pre', 'hr', 'sub', 'sup',
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'style',
        'width', 'height', 'colspan', 'rowspan', 'align', 'valign', 'data-img-id', 'contenteditable',
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|data:image\/):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      FORBID_TAGS: ['script', 'style', 'iframe', 'frame', 'object', 'embed', 'form', 'input', 'button', 'link', 'meta'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'formaction', 'action'],
    });

  } else {
    // ── WEB PAGE PATH ───────────────────────────────────────────────────────
    // Strip all page-specific styles/colors so content inherits notebook look

    // Step 1: Clean structural web-page markup and strip all styling
    cleanWebPageMarkup(doc);

    // Step 2: Handle real content images (skip tiny icons already removed)
    const imgs = Array.from(doc.querySelectorAll('img'));
    for (const img of imgs) {
      const src = img.getAttribute('src') || '';
      if (src.startsWith('data:image/') && saveImageFn) {
        const imgId = `img_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        try {
          await saveImageFn(imgId, src);
          img.setAttribute('data-img-id', imgId);
        } catch (err) {
          console.warn('Could not persist pasted image to IndexedDB:', err);
        }
      }
      img.classList.add('nb-resizable-image', 'align-center');
      img.removeAttribute('style');  // no external sizing — notebook controls it
    }

    // Step 3: Sanitize with a minimal, semantic-only tag/attr set
    //         No style/class allowed — links get href only
    return DOMPurify.sanitize(doc.body.innerHTML, {
      ALLOWED_TAGS: [
        'p', 'br', 'b', 'strong', 'i', 'em', 'u', 's', 'strike', 'del',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li',
        'a', 'img', 'blockquote', 'code', 'pre', 'hr', 'sub', 'sup',
        // tables from web pages (stripped of colour but keep structure)
        'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
      ],
      ALLOWED_ATTR: [
        // Links: href only (no style/class → inherit notebook link colour)
        'href', 'target', 'rel',
        // Images: src, alt, data-img-id only
        'src', 'alt', 'data-img-id', 'class',
        // Tables: structural attributes only
        'colspan', 'rowspan',
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|data:image\/):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      FORBID_TAGS: ['script', 'style', 'iframe', 'frame', 'object', 'embed', 'form', 'input', 'button', 'link', 'meta'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'style', 'class', 'formaction', 'action'],
    });
  }
}

/**
 * Inserts sanitized HTML directly at the user's current cursor position in the editor
 */
export function insertHtmlAtCursor(editor, html) {
  if (!editor || !html) return;
  editor.focus();

  const sel = window.getSelection();
  let range = null;

  if (sel && sel.rangeCount > 0) {
    const currentRange = sel.getRangeAt(0);
    if (editor.contains(currentRange.commonAncestorContainer)) {
      range = currentRange;
    }
  }

  // Fallback to placing range at end of editor if no valid selection inside editor
  if (!range) {
    range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  // Remove any highlighted selection
  range.deleteContents();

  // Create document fragment from sanitized HTML
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  const fragment = template.content;

  if (!fragment || fragment.childNodes.length === 0) return;

  const lastNode = fragment.lastChild;

  // Insert fragment into document
  range.insertNode(fragment);

  // Position caret right after inserted content
  if (lastNode) {
    const newRange = document.createRange();
    // If last node was a table container, guarantee a paragraph follows it so user can click to write
    if (
      lastNode.nodeType === Node.ELEMENT_NODE &&
      (lastNode.classList?.contains('nb-table-container') || lastNode.tagName === 'TABLE')
    ) {
      let nextEl = lastNode.nextSibling;
      if (!nextEl || nextEl.nodeName !== 'P') {
        const p = document.createElement('p');
        p.innerHTML = '<br>';
        if (lastNode.parentNode) {
          lastNode.parentNode.insertBefore(p, lastNode.nextSibling);
        }
        nextEl = p;
      }
      newRange.setStart(nextEl, 0);
      newRange.collapse(true);
    } else {
      newRange.setStartAfter(lastNode);
      newRange.collapse(true);
    }

    sel.removeAllRanges();
    sel.addRange(newRange);
  }
}

/**
 * Handles Tab and Shift+Tab key navigation inside table cells
 */
export function handleTableKeyNavigation(e, editor, onContentChange) {
  if (e.key !== 'Tab') return false;

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return false;
  const range = sel.getRangeAt(0);

  // Check if caret is inside a table cell
  let cell = range.startContainer;
  while (cell && cell !== editor) {
    if (cell.nodeName === 'TD' || cell.nodeName === 'TH') break;
    cell = cell.parentNode;
  }

  if (!cell || (cell.nodeName !== 'TD' && cell.nodeName !== 'TH')) {
    return false;
  }

  const table = cell.closest('table');
  if (!table) return false;

  const allCells = Array.from(table.querySelectorAll('th, td'));
  const currentIndex = allCells.indexOf(cell);
  if (currentIndex === -1) return false;

  e.preventDefault();

  if (e.shiftKey) {
    // Navigate to previous cell
    if (currentIndex > 0) {
      focusTableCell(allCells[currentIndex - 1]);
    }
  } else {
    // Navigate to next cell
    if (currentIndex < allCells.length - 1) {
      focusTableCell(allCells[currentIndex + 1]);
    } else {
      // Last cell reached: Append a new row with matching column count
      const currentRow = cell.closest('tr');
      const colCount = currentRow ? currentRow.children.length : 1;
      const newRow = document.createElement('tr');
      for (let i = 0; i < colCount; i++) {
        const newCell = document.createElement('td');
        newCell.innerHTML = '<br>';
        newRow.appendChild(newCell);
      }
      const tbody = table.querySelector('tbody') || table;
      tbody.appendChild(newRow);

      focusTableCell(newRow.children[0]);
      if (typeof onContentChange === 'function') {
        onContentChange();
      }
    }
  }

  return true;
}

function focusTableCell(cell) {
  if (!cell) return;
  const range = document.createRange();
  range.selectNodeContents(cell);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

/**
 * Master Rich Clipboard Paste Dispatcher
 */
export async function handleRichClipboardPaste(e, editor, saveImageFn, onContentChange) {
  if (!editor || !e.clipboardData) return false;

  const clipboardData = e.clipboardData;
  const items = Array.from(clipboardData.items || []);

  const rawHtml = clipboardData.getData('text/html');
  const rawText = clipboardData.getData('text/plain');

  const imageItems = items.filter((item) => item.type && item.type.startsWith('image/'));

  // If user copied a raw image file and there is NO substantial HTML, let dedicated image handler process it
  const hasSubstantialHtml = rawHtml && rawHtml.trim().length > 0 && !/^<img[^>]+>$/i.test(rawHtml.trim());
  if (imageItems.length > 0 && !hasSubstantialHtml) {
    return false;
  }

  // Rich text, table, or TSV paste detected — prevent unstyled browser default
  e.preventDefault();

  let finalHtml = '';

  if (rawHtml && rawHtml.trim().length > 0) {
    finalHtml = await processRichHtml(rawHtml, saveImageFn);
  } else if (rawText && isTsvTable(rawText)) {
    finalHtml = tsvToHtmlTable(rawText);
  } else if (rawText) {
    finalHtml = plainTextToHtml(rawText);
  }

  if (!finalHtml || finalHtml.trim() === '') return false;

  insertHtmlAtCursor(editor, finalHtml);

  if (typeof onContentChange === 'function') {
    onContentChange();
  }

  return true;
}

/**
 * Inserts a new row above or below the target cell
 */
export function insertTableRow(cell, direction = 'below') {
  if (!cell) return;
  const tr = cell.closest('tr');
  if (!tr) return;

  const colCount = tr.children.length;
  const newRow = document.createElement('tr');
  for (let i = 0; i < colCount; i++) {
    const newCell = document.createElement('td');
    newCell.innerHTML = '<br>';
    newRow.appendChild(newCell);
  }

  if (direction === 'above') {
    tr.parentNode.insertBefore(newRow, tr);
  } else {
    tr.parentNode.insertBefore(newRow, tr.nextSibling);
  }

  focusTableCell(newRow.children[0]);
}

/**
 * Deletes the current row, or deletes the table if it was the last row
 */
export function deleteTableRow(cell) {
  if (!cell) return;
  const tr = cell.closest('tr');
  if (!tr) return;
  const table = tr.closest('table');
  if (!table) return;

  const allRows = table.querySelectorAll('tr');
  if (allRows.length <= 1) {
    deleteTable(cell);
    return;
  }

  const prevRow = tr.previousElementSibling || tr.nextElementSibling;
  tr.remove();

  if (prevRow && prevRow.children.length > 0) {
    focusTableCell(prevRow.children[0]);
  }
}

/**
 * Inserts a new column to the left or right of target cell
 */
export function insertTableColumn(cell, direction = 'right') {
  if (!cell) return;
  const colIndex = cell.cellIndex;
  const table = cell.closest('table');
  if (!table) return;

  const rows = table.querySelectorAll('tr');
  rows.forEach((row) => {
    const isHeader = row.parentElement?.tagName === 'THEAD' || row.querySelector('th');
    const newCell = document.createElement(isHeader ? 'th' : 'td');
    newCell.innerHTML = '<br>';

    const refCell = row.children[colIndex];
    if (direction === 'left') {
      row.insertBefore(newCell, refCell);
    } else {
      row.insertBefore(newCell, refCell ? refCell.nextSibling : null);
    }
  });

  focusTableCell(cell);
}

/**
 * Deletes the current column, or deletes the table if it was the last column
 */
export function deleteTableColumn(cell) {
  if (!cell) return;
  const colIndex = cell.cellIndex;
  const table = cell.closest('table');
  if (!table) return;

  const rows = Array.from(table.querySelectorAll('tr'));
  const firstRowCols = rows[0]?.children.length || 0;

  if (firstRowCols <= 1) {
    deleteTable(cell);
    return;
  }

  rows.forEach((row) => {
    if (row.children[colIndex]) {
      row.children[colIndex].remove();
    }
  });

  const remaining = table.querySelector('th, td');
  if (remaining) focusTableCell(remaining);
}

/**
 * Deletes the entire table container
 */
export function deleteTable(cell) {
  if (!cell) return;
  const container = cell.closest('.nb-table-container') || cell.closest('table');
  if (!container) return;

  const p = document.createElement('p');
  p.innerHTML = '<br>';
  if (container.parentNode) {
    container.parentNode.insertBefore(p, container);
    container.remove();
  }

  const range = document.createRange();
  range.setStart(p, 0);
  range.collapse(true);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}
