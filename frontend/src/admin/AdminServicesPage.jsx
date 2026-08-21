import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteAdminService, getAdminServices, reorderAdminServices } from '../services/adminApi.js';
import { formatMoney } from '../utils/format.js';
import { useToast } from '../components/ui/Toast.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import AdminTable from './components/AdminTable.jsx';
import ConfirmModal from './components/ConfirmModal.jsx';

export default function AdminServicesPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reordering, setReordering] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminServices();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Unable to load services');
      toast({ title: 'Load failed', message: err.message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const moveService = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const reordered = [...services];
    const [item] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, item);

    setServices(reordered);
    setReordering(true);

    try {
      const payload = reordered.map((service, displayOrder) => ({
        id: service._id,
        displayOrder,
      }));
      const updated = await reorderAdminServices(payload);
      setServices(Array.isArray(updated) ? updated : reordered);
      toast({ title: 'Order updated', variant: 'success' });
    } catch (err) {
      await loadServices();
      toast({ title: 'Reorder failed', message: err.message, variant: 'error' });
    } finally {
      setReordering(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteAdminService(deleteTarget._id);
      setServices((current) => current.filter((item) => item._id !== deleteTarget._id));
      toast({ title: 'Service deleted', variant: 'success' });
      setDeleteTarget(null);
    } catch (err) {
      toast({ title: 'Delete failed', message: err.message, variant: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl tracking-[0.08em] text-white">Services</h1>
          <p className="mt-2 text-sm text-steel">Manage offerings and control display order.</p>
        </div>
        <Link to="/admin/services/new">
          <Button>Add service</Button>
        </Link>
      </div>

      {error ? (
        <div className="border border-signal/40 bg-deep-red/10 p-4 text-sm text-bone/90">
          {error}
          <Button className="mt-4" size="sm" onClick={loadServices}>
            Retry
          </Button>
        </div>
      ) : null}

      <AdminTable
        loading={loading}
        data={services}
        emptyTitle="No services yet"
        emptyDescription="Add your first service to display on the public site."
        onRowClick={(row) => navigate(`/admin/services/${row._id}/edit`)}
        columns={[
          {
            key: 'order',
            header: 'Order',
            render: (row, index) => (
              <div className="flex gap-2" onClick={(event) => event.stopPropagation()}>
                <Button size="sm" variant="ghost" disabled={reordering || index === 0} onClick={() => moveService(index, -1)}>
                  Up
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={reordering || index === services.length - 1}
                  onClick={() => moveService(index, 1)}
                >
                  Down
                </Button>
              </div>
            ),
          },
          {
            key: 'title',
            header: 'Service',
            render: (row) => (
              <div>
                <p className="font-medium text-white">{row.title}</p>
                <p className="text-xs text-steel">{row.shortDescription || row.slug}</p>
              </div>
            ),
          },
          {
            key: 'price',
            header: 'Price',
            render: (row) => formatMoney(row.price),
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <div className="flex flex-wrap gap-2">
                <Badge variant={row.active ? 'success' : 'muted'}>{row.active ? 'Active' : 'Hidden'}</Badge>
                {row.featured ? <Badge variant="signal">Featured</Badge> : null}
              </div>
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <div className="flex gap-2" onClick={(event) => event.stopPropagation()}>
                <Link to={`/admin/services/${row._id}/edit`}>
                  <Button size="sm" variant="ghost">
                    Edit
                  </Button>
                </Link>
                <Button size="sm" variant="danger" onClick={() => setDeleteTarget(row)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete service?"
        description={`This will permanently remove "${deleteTarget?.title}".`}
        confirmLabel="Delete service"
      />
    </div>
  );
}
