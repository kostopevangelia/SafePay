import { useCallback, useMemo, useState } from 'react';
import { clearSessionPayments, listSessionPayments } from '../utils/sessionPayments.js';

export function useSessionPayments() {
  const [version, setVersion] = useState(0);

  const payments = useMemo(() => {
    void version;
    return listSessionPayments();
  }, [version]);

  const refresh = useCallback(() => {
    setVersion((current) => current + 1);
  }, []);

  const clear = useCallback(() => {
    clearSessionPayments();
    refresh();
  }, [refresh]);

  return { payments, refresh, clear };
}
