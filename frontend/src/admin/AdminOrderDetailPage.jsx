import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useParams } from 'react-router-dom';
import { getAdminOrder, updateAdminOrder } from '../services/adminApi.js';
import { formatDate, formatMoney } from '../utils/format.js';
import { useToast } from '../components/ui/Toast.jsx';
import Select from '../components/ui/Select.jsx';
import Input from '../components/ui/Input.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import AdminTable from './components/AdminTable.jsx';

const fulfillmentSchema = z.object({
  fulfillmentStatus: z.enum(['Unfulfilled', 'Processing', 'Shipped', 'Completed', 'Cancelled']),
  trackingNumber: z.string().max(100).optional(),
  carrier: z.string().max(100).optional(),
  note: z.string().max(500).optional(),
});

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(fulfillmentSchema),
    defaultValues: {
      fulfillmentStatus: 'Unfulfilled',
      trackingNumber: '',
      carrier: '',
      note: '',
    },
  });

  const fulfillmentStatus = watch('fulfillmentStatus');

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAdminOrder(id);
        if (!active) return;
        setOrder(data);
        reset({
          fulfillmentStatus: data.fulfillmentStatus || 'Unfulfilled',
          trackingNumber: data.trackingNumber || '',
          carrier: data.carrier || '',
          note: '',
        });
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to load order');
          toast({ title: 'Load failed', message: err.message, variant: 'error' });
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrder();
    return () => {
      active = false;
    };
  }, [id, reset, toast]);

  const onSubmit = async (values) => {
    try {
      const updated = await updateAdminOrder(id, values);
      setOrder(updated);
      reset({
        fulfillmentStatus: updated.fulfillmentStatus,
        trackingNumber: updated.trackingNumber || '',
        carrier: updated.carrier || '',
        note: '',
      });
      toast({ title: 'Order updated', message: 'Fulfillment status saved.', variant: 'success' });
    } catch (err) {
      toast({ title: 'Update failed', message: err.message, variant: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="border border-signal/40 bg-deep-red/10 p-6">
        <h1 className="font-display text-3xl tracking-[0.08em] text-white">Order unavailable</h1>
        <p className="mt-3 text-sm text-bone/90">{error || 'Order not found.'}</p>
        <Link to="/admin/orders" className="mt-6 inline-block">
          <Button variant="outline">Back to orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link to="/admin/orders" className="text-xs uppercase tracking-[0.16em] text-steel hover:text-signal">
            ← Back to orders
          </Link>
          <h1 className="mt-2 font-display text-4xl tracking-[0.08em] text-white">{order.orderNumber}</h1>
          <p className="mt-2 text-sm text-steel">Placed {formatDate(order.createdAt, { includeTime: true })}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'muted'}>{order.paymentStatus}</Badge>
          <Badge variant="signal">{order.fulfillmentStatus}</Badge>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-3">
        <section className="space-y-4 border border-steel/20 bg-carbon/40 p-6 xl:col-span-2">
          <h2 className="font-display text-2xl tracking-[0.08em] text-white">Line items</h2>
          <AdminTable
            data={order.lineItems || []}
            getRowKey={(row, index) => `${row.slug}-${index}`}
            emptyTitle="No line items"
            columns={[
              { key: 'name', header: 'Product', render: (row) => row.name },
              {
                key: 'options',
                header: 'Options',
                render: (row) => [row.size, row.color].filter(Boolean).join(' · ') || '—',
              },
              { key: 'quantity', header: 'Qty', render: (row) => row.quantity },
              { key: 'unitPrice', header: 'Unit', render: (row) => formatMoney(row.unitPrice) },
              { key: 'lineTotal', header: 'Total', render: (row) => formatMoney(row.lineTotal) },
            ]}
          />

          <div className="grid gap-3 border-t border-steel/15 pt-4 text-sm sm:grid-cols-2">
            <p>Subtotal: {formatMoney(order.subtotal)}</p>
            <p>Shipping: {formatMoney(order.shippingAmount)}</p>
            <p>Tax: {formatMoney(order.taxAmount)}</p>
            <p>Discount: {order.discountCode ? `${order.discountCode} (-${formatMoney(order.discountAmount)})` : '—'}</p>
            <p className="font-semibold text-white sm:col-span-2">Total: {formatMoney(order.total)}</p>
          </div>
        </section>

        <section className="space-y-6">
          <div className="border border-steel/20 bg-carbon/40 p-6">
            <h2 className="font-display text-2xl tracking-[0.08em] text-white">Customer</h2>
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-white">{order.customer?.name}</p>
              <p className="text-steel">{order.customer?.email}</p>
              {order.customer?.phone ? <p className="text-steel">{order.customer.phone}</p> : null}
            </div>
          </div>

          <div className="border border-steel/20 bg-carbon/40 p-6">
            <h2 className="font-display text-2xl tracking-[0.08em] text-white">Shipping address</h2>
            <address className="mt-4 space-y-1 text-sm not-italic text-steel">
              <p>{order.shippingAddress?.line1}</p>
              {order.shippingAddress?.line2 ? <p>{order.shippingAddress.line2}</p> : null}
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
              </p>
              <p>{order.shippingAddress?.country}</p>
            </address>
          </div>
        </section>
      </div>

      <section className="border border-steel/20 bg-carbon/40 p-6">
        <h2 className="font-display text-2xl tracking-[0.08em] text-white">Update fulfillment</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-5 lg:grid-cols-2">
          <Select
            label="Fulfillment status"
            required
            error={errors.fulfillmentStatus?.message}
            {...register('fulfillmentStatus')}
          >
            {['Unfulfilled', 'Processing', 'Shipped', 'Completed', 'Cancelled'].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
          {fulfillmentStatus === 'Shipped' ? (
            <>
              <Input label="Carrier" error={errors.carrier?.message} {...register('carrier')} />
              <Input label="Tracking number" error={errors.trackingNumber?.message} {...register('trackingNumber')} />
            </>
          ) : null}
          <div className="lg:col-span-2">
            <Textarea label="Internal note" rows={3} error={errors.note?.message} {...register('note')} />
          </div>
          <div className="lg:col-span-2">
            <Button type="submit" loading={isSubmitting}>
              Save fulfillment update
            </Button>
          </div>
        </form>
      </section>

      {order.statusHistory?.length ? (
        <section className="border border-steel/20 bg-carbon/40 p-6">
          <h2 className="font-display text-2xl tracking-[0.08em] text-white">Status history</h2>
          <ul className="mt-4 space-y-3">
            {[...order.statusHistory].reverse().map((entry, index) => (
              <li key={`${entry.status}-${index}`} className="border-l-2 border-signal/40 pl-4">
                <p className="text-sm font-medium text-white">{entry.status}</p>
                {entry.note ? <p className="text-sm text-steel">{entry.note}</p> : null}
                <p className="text-xs text-steel">{formatDate(entry.changedAt, { includeTime: true })}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
