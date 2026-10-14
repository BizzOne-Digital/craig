import { cn } from '../../utils/cn.js';
import { PRODUCT_COLOR_OPTIONS, PRODUCT_SIZE_OPTIONS } from '../../utils/checkoutTotals.js';

const COLOR_SWATCH = {
  Red: 'bg-[#c41e1e]',
  Black: 'bg-black',
  Blue: 'bg-[#1e4fc4]',
  Green: 'bg-[#1e7a3a]',
};

export function ProductOptions({
  sizes = PRODUCT_SIZE_OPTIONS,
  colors = PRODUCT_COLOR_OPTIONS,
  size,
  color,
  onSizeChange,
  onColorChange,
  disabled = false,
  compact = false,
}) {
  return (
    <div className={cn('space-y-4', compact && 'space-y-3')}>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-steel">Size</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((value) => (
            <button
              key={value}
              type="button"
              disabled={disabled}
              onClick={() => onSizeChange(value)}
              className={cn(
                'min-w-[2.75rem] border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition',
                size === value
                  ? 'border-signal bg-signal/15 text-white'
                  : 'border-white/15 text-bone hover:border-signal/50',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-steel">Color</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((value) => (
            <button
              key={value}
              type="button"
              disabled={disabled}
              onClick={() => onColorChange(value)}
              className={cn(
                'flex items-center gap-2 border px-3 py-2 text-xs font-semibold transition',
                color === value
                  ? 'border-signal bg-signal/10 text-white'
                  : 'border-white/15 text-bone hover:border-signal/50',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              <span
                className={cn('h-4 w-4 rounded-full border border-white/30', COLOR_SWATCH[value] || 'bg-steel')}
                aria-hidden="true"
              />
              {value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductOptions;
