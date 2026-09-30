import { useCallback, useState } from 'react';
import { initiatePayment } from '../api/paymentApi.js';
import { extractErrorMessage, toUserFacingError } from '../utils/errors.js';
import { getPaymentInfo, isFraudFlag, maskCardNumber } from '../utils/format.js';
import { saveSessionPayment } from '../utils/sessionPayments.js';

function persistIfPossible(request, result) {
  const paymentInfo = getPaymentInfo(result.data);
  const transactionId = paymentInfo?.transactionId;
  if (!transactionId) {
    return null;
  }

  const entry = {
    transactionId,
    httpStatus: result.status,
    code: result.data?.code ?? null,
    message: result.data?.message || paymentInfo.message || null,
    description: result.data?.description || null,
    paymentInfo,
    requestSummary: {
      amount: request.amount,
      currency: request.currency,
      paymentType: request.paymentType,
      transactionType: request.transactionType,
      userId: request.userId,
      cardLast4: request.cardNumber ? maskCardNumber(request.cardNumber) : null,
      iban: request.iban || null,
      timestamp: request.timestamp,
    },
    savedAt: new Date().toISOString(),
    fraud: isFraudFlag(paymentInfo),
  };
  saveSessionPayment(entry);
  return entry;
}

export function useInitiatePayment() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const submit = useCallback(async (payload) => {
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const response = await initiatePayment(payload);
      const paymentInfo = getPaymentInfo(response.data);
      const entry = persistIfPossible(payload, response);

      if (paymentInfo) {
        setResult({
          httpStatus: response.status,
          data: response.data,
          paymentInfo,
          sessionEntry: entry,
        });
        if (!response.ok && isFraudFlag(paymentInfo)) {
          setError({
            title: 'Payment blocked',
            message: extractErrorMessage(response) || 'The transaction was marked as fraudulent.',
          });
        } else if (!response.ok) {
          setError({
            title: 'Payment was not completed',
            message: extractErrorMessage(response),
          });
        }
        return;
      }

      setError({
        title: response.ok ? 'Unexpected response' : 'Payment failed',
        message: extractErrorMessage(response),
      });
    } catch (err) {
      setError(toUserFacingError(err));
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { submitting, result, error, submit };
}
