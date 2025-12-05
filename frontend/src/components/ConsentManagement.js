// frontend/src/components/ConsentManagement.js
import React, { useEffect, useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { getConsents, createConsent, updateConsent } from '../services/api';

export default function ConsentManagement() {
  const { account, isConnected, connectWallet, signMessage } = useWeb3();

  const [statusFilter, setStatusFilter] = useState('');
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  async function fetchConsents() {
    setLoading(true);
    try {
      const res = await getConsents({ status: statusFilter });
      setConsents(res || []);
    } catch (err) {
      setError('Failed to fetch consents');
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=> { fetchConsents(); }, [statusFilter]);

  async function handleCreateConsent({ patientId, purpose }) {
    if (!isConnected) {
      await connectWallet();
      if (!isConnected) { setError('Connect wallet first'); return; }
    }

    const message = `I consent to: ${purpose} for patient: ${patientId}`;
    setCreating(true); setError(null);

    try {
      const signature = await signMessage(message);
      const payload = {
        patientId,
        purpose,
        walletAddress: account,
        signature,
      };
      const created = await createConsent(payload);
      // optimistic refresh
      await fetchConsents();
    } catch (err) {
      setError('Failed to create consent: ' + (err.message || err));
    } finally {
      setCreating(false);
    }
  }

  async function handleActivate(consentId, blockchainTxHash) {
    try {
      await updateConsent(consentId, { status: 'active', blockchainTxHash });
      await fetchConsents();
    } catch(err) {
      setError('Failed to update consent');
    }
  }

  return (
    <div>
      <h2>Consent Management</h2>

      <div>
        <label>Filter:
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="revoked">Revoked</option>
          </select>
        </label>
      </div>

      <ConsentCreateForm onSubmit={handleCreateConsent} creating={creating} />
      {loading ? <div>Loading...</div> : (
        <div>
          {consents.map(c => (
            <div key={c.id} className="consent-card">
              <div><strong>Patient:</strong> {c.patientId}</div>
              <div><strong>Purpose:</strong> {c.purpose}</div>
              <div><strong>Status:</strong> {c.status}</div>
              <div><strong>Wallet:</strong> {c.walletAddress}</div>
              <div><strong>Signature:</strong> <code>{c.signature}</code></div>
              <div><strong>Blockchain TX:</strong> {c.blockchainTxHash || '—'}</div>
              {c.status === 'pending' && (
                <button onClick={()=>handleActivate(c.id, '0xSIMULATED_TX_HASH')}>
                  Activate (simulate)
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

// Simple form component to input patientId & purpose (implement as needed)
function ConsentCreateForm({ onSubmit, creating }) {
  const [patientId, setPatientId] = useState('');
  const [purpose, setPurpose] = useState('');
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit({ patientId, purpose }); }}>
      <input placeholder="Patient ID" value={patientId} onChange={e=>setPatientId(e.target.value)} required />
      <input placeholder="Purpose" value={purpose} onChange={e=>setPurpose(e.target.value)} required />
      <button type="submit" disabled={creating}>{creating ? 'Signing...' : 'Create Consent'}</button>
    </form>
  );
}
