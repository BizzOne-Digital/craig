import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart.js';
import { formatMoney } from '../../utils/format.js';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import SEO from '../../components/ui/SEO.jsx';

export function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCart();
  const subtotal = getSubtotal();

  return (
    <div className="section-padding">
      <SEO
        title="Cart"
        description="Review items in your cart and continue to checkout to support the CEO Foundation mission."
        path="/cart"
      />
      <div className="container-jlf">
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-signal">Shop With Purpose</p>
        <h1 className="display-md text-white">Your Cart</h1>

        {items.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="No items yet"
              description="Explore mission-driven products and add them to your cart when you're ready."
              actionLabel="Browse Shop"
              onAction={() => {}}
            />
            <div className="mt-6 text-center">
              <Link to="/shop">
                <Button>Browse Shop</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
            <ul className="space-y-6">
              {items.map((item) => {
                const key = `${item.productId}-${item.size || 'default'}-${item.color || 'default'}`;
                return (
                  <li
                    key={key}
                    className="grid gap-4 border border-steel/10 bg-carbon/50 p-4 md:grid-cols-[7rem_1fr_auto]"
                  >
                    {item.image ? (
                      <img src={item.image} alt="" className="h-28 w-full object-cover md:h-24" />
                    ) : (
                      <div className="flex h-28 items-center justify-center bg-obsidian text-xs text-steel md:h-24">
                        No image
                      </div>
                    )}
                    <div>
                      <Link to={`/shop/${item.slug}`} className="font-semibold text-white hover:text-signal">
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm text-steel">
                        {item.size ? `Size: ${item.size}` : null}
                        {item.size && item.color ? ' · ' : null}
                        {item.color ? `Color: ${item.color}` : null}
                      </p>
                      <p className="mt-2 text-sm">{formatMoney(item.price)} each</p>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <label className="text-xs uppercase tracking-[0.16em] text-steel" htmlFor={`cart-qty-${key}`}>
                          Qty
                        </label>
                        <input
                          id={`cart-qty-${key}`}
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
                          className="w-20 border border-steel/30 bg-obsidian px-2 py-1"
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
                    <p className="font-semibold text-white md:text-right">
                      {formatMoney(item.price * item.quantity)}
                    </p>
                  </li>
                );
              })}
            </ul>

            <aside className="h-fit border border-steel/10 bg-carbon/60 p-6">
              <h2 className="font-display text-2xl tracking-[0.08em] text-white">Order Summary</h2>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-steel">Subtotal</span>
                  <span>{formatMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-steel">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <Link to="/shop">
                  <Button variant="secondary" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
                <Link to="/shop">
                  <Button className="w-full">Proceed to Checkout</Button>
                </Link>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs uppercase tracking-[0.16em] text-steel hover:text-signal"
                >
                  Clear cart
                </button>
              </div>
              <p className="mt-6 text-xs text-steel">
                Purchases support the Foundation&apos;s mission.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
