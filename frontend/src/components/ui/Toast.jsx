import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { cn } from '../../utils/cn.js';

const ToastContext = createContext(null);

const variantStyles = {
  success: 'border-signal/40 bg-carbon text-bone',
  error: 'border-signal bg-deep-red/20 text-bone',
  info: 'border-steel/30 bg-carbon text-bone',
  warning: 'border-signal/60 bg-carbon text-bone',
};

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, message, variant = 'info', duration = 4500 }) => {
      const id = ++toastId;
      setToasts((current) => [...current, { id, title, message, variant }]);

      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration);
      }

      return id;
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 top-4 z-[10000] flex flex-col items-end gap-3 sm:inset-x-auto sm:right-6 sm:top-6"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            className={cn(
              'pointer-events-auto w-full max-w-sm border px-4 py-3 shadow-glow backdrop-blur-md sm:w-96',
              variantStyles[item.variant]
            )}
            role="status"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                {item.title ? (
                  <p className="font-display text-lg tracking-[0.12em] text-white">{item.title}</p>
                ) : null}
                {item.message ? <p className="mt-1 text-sm text-bone/90">{item.message}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="text-steel transition-colors hover:text-white"
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export default ToastProvider;
