import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { deleteAdminInquiry, getAdminInquiries, updateAdminInquiryStatus } from '../services/adminApi.js';
import { formatDate } from '../utils/format.js';
import { useToast } from '../components/ui/Toast.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import AdminTable from './components/AdminTable.jsx';
import ConfirmModal from './components/ConfirmModal.jsx';

const statuses = ['new', 'contacted', 'closed'];

const CONFIG = {
  bookings: {
    title: 'Bookings',
    subtitle: 'Case review and service booking requests from the website.',
    summaryHeader: 'Request',
    summary: (row) => (
      <div>
        <p className="font-medium text-white">{row.service}</p>
        <p className="text-xs text-steel">
          {row.preferredDate} · {row.preferredTime} · prefers {row.contactPreference}
        </p>
        {row.message ? <p className="mt-1 max-w-md whitespace-pre-wrap text-xs text-bone/80">{row.message}</p> : null}
      </div>
    ),
  },
  contacts: {
    title: 'Contact messages',
    subtitle: 'Messages submitted through the contact form.',
    summaryHeader: 'Message',
    summary: (row) => (
      <div>
        <p className="font-medium text-white">{row.subject}</p>
        <p className="mt-1 max-w-md whitespace-pre-wrap text-xs text-bone/80">{row.message}</p>
      </div>
    ),
  },
};

export default function AdminInquiriesPage({ kind }) {
  const config = CONFIG[kind];
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const page = Number(searchParams.get('page') || 1);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';

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
      const result = await getAdminInquiries(kind, {
        page,
        limit: 20,
        search: search || undefined,
        status: status || undefined,
      });
      setItems(result?.data ?? []);
      setMeta(result?.meta ?? { page, pages: 1, total: 0 });
    } catch (err) {
      setError(err.message || 'Unable to load');
      toast({ title: 'Load failed', message: err.message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [kind, page, search, status, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (row, next) => {
    try {
      const updated = await updateAdminInquiryStatus(kind, row._id, next);
      setItems((current) => current.map((item) => (item._id === row._id ? updated : item)));
      toast({ title: 'Status updated', variant: 'success' });
    } catch (err) {
      toast({ title: 'Update failed', message: err.message, variant: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteAdminInquiry(kind, deleteTarget._id);
      setItems((current) => current.filter((item) => item._id !== deleteTarget._id));
      toast({ title: 'Deleted', variant: 'success' });
      setDeleteTarget(null);
    } catch (err) {
      toast({ title: 'Delete failed', message: err.message, variant: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl tracking-[0.08em] text-white">{config.title}</h1>
        <p className="mt-2 text-sm text-steel">{config.subtitle}</p>
      </div>

      <div className="grid gap-4 border border-steel/20 bg-carbon/40 p-4 lg:grid-cols-3">
        <Input
          label="Search"
          placeholder="Name, email, or keyword"
          value={search}
          onChange={(event) => updateParams({ search: event.target.value, page: 1 })}
        />
        <Select label="Status" value={status} onChange={(event) => updateParams({ status: event.target.value, page: 1 })}>
          <option value="">All statuses</option>
          {statuses.map((value) => (
            <option key={value} value={value}>
              {value}
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
        data={items}
        emptyTitle="Nothing here yet"
        emptyDescription="New submissions will appear here."
        columns={[
          {
            key: 'from',
            header: 'From',
            render: (row) => (
              <div>
                <p className="font-medium text-white">{row.name}</p>
                <a href={`mailto:${row.email}`} className="text-xs text-signal hover:underline">
                  {row.email}
                </a>
                {row.phone ? <p className="text-xs text-steel">{row.phone}</p> : null}
              </div>
            ),
          },
          { key: 'summary', header: config.summaryHeader, render: config.summary },
          { key: 'createdAt', header: 'Received', render: (row) => formatDate(row.createdAt, { includeTime: true }) },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <div className="space-y-2">
                <Badge variant={(row.status || 'new') === 'new' ? 'signal' : 'muted'}>{row.status || 'new'}</Badge>
                <Select
                  aria-label="Change status"
                  value={row.status || 'new'}
                  onChange={(event) => changeStatus(row, event.target.value)}
                >
                  {statuses.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
              </div>
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <Button size="sm" variant="danger" onClick={() => setDeleteTarget(row)}>
                Delete
              </Button>
            ),
          },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-steel">
          Page {meta.page} of {meta.pages || 1} · {meta.total || 0} total
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

      <ConfirmModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this entry?"
        description={`This will permanently remove the submission from ${deleteTarget?.name || 'this sender'}.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
