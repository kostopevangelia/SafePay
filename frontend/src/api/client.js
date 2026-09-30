const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export async function apiRequest(path, options = {}) {
  const headers = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  };

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (error) {
    throw {
      kind: 'network',
      status: 0,
      message: 'Unable to reach the payment system. Check that the backend is running.',
      details: error instanceof Error ? error.message : 'Network error',
    };
  }

  const rawText = await response.text();
  let data = null;
  if (rawText) {
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { message: rawText };
    }
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}
