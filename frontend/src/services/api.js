// frontend/src/services/api.js
const BASE = 'http://localhost:5000/api';

async function request(path, opts = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

export const getPatients = (page = 1, limit = 10, search = '') =>
  request(`/patients?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);

export const getPatient = (id) => request(`/patients/${id}`);
export const getPatientRecords = (id) => request(`/patients/${id}/records`);

export const getConsents = (filters = {}) => {
  const url = new URL(`${BASE}/consents`);
  Object.entries(filters).forEach(([k, v]) => { if (v) url.searchParams.append(k, v); });
  return fetch(url.toString()).then(r => r.json());
};

export const createConsent = (payload) =>
  request('/consents', { method: 'POST', body: JSON.stringify(payload) });

export const updateConsent = (id, payload) =>
  request(`/consents/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });

export const getTransactions = (walletAddress = '', limit = 20) =>
  request(`/transactions?walletAddress=${encodeURIComponent(walletAddress)}&limit=${limit}`);

export const getStats = () => request('/stats');

export const verifySignature = (message, signature, address) =>
  request('/verify-signature', { method: 'POST', body: JSON.stringify({ message, signature, address })});
