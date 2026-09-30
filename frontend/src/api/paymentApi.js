import { apiRequest } from './client.js';

export function initiatePayment(payload) {
  return apiRequest('/payments/init', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
