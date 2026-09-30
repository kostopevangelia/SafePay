export const TRANSACTION_TYPES = ['PAYMENT', 'REFUND'];

export const PAYMENT_TYPES = [
  { value: 'card', label: 'Card' },
  { value: 'iban', label: 'IBAN' },
];

export const CURRENCIES = ['USD', 'EUR', 'GBP'];

export const STRIPE_TEST_CARDS = [
  { brand: 'Visa', number: '4242424242424242' },
  { brand: 'Visa debit', number: '4000056655665556' },
  { brand: 'Mastercard', number: '5555555555554444' },
  { brand: 'American Express', number: '378282246310005' },
];

export function nowLocalDateTimeInputValue() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export function toBackendTimestamp(datetimeLocalValue) {
  if (!datetimeLocalValue) {
    return null;
  }
  return datetimeLocalValue.length === 16 ? `${datetimeLocalValue}:00` : datetimeLocalValue;
}
