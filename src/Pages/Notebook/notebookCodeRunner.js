/**
 * Stiknex Notebook Code Runner
 * Detects, compiles and executes HTML, CSS & JavaScript in a dedicated preview tab
 * with full DOM rendering, error capturing, and an interactive on-screen console.
 */

// Natural language & prose indicators (Hindi/English words, conversational patterns, study questions)
const NATURAL_LANGUAGE_REGEX =
  /\b(?:hai|kya|kyon|karein|hoga|hota|hote|kaise|mein|maine|likha|likhi|note|notes|node(?:\.?js)?|javascript|aur|se|ko|par|ke|ki|me|this is|what is|how to|why does|in this article|exam-ready|definition|complete notes)\b/i;

/**
 * Checks whether content contains genuine executable HTML, CSS, JavaScript or Python code,
 * while accurately filtering out study notes, prose, and empty rich-text paragraphs.
 */
export function isExecutableCode(content) {
  if (!content || typeof content !== "string") return false;
  const trimmed = content.trim();
  // Require at least 15 characters of substantial content to avoid false triggers
  if (trimmed.length < 15) return false;

  // Empty rich-text wrapper (<p><br></p>, <p style="..."><br></p>, etc.) is NEVER code
  if (/^<(?:p|div)[^>]*>(?:<br\s*\/?>|\s|&nbsp;)*<\/(?:p|div)>$/i.test(trimmed)) {
    return false;
  }

  // 1. Full HTML document is always genuine code
  const isFullHtml = /^\s*<!DOCTYPE\s+html/i.test(trimmed) || /^\s*<html\b/i.test(trimmed);
  if (isFullHtml) return true;

  // 2. Embedded executable script or style tags with content
  const hasScriptTag = /<script\b[^>]*>[\s\S]*?<\/script>/i.test(trimmed);
  const hasStyleTag = /<style\b[^>]*>[\s\S]*?<\/style>/i.test(trimmed);
  if (hasScriptTag || hasStyleTag) return true;

  // 3. If text contains predominantly natural language / study note prose, reject
  if (NATURAL_LANGUAGE_REGEX.test(trimmed)) {
    return false;
  }

  // 4. Pure HTML Structure (must have actual code elements and not just rich-text <p>, <h1>, etc.)
  const hasHtmlPair =
    /<(div|section|article|header|footer|nav|form|button|table|canvas|svg|pre|code)\b[^>]*>[\s\S]*<\/\1>/i.test(
      trimmed
    );
  if (hasHtmlPair) {
    // If it's just rich text paragraphs, headings or lists from contenteditable, it's not code
    if (/^<(?:p|div|h[1-6]|span|strong|em|ul|ol|li)[^>]*>.*<\/(?:p|div|h[1-6]|span|strong|em|ul|ol|li)>$/is.test(trimmed)) {
      return false;
    }
    return true;
  }

  // 5. Genuine JavaScript / TypeScript Program
  const hasJsCode =
    /(?:^|\n)\s*(?:const|let|var)\s+[a-zA-Z_$][\w$]*\s*=\s*[^;\n]+[;\n]/m.test(trimmed) ||
    /(?:^|\n)\s*function\s+[a-zA-Z_$][\w$]*\s*\([^)]*\)\s*\{/m.test(trimmed) ||
    /(?:^|\n)\s*(?:async\s+)?function\s*\([^)]*\)\s*\{/m.test(trimmed) ||
    /console\.(?:log|error|warn|info|table)\s*\([^)]*\)/.test(trimmed) ||
    /document\.(?:getElementById|querySelector|querySelectorAll|createElement)\s*\([^)]*\)/.test(trimmed) ||
    /\.addEventListener\s*\(['"][a-zA-Z]+['"]\s*,\s*(?:function|\([^)]*\)\s*=>)/.test(trimmed) ||
    /(?:^|\n)\s*(?:import\s+.*from\s+['"][^'"]+['"]|export\s+(?:default|const|function|class))/m.test(trimmed) ||
    /(?:^|\n)\s*class\s+[a-zA-Z_$][\w$]*(?:\s+extends\s+[a-zA-Z_$][\w$]*)?\s*\{/m.test(trimmed);

  if (hasJsCode) return true;

  // 6. Genuine CSS Stylesheet
  const hasCssRules =
    /(?:^|\n)\s*(?:[.#][a-zA-Z0-9_-]+|[a-zA-Z]+)\s*\{\s*(?:[a-zA-Z-]+:\s*[^;{}]+;\s*){2,}\}/m.test(trimmed);
  if (hasCssRules) return true;

  // 7. Python / Backend
  const hasPython =
    /(?:^|\n)\s*def\s+[a-zA-Z_]\w*\s*\([^)]*\)\s*:/m.test(trimmed) ||
    /(?:^|\n)\s*class\s+[a-zA-Z_]\w*(?:\([^)]*\))?\s*:/m.test(trimmed) ||
    /(?:^|\n)\s*(?:import\s+[a-zA-Z_]\w*|from\s+[a-zA-Z_]\w*\s+import\s+)/m.test(trimmed);

  if (hasPython) return true;

  return false;
}

/**
 * Extracts clean code or plain text from rich-text HTML content.
 * Prevents phantom <p style="..."><br></p> tags from appearing in Monaco Editor.
 */
export function extractCleanCodeFromContent(content) {
  if (!content || typeof content !== "string") return "";
  const trimmed = content.trim();
  if (!trimmed) return "";

  // Completely empty rich-text wrapper -> return empty string
  if (/^<(?:p|div)[^>]*>(?:<br\s*\/?>|\s|&nbsp;)*<\/(?:p|div)>$/i.test(trimmed)) {
    return "";
  }

  // If user wrote a full standalone HTML document, keep it intact
  if (/^\s*<!DOCTYPE\s+html/i.test(trimmed) || /^\s*<html\b/i.test(trimmed)) {
    return content;
  }

  // If DOM is available, use innerText for cleanest conversion
  if (typeof document !== "undefined") {
    const temp = document.createElement("div");
    temp.innerHTML = trimmed;
    // If only empty elements or no text
    const inner = (temp.innerText || temp.textContent || "").replace(/\u200B/g, "").trim();
    if (!inner) return "";
  }

  // Strip rich text HTML wrappers (<p...>, <h1-6...>, <ul>, <ol>, <strong>, etc.)
  let clean = trimmed
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|h[1-6]|li|tr|blockquote)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\u200B/g, "")
    .replace(/\r\n/g, "\n");

  clean = clean.replace(/\n{3,}/g, "\n\n").trim();
  return clean;
}

const HTML_TAG_REGEX = /<[a-z][\s\S]*>/i;
const JS_KEYWORD_REGEX =
  /(?:\b(?:const|let|var|function|console|document|window|setTimeout|setInterval|fetch|return|class)\b|=>)/;
const CSS_RULE_REGEX = /(?:[.#][a-zA-Z0-9_-]+|[a-zA-Z]+)\s*\{[^}]+\}/;

/**
 * Compiles source code into a standalone HTML5 document
 */
export function compileHtmlDocument(sourceCode, title = "Code Preview") {
  let cleanCode = (sourceCode || "")
    .replace(/\u00A0/g, " ") // Convert non-breaking spaces (\u00A0) back to standard ASCII spaces!
    .replace(/\u200B/g, "") // Strip zero-width spaces
    .replace(/\r\n/g, "\n")
    .trim();

  // If source code was HTML-entity encoded (e.g. &lt;!DOCTYPE or &lt;html)
  if (/&lt;(?:!DOCTYPE|html|head|body|div|p|h[1-6]|section|nav)\b/i.test(cleanCode)) {
    cleanCode = cleanCode
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&");
  }

  // Strip any accidental stray leading character before the HTML doctype/tag (e.g. accidental single quote)
  const docTypeMatch = cleanCode.match(/<!DOCTYPE\s+html/i);
  const htmlTagMatch = cleanCode.match(/<html\b/i);
  const firstTagIndex = Math.min(
    docTypeMatch ? docTypeMatch.index : Infinity,
    htmlTagMatch ? htmlTagMatch.index : Infinity
  );

  if (firstTagIndex !== Infinity && firstTagIndex > 0 && firstTagIndex < 30) {
    cleanCode = cleanCode.slice(firstTagIndex).trim();
  }

  // If already a complete HTML document
  const isFullHtml = /^\s*<!DOCTYPE\s+html/i.test(cleanCode) || /^\s*<html\b[^>]*>/i.test(cleanCode);

  const consoleBridgeScript = `
    <script>
      (function() {
        var consoleBox = null;
        var logEntries = [];

        function ensureConsole() {
          if (consoleBox) return consoleBox;
          var wrapper = document.createElement('div');
          wrapper.id = 'stiknex-console-drawer';
          wrapper.innerHTML = [
            '<div id="stiknex-console-bar">',
              '<span style="font-weight:700;display:flex;align-items:center;gap:6px;">',
                '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#10b981;"></span>',
                'Stiknex Virtual Console',
              '</span>',
              '<div style="display:flex;gap:8px;">',
                '<button id="stiknex-console-clear" style="background:#374151;color:#f3f4f6;border:none;padding:2px 8px;border-radius:4px;font-size:11px;cursor:pointer;">Clear</button>',
                '<button id="stiknex-console-toggle" style="background:#374151;color:#f3f4f6;border:none;padding:2px 8px;border-radius:4px;font-size:11px;cursor:pointer;">Hide</button>',
              '</div>',
            '</div>',
            '<div id="stiknex-console-logs"></div>'
          ].join('');

          var style = document.createElement('style');
          style.textContent = [
            '#stiknex-console-drawer {',
              'position: fixed; bottom: 0; left: 0; right: 0; z-index: 2147483647;',
              'background: #111827; color: #f9fafb; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;',
              'font-size: 12px; border-top: 1px solid #374151; box-shadow: 0 -4px 16px rgba(0,0,0,0.3);',
              'max-height: 45vh; display: flex; flex-direction: column; transition: transform 0.2s ease;',
            '}',
            '#stiknex-console-bar {',
              'display: flex; align-items: center; justify-content: space-between; padding: 6px 12px;',
              'background: #1f2937; border-bottom: 1px solid #374151; user-select: none;',
            '}',
            '#stiknex-console-logs {',
              'overflow-y: auto; padding: 6px 12px; flex: 1 1 auto; line-height: 1.5;',
            '}',
            '.stiknex-log-line {',
              'padding: 3px 0; border-bottom: 1px solid rgba(55,65,81,0.5); word-break: break-all;',
            '}',
            '.stiknex-log-info { color: #60a5fa; }',
            '.stiknex-log-warn { color: #fbbf24; }',
            '.stiknex-log-error { color: #f87171; font-weight: 600; }',
            '.stiknex-console-minimized #stiknex-console-logs { display: none; }'
          ].join('\\n');

          document.head.appendChild(style);
          document.body.appendChild(wrapper);

          document.getElementById('stiknex-console-clear').onclick = function() {
            document.getElementById('stiknex-console-logs').innerHTML = '';
          };
          var toggleBtn = document.getElementById('stiknex-console-toggle');
          toggleBtn.onclick = function() {
            wrapper.classList.toggle('stiknex-console-minimized');
            toggleBtn.textContent = wrapper.classList.contains('stiknex-console-minimized') ? 'Show' : 'Hide';
          };

          consoleBox = wrapper;
          return consoleBox;
        }

        function appendLog(type, args) {
          ensureConsole();
          var container = document.getElementById('stiknex-console-logs');
          if (!container) return;
          var div = document.createElement('div');
          div.className = 'stiknex-log-line stiknex-log-' + type;

          var textParts = [];
          for (var i = 0; i < args.length; i++) {
            var item = args[i];
            if (typeof item === 'object' && item !== null) {
              try { textParts.push(JSON.stringify(item, null, 2)); }
              catch(e) { textParts.push(String(item)); }
            } else {
              textParts.push(String(item));
            }
          }
          div.textContent = '[' + type.toUpperCase() + '] ' + textParts.join(' ');
          container.appendChild(div);
          container.scrollTop = container.scrollHeight;
        }

        var origLog = console.log;
        var origWarn = console.warn;
        var origError = console.error;
        var origInfo = console.info;

        console.log = function() { origLog.apply(console, arguments); appendLog('log', arguments); };
        console.warn = function() { origWarn.apply(console, arguments); appendLog('warn', arguments); };
        console.error = function() { origError.apply(console, arguments); appendLog('error', arguments); };
        console.info = function() { origInfo.apply(console, arguments); appendLog('info', arguments); };

        window.onerror = function(msg, url, line, col, error) {
          appendLog('error', ['Uncaught Error at line ' + line + ':' + col + ' — ' + msg]);
          return false;
        };

        window.addEventListener('unhandledrejection', function(event) {
          appendLog('error', ['Unhandled Promise Rejection: ' + (event.reason ? (event.reason.stack || event.reason) : event)]);
        });

        // Stiknex Live Code Preview synchronization listener
        function reloadLiveContent(newHtml) {
          try {
            document.open();
            document.write(newHtml);
            document.close();
          } catch(err) {
            console.error('[Stiknex Live Sync Error]:', err);
          }
        }

        try {
          if (typeof BroadcastChannel !== 'undefined') {
            var liveBc = new BroadcastChannel('stiknex_live_code_preview_channel');
            liveBc.onmessage = function(event) {
              if (event.data && event.data.type === 'LIVE_CODE_UPDATE' && event.data.html) {
                reloadLiveContent(event.data.html);
              }
            };
          }

          window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'LIVE_CODE_UPDATE' && event.data.html) {
              reloadLiveContent(event.data.html);
            }
          });
        } catch(e) {}
      })();
    </script>
  `;

  const baseDefaultStyles = `
    <style id="stiknex-runner-base">
      /* Stiknex Code Runner Base Styles: Ensures standard HTML elements always have visible, crisp styling */
      input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]):not([type="reset"]),
      textarea,
      select {
        border: 1px solid #94a3b8;
        border-radius: 6px;
        padding: 8px 12px;
        font-family: inherit;
        font-size: 14px;
        background-color: #ffffff;
        color: #0f172a;
        box-sizing: border-box;
      }
      input:focus, textarea:focus, select:focus {
        border-color: #6366f1;
        outline: 2px solid rgba(99, 102, 241, 0.25);
      }
      button, input[type="submit"], input[type="button"], input[type="reset"] {
        border: 1px solid #4f46e5;
        border-radius: 6px;
        padding: 8px 18px;
        background-color: #4f46e5;
        color: #ffffff;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        font-family: inherit;
      }
      button:hover, input[type="submit"]:hover {
        background-color: #4338ca;
      }
    </style>
  `;

  if (isFullHtml) {
    let result = cleanCode;

    // Do NOT inject baseDefaultStyles into complete HTML documents so Bootstrap/Tailwind/custom styles stay 100% accurate!
    if (result.includes('</body>')) {
      return result.replace('</body>', consoleBridgeScript + '</body>');
    }
    return result + consoleBridgeScript;
  }

  // Check if pure JS (no HTML tags, but has JS keywords)
  const isPureJs = !HTML_TAG_REGEX.test(cleanCode) && JS_KEYWORD_REGEX.test(cleanCode);
  // Check if pure CSS (no HTML tags, but has CSS rules)
  const isPureCss = !HTML_TAG_REGEX.test(cleanCode) && CSS_RULE_REGEX.test(cleanCode);

  let bodyContent = "";
  let headExtras = "";

  if (isPureJs) {
    bodyContent = `
      <div style="max-width: 650px; margin: 40px auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: center;">
        <h2 style="margin-top:0; color:#111827; font-size: 20px;">⚡ JavaScript Executed Successfully</h2>
        <p style="color:#6b7280; font-size: 14px;">Your script is running in this live environment. View the interactive output in the console drawer below.</p>
        <button onclick="location.reload()" style="background:#4f46e5; color:#ffffff; border:none; padding:8px 16px; border-radius:6px; font-weight:600; cursor:pointer;">Restart Script</button>
      </div>
      <script>
        try {
          ${cleanCode}
        } catch (e) {
          console.error(e);
        }
      </script>
    `;
  } else if (isPureCss) {
    headExtras = `<style>${cleanCode}</style>`;
    bodyContent = `
      <div class="stiknex-css-preview" style="max-width: 800px; margin: 24px auto;">
        <h1>CSS Stylesheet Applied</h1>
        <p>This is a live preview of your custom CSS rules applied to standard HTML5 elements.</p>
        <button>Sample Button</button>
        <div class="card" style="margin-top: 16px; padding: 16px; border: 1px solid #ccc; border-radius: 8px;">
          <h3>Sample Card Component</h3>
          <p>Text inside a card container to test layout, colors, and typography.</p>
        </div>
      </div>
    `;
  } else {
    // Contains HTML (and maybe embedded <style> / <script>)
    // If the user wrote script tags or inline js, wrap gracefully
    bodyContent = cleanCode;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Stiknex Code Runner</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1f2937;
      background: #ffffff;
      min-height: 100vh;
    }
  </style>
  ${headExtras}
</head>
<body>
  ${bodyContent}
  ${consoleBridgeScript}
</body>
</html>`;
}

// Active live preview window & broadcast channel tracking
let activePreviewWindow = null;
let previewBroadcastChannel = null;

/**
 * Broadcasts code updates in real time to any currently open live preview tab
 */
export function broadcastLiveCodeUpdate(sourceCode, title = "Notebook Code") {
  if (!sourceCode || typeof window === "undefined") return;
  const compiledHtml = compileHtmlDocument(sourceCode, title);

  // 1. BroadcastChannel: updates across all open preview tabs of the same origin in 0ms
  try {
    if (typeof BroadcastChannel !== "undefined") {
      if (!previewBroadcastChannel) {
        previewBroadcastChannel = new BroadcastChannel("stiknex_live_code_preview_channel");
      }
      previewBroadcastChannel.postMessage({
        type: "LIVE_CODE_UPDATE",
        html: compiledHtml,
        timestamp: Date.now(),
      });
    }
  } catch (err) {}

  // 2. Window postMessage fallback
  try {
    if (activePreviewWindow && !activePreviewWindow.closed) {
      activePreviewWindow.postMessage(
        {
          type: "LIVE_CODE_UPDATE",
          html: compiledHtml,
          timestamp: Date.now(),
        },
        "*"
      );
    }
  } catch (err) {}
}

/**
 * Compiles and launches the code in a new browser tab or refreshes the existing live preview
 */
export function runCodeInNewTab(sourceCode, title = "Notebook Code") {
  if (!sourceCode || !sourceCode.trim()) {
    return false;
  }

  try {
    const compiledHtml = compileHtmlDocument(sourceCode, title);
    const blob = new Blob([compiledHtml], { type: "text/html;charset=utf-8" });
    const previewUrl = URL.createObjectURL(blob);

    // If a preview window is already open, refresh its location and focus it
    if (activePreviewWindow && !activePreviewWindow.closed) {
      try {
        activePreviewWindow.location.href = previewUrl;
        activePreviewWindow.focus();
        broadcastLiveCodeUpdate(sourceCode, title);
        return true;
      } catch (e) {
        activePreviewWindow = null;
      }
    }

    const newWindow = window.open(previewUrl, "_blank");
    activePreviewWindow = newWindow;

    if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
      // Fallback if popup is blocked
      const anchor = document.createElement("a");
      anchor.href = previewUrl;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      document.body.appendChild(anchor);
      anchor.click();
      setTimeout(() => {
        anchor.remove();
        URL.revokeObjectURL(previewUrl);
      }, 15000);
    } else {
      setTimeout(() => {
        URL.revokeObjectURL(previewUrl);
      }, 15000);
    }

    return true;
  } catch (err) {
    console.error("Failed to run code:", err);
    return false;
  }
}
