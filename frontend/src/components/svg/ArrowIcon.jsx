import { cn } from '../../utils/cn.js';

export function ArrowIcon({ className, direction = 'right', ...props }) {
  const rotation = {
    right: 'rotate-0',
    left: 'rotate-180',
    up: '-rotate-90',
    down: 'rotate-90',
  }[direction];

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-5 w-5', rotation, className)}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M5 12H19M19 12L13 6M19 12L13 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ArrowIcon;
