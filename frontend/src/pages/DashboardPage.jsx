import { Link } from 'react-router-dom';
import Alert from '../components/Alert.jsx';
import Spinner from '../components/Spinner.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useHealth } from '../hooks/useHealth.js';
import { useSessionPayments } from '../hooks/useSessionPayments.js';
import { getApiBaseUrl } from '../api/client.js';
import { formatAmount } from '../utils/format.js';

export default function DashboardPage() {
  const health = useHealth();
  const { payments } = useSessionPayments();
  const latest = payments[0];
  const apiBase = getApiBaseUrl() || '(same origin / proxy)';

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Operational view based on the endpoints the backend actually exposes.</p>
        </div>
        <button type="button" className="btn-secondary" onClick={health.refresh} disabled={health.loading}>
          Refresh health
        </button>
      </div>

      <div className="grid-2">
        <section className="card">
          <div className="card-header">
            <h2>Payment system</h2>
            {health.data?.status ? <StatusBadge value={health.data.status} /> : null}
          </div>
          {health.loading ? <Spinner label="Checking GET /actuator/health" /> : null}
          {health.error ? (
            <Alert type="error" title="Health check failed">
              {health.error}
            </Alert>
          ) : null}
          {!health.loading && health.data ? (
            <dl className="detail-list">
              <div className="detail-row">
                <dt>Status</dt>
                <dd>{health.data.status}</dd>
              </div>
              <div className="detail-row">
                <dt>API base URL</dt>
                <dd className="mono">{apiBase}</dd>
              </div>
              {health.data.components ? (
                Object.entries(health.data.components).map(([name, component]) => (
                  <div className="detail-row" key={name}>
                    <dt>{name}</dt>
                    <dd>{component?.status || '—'}</dd>
                  </div>
                ))
              ) : null}
            </dl>
          ) : null}
        </section>

        <section className="card">
          <div className="card-header">
            <h2>Session activity</h2>
          </div>
          <p className="muted">
            There is no payment history API. Counts below only include payments started in this browser.
          </p>
          <div className="stat-row">
            <div>
              <div className="stat-label">Payments in this session</div>
              <div className="stat-value">{payments.length}</div>
            </div>
            <div>
              <div className="stat-label">Latest status</div>
              <div className="stat-value">{latest?.paymentInfo?.status || '—'}</div>
            </div>
          </div>
          {latest ? (
            <p>
              Latest transaction <span className="mono">{latest.transactionId}</span>
              {latest.paymentInfo?.amount
                ? ` · ${formatAmount(latest.paymentInfo.amount, latest.paymentInfo.currency)}`
                : ''}
            </p>
          ) : (
            <p>No payments have been initiated from this UI yet.</p>
          )}
          <div className="form-actions">
            <Link className="btn-primary" to="/payments">
              New payment
            </Link>
            <Link className="btn-secondary" to="/history">
              Open history
            </Link>
          </div>
        </section>
      </div>

      <section className="card">
        <h2>How a payment is processed</h2>
        <ol className="flow-list">
          <li>This UI calls the Java payment system at POST /payments/init.</li>
          <li>The Java service creates a Stripe PaymentIntent and then asks the fraud-detection service for a score.</li>
          <li>If the transaction is not marked as fraud and Stripe requires a payment method, the Java service confirms the intent with Stripe.</li>
          <li>The response includes payment status, fraud flag, and fraud score. This UI does not call Stripe or the Python service directly.</li>
        </ol>
      </section>
    </div>
  );
}
