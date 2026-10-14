import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn.js';
import Button from './Button.jsx';

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
  );
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  size = 'md',
}) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    previousFocusRef.current = document.activeElement;
    document.body.classList.add('modal-open');

    const panel = panelRef.current;
    const focusables = panel ? getFocusableElements(panel) : [];
    focusables[0]?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
        return;
      }

      if (event.key !== 'Tab' || !panel) return;

      const elements = getFocusableElements(panel);
      if (!elements.length) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-open');
      previousFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          'relative z-10 w-full border border-steel/20 bg-carbon p-6 shadow-glow',
          sizes[size],
          className
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title ? (
              <h2 id={titleId} className="font-display text-3xl tracking-[0.08em] text-white">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p id={descriptionId} className="mt-2 text-sm text-steel">
                {description}
              </p>
            ) : null}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            Close
          </Button>
        </div>
        <div>{children}</div>
        {footer ? <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div> : null}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
