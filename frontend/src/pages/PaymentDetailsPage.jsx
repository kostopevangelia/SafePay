import { Link, useParams } from 'react-router-dom';
import Alert from '../components/Alert.jsx';
import PaymentDetailsCard from '../components/PaymentDetailsCard.jsx';
import { getSessionPayment } from '../utils/sessionPayments.js';

export default function PaymentDetailsPage() {
  const { transactionId } = useParams();
  const entry = getSessionPayment(transactionId);

  if (!entry) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Payment details</h1>
        </div>
        <Alert type="info" title="No stored payment found">
          The backend does not expose a get-by-id payment endpoint. Details are available only for payments
          initiated in this browser session.
        </Alert>
        <Link className="text-link" to="/history">
          Back to payment history
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Payment details</h1>
          <p className="muted">{entry.transactionId}</p>
        </div>
        <Link className="text-link" to="/history">
          Back to history
        </Link>
      </div>
      <PaymentDetailsCard
        response={{
          code: entry.code,
          message: entry.message,
          description: entry.description,
        }}
        paymentInfo={entry.paymentInfo}
        httpStatus={entry.httpStatus}
        requestSummary={entry.requestSummary}
      />
    </div>
  );
}
