import { useEffect, useEffectEvent } from 'react';
import { createPortal } from 'react-dom';

// Centered alert with a warning (!) or success (✓) icon, a title, a message and one or two buttons.
// Leave out cancelLabel for a single-button alert. Escape and clicking the backdrop count as cancel
// (or as confirm when there is no cancel button).
export const AlertDialog = ({
  open,
  variant = 'warning',
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel,
  onConfirm,
  onCancel,
}) => {
  const dismiss = cancelLabel ? onCancel : onConfirm;
  const onEscape = useEffectEvent((event) => {
    if (event.key === 'Escape') dismiss?.();
  });

  useEffect(() => {
    if (!open) return undefined;
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="wetap-alert-overlay" onClick={dismiss}>
      <div
        className="wetap-alert-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="wetap-alert-title"
        aria-describedby="wetap-alert-message"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`wetap-alert-icon ${variant}`} aria-hidden="true">
          {variant === 'success' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 12.5l4 4 8-8.5" />
            </svg>
          ) : (
            <span>!</span>
          )}
        </div>
        <h2 id="wetap-alert-title" className="wetap-alert-title">{title}</h2>
        <p id="wetap-alert-message" className="wetap-alert-message">{message}</p>
        <div className="wetap-alert-actions">
          <button type="button" className="wetap-alert-btn confirm" onClick={onConfirm} autoFocus>
            {confirmLabel}
          </button>
          {cancelLabel && (
            <button type="button" className="wetap-alert-btn cancel" onClick={onCancel}>
              {cancelLabel}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AlertDialog;
