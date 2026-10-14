import { forwardRef } from 'react';
import { cn } from '../../utils/cn.js';

export const Textarea = forwardRef(function Textarea(
  { className, label, error, hint, id, required, rows = 4, ...props },
  ref
) {
  const inputId = id || props.name;

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={inputId} className="block text-sm font-medium text-bone">
          {label}
          {required ? <span className="text-signal"> *</span> : null}
        </label>
      ) : null}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        required={required}
        className={cn(
          'w-full resize-y rounded-none border border-steel/30 bg-carbon/80 px-4 py-3 text-bone',
          'placeholder:text-steel/70 transition-colors duration-200',
          'focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-signal focus:ring-signal',
          className
        )}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {hint && !error ? (
        <p id={`${inputId}-hint`} className="text-xs text-steel">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-signal" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});

export default Textarea;
