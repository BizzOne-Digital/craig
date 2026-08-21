import { cn } from '../../utils/cn.js';

export function SectionHeading({ eyebrow, title, subtitle, align = 'left', className }) {
  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      {eyebrow && (
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-signal">
          <span className="h-px w-8 bg-signal/80" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      {title ? (
        <h2 className="mt-4 font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.92] text-bone">
          {title}
        </h2>
      ) : null}
      {subtitle && (
        <p className={cn('mt-4 max-w-2xl text-lg text-steel', align === 'center' && 'mx-auto')}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
