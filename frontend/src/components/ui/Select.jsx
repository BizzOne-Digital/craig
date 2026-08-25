import { forwardRef } from 'react';
import { cn } from '../../utils/cn.js';

export const Select = forwardRef(function Select(
  { className, label, error, hint, id, required, children, options, placeholder, ...props },
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
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          required={required}
          className={cn(
            'w-full appearance-none rounded-none border border-steel/30 bg-carbon/80 px-4 py-3 pr-10 text-bone',
            'transition-colors duration-200',
            'focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-signal focus:ring-signal',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options?.map((option) => (
            <option key={`${option.value}-${option.label}`} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
          {children}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-steel">
          ▾
        </span>
      </div>
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

export default Select;
