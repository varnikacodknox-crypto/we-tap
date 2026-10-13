import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ToastContext } from './toastContextInstance';

const TOAST_DURATION_MS = 3000;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismissToast = useCallback((id) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message) => {
    if (!message) return;
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message }]);
    timers.current.set(id, setTimeout(() => dismissToast(id), TOAST_DURATION_MS));
  }, [dismissToast]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {createPortal(
        <div className="wetap-toast-container" aria-live="assertive">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="wetap-toast"
              role="alert"
              onClick={() => dismissToast(toast.id)}
            >
              {toast.message}
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};
