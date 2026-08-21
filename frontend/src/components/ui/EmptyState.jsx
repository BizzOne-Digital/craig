import { cn } from '../../utils/cn.js';
import Button from './Button.jsx';

export function EmptyState({
  title = 'Nothing here yet',
  description,
  actionLabel,
  onAction,
  icon,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center border border-dashed border-steel/20 bg-carbon/40 px-6 py-16 text-center',
        className
      )}
    >
      {icon ? <div className="mb-6 text-signal">{icon}</div> : null}
      <h3 className="font-display text-3xl tracking-[0.08em] text-white">{title}</h3>
      {description ? <p className="mt-3 max-w-md text-sm text-steel">{description}</p> : null}
      {actionLabel && onAction ? (
        <Button className="mt-8" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export default EmptyState;
