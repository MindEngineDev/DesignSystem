// src/utils/helpers.js
// A collection of helper functions for reuse in components.

/**
 * Format a Date object as YYYY-MM-DD.
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Generate a UUID v4. Useful for assigning unique IDs to elements.
 * @returns {string}
 */
export function uuid() {
  return crypto.randomUUID();
}

// You can add more helpers here...
