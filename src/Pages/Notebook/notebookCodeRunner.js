/**
 * Stiknex Notebook Code Runner
 * Detects, compiles and executes HTML, CSS & JavaScript in a dedicated preview tab
 * with full DOM rendering, error capturing, and an interactive on-screen console.
 */

// Heuristics to detect if text contains HTML, CSS or JS code
const HTML_TAG_REGEX = /<\/?(?:html|head|body|div|p|span|h[1-6]|ul|ol|li|table|tr|td|th|button|input|form|a|img|canvas|svg|style|script|link|meta|section|header|footer|nav|main|aside|article|video|audio|iframe)\b[^>]*>/i;
const JS_KEYWORD_REGEX = /\b(?:console\.(?:log|error|warn|info|table)|document\.(?:getElementById|querySelector|createElement|body)|window\.|alert\(|prompt\(|confirm\(|function\s*\w*\s*\(|const\s+\w+\s*=|let\s+\w+\s*=|var\s+\w+\s*=|=>|addEventListener\(|setTimeout\(|setInterval\(|fetch\()\b/;
const CSS_RULE_REGEX = /(?:[.#\w-][^{}]*)\s*\{\s*[\w-]+:\s*[^}]+;?\s*\}/;

/**
 * Checks whether content contains executable HTML, CSS, or JavaScript
 */
export function isExecutableCode(content) {
  if (!content || typeof content !== "string") return false;
  const trimmed = content.trim();
  if (trimmed.length < 4) return false;

  return (
    HTML_TAG_REGEX.test(trimmed) ||
    JS_KEYWORD_REGEX.test(trimmed) ||
    CSS_RULE_REGEX.test(trimmed) ||
    trimmed.startsWith("<!DOCTYPE") ||
    trimmed.startsWith("<html")
  );
}

/**
 * Compiles source code into a standalone HTML5 document
 */
export function compileHtmlDocument(sourceCode, title = "Code Preview") {
  const cleanCode = (sourceCode || "").trim();

  // If already a complete HTML document
  const isFullHtml = /^\s*<!DOCTYPE\s+html/i.test(cleanCode) || /<html\b[^>]*>/i.test(cleanCode);

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
    if (result.includes('<head>')) {
      result = result.replace('<head>', '<head>' + baseDefaultStyles);
    } else if (/<head\b[^>]*>/i.test(result)) {
      result = result.replace(/(<head\b[^>]*>)/i, '$1' + baseDefaultStyles);
    } else {
      result = baseDefaultStyles + result;
    }

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

/**
 * Compiles and launches the code in a new browser tab
 */
export function runCodeInNewTab(sourceCode, title = "Notebook Code") {
  if (!sourceCode || !sourceCode.trim()) {
    return false;
  }

  const compiledHtml = compileHtmlDocument(sourceCode, title);
  const blob = new Blob([compiledHtml], { type: "text/html;charset=utf-8" });
  const previewUrl = URL.createObjectURL(blob);

  const newWindow = window.open(previewUrl, "_blank");

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
    }, 10000);
  } else {
    setTimeout(() => {
      URL.revokeObjectURL(previewUrl);
    }, 10000);
  }

  return true;
}
