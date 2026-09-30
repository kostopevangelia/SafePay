import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import PaymentsPage from './pages/PaymentsPage.jsx';
import PaymentDetailsPage from './pages/PaymentDetailsPage.jsx';
import SessionHistoryPage from './pages/SessionHistoryPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/payments/:transactionId" element={<PaymentDetailsPage />} />
        <Route path="/history" element={<SessionHistoryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
