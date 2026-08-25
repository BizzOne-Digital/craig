import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { exportOrdersCsv, getAdminOrders } from '../services/adminApi.js';
import { formatDate, formatMoney } from '../utils/format.js';
import { useToast } from '../components/ui/Toast.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import AdminTable from './components/AdminTable.jsx';

const paymentStatuses = ['', 'pending', 'paid', 'failed', 'refunded'];
const fulfillmentStatuses = ['', 'Unfulfilled', 'Processing', 'Shipped', 'Completed', 'Cancelled'];

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  const page = Number(searchParams.get('page') || 1);
  const search = searchParams.get('search') || '';
  const paymentStatus = searchParams.get('paymentStatus') || '';
  const fulfillmentStatus = searchParams.get('fulfillmentStatus') || '';

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) next.delete(key);
      else next.set(key, String(value));
    });
    setSearchParams(next);
  };

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAdminOrders({
        page,
        limit: 20,
        search: search || undefined,
        paymentStatus: paymentStatus || undefined,
        fulfillmentStatus: fulfillmentStatus || undefined,
      });
      setOrders(result?.data ?? []);
      setMeta(result?.meta ?? { page, pages: 1, total: 0, limit: 20 });
    } catch (err) {
      setError(err.message || 'Unable to load orders');
      toast({ title: 'Load failed', message: err.message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, search, paymentStatus, fulfillmentStatus, toast]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportOrdersCsv({
        search: search || undefined,
        paymentStatus: paymentStatus || undefined,
        fulfillmentStatus: fulfillmentStatus || undefined,
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'CEO-orders.csv';
      anchor.click();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Export ready', message: 'Orders CSV downloaded.', variant: 'success' });
    } catch (err) {
      toast({ title: 'Export failed', message: err.message, variant: 'error' });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl tracking-[0.08em] text-white">Orders</h1>
          <p className="mt-2 text-sm text-steel">Review payments, fulfillment, and customer details.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="/api/admin/orders/export.csv" className="inline-flex">
            <Button variant="outline" size="sm">
              CSV link
            </Button>
          </a>
          <Button variant="secondary" size="sm" loading={exporting} onClick={handleExport}>
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4 border border-steel/20 bg-carbon/40 p-4 lg:grid-cols-4">
        <Input
          label="Search"
          placeholder="Order #, name, or email"
          value={search}
          onChange={(event) => updateParams({ search: event.target.value, page: 1 })}
        />
        <Select
          label="Payment status"
          value={paymentStatus}
          onChange={(event) => updateParams({ paymentStatus: event.target.value, page: 1 })}
        >
          {paymentStatuses.map((status) => (
            <option key={status || 'all'} value={status}>
              {status || 'All payments'}
            </option>
          ))}
        </Select>
        <Select
          label="Fulfillment status"
          value={fulfillmentStatus}
          onChange={(event) => updateParams({ fulfillmentStatus: event.target.value, page: 1 })}
        >
          {fulfillmentStatuses.map((status) => (
            <option key={status || 'all'} value={status}>
              {status || 'All fulfillment'}
            </option>
          ))}
        </Select>
        <div className="flex items-end">
          <Button
            variant="ghost"
            className="w-full"
            onClick={() =>
              setSearchParams(new URLSearchParams())
            }
          >
            Clear filters
          </Button>
        </div>
      </div>

      {error ? (
        <div className="border border-signal/40 bg-deep-red/10 p-4 text-sm text-bone/90">
          {error}
          <Button className="mt-4" size="sm" onClick={loadOrders}>
            Retry
          </Button>
        </div>
      ) : null}

      <AdminTable
        loading={loading}
        data={orders}
        emptyTitle="No orders found"
        emptyDescription="Try adjusting your filters or check back later."
        onRowClick={(row) => navigate(`/admin/orders/${row._id}`)}
        columns={[
          {
            key: 'orderNumber',
            header: 'Order',
            render: (row) => (
              <Link to={`/admin/orders/${row._id}`} className="font-medium text-white hover:text-signal">
                {row.orderNumber}
              </Link>
            ),
          },
          {
            key: 'customer',
            header: 'Customer',
            render: (row) => (
              <div>
                <p>{row.customer?.name}</p>
                <p className="text-xs text-steel">{row.customer?.email}</p>
              </div>
            ),
          },
          {
            key: 'total',
            header: 'Total',
            render: (row) => formatMoney(row.total),
          },
          {
            key: 'paymentStatus',
            header: 'Payment',
            render: (row) => <Badge variant={row.paymentStatus === 'paid' ? 'success' : 'muted'}>{row.paymentStatus}</Badge>,
          },
          {
            key: 'fulfillmentStatus',
            header: 'Fulfillment',
            render: (row) => <Badge variant="signal">{row.fulfillmentStatus}</Badge>,
          },
          {
            key: 'createdAt',
            header: 'Date',
            render: (row) => formatDate(row.createdAt, { includeTime: true }),
          },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-steel">
          Page {meta.page} of {meta.pages || 1} · {meta.total || 0} orders
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || loading}
            onClick={() => updateParams({ page: page - 1 })}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= (meta.pages || 1) || loading}
            onClick={() => updateParams({ page: page + 1 })}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
