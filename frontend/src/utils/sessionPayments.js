const STORAGE_KEY = 'safepay.sessionPayments';

function readAll() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(items) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function listSessionPayments() {
  return readAll();
}

export function getSessionPayment(transactionId) {
  return readAll().find((item) => item.transactionId === transactionId) || null;
}

export function saveSessionPayment(entry) {
  const items = readAll().filter((item) => item.transactionId !== entry.transactionId);
  items.unshift(entry);
  writeAll(items.slice(0, 50));
}

export function clearSessionPayments() {
  window.localStorage.removeItem(STORAGE_KEY);
}
