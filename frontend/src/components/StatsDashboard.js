// frontend/src/components/StatsDashboard.js
import React, { useEffect, useState } from 'react';
import { getStats } from '../services/api';

export default function StatsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    let mounted = true;
    async function fetchStats() {
      setLoading(true);
      try {
        const s = await getStats();
        if (mounted) setStats(s);
      } catch (err) {
        // handle
      } finally { setLoading(false); }
    }
    fetchStats();
    return () => mounted = false;
  }, []);

  if (loading) return <div>Loading stats...</div>;
  if (!stats) return <div>No stats</div>;

  const cards = [
    { label: 'Total Patients', value: stats.totalPatients },
    { label: 'Total Records', value: stats.totalRecords },
    { label: 'Total Consents', value: stats.totalConsents },
    { label: 'Active Consents', value: stats.activeConsents },
    { label: 'Pending Consents', value: stats.pendingConsents },
    { label: 'Total Transactions', value: stats.totalTransactions },
  ];

  return (
    <div>
      <h2>Platform Stats</h2>
      <div className="stats-grid">
        {cards.map(c => (
          <div key={c.label} className="stat-card">
            <div className="stat-value">{c.value ?? '-'}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
