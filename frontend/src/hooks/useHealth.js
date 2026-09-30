import { useCallback, useEffect, useState } from 'react';
import { getPaymentSystemHealth } from '../api/healthApi.js';
import { extractErrorMessage, toUserFacingError } from '../utils/errors.js';

export function useHealth() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    data: null,
    status: null,
  });

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const result = await getPaymentSystemHealth();
      if (!result.ok) {
        setState({
          loading: false,
          error: extractErrorMessage(result),
          data: result.data,
          status: result.status,
        });
        return;
      }
      setState({
        loading: false,
        error: null,
        data: result.data,
        status: result.status,
      });
    } catch (error) {
      setState({
        loading: false,
        error: toUserFacingError(error).message,
        data: null,
        status: 0,
      });
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, refresh };
}
