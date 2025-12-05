// frontend/src/components/PatientList.js
import React, { useState, useEffect, useCallback } from 'react';
import { getPatients } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/format';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // debounce search
  useEffect(() => {
    const t = setTimeout(()=> setPage(1), 300);
    return ()=> clearTimeout(t);
  }, [search]);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPatients(page, limit, search);
      // assume backend returns { data: [...], totalPages, total }
      const { data, totalPages: tp } = res;
      setPatients(data || []);
      setTotalPages(tp || 1);
    } catch (err) {
      setError('Failed to load patients');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(()=> { fetchPatients(); }, [fetchPatients]);

  return (
    <div>
      <h2>Patients</h2>

      <div>
        <input
          placeholder="Search by name, email, phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <div>Loading patients...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && patients.length === 0 && <div>No patients found.</div>}

      <div className="cards-grid">
        {patients.map(p => (
          <div key={p.id} className="patient-card" onClick={() => navigate(`/patients/${p.id}`)}>
            <h3>{p.name}</h3>
            <div>{p.email}</div>
            <div>{p.phone}</div>
            <div>DOB: {formatDate(p.dob)}</div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button disabled={page<=1} onClick={()=> setPage(page-1)}>Prev</button>
        <span>Page {page} / {totalPages}</span>
        <button disabled={page>=totalPages} onClick={()=> setPage(page+1)}>Next</button>
      </div>
    </div>
  );
}
