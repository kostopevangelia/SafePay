import { apiRequest } from './client.js';

export function getPaymentSystemHealth() {
  return apiRequest('/actuator/health');
}
