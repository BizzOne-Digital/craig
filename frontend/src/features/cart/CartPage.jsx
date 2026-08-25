import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useCart from '../../hooks/useCart.js';
import { formatMoney } from '../../utils/format.js';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import SEO from '../../components/ui/SEO.jsx';
import Input from '../../components/ui/Input.jsx';
import { createCheckout } from '../../services/publicApi.js';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  line1: z.string().min(3, 'Address is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(3, 'ZIP code is required'),
  country: z.string().default('US'),
  discountCode: z.string().optional(),
  website: z.string().max(0).optional(),
});

export function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCart();
  const subtotal = getSubtotal();
  const [checkoutError, setCheckoutError] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: 'US', website: '' },
  });

  const onCheckout = async (values) => {
    setCheckoutError('');
    setCheckingOut(true);
    try {
      const { website, discountCode, ...rest } = values;
      const result = await createCheckout({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size || undefined,
          color: item.color || undefined,
        })),
        customer: {
          name: rest.name,
          email: rest.email,
          phone: rest.phone || undefined,
        },
        shippingAddress: {
          line1: rest.line1,
          line2: rest.line2 || undefined,
          city: rest.city,
          state: rest.state,
          postalCode: rest.postalCode,
          country: rest.country || 'US',
        },
        discountCode: discountCode || undefined,
        website: website || '',
      });

      const checkoutUrl = result.data?.url;
      if (!checkoutUrl) {
        setCheckoutError('Unable to start checkout. Please try again.');
        return;
      }

      window.location.href = checkoutUrl;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Checkout is unavailable right now. Please contact us to complete your order.';
      setCheckoutError(message);
    } finally {
      setCheckingOut(false);
    }
  };

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

            <div className="space-y-6">
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
                <div className="mt-6">
                  <Link to="/shop">
                    <Button variant="secondary" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </aside>

              <aside id="checkout" className="h-fit border border-steel/10 bg-carbon/60 p-6 scroll-mt-28">
                <h2 className="font-display text-2xl tracking-[0.08em] text-white">Checkout</h2>
                <p className="mt-2 text-sm text-steel">
                  Secure payment via Stripe. You&apos;ll be redirected to complete your purchase.
                </p>

                <form onSubmit={handleSubmit(onCheckout)} className="mt-6 space-y-4">
                  <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register('website')} />

                  <Input label="Full name" {...register('name')} error={errors.name?.message} required />
                  <Input label="Email" type="email" {...register('email')} error={errors.email?.message} required />
                  <Input label="Phone (optional)" type="tel" {...register('phone')} error={errors.phone?.message} />
                  <Input label="Address line 1" {...register('line1')} error={errors.line1?.message} required />
                  <Input label="Address line 2 (optional)" {...register('line2')} error={errors.line2?.message} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="City" {...register('city')} error={errors.city?.message} required />
                    <Input label="State" {...register('state')} error={errors.state?.message} required />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="ZIP code" {...register('postalCode')} error={errors.postalCode?.message} required />
                    <Input label="Country" {...register('country')} error={errors.country?.message} required />
                  </div>
                  <Input
                    label="Discount code (optional)"
                    {...register('discountCode')}
                    error={errors.discountCode?.message}
                  />

                  {checkoutError ? (
                    <p className="rounded border border-signal/40 bg-signal/10 px-3 py-2 text-sm text-bone" role="alert">
                      {checkoutError}
                    </p>
                  ) : null}

                  <Button type="submit" className="w-full" disabled={checkingOut}>
                    {checkingOut ? 'Redirecting…' : 'Proceed to Secure Checkout'}
                  </Button>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="w-full text-xs uppercase tracking-[0.16em] text-steel hover:text-signal"
                  >
                    Clear cart
                  </button>
                </form>
              </aside>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
