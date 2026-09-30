import { formatAmount, formatFraudScore, isFraudFlag } from '../utils/format.js';
import StatusBadge from './StatusBadge.jsx';

function Row({ label, value }) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return (
    <div className="detail-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export default function PaymentDetailsCard({ response, paymentInfo, httpStatus, requestSummary }) {
  if (!paymentInfo && !response) {
    return null;
  }

  const info = paymentInfo || {};
  const fraud = isFraudFlag(info);

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h2>Payment result</h2>
          <p className="muted">Fields returned by POST /payments/init</p>
        </div>
        <StatusBadge value={fraud ? 'fraud' : info.status} />
      </div>

      {response?.message ? <p className="result-message">{response.message}</p> : null}

      <dl className="detail-list">
        <Row label="HTTP status" value={httpStatus} />
        <Row label="Response code" value={response?.code} />
        <Row label="Response description" value={response?.description} />
        <Row label="Transaction ID" value={info.transactionId} />
        <Row label="Amount" value={formatAmount(info.amount, info.currency)} />
        <Row label="Currency" value={info.currency} />
        <Row label="Status" value={info.status} />
        <Row label="Payment type" value={info.paymentType} />
        <Row label="Timestamp" value={info.timestamp} />
        <Row label="Fraud" value={fraud ? 'Yes' : 'No'} />
        <Row label="Fraud score" value={formatFraudScore(info.fraudScore)} />
        <Row label="Payment message" value={info.message} />
        <Row label="Client secret" value={info.client_secret} />
      </dl>

      {requestSummary ? (
        <>
          <h3 className="section-title">Submitted request</h3>
          <dl className="detail-list">
            <Row label="User ID" value={requestSummary.userId} />
            <Row label="Transaction type" value={requestSummary.transactionType} />
            <Row label="Payment type" value={requestSummary.paymentType} />
            <Row label="Amount" value={formatAmount(requestSummary.amount, requestSummary.currency)} />
            <Row label="Card" value={requestSummary.cardLast4} />
            <Row label="IBAN" value={requestSummary.iban} />
            <Row label="Request timestamp" value={requestSummary.timestamp} />
          </dl>
        </>
      ) : null}
    </section>
  );
}
