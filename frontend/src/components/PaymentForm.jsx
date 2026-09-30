import { useMemo, useState } from 'react';
import {
  CURRENCIES,
  PAYMENT_TYPES,
  STRIPE_TEST_CARDS,
  TRANSACTION_TYPES,
  nowLocalDateTimeInputValue,
  toBackendTimestamp,
} from '../utils/constants.js';

const INITIAL_FORM = {
  cardNumber: '',
  iban: '',
  transactionId: '',
  amount: '100',
  currency: 'USD',
  timestamp: nowLocalDateTimeInputValue(),
  transactionType: 'PAYMENT',
  paymentType: 'card',
  userId: 'USER987',
};

function validate(form) {
  const errors = {};
  const amount = Number(form.amount);

  if (!form.amount || Number.isNaN(amount) || amount <= 0 || !Number.isInteger(amount)) {
    errors.amount = 'Amount must be a positive whole number (Stripe smallest currency unit).';
  }
  if (!form.currency) {
    errors.currency = 'Currency is required.';
  }
  if (!form.userId.trim()) {
    errors.userId = 'User ID is required.';
  }
  if (!form.timestamp) {
    errors.timestamp = 'Timestamp is required.';
  }
  if (!form.transactionType) {
    errors.transactionType = 'Transaction type is required.';
  }
  if (!form.paymentType) {
    errors.paymentType = 'Payment type is required.';
  }
  if (form.paymentType === 'card') {
    const digits = form.cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(digits)) {
      errors.cardNumber = 'Enter a card number with 13 to 19 digits.';
    }
  }
  if (form.paymentType === 'iban' && !form.iban.trim()) {
    errors.iban = 'IBAN is required for IBAN payments.';
  }
  return errors;
}

function FieldError({ message }) {
  if (!message) {
    return null;
  }
  return <div className="field-error">{message}</div>;
}

export default function PaymentForm({ submitting, onSubmit }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const isCard = form.paymentType === 'card';

  const canSubmit = useMemo(() => !submitting, [submitting]);

  function update(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit({
      cardNumber: isCard ? form.cardNumber.replace(/\s/g, '') : null,
      iban: form.iban.trim() ? form.iban.trim() : null,
      transactionId: form.transactionId.trim() ? form.transactionId.trim() : null,
      amount: Number(form.amount),
      currency: form.currency,
      timestamp: toBackendTimestamp(form.timestamp),
      transactionType: form.transactionType,
      paymentType: form.paymentType,
      userId: form.userId.trim(),
    });
  }

  return (
    <form className="card form-card" onSubmit={handleSubmit} noValidate>
      <div className="card-header">
        <div>
          <h2>Initiate payment</h2>
          <p className="muted">Sends PaymentRequest to POST /payments/init</p>
        </div>
      </div>

      <div className="form-grid">
        <label className="field">
          <span>Amount <em>*</em></span>
          <input
            type="number"
            min="1"
            step="1"
            value={form.amount}
            onChange={(event) => update('amount', event.target.value)}
            required
          />
          <small>Whole number in the smallest currency unit (for example cents for USD).</small>
          <FieldError message={errors.amount} />
        </label>

        <label className="field">
          <span>Currency <em>*</em></span>
          <select value={form.currency} onChange={(event) => update('currency', event.target.value)} required>
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <FieldError message={errors.currency} />
        </label>

        <label className="field">
          <span>Payment type <em>*</em></span>
          <select value={form.paymentType} onChange={(event) => update('paymentType', event.target.value)} required>
            {PAYMENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <FieldError message={errors.paymentType} />
        </label>

        <label className="field">
          <span>Transaction type <em>*</em></span>
          <select value={form.transactionType} onChange={(event) => update('transactionType', event.target.value)} required>
            {TRANSACTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <FieldError message={errors.transactionType} />
        </label>

        {isCard ? (
          <label className="field field-span-2">
            <span>Card number <em>*</em></span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              value={form.cardNumber}
              onChange={(event) => update('cardNumber', event.target.value)}
              placeholder="4242424242424242"
              required
            />
            <FieldError message={errors.cardNumber} />
          </label>
        ) : (
          <label className="field field-span-2">
            <span>IBAN <em>*</em></span>
            <input
              type="text"
              value={form.iban}
              onChange={(event) => update('iban', event.target.value)}
              placeholder="DE89370400440532013000"
              required
            />
            <FieldError message={errors.iban} />
          </label>
        )}

        <label className="field">
          <span>User ID <em>*</em></span>
          <input
            type="text"
            value={form.userId}
            onChange={(event) => update('userId', event.target.value)}
            required
          />
          <FieldError message={errors.userId} />
        </label>

        <label className="field">
          <span>Timestamp <em>*</em></span>
          <input
            type="datetime-local"
            value={form.timestamp}
            onChange={(event) => update('timestamp', event.target.value)}
            required
          />
          <FieldError message={errors.timestamp} />
        </label>

        <label className="field field-span-2">
          <span>Transaction ID</span>
          <input
            type="text"
            value={form.transactionId}
            onChange={(event) => update('transactionId', event.target.value)}
            placeholder="Optional — the backend generates its own ID"
          />
        </label>
      </div>

      <div className="helper-box">
        <div className="helper-title">Stripe test cards used by the existing collection</div>
        <ul>
          {STRIPE_TEST_CARDS.map((card) => (
            <li key={card.number}>
              <button
                type="button"
                className="link-button"
                onClick={() => {
                  update('paymentType', 'card');
                  update('cardNumber', card.number);
                }}
              >
                {card.brand}: {card.number}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={!canSubmit}>
          {submitting ? 'Submitting...' : 'Submit payment'}
        </button>
      </div>
    </form>
  );
}
