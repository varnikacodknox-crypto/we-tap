import { useEffect, useEffectEvent, useState } from 'react';
import { useToast } from '../../context/useToast';

// Fetches whenever `key` changes; a null key skips the request.
// Results are tagged with their key so a stale response never shows for a newer query.
export const useApiData = (key, load) => {
  const [result, setResult] = useState(null);
  const showToast = useToast();
  const runLoad = useEffectEvent((signal) => load(signal));
  const reportError = useEffectEvent((message) => showToast(message));

  useEffect(() => {
    if (key === null) return undefined;
    const controller = new AbortController();

    runLoad(controller.signal)
      .then((data) => setResult({ key, data }))
      .catch((error) => {
        if (controller.signal.aborted) return;
        setResult({ key, error: error.message });
        reportError(error.message);
      });

    return () => controller.abort();
  }, [key]);

  const current = result?.key === key ? result : null;
  return {
    data: current?.data,
    error: current?.error,
    isLoading: key !== null && current === null,
  };
};

export default useApiData;
