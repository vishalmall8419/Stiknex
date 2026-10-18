/**
 * Stiknex Chrome Extension — Safe Zero-Eval Mathematical Parser
 * 100% Manifest V3 CSP Compliant (No eval, No new Function)
 * Supports standard arithmetic, parentheses, percentages, factorials, and scientific functions.
 */

export function evaluateExpression(input, isRadian = false) {
  if (!input || typeof input !== "string") return "";

  // Normalize operators and unicode symbols
  let expr = input
    .replace(/\u00D7/g, "*")
    .replace(/\u00F7/g, "/")
    .replace(/\u2212/g, "-")
    .replace(/,/g, ".")
    .trim();

  if (!expr) return "";

  let pos = 0;
  let ch = expr.charAt(0);

  function nextChar() {
    pos++;
    ch = pos < expr.length ? expr.charAt(pos) : "";
  }

  function eat(charToEat) {
    while (ch === " ") nextChar();
    if (ch === charToEat) {
      nextChar();
      return true;
    }
    return false;
  }

  function parseExpression() {
    let x = parseTerm();
    for (;;) {
      if (eat("+")) x += parseTerm();
      else if (eat("-")) x -= parseTerm();
      else return x;
    }
  }

  function parseTerm() {
    let x = parseFactor();
    for (;;) {
      if (eat("*")) {
        x *= parseFactor();
      } else if (eat("/")) {
        const divisor = parseFactor();
        if (divisor === 0) throw new Error("Division by zero");
        x /= divisor;
      } else if (ch === "%") {
        nextChar(); // consume %
        while (ch === " ") nextChar();
        // If followed by an operand, it's modulo: 15 % 4
        if ((ch >= "0" && ch <= "9") || ch === "(" || ch === "." || (ch >= "a" && ch <= "z") || ch === "+" || ch === "-") {
          const mod = parseFactor();
          x = x % mod;
        } else {
          // Postfix percentage: 50%
          x = x / 100;
        }
      } else {
        return x;
      }
    }
  }

  function parseFactor() {
    while (ch === " ") nextChar();

    // Unary operators
    if (eat("+")) return +parseFactor();
    if (eat("-")) return -parseFactor();

    let x;
    const startPos = pos;

    if (eat("(")) {
      x = parseExpression();
      if (!eat(")")) throw new Error("Missing closing parenthesis");
    } else if ((ch >= "0" && ch <= "9") || ch === ".") {
      while ((ch >= "0" && ch <= "9") || ch === ".") nextChar();
      x = parseFloat(expr.substring(startPos, pos));
    } else if ((ch >= "a" && ch <= "z") || ch === "\u03C0") {
      while ((ch >= "a" && ch <= "z") || ch === "\u03C0") nextChar();
      const fn = expr.substring(startPos, pos).toLowerCase();

      if (fn === "pi" || fn === "\u03C0") {
        x = Math.PI;
      } else if (fn === "e") {
        x = Math.E;
      } else {
        if (!eat("(")) throw new Error(`Expected '(' after function ${fn}`);
        const arg = parseExpression();
        if (!eat(")")) throw new Error(`Missing ')' after function ${fn}`);

        switch (fn) {
          case "sin": {
            const rad = isRadian ? arg : (arg * Math.PI) / 180;
            x = Math.sin(rad);
            break;
          }
          case "cos": {
            const rad = isRadian ? arg : (arg * Math.PI) / 180;
            x = Math.cos(rad);
            break;
          }
          case "tan": {
            const rad = isRadian ? arg : (arg * Math.PI) / 180;
            x = Math.tan(rad);
            break;
          }
          case "asin": {
            const res = Math.asin(arg);
            x = isRadian ? res : (res * 180) / Math.PI;
            break;
          }
          case "acos": {
            const res = Math.acos(arg);
            x = isRadian ? res : (res * 180) / Math.PI;
            break;
          }
          case "atan": {
            const res = Math.atan(arg);
            x = isRadian ? res : (res * 180) / Math.PI;
            break;
          }
          case "log":
            if (arg <= 0) throw new Error("Invalid log argument");
            x = Math.log10(arg);
            break;
          case "ln":
            if (arg <= 0) throw new Error("Invalid ln argument");
            x = Math.log(arg);
            break;
          case "sqrt":
            if (arg < 0) throw new Error("Negative square root");
            x = Math.sqrt(arg);
            break;
          case "abs":
            x = Math.abs(arg);
            break;
          default:
            throw new Error(`Unknown function: ${fn}`);
        }
      }
    } else {
      throw new Error(`Unexpected character: ${ch}`);
    }

    // Check for postfix exponentiation ^ or **
    while (ch === " ") nextChar();
    if (eat("^")) {
      x = Math.pow(x, parseFactor());
    } else if (ch === "*") {
      let tempPos = pos + 1;
      while (tempPos < expr.length && expr.charAt(tempPos) === " ") tempPos++;
      if (tempPos < expr.length && expr.charAt(tempPos) === "*") {
        nextChar(); // consume first *
        while (ch === " ") nextChar();
        nextChar(); // consume second *
        x = Math.pow(x, parseFactor());
      }
    }

    // Postfix percentage (e.g. 25%)
    if (ch === "%") {
      let tempPos = pos + 1;
      while (tempPos < expr.length && expr.charAt(tempPos) === " ") tempPos++;
      const nextCharAhead = tempPos < expr.length ? expr.charAt(tempPos) : "";
      // If NOT followed by an operand, consume as postfix percentage
      if (!((nextCharAhead >= "0" && nextCharAhead <= "9") || nextCharAhead === "(" || nextCharAhead === ".")) {
        nextChar();
        x = x / 100;
      }
    }

    // Postfix Factorial !
    if (eat("!")) {
      if (x < 0 || !Number.isInteger(x)) throw new Error("Factorial requires non-negative integer");
      if (x > 170) return Infinity;
      let fact = 1;
      for (let i = 2; i <= x; i++) fact *= i;
      x = fact;
    }

    return x;
  }

  try {
    const result = parseExpression();
    while (ch === " ") nextChar();
    if (pos < expr.length) throw new Error("Syntax error");
    if (!Number.isFinite(result)) return "Error";
    return Math.round(result * 1e10) / 1e10;
  } catch {
    return "Error";
  }
}

