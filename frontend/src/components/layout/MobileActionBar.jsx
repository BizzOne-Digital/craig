import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn.js';

const actions = [
  { to: 'tel:+13142675674', label: 'Call', external: true },
  { to: '/booking', label: 'Book', primary: true },
  { to: '/shop', label: 'Shop' },
];

export function MobileActionBar() {
  const location = useLocation();
  const hidden = location.pathname.startsWith('/admin') || location.pathname.startsWith('/order');

  if (hidden) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-carbon/95 px-3 pb-safe pt-2 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-lg items-stretch justify-between gap-2">
        {actions.map((action) =>
          action.external ? (
            <a
              key={action.to}
              href={action.to}
              className="touch-target flex flex-1 items-center justify-center rounded-sm border border-white/15 py-3 text-sm font-bold uppercase tracking-[0.12em] text-bone"
            >
              {action.label}
            </a>
          ) : (
            <Link
              key={action.to}
              to={action.to}
              className={cn(
                'touch-target flex flex-1 items-center justify-center rounded-sm py-3 text-sm font-bold uppercase tracking-[0.12em]',
                action.primary
                  ? 'bg-signal text-white shadow-glow'
                  : 'border border-white/15 text-bone'
              )}
            >
              {action.label}
            </Link>
          )
        )}
      </div>
    </div>
  );
}

export default MobileActionBar;
