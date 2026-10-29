// Editor utilities for Stiknex Online Notebook
// Handles formatting, selection preservation, image processing, and to-do conversion.

/**
 * Compresses/resizes an image file if it exceeds maximum dimensions.
 * Returns a data URL (PNG/WebP/JPEG).
 */
export async function processImageFile(file, maxDim = 1920, quality = 0.88) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Prefer original type if PNG or WebP, fallback to JPEG for others
        const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
        const dataUrl = canvas.toDataURL(mime, quality);
        resolve({
          dataUrl,
          width,
          height,
          originalName: file.name || "pasted-image.png",
        });
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Escapes HTML characters
 */
export function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Converts legacy plain text notes to safe HTML
 */
export function plainTextToHtml(plain) {
  if (!plain) return "<p><br></p>";
  // Check if string is already HTML
  if (/<(p|div|ul|ol|li|img|span|h[1-6]|table|blockquote)\b/i.test(plain)) {
    return plain;
  }
  const lines = plain.split("\n");
  return lines
    .map((line) => {
      if (!line.trim()) return "<p><br></p>";
      return `<p>${escapeHtml(line)}</p>`;
    })
    .join("");
}

/**
 * Converts HTML content to readable plain text (with [x] / [ ] checklist markers)
 */
export function htmlToPlainText(html) {
  if (!html) return "";
  const temp = document.createElement("div");
  temp.innerHTML = html;

  // Transform to-do items into markdown-style checklist text
  const todos = temp.querySelectorAll(".nb-todo-item");
  todos.forEach((todo) => {
    const cb = todo.querySelector('input[type="checkbox"]');
    const textEl = todo.querySelector(".nb-todo-text") || todo;
    const isChecked = cb && cb.checked;
    const prefix = isChecked ? "[x] " : "[ ] ";
    const cleanText = textEl.textContent || "";
    const textNode = document.createTextNode(prefix + cleanText + "\n");
    todo.parentNode && todo.parentNode.replaceChild(textNode, todo);
  });

  // Transform images into text notes
  const images = temp.querySelectorAll("img");
  images.forEach((img) => {
    const alt = img.getAttribute("alt") || "Image";
    const imgNote = document.createTextNode(` [${alt}] `);
    img.parentNode && img.parentNode.replaceChild(imgNote, img);
  });

  return temp.innerText || temp.textContent || "";
}

/**
 * Inserts an image element at current selection or end of editor
 */
export function insertImageAtCursor(editor, dataUrl, imgId, width = null) {
  if (!editor) return null;
  editor.focus();

  const img = document.createElement("img");
  img.src = dataUrl;
  img.setAttribute("data-img-id", imgId || `img_${Date.now()}`);
  img.alt = "Notebook image";
  img.className = "nb-resizable-image align-center";
  img.style.maxWidth = "100%";
  img.style.height = "auto";
  img.style.display = "block";
  img.style.margin = "12px auto";
  if (width) {
    img.style.width = typeof width === "number" ? `${width}px` : width;
  }

  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    if (editor.contains(range.commonAncestorContainer)) {
      range.deleteContents();

      const p = document.createElement("p");
      p.appendChild(img);

      const nextP = document.createElement("p");
      nextP.innerHTML = "<br>";

      const fragment = document.createDocumentFragment();
      fragment.appendChild(p);
      fragment.appendChild(nextP);

      range.insertNode(fragment);

      const newRange = document.createRange();
      newRange.setStart(nextP, 0);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
      return img;
    }
  }

  const p = document.createElement("p");
  p.appendChild(img);
  editor.appendChild(p);
  const nextP = document.createElement("p");
  nextP.innerHTML = "<br>";
  editor.appendChild(nextP);
  return img;
}

/**
 * Checks if current selection is inside a To-Do item
 */
export function isSelectionInTodo(editor) {
  if (!editor) return false;
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return false;
  const range = sel.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return false;

  let node = range.commonAncestorContainer;
  while (node && node !== editor) {
    if (node.classList && node.classList.contains("nb-todo-item")) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

/**
 * Toggles To-do state on selected blocks:
 * If selected blocks are already To-do items -> converts them back to normal paragraphs!
 * If selected blocks are normal text -> converts them to To-do items!
 */
export function toggleTodoSelection(editor) {
  if (!editor) return;
  editor.focus();

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return;

  const blocks = getSelectedBlocks(editor, range);

  if (blocks.length === 0) {
    const todo = createTodoItem("");
    range.insertNode(todo);
    placeCursorInTodo(todo);
    return;
  }

  // Check if every selected block is already a todo item
  const allAreTodos = blocks.every(
    (b) =>
      (b.classList && b.classList.contains("nb-todo-item")) ||
      Boolean(b.closest && b.closest(".nb-todo-item"))
  );

  if (allAreTodos) {
    // TOGGLE OFF: Convert all to-dos back to normal paragraphs
    blocks.forEach((block) => {
      let todoEl = block.classList?.contains("nb-todo-item")
        ? block
        : block.closest?.(".nb-todo-item");

      if (todoEl && editor.contains(todoEl)) {
        const textSpan = todoEl.querySelector(".nb-todo-text");
        const p = document.createElement("p");
        p.innerHTML = textSpan ? textSpan.innerHTML || "<br>" : "<br>";
        if (todoEl.parentNode) {
          todoEl.parentNode.replaceChild(p, todoEl);
        }
      }
    });
  } else {
    // TOGGLE ON: Convert normal blocks or list items to to-dos
    blocks.forEach((block) => {
      if (block.classList && block.classList.contains("nb-todo-item")) {
        return;
      }
      const textContent = block.innerHTML || block.textContent || "";
      const cleanText = textContent === "<br>" ? "" : textContent;
      const todo = createTodoItem(cleanText);

      if (block.parentNode) {
        const parent = block.parentNode;
        if (block.tagName === "LI" && (parent.tagName === "UL" || parent.tagName === "OL")) {
          parent.parentNode && parent.parentNode.insertBefore(todo, parent);
          block.remove();
          if (parent.children.length === 0) {
            parent.remove();
          }
        } else {
          parent.replaceChild(todo, block);
        }
      }
    });
  }
}

/**
 * Toggles an unordered (bullet) or ordered (numbered) list on the selection.
 * If selection is inside a To-do, converts it to normal block first so list applies cleanly.
 */
/**
 * Toggles a Multilevel List (1. > 1.1 > 1.1.1) on the current selection.
 */
export function toggleMultilevelList(editor) {
  if (!editor) return;
  editor.focus();

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return;
  const selectionBookmark = {
    startContainer: range.startContainer,
    startOffset: range.startOffset,
    endContainer: range.endContainer,
    endOffset: range.endOffset,
  };

  const restoreSelectionAfterMove = () => {
    if (
      !editor.contains(selectionBookmark.startContainer) ||
      !editor.contains(selectionBookmark.endContainer)
    ) {
      return;
    }
    const restoredRange = document.createRange();
    restoredRange.setStart(
      selectionBookmark.startContainer,
      selectionBookmark.startOffset,
    );
    restoredRange.setEnd(
      selectionBookmark.endContainer,
      selectionBookmark.endOffset,
    );
    sel.removeAllRanges();
    sel.addRange(restoredRange);
  };

  const findAncestor = (node, tagName) => {
    let current = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement;
    while (current && current !== editor) {
      if (current.tagName === tagName) return current;
      current = current.parentElement;
    }
    return null;
  };

  const listItem = findAncestor(range.startContainer, "LI");
  const parentList = listItem?.parentElement;

  if (listItem && parentList?.tagName === "OL") {
    const ancestorListItem = parentList.parentElement?.closest("li");

    if (ancestorListItem) {
      const containingList = ancestorListItem.parentElement;
      if (containingList?.tagName === "OL" || containingList?.tagName === "UL") {
        containingList.insertBefore(listItem, ancestorListItem.nextElementSibling);
        if (parentList.children.length === 0) parentList.remove();
        restoreSelectionAfterMove();
      }
      return;
    }

    const previousItem = listItem.previousElementSibling;
    if (previousItem?.tagName === "LI") {
      let nestedList = Array.from(previousItem.children).find(
        (child) => child.tagName === "OL",
      );
      if (!nestedList) {
        nestedList = document.createElement("ol");
        previousItem.appendChild(nestedList);
      }
      nestedList.appendChild(listItem);
      parentList.classList.add("nb-multilevel-list");
      restoreSelectionAfterMove();
      return;
    }

    if (parentList.classList.contains("nb-multilevel-list")) {
      parentList.classList.remove("nb-multilevel-list");
    } else {
      parentList.classList.add("nb-multilevel-list");
    }
    return;
  }

  const blocks = getSelectedBlocks(editor, range);
  blocks.forEach((block) => {
    const todoEl = block.classList?.contains("nb-todo-item")
      ? block
      : block.closest?.(".nb-todo-item");
    if (todoEl && editor.contains(todoEl)) {
      const textSpan = todoEl.querySelector(".nb-todo-text");
      const paragraph = document.createElement("p");
      paragraph.innerHTML = textSpan ? textSpan.innerHTML || "<br>" : "<br>";
      todoEl.parentNode?.replaceChild(paragraph, todoEl);
    }
  });

  document.execCommand("insertOrderedList", false, null);
  const selectionAfterCommand = window.getSelection();
  if (selectionAfterCommand?.rangeCount) {
    const listAfterCommand = findAncestor(
      selectionAfterCommand.getRangeAt(0).startContainer,
      "OL",
    );
    listAfterCommand?.classList.add("nb-multilevel-list");
  }
}

/**
 * Checks if current selection is inside a Multilevel List
 */
export function isSelectionInMultilevelList(editor) {
  if (!editor) return false;
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return false;
  const range = sel.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return false;

  let node = range.commonAncestorContainer;
  while (node && node !== editor) {
    if (node.classList && node.classList.contains("nb-multilevel-list")) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

export function toggleListSelection(editor, listType = "unordered") {
  if (!editor) return;
  editor.focus();

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return;

  // If any selected block is a todo item, convert to paragraph first
  const blocks = getSelectedBlocks(editor, range);
  blocks.forEach((block) => {
    let todoEl = block.classList?.contains("nb-todo-item")
      ? block
      : block.closest?.(".nb-todo-item");
    if (todoEl && editor.contains(todoEl)) {
      const textSpan = todoEl.querySelector(".nb-todo-text");
      const p = document.createElement("p");
      p.innerHTML = textSpan ? textSpan.innerHTML || "<br>" : "<br>";
      if (todoEl.parentNode) {
        todoEl.parentNode.replaceChild(p, todoEl);
      }
    }
  });

  const cmd = listType === "ordered" ? "insertOrderedList" : "insertUnorderedList";
  document.execCommand(cmd, false, null);
}

/**
 * Converts selected text blocks to interactive to-do items
 */
export function convertSelectionToTodo(editor) {
  toggleTodoSelection(editor);
}

/**
 * Converts selected to-do items or list items back into normal paragraphs
 */
export function convertSelectionToNormalText(editor) {
  if (!editor) return;
  editor.focus();

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return;

  const blocks = getSelectedBlocks(editor, range);
  blocks.forEach((block) => {
    let todoEl = null;
    if (block.classList && block.classList.contains("nb-todo-item")) {
      todoEl = block;
    } else if (block.closest) {
      todoEl = block.closest(".nb-todo-item");
    }

    if (todoEl && editor.contains(todoEl)) {
      const textSpan = todoEl.querySelector(".nb-todo-text");
      const p = document.createElement("p");
      p.innerHTML = textSpan ? textSpan.innerHTML || "<br>" : "<br>";
      if (todoEl.parentNode) {
        todoEl.parentNode.replaceChild(p, todoEl);
      }
    }
  });

  // If selection is inside an unordered or ordered list, un-list it
  try {
    if (document.queryCommandState("insertUnorderedList")) {
      document.execCommand("insertUnorderedList", false, null);
    }
    if (document.queryCommandState("insertOrderedList")) {
      document.execCommand("insertOrderedList", false, null);
    }
    document.execCommand("formatBlock", false, "p");
  } catch {}
}

/**
 * Applies text color, or cleanly removes color if color is 'inherit' / 'default' / none
 */
export function applyTextColor(editor, color) {
  if (!editor) return;
  editor.focus();

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return;

  const isClear = !color || color === "inherit" || color === "default";

  if (isClear) {
    // Cleanly remove color styling from selected elements
    const container = range.commonAncestorContainer;
    const parent =
      container.nodeType === Node.TEXT_NODE
        ? container.parentNode
        : container;

    if (parent && editor.contains(parent)) {
      if (parent.tagName === "FONT" || parent.style?.color) {
        parent.style.color = "";
        parent.removeAttribute("color");
      }
      const colored = parent.querySelectorAll
        ? parent.querySelectorAll("[style*='color'], font")
        : [];
      colored.forEach((el) => {
        if (range.intersectsNode(el)) {
          el.style.color = "";
          el.removeAttribute("color");
        }
      });
    }

    try {
      document.execCommand("foreColor", false, "inherit");
    } catch {}
  } else {
    if (range.isCollapsed) {
      const span = document.createElement("span");
      span.style.color = color;
      span.textContent = "\u200B";
      range.insertNode(span);
      const newRange = document.createRange();
      newRange.setStart(span.firstChild, 1);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
    } else {
      document.execCommand("foreColor", false, color);
    }
  }
}

/**
 * Applies highlight background color, or cleanly removes highlight if 'transparent' / 'none'
 */

/**
 * Checks if current selection is highlighted
 */
export function isSelectionHighlighted(editor) {
  if (!editor) return false;
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return false;
  const range = sel.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return false;

  let node = range.commonAncestorContainer;
  if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;

  while (node && node !== editor) {
    if (
      node.tagName === "MARK" ||
      (node.style?.backgroundColor &&
        node.style.backgroundColor !== "transparent" &&
        node.style.backgroundColor !== "rgba(0, 0, 0, 0)")
    ) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

/**
 * Checks if current selection has custom text color
 */
export function isSelectionColored(editor) {
  if (!editor) return false;
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return false;
  const range = sel.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return false;

  let node = range.commonAncestorContainer;
  if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;

  while (node && node !== editor) {
    if (
      node.tagName === "FONT" ||
      (node.style?.color &&
        node.style.color !== "inherit" &&
        node.style.color !== "initial")
    ) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

export function applyHighlightColor(editor, color) {
  if (!editor) return;

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return;

  if (document.activeElement !== editor) {
    editor.focus();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  const isClear = !color || color === "transparent" || color === "none";

  try {
    document.execCommand("styleWithCSS", false, true);
  } catch {}

  if (isClear) {
    const container = range.commonAncestorContainer;
    let root = container.nodeType === Node.TEXT_NODE ? container.parentNode : container;

    while (root && root !== editor) {
      if (
        root.tagName === "MARK" ||
        (root.style && root.style.backgroundColor && root.style.backgroundColor !== "transparent")
      ) {
        root.style.backgroundColor = "";
        if (root.tagName === "MARK") {
          const parent = root.parentNode;
          while (root.firstChild) {
            parent.insertBefore(root.firstChild, root);
          }
          parent.removeChild(root);
          root = parent;
          continue;
        }
      }
      root = root.parentNode;
    }

    if (editor.contains(range.commonAncestorContainer)) {
      const scope = container.nodeType === Node.TEXT_NODE ? container.parentNode : container;
      if (scope) {
        const marks = scope.querySelectorAll ? scope.querySelectorAll("mark, [style*='background']") : [];
        marks.forEach((el) => {
          if (range.intersectsNode(el)) {
            el.style.backgroundColor = "";
            if (el.tagName === "MARK") {
              while (el.firstChild) {
                el.parentNode.insertBefore(el.firstChild, el);
              }
              el.parentNode.removeChild(el);
            }
          }
        });
      }
    }

    try {
      if (!document.execCommand("hiliteColor", false, "transparent")) {
        document.execCommand("backColor", false, "transparent");
      }
    } catch {
      try {
        document.execCommand("backColor", false, "transparent");
      } catch {}
    }
  } else {
    if (range.isCollapsed) {
      const mark = document.createElement("mark");
      mark.style.backgroundColor = color;
      mark.textContent = "\u200B";
      range.insertNode(mark);
      const newRange = document.createRange();
      newRange.setStart(mark.firstChild, 1);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
      return;
    }

    let applied = false;
    try {
      applied = document.execCommand("hiliteColor", false, color);
      if (!applied) {
        applied = document.execCommand("backColor", false, color);
      }
    } catch {
      try {
        applied = document.execCommand("backColor", false, color);
      } catch {}
    }

    // Verify whether the selection or its container actually received background color
    const container = range.commonAncestorContainer;
    const testElem = container.nodeType === Node.TEXT_NODE ? container.parentNode : container;
    const hasHighlight =
      testElem &&
      (testElem.tagName === "MARK" ||
        (testElem.style && testElem.style.backgroundColor && testElem.style.backgroundColor !== "transparent"));

    if ((!applied || !hasHighlight) && !range.collapsed) {
      try {
        const mark = document.createElement("mark");
        mark.style.backgroundColor = color;
        mark.style.color = "inherit";
        mark.style.padding = "0.1em 0.25em";
        mark.style.borderRadius = "3px";
        mark.appendChild(range.extractContents());
        range.insertNode(mark);
        sel.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(mark);
        sel.addRange(newRange);
      } catch {}
    }
  }
}

/**
 * Completely clears all formatting from selection (bold, italic, underline, strike, colors, headings, todos)
 */
export function clearFormattingFromSelection(editor) {
  if (!editor) return;
  editor.focus();

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return;

  // 1. Native removeFormat
  try {
    document.execCommand("removeFormat", false, null);
    document.execCommand("unlink", false, null);
  } catch {}

  // 2. Convert to-dos in selection back to normal paragraphs
  const blocks = getSelectedBlocks(editor, range);
  blocks.forEach((block) => {
    let todoEl = block.classList?.contains("nb-todo-item")
      ? block
      : block.closest?.(".nb-todo-item");

    if (todoEl && editor.contains(todoEl)) {
      const textSpan = todoEl.querySelector(".nb-todo-text");
      const p = document.createElement("p");
      p.innerHTML = textSpan ? textSpan.innerHTML || "<br>" : "<br>";
      if (todoEl.parentNode) {
        todoEl.parentNode.replaceChild(p, todoEl);
      }
    }

    // Reset headings to normal paragraphs
    if (/^H[1-6]$/i.test(block.tagName)) {
      const p = document.createElement("p");
      p.innerHTML = block.innerHTML || "<br>";
      if (block.parentNode) {
        block.parentNode.replaceChild(p, block);
      }
    }
  });

  // 3. Remove inline styles & unwrap empty formatting tags
  const container = range.commonAncestorContainer;
  const parent =
    container.nodeType === Node.TEXT_NODE
      ? container.parentNode
      : container;

  if (parent && editor.contains(parent)) {
    const styledEls = parent.querySelectorAll
      ? parent.querySelectorAll(
          "span, font, b, strong, i, em, u, s, strike, mark"
        )
      : [];

    styledEls.forEach((el) => {
      if (range.intersectsNode(el)) {
        el.removeAttribute("style");
        el.removeAttribute("color");
        if (el.tagName === "SPAN" || el.tagName === "FONT") {
          while (el.firstChild) {
            el.parentNode.insertBefore(el.firstChild, el);
          }
          if (el.parentNode) el.parentNode.removeChild(el);
        }
      }
    });
  }
}

/**
 * Sets block format (paragraph or heading)
 */
export function setBlockFormat(editor, tag) {
  if (!editor) return;
  editor.focus();

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return;

  // If currently a todo item and user selects normal or heading, convert todo first
  const blocks = getSelectedBlocks(editor, range);
  blocks.forEach((block) => {
    let todoEl = block.classList?.contains("nb-todo-item")
      ? block
      : block.closest?.(".nb-todo-item");
    if (todoEl && editor.contains(todoEl)) {
      const textSpan = todoEl.querySelector(".nb-todo-text");
      const p = document.createElement(tag === "p" ? "p" : tag);
      p.innerHTML = textSpan ? textSpan.innerHTML || "<br>" : "<br>";
      if (todoEl.parentNode) {
        todoEl.parentNode.replaceChild(p, todoEl);
      }
    }
  });

  // Standard formatBlock
  const blockVal = tag === "p" ? "<p>" : `<${tag}>`;
  try {
    if (!document.execCommand("formatBlock", false, blockVal)) {
      document.execCommand("formatBlock", false, tag);
    }
  } catch {
    try {
      document.execCommand("formatBlock", false, tag);
    } catch {}
  }
}

/**
 * Helper to construct a todo item DOM element
 */
export function createTodoItem(innerHtml = "", isChecked = false) {
  const div = document.createElement("div");
  div.className = `nb-todo-item ${isChecked ? "nb-todo-completed" : ""}`;
  div.setAttribute("data-todo", "true");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "nb-todo-cb";
  checkbox.setAttribute("contenteditable", "false");
  if (isChecked) checkbox.checked = true;

  const span = document.createElement("span");
  span.className = "nb-todo-text";
  span.innerHTML = innerHtml.trim() ? innerHtml : "<br>";

  div.appendChild(checkbox);
  div.appendChild(span);
  return div;
}

/**
 * Places cursor inside a todo item's text span
 */
export function placeCursorInTodo(todoItem) {
  const span = todoItem.querySelector(".nb-todo-text");
  if (!span) return;
  const sel = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(span);
  range.collapse(false);
  if (sel) {
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

/**
 * Finds top-level block children of editor intersecting the range
 */
function getSelectedBlocks(editor, range) {
  const blocks = [];
  const startNode = range.startContainer;
  const endNode = range.endContainer;

  const getEditorChild = (node) => {
    let curr = node;
    while (curr && curr.parentNode !== editor) {
      curr = curr.parentNode;
    }
    return curr;
  };

  const startBlock = getEditorChild(startNode);
  const endBlock = getEditorChild(endNode);

  if (startBlock && endBlock) {
    let curr = startBlock;
    while (curr) {
      blocks.push(curr);
      if (curr === endBlock) break;
      curr = curr.nextSibling;
    }
  } else if (startBlock) {
    blocks.push(startBlock);
  } else {
    editor.childNodes.forEach((child) => {
      if (range.intersectsNode(child)) {
        blocks.push(child);
      }
    });
  }

  return blocks;
}

/**
 * Saves current text selection range
 */
export function saveSelection() {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    return sel.getRangeAt(0).cloneRange();
  }
  return null;
}

/**
 * Restores a saved text selection range
 */
export function restoreSelection(savedRange) {
  if (!savedRange) return;
  const sel = window.getSelection();
  if (sel) {
    sel.removeAllRanges();
    sel.addRange(savedRange);
  }
}
