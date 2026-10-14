import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../services/adminApi.js';
import { formatDate, formatMoney } from '../utils/format.js';
import { useToast } from '../components/ui/Toast.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import AdminTable from './components/AdminTable.jsx';

function StatCard({ label, value, hint }) {
  return (
    <div className="border border-steel/20 bg-carbon/60 p-5">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-steel">{label}</p>
      <p className="mt-2 font-display text-4xl tracking-[0.06em] text-white">{value}</p>
      {hint ? <p className="mt-2 text-xs text-steel">{hint}</p> : null}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError(null);
      try {
        const data = await getDashboard();
        if (active) setDashboard(data);
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to load dashboard');
          toast({ title: 'Dashboard error', message: err.message, variant: 'error' });
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, [toast]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-signal/40 bg-deep-red/10 p-6">
        <h1 className="font-display text-3xl tracking-[0.08em] text-white">Dashboard</h1>
        <p className="mt-3 text-sm text-bone/90">{error}</p>
        <Button className="mt-6" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  const { stats, recentOrders = [], lowStockProducts = [] } = dashboard || {};

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl tracking-[0.08em] text-white">Dashboard</h1>
          <p className="mt-2 text-sm text-steel">Overview of store activity and inventory alerts.</p>
        </div>
        <Link to="/admin/orders">
          <Button variant="outline" size="sm">
            View all orders
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Products" value={stats?.products ?? 0} />
        <StatCard label="Active services" value={stats?.activeServices ?? 0} />
        <StatCard label="Orders" value={stats?.orders ?? 0} hint={`${stats?.pendingOrders ?? 0} pending payment`} />
        <StatCard
          label="Paid revenue"
          value={formatMoney(stats?.paidRevenueTotal ?? 0)}
          hint={`${stats?.paidOrderCount ?? 0} paid orders`}
        />
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl tracking-[0.08em] text-white">Recent orders</h2>
          </div>
          <AdminTable
            data={recentOrders}
            emptyTitle="No orders yet"
            emptyDescription="New orders will appear here once customers check out."
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
                render: (row) => row.customer?.name || '—',
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
                key: 'createdAt',
                header: 'Date',
                render: (row) => formatDate(row.createdAt, { includeTime: true }),
              },
            ]}
          />
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl tracking-[0.08em] text-white">Low stock</h2>
            <Link to="/admin/products">
              <Button variant="ghost" size="sm">
                Manage products
              </Button>
            </Link>
          </div>
          <AdminTable
            data={lowStockProducts}
            emptyTitle="Inventory looks healthy"
            emptyDescription="Products at or below their threshold will show here."
            columns={[
              { key: 'name', header: 'Product', render: (row) => row.name },
              { key: 'sku', header: 'SKU', render: (row) => row.sku || '—' },
              {
                key: 'stock',
                header: 'Stock',
                render: (row) => (
                  <Badge variant="signal">
                    {row.stock} / {row.lowStockThreshold ?? 5}
                  </Badge>
                ),
              },
            ]}
          />
        </section>
      </div>
    </div>
  );
}
