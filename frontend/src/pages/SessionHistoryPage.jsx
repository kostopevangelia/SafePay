import { Link } from 'react-router-dom';
import Alert from '../components/Alert.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useSessionPayments } from '../hooks/useSessionPayments.js';
import { formatAmount, formatFraudScore } from '../utils/format.js';

export default function SessionHistoryPage() {
  const { payments, clear } = useSessionPayments();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Payment history</h1>
          <p className="muted">
            The payment API does not expose a history or status lookup endpoint. This table shows payments
            initiated from this browser.
          </p>
        </div>
        {payments.length > 0 ? (
          <button type="button" className="btn-secondary" onClick={clear}>
            Clear session history
          </button>
        ) : null}
      </div>

      {payments.length === 0 ? (
        <Alert type="info" title="No payments in this session">
          Initiate a payment to see it listed here. Nothing is loaded from the database because no list API exists.
        </Alert>
      ) : (
        <div className="card table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Fraud</th>
                <th>Score</th>
                <th>Saved</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {payments.map((item) => (
                <tr key={item.transactionId}>
                  <td className="mono">{item.transactionId}</td>
                  <td>{formatAmount(item.paymentInfo?.amount, item.paymentInfo?.currency)}</td>
                  <td>
                    <StatusBadge value={item.paymentInfo?.status} />
                  </td>
                  <td>
                    <StatusBadge value={item.fraud ? 'fraud' : 'clear'} label={item.fraud ? 'Yes' : 'No'} />
                  </td>
                  <td>{formatFraudScore(item.paymentInfo?.fraudScore)}</td>
                  <td>{item.savedAt?.replace('T', ' ').slice(0, 19)}</td>
                  <td>
                    <Link to={`/payments/${encodeURIComponent(item.transactionId)}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
