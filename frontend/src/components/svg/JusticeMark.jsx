import { cn } from '../../utils/cn.js';

export function JusticeMark({ className, ...props }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-auto w-full', className)}
      aria-hidden="true"
      {...props}
    >
      <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <path
        d="M60 18V102M18 60H102"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.2"
      />
      <path
        d="M36 42H84M42 78H78"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M60 28L48 52H72L60 28Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M44 88C52 96 68 96 76 88"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="60" cy="60" r="4" fill="currentColor" />
    </svg>
  );
}

export default JusticeMark;
