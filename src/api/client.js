/**
 * GTICC Public API Client
 * Configures the single authoritative API base URL from Vite environment variables.
 * Automatically falls back to relative '/api' in production or 'http://localhost:3000/api' in development.
 */

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '')) ||
  (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api');

export function getApiUrl(endpoint) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
}

/**
 * Standardized API client with JSON headers and error extraction
 */
export async function apiClient(endpoint, options = {}) {
  const url = getApiUrl(endpoint);
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMsg =
      (data && (data.error || data.message)) ||
      `HTTP Error ${response.status}: ${response.statusText}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export default {
  getApiUrl,
  apiClient,
};
