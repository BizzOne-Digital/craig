import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart.js';
import { formatMoney } from '../../utils/format.js';
import { cn } from '../../utils/cn.js';
import Button from '../ui/Button.jsx';
import EmptyState from '../ui/EmptyState.jsx';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCart();
  const subtotal = getSubtotal();

  return (
    <>
      <button
        type="button"
        aria-hidden={!isOpen}
        className={cn(
          'fixed inset-0 z-[70] bg-obsidian/70 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={closeCart}
        tabIndex={isOpen ? 0 : -1}
        aria-label="Close cart overlay"
      />
      <aside
        data-lenis-prevent
        className={cn(
          'fixed inset-y-0 right-0 z-[71] flex w-full max-w-md flex-col border-l border-steel/10 bg-carbon shadow-glow transition-transform duration-500',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-hidden={!isOpen}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-steel/10 px-6 py-5">
          <h2 className="font-display text-3xl tracking-[0.08em] text-white">Cart</h2>
          <button
            type="button"
            onClick={closeCart}
            className="text-sm uppercase tracking-[0.18em] text-steel hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <EmptyState
              title="Your cart is empty"
              description="Support the mission with purpose-driven products from our shop."
              actionLabel="Shop With Purpose"
              onAction={closeCart}
            />
          ) : (
            <ul className="space-y-6">
              {items.map((item) => {
                const key = `${item.productId}-${item.size || 'default'}-${item.color || 'default'}`;
                return (
                  <li key={key} className="flex gap-4 border-b border-steel/10 pb-6">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="h-24 w-20 object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-24 w-20 items-center justify-center bg-obsidian text-xs text-steel">
                        No image
                      </div>
                    )}
                    <div className="flex-1">
                      <Link
                        to={`/shop/${item.slug}`}
                        onClick={closeCart}
                        className="line-clamp-2 font-semibold text-white hover:text-signal"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm text-steel">
                        {item.size ? `Size: ${item.size}` : null}
                        {item.size && item.color ? ' · ' : null}
                        {item.color ? `Color: ${item.color}` : null}
                      </p>
                      <p className="mt-2 text-sm text-bone">{formatMoney(item.price)}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <label className="sr-only" htmlFor={`qty-${key}`}>
                          Quantity for {item.name}
                        </label>
                        <input
                          id={`qty-${key}`}
                          type="number"
                          min="1"
                          max="20"
                          value={item.quantity}
                          onChange={(event) =>
                            updateQuantity(
                              item.productId,
                              Number(event.target.value),
                              item.size,
                              item.color
                            )
                          }
                          className="w-16 border border-steel/30 bg-obsidian px-2 py-1 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.size, item.color)}
                          className="text-xs uppercase tracking-[0.16em] text-steel hover:text-signal"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <div className="border-t border-steel/10 px-4 py-4 pb-safe sm:px-6 sm:py-5">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-steel">Subtotal</span>
              <span className="font-semibold text-white">{formatMoney(subtotal)}</span>
            </div>
            <Link to="/cart" onClick={closeCart}>
              <Button className="w-full" variant="secondary">
                View Cart
              </Button>
            </Link>
          </div>
        ) : null}
      </aside>
    </>
  );
}

export default CartDrawer;
