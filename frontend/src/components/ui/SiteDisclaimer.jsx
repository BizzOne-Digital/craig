import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn.js';

export function SiteDisclaimer({ className, compact = false }) {
  if (compact) {
    return (
      <p className={cn('text-xs leading-relaxed text-steel/70', className)}>
        For educational and entertainment purposes only. Not legal advice.{' '}
        <Link to="/disclaimer" className="text-signal hover:underline">
          Full disclaimer
        </Link>
      </p>
    );
  }

  return (
    <p className={cn('text-xs leading-relaxed text-steel/70', className)}>
      Content on this website and related merchandise is provided for{' '}
      <strong className="font-medium text-steel">educational and entertainment purposes only</strong>.
      It is not legal advice and does not guarantee dismissal, acquittal, or any other legal outcome.{' '}
      <Link to="/disclaimer" className="text-signal hover:underline">
        Read full disclaimer
      </Link>
    </p>
  );
}

export default SiteDisclaimer;
