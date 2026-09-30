import { Link } from 'react-router-dom';
import Alert from '../components/Alert.jsx';
import PaymentDetailsCard from '../components/PaymentDetailsCard.jsx';
import PaymentForm from '../components/PaymentForm.jsx';
import { useInitiatePayment } from '../hooks/useInitiatePayment.js';
import { isFraudFlag } from '../utils/format.js';

export default function PaymentsPage() {
  const { submitting, result, error, submit } = useInitiatePayment();
  const fraud = isFraudFlag(result?.paymentInfo);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Payments</h1>
          <p className="muted">Create and review a payment through the existing Java payment API.</p>
        </div>
      </div>

      <div className="stack">
        <PaymentForm submitting={submitting} onSubmit={submit} />

        {error ? (
          <Alert type={fraud ? 'warning' : 'error'} title={error.title}>
            {error.message}
          </Alert>
        ) : null}

        {result?.paymentInfo ? (
          <>
            {!error && result.httpStatus >= 200 && result.httpStatus < 300 ? (
              <Alert type="success" title="Payment processed">
                The backend returned payment information for this request.
              </Alert>
            ) : null}
            <PaymentDetailsCard
              response={result.data}
              paymentInfo={result.paymentInfo}
              httpStatus={result.httpStatus}
              requestSummary={result.sessionEntry?.requestSummary}
            />
            {result.paymentInfo.transactionId ? (
              <Link className="text-link" to={`/payments/${encodeURIComponent(result.paymentInfo.transactionId)}`}>
                Open payment details
              </Link>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
