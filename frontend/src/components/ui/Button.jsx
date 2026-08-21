import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn.js';

const variants = {
  primary:
    'bg-signal text-white border border-signal hover:bg-deep-red hover:border-deep-red shadow-glow hover:shadow-[0_0_50px_rgba(225,6,0,0.45)]',
  secondary:
    'bg-white/5 text-bone border border-bone/20 hover:border-signal/60 hover:bg-signal/10 backdrop-blur-sm',
  ghost: 'bg-transparent text-bone hover:text-signal border border-transparent hover:bg-white/5',
  danger: 'bg-deep-red text-white border border-deep-red hover:bg-signal',
  outline:
    'bg-transparent text-signal border border-signal/80 hover:bg-signal hover:text-white hover:shadow-glow',
};

const sizes = {
  sm: 'px-4 py-2 text-xs tracking-[0.18em]',
  md: 'px-6 py-3 text-sm tracking-[0.16em]',
  lg: 'px-8 py-4 text-sm tracking-[0.14em]',
};

const baseClass =
  'group relative inline-flex items-center justify-center gap-2 overflow-hidden font-body font-semibold uppercase transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian';

function Shine() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
    />
  );
}

export const Button = forwardRef(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    type = 'button',
    loading = false,
    disabled,
    magnetic = false,
    to,
    href,
    children,
    ...props
  },
  ref
) {
  const classes = cn(baseClass, variants[variant], sizes[size], className);
  const content = (
    <>
      <Shine />
      {loading ? (
        <>
          <span className="relative z-10 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span className="relative z-10">{children}</span>
        </>
      ) : (
        <span className="relative z-10">{children}</span>
      )}
    </>
  );

  if (to) {
    return (
      <Link
        ref={ref}
        to={to}
        data-magnetic={magnetic ? 'true' : undefined}
        className={classes}
        {...props}
      >
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        data-magnetic={magnetic ? 'true' : undefined}
        className={classes}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      data-magnetic={magnetic ? 'true' : undefined}
      className={classes}
      {...props}
    >
      {content}
    </button>
  );
});

export default Button;
