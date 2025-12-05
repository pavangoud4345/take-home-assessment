// frontend/src/components/TransactionHistory.js
import React, { useEffect, useState } from 'react';
import { getTransactions } from '../services/api';
import { useWeb3 } from '../hooks/useWeb3';
import { truncateAddr, formatDate, formatCurrency } from '../utils/format';

export default function TransactionHistory() {
  const { account, isConnected } = useWeb3();
  const [walletFilter, setWalletFilter] = useState('');
  useEffect(()=> { if (account) setWalletFilter(account); }, [account]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchTxs() {
    setLoading(true);
    try {
      const res = await getTransactions(walletFilter, 50);
      setTransactions(res || []);
    } catch(e) {
      // handle
    } finally { setLoading(false); }
  }

  useEffect(()=> { fetchTxs(); }, [walletFilter]);

  return (
    <div>
      <h2>Transactions</h2>
      <div>
        <label>Wallet filter:
          <input value={walletFilter} onChange={e=>setWalletFilter(e.target.value)} placeholder="0x..." />
        </label>
        <button onClick={fetchTxs}>Refresh</button>
      </div>

      {loading ? <div>Loading...</div> : (
        <div className="tx-grid">
          {transactions.map(tx => (
            <div className="tx-card" key={tx.id}>
              <div><strong>{tx.type}</strong> — {tx.status}</div>
              <div>{formatCurrency(tx.amount)}</div>
              <div>{formatDate(tx.timestamp)}</div>
              <div>From: {truncateAddr(tx.from)}</div>
              <div>To: {truncateAddr(tx.to)}</div>
              <div>Hash: <code>{tx.blockchainHash}</code></div>
            </div>
          ))}
          {transactions.length === 0 && <div>No transactions</div>}
        </div>
      )}
    </div>
  );
}
