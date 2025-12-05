// frontend/src/components/PatientDetail.js
import React, { useEffect, useState } from 'react';
import { getPatient, getPatientRecords } from '../services/api';
import { useParams } from 'react-router-dom';
import { formatDate, truncateAddr } from '../utils/format';

export default function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetch() {
      setLoading(true);
      try {
        const p = await getPatient(id);
        const recs = await getPatientRecords(id);
        if (!mounted) return;
        setPatient(p);
        setRecords(recs || []);
      } catch (err) {
        setError('Failed to load patient details');
      } finally {
        setLoading(false);
      }
    }
    fetch();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div>Loading patient...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!patient) return <div>Patient not found</div>;

  return (
    <div>
      <h2>{patient.name}</h2>
      <div>Email: {patient.email}</div>
      <div>DOB: {formatDate(patient.dob)}</div>
      <div>Gender: {patient.gender}</div>
      <div>Phone: {patient.phone}</div>
      <div>Address: {patient.address}</div>
      <div>Wallet: {patient.wallet ? truncateAddr(patient.wallet) : 'N/A'}</div>

      <h3>Medical Records</h3>
      {records.length === 0 && <div>No records</div>}
      <div className="records-list">
        {records.map(r => (
          <div key={r.id} className="record-card">
            <div className="record-header">
              <span className="badge">{r.type}</span>
              <span>{formatDate(r.date)}</span>
            </div>
            <div>{r.description}</div>
            <div>Blockchain hash: <code>{r.blockchainHash}</code></div>
          </div>
        ))}
      </div>
    </div>
  );
}
