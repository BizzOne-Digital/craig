import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteAdminTestimonial, getAdminTestimonials } from '../services/adminApi.js';
import { useToast } from '../components/ui/Toast.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import AdminTable from './components/AdminTable.jsx';
import ConfirmModal from './components/ConfirmModal.jsx';

export default function AdminTestimonialsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminTestimonials();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Unable to load testimonials');
      toast({ title: 'Load failed', message: err.message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteAdminTestimonial(deleteTarget._id);
      setTestimonials((current) => current.filter((item) => item._id !== deleteTarget._id));
      toast({ title: 'Testimonial deleted', variant: 'success' });
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
          <h1 className="font-display text-4xl tracking-[0.08em] text-white">Testimonials</h1>
          <p className="mt-2 text-sm text-steel">Manage published quotes and featured stories.</p>
        </div>
        <Link to="/admin/testimonials/new">
          <Button>Add testimonial</Button>
        </Link>
      </div>

      {error ? (
        <div className="border border-signal/40 bg-deep-red/10 p-4 text-sm text-bone/90">
          {error}
          <Button className="mt-4" size="sm" onClick={loadTestimonials}>
            Retry
          </Button>
        </div>
      ) : null}

      <AdminTable
        loading={loading}
        data={testimonials}
        emptyTitle="No testimonials yet"
        emptyDescription="Add a testimonial to showcase community impact."
        onRowClick={(row) => navigate(`/admin/testimonials/${row._id}/edit`)}
        columns={[
          {
            key: 'displayName',
            header: 'Person',
            render: (row) => (
              <div className="flex items-center gap-3">
                {row.image?.url ? (
                  <img src={row.image.url} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-obsidian text-xs text-steel">
                    {row.displayName?.[0] || '?'}
                  </div>
                )}
                <div>
                  <p className="font-medium text-white">{row.displayName}</p>
                  <p className="text-xs text-steel">{row.roleOrLocation || '—'}</p>
                </div>
              </div>
            ),
          },
          {
            key: 'quote',
            header: 'Quote',
            render: (row) => <p className="max-w-md truncate text-steel">{row.quote}</p>,
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <div className="flex flex-wrap gap-2">
                <Badge variant={row.published ? 'success' : 'muted'}>{row.published ? 'Published' : 'Draft'}</Badge>
                {row.featured ? <Badge variant="signal">Featured</Badge> : null}
              </div>
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <div className="flex gap-2" onClick={(event) => event.stopPropagation()}>
                <Link to={`/admin/testimonials/${row._id}/edit`}>
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
        title="Delete testimonial?"
        description={`This will permanently remove the quote from "${deleteTarget?.displayName}".`}
        confirmLabel="Delete testimonial"
      />
    </div>
  );
}
