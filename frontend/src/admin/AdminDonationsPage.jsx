import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { exportDonationsCsv, getAdminDonations } from '../services/adminApi.js';
import { formatDate, formatMoney } from '../utils/format.js';
import { useToast } from '../components/ui/Toast.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import AdminTable from './components/AdminTable.jsx';

const statuses = ['', 'pending', 'paid', 'failed', 'refunded'];

export default function AdminDonationsPage() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [donations, setDonations] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0, paidTotal: 0, paidCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  const page = Number(searchParams.get('page') || 1);
  const search = searchParams.get('search') || '';
  const paymentStatus = searchParams.get('paymentStatus') || '';

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) next.delete(key);
      else next.set(key, String(value));
    });
    setSearchParams(next);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAdminDonations({
        page,
        limit: 20,
        search: search || undefined,
        paymentStatus: paymentStatus || undefined,
      });
      setDonations(result?.data ?? []);
      setMeta(result?.meta ?? { page, pages: 1, total: 0, paidTotal: 0, paidCount: 0 });
    } catch (err) {
      setError(err.message || 'Unable to load donations');
      toast({ title: 'Load failed', message: err.message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, search, paymentStatus, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportDonationsCsv({
        search: search || undefined,
        paymentStatus: paymentStatus || undefined,
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'CEO-donations.csv';
      anchor.click();
      window.URL.revokeObjectURL(url);
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
          <h1 className="font-display text-4xl tracking-[0.08em] text-white">Donations</h1>
          <p className="mt-2 text-sm text-steel">
            Total received: <span className="font-semibold text-white">{formatMoney(meta.paidTotal || 0)}</span> from{' '}
            {meta.paidCount || 0} paid donations.
          </p>
        </div>
        <Button variant="secondary" size="sm" loading={exporting} onClick={handleExport}>
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 border border-steel/20 bg-carbon/40 p-4 lg:grid-cols-3">
        <Input
          label="Search"
          placeholder="Donation #, name, or email"
          value={search}
          onChange={(event) => updateParams({ search: event.target.value, page: 1 })}
        />
        <Select
          label="Payment status"
          value={paymentStatus}
          onChange={(event) => updateParams({ paymentStatus: event.target.value, page: 1 })}
        >
          {statuses.map((status) => (
            <option key={status || 'all'} value={status}>
              {status || 'All statuses'}
            </option>
          ))}
        </Select>
        <div className="flex items-end">
          <Button variant="ghost" className="w-full" onClick={() => setSearchParams(new URLSearchParams())}>
            Clear filters
          </Button>
        </div>
      </div>

      {error ? (
        <div className="border border-signal/40 bg-deep-red/10 p-4 text-sm text-bone/90">
          {error}
          <Button className="mt-4" size="sm" onClick={load}>
            Retry
          </Button>
        </div>
      ) : null}

      <AdminTable
        loading={loading}
        data={donations}
        emptyTitle="No donations found"
        emptyDescription="Donations will appear here as soon as supporters give through the website."
        columns={[
          {
            key: 'donationNumber',
            header: 'Donation',
            render: (row) => <span className="font-medium text-white">{row.donationNumber}</span>,
          },
          {
            key: 'donor',
            header: 'Donor',
            render: (row) => (
              <div>
                <p>{row.customer?.name || 'Anonymous'}</p>
                <p className="text-xs text-steel">{row.customer?.email || '—'}</p>
              </div>
            ),
          },
          { key: 'amount', header: 'Amount', render: (row) => formatMoney(row.amount) },
          {
            key: 'paymentStatus',
            header: 'Status',
            render: (row) => (
              <Badge variant={row.paymentStatus === 'paid' ? 'success' : 'muted'}>{row.paymentStatus}</Badge>
            ),
          },
          {
            key: 'createdAt',
            header: 'Date',
            render: (row) => formatDate(row.paidAt || row.createdAt, { includeTime: true }),
          },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-steel">
          Page {meta.page} of {meta.pages || 1} · {meta.total || 0} donations
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => updateParams({ page: page - 1 })}>
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
