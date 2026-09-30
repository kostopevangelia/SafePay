function firstNonEmpty(...values) {
  return values.find((value) => value !== null && value !== undefined && String(value).trim() !== '');
}

export function extractErrorMessage(result) {
  const data = result?.data;
  if (!data) {
    return result?.message || `Request failed (${result?.status || 'unknown'})`;
  }

  if (typeof data === 'string') {
    return data;
  }

  return firstNonEmpty(
    data.message,
    data.description,
    data.error,
    data.title,
    data.paymentInfo?.message,
    `Request failed (${result.status})`
  );
}

export function toUserFacingError(error) {
  if (error?.kind === 'network') {
    return {
      title: 'Connection error',
      message: error.message,
    };
  }
  return {
    title: 'Unexpected error',
    message: error?.message || 'Something went wrong.',
  };
}
