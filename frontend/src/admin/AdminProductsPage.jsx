import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteAdminProduct, getAdminProducts } from '../services/adminApi.js';
import { formatMoney } from '../utils/format.js';
import { useToast } from '../components/ui/Toast.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import AdminTable from './components/AdminTable.jsx';
import ConfirmModal from './components/ConfirmModal.jsx';

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAdminProducts();
      setProducts(result?.data ?? result ?? []);
    } catch (err) {
      setError(err.message || 'Unable to load products');
      toast({ title: 'Load failed', message: err.message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) =>
      [product.name, product.sku, product.category, product.slug]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [products, search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteAdminProduct(deleteTarget._id);
      setProducts((current) => current.filter((item) => item._id !== deleteTarget._id));
      toast({ title: 'Product deleted', variant: 'success' });
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
          <h1 className="font-display text-4xl tracking-[0.08em] text-white">Products</h1>
          <p className="mt-2 text-sm text-steel">Manage catalog items, pricing, and inventory.</p>
        </div>
        <Link to="/admin/products/new">
          <Button>Add product</Button>
        </Link>
      </div>

      <div className="max-w-md">
        <Input
          label="Search products"
          placeholder="Search by name, SKU, or category"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {error ? (
        <div className="border border-signal/40 bg-deep-red/10 p-4 text-sm text-bone/90">
          {error}
          <Button className="mt-4" size="sm" onClick={loadProducts}>
            Retry
          </Button>
        </div>
      ) : null}

      <AdminTable
        loading={loading}
        data={filteredProducts}
        emptyTitle={search ? 'No matching products' : 'No products yet'}
        emptyDescription={search ? 'Try a different search term.' : 'Create your first product to start selling.'}
        onRowClick={(row) => navigate(`/admin/products/${row._id}/edit`)}
        columns={[
          {
            key: 'name',
            header: 'Product',
            render: (row) => (
              <div className="flex items-center gap-3">
                {row.images?.[0]?.url ? (
                  <img src={row.images[0].url} alt="" className="h-10 w-10 object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center bg-obsidian text-xs text-steel">—</div>
                )}
                <div>
                  <p className="font-medium text-white">{row.name}</p>
                  <p className="text-xs text-steel">{row.category || 'General'}</p>
                </div>
              </div>
            ),
          },
          {
            key: 'price',
            header: 'Retail price',
            render: (row) => formatMoney(row.price),
          },
          {
            key: 'stock',
            header: 'Stock',
            render: (row) => row.stock ?? 0,
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
                <Link to={`/admin/products/${row._id}/edit`}>
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
        title="Delete product?"
        description={`This will permanently remove "${deleteTarget?.name}".`}
        confirmLabel="Delete product"
      />
    </div>
  );
}
