/**
 * Stiknex Canonical Date Formatting Utilities
 * Standardized to DD/MM/YYYY across all Tools & Calculators
 */

/**
 * Formats any date input (Date object, ISO string, or timestamp) to DD/MM/YYYY
 * @param {Date|string|number} dateInput
 * @returns {string} Date in DD/MM/YYYY format (e.g., "14/11/2026")
 */
export function formatDateDDMMYYYY(dateInput) {
  if (!dateInput) return "";
  try {
    // If it's a date string like "YYYY-MM-DD"
    if (typeof dateInput === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      const [year, month, day] = dateInput.split("-");
      return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    }

    const d = typeof dateInput === "string" && !dateInput.includes("T") && dateInput.includes("-")
      ? new Date(dateInput + "T00:00:00")
      : new Date(dateInput);

    if (isNaN(d.getTime())) return "";

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "";
  }
}

/**
 * Formats date and time to DD/MM/YYYY hh:mm A
 * @param {Date|string|number} dateInput
 * @returns {string} e.g., "14/11/2026 01:15 PM"
 */
export function formatDateTimeDDMMYYYY(dateInput) {
  if (!dateInput) return "";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "";

    const dateStr = formatDateDDMMYYYY(d);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
    const strHours = String(hours).padStart(2, "0");

    return `${dateStr} ${strHours}:${minutes} ${ampm}`;
  } catch {
    return "";
  }
}

/**
 * Standard history timestamp formatter:
 * - < 1 min: "Just now"
 * - < 1 hr: "Xm ago"
 * - < 24 hrs: "Xh ago"
 * - >= 24 hrs: "DD/MM/YYYY"
 * @param {string|number|Date} iso
 * @returns {string}
 */
export function formatHistoryTimestamp(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return formatDateDDMMYYYY(d);
  } catch {
    return "";
  }
}

export default formatDateDDMMYYYY;
