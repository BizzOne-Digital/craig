import { cn } from '../../utils/cn.js';

const variants = {
  default: 'border-steel/30 bg-carbon text-bone',
  signal: 'border-signal bg-signal/10 text-signal',
  success: 'border-signal/50 bg-signal/10 text-bone',
  muted: 'border-steel/20 bg-obsidian text-steel',
};

export function Badge({ className, variant = 'default', children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em]',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
