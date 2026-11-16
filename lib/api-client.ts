/**
 * API Client - Gateway for frontend to backend calls
 */

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
};

export async function apiFetch(endpoint: string, options: FetchOptions = {}) {
  const url = `/api${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || 'API error');
  }

  return response.json();
}

export async function getSequencing(prospectId: string) {
  return apiFetch('/api/sequence-cards', { method: 'POST', body: { prospectId } });
}

export async function getLoanStatus(prospectId: string) {
  return apiFetch('/api/sba-loan', { method: 'POST', body: { prospectId } });
}

export async function updateCardStatus(prospectId: string, issuer: string, status: string, limit?: number) {
  return apiFetch('/api/sequence-cards', {
    method: 'PUT',
    body: { prospectId, issuer, status, limit }
  });
}

export async function updateLoanStatus(prospectId: string, status: string, lender?: string, amount?: number) {
  return apiFetch('/api/sba-loan', {
    method: 'PUT',
    body: { prospectId, status, lender, approvedAmount: amount }
  });
}