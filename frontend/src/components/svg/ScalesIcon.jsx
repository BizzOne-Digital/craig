import { cn } from '../../utils/cn.js';

export function ScalesIcon({ className, animated = false, ...props }) {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-auto w-full text-signal', className)}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M80 8V112"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={animated ? 'scale-draw' : undefined}
        pathLength="1"
        style={animated ? { strokeDasharray: 1, strokeDashoffset: 1 } : undefined}
      />
      <path
        d="M48 24H112"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M28 44L52 44L40 72L28 44Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M108 44L132 44L120 72L108 44Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M40 44H120"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M40 72V84"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M120 72V84"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse cx="40" cy="90" rx="18" ry="6" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="120" cy="90" rx="18" ry="6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default ScalesIcon;
