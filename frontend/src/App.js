// frontend/src/App.js (example)
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PatientList from './components/PatientList';
import PatientDetail from './components/PatientDetail';
import ConsentManagement from './components/ConsentManagement';
import TransactionHistory from './components/TransactionHistory';
import StatsDashboard from './components/StatsDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StatsDashboard/>} />
        <Route path="/patients" element={<PatientList/>} />
        <Route path="/patients/:id" element={<PatientDetail/>} />
        <Route path="/consents" element={<ConsentManagement/>} />
        <Route path="/transactions" element={<TransactionHistory/>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
