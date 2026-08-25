import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/ui/SEO.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Badge from '../components/ui/Badge.jsx';
import SiteDisclaimer from '../components/ui/SiteDisclaimer.jsx';
import { getProducts } from '../services/publicApi.js';
import { formatMoney } from '../utils/format.js';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A–Z' },
];

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [availability, setAvailability] = useState('all');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    getProducts({ active: true, limit: 100 })
      .then((res) => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Unable to load products. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category).filter(Boolean));
    return ['', ...Array.from(cats)];
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    if (category) {
      result = result.filter((p) => p.category === category);
    }

    if (availability === 'in-stock') {
      result = result.filter((p) => p.stock > 0);
    } else if (availability === 'out-of-stock') {
      result = result.filter((p) => p.stock <= 0);
    }

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [products, search, category, availability, sort]);

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setAvailability('all');
    setSort('newest');
  };

  return (
    <>
      <SEO
        title="Shop"
        description="Shop with purpose. Every purchase supports the CEO Foundation mission of fairness, accountability, and assistance."
        path="/shop"
      />

      <section className="bg-obsidian px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-[0.25em] text-signal">Shop</p>
          <h1 className="mt-4 font-display text-5xl text-bone md:text-7xl">Shop With Purpose</h1>
          <p className="mt-6 max-w-2xl text-lg text-steel">
            Every purchase supports our mission to promote fairness and assist families affected by injustice.
          </p>
          <div className="mt-6 max-w-3xl rounded border border-white/10 bg-carbon/60 px-4 py-3">
            <SiteDisclaimer compact />
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-carbon px-6 py-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Search"
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categories.map((c) => ({ value: c, label: c || 'All categories' }))}
          />
          <Select
            label="Availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            options={[
              { value: 'all', label: 'All' },
              { value: 'in-stock', label: 'In stock' },
              { value: 'out-of-stock', label: 'Out of stock' },
            ]}
          />
          <Select
            label="Sort by"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            options={SORT_OPTIONS}
          />
        </div>
      </section>

      <section className="bg-obsidian px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <Skeleton key={n} className="aspect-[3/4] rounded-lg" />
              ))}
            </div>
          )}

          {error && (
            <EmptyState title="Shop unavailable" description={error} actionLabel="Contact support" actionTo="/contact" />
          )}

          {!loading && !error && filtered.length === 0 && (
            <EmptyState
              title="No products found"
              description="Try adjusting your filters or search terms."
              actionLabel="Clear filters"
              onAction={clearFilters}
            />
          )}

          {!loading && !error && filtered.length > 0 && (
            <>
              <p className="mb-8 text-sm text-steel">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((product) => (
                  <Link
                    key={product._id}
                    to={`/shop/${product.slug}`}
                    className="group overflow-hidden border border-white/10 bg-carbon transition hover:border-signal/40"
                  >
                    <div className="relative aspect-square overflow-hidden bg-obsidian">
                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.images[0].alt || product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-steel">No image</div>
                      )}
                      <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                        {product.featured && <Badge variant="signal">Featured</Badge>}
                        {product.stock <= 0 && <Badge variant="muted">Sold out</Badge>}
                      </div>
                    </div>
                    <div className="p-4">
                      {product.category && (
                        <p className="text-xs uppercase tracking-wider text-steel">{product.category}</p>
                      )}
                      <h2 className="mt-1 font-display text-xl text-bone group-hover:text-signal">{product.name}</h2>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-signal">{formatMoney(product.price)}</span>
                        {product.compareAtPrice > product.price && (
                          <span className="text-sm text-steel line-through">{formatMoney(product.compareAtPrice)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
