export function formatAmount(amount, currency) {
  if (amount === null || amount === undefined || amount === '') {
    return '—';
  }
  const value = Number(amount);
  if (Number.isNaN(value)) {
    return String(amount);
  }
  return currency ? `${value} ${String(currency).toUpperCase()}` : String(value);
}

export function formatFraudScore(score) {
  if (score === null || score === undefined || score === '') {
    return '—';
  }
  const value = Number(score);
  if (Number.isNaN(value)) {
    return String(score);
  }
  return value.toFixed(4);
}

export function isFraudFlag(paymentInfo) {
  if (!paymentInfo) {
    return false;
  }
  return Boolean(paymentInfo.fraud ?? paymentInfo.isFraud);
}

export function getPaymentInfo(response) {
  if (!response || typeof response !== 'object') {
    return null;
  }
  return response.paymentInfo || null;
}

export function maskCardNumber(cardNumber) {
  const digits = String(cardNumber || '').replace(/\D/g, '');
  if (digits.length < 4) {
    return '••••';
  }
  return `•••• ${digits.slice(-4)}`;
}
