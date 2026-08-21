import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/ui/SEO.jsx';
import Button from '../components/ui/Button.jsx';
import Select from '../components/ui/Select.jsx';
import Input from '../components/ui/Input.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Badge from '../components/ui/Badge.jsx';
import { getProduct, getProducts } from '../services/publicApi.js';
import { formatMoney } from '../utils/format.js';
import useCart from '../hooks/useCart.js';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    getProduct(slug)
      .then((res) => {
        setProduct(res.data);
        if (res.data?.sizes?.length) setSize(res.data.sizes[0]);
        if (res.data?.colors?.length) setColor(res.data.colors[0]);
      })
      .catch((err) => {
        setProduct(null);
        setError(err.response?.status === 404 ? 'Product not found.' : 'Unable to load product.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!product?.category) return;
    getProducts({ category: product.category, limit: 4, active: true })
      .then((res) => {
        setRelated((res.data || []).filter((p) => p.slug !== product.slug).slice(0, 3));
      })
      .catch(() => setRelated([]));
  }, [product]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url || '',
      quantity,
      size,
      color,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2 lg:px-10">
        <Skeleton className="aspect-square rounded-lg" />
        <div>
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="mt-4 h-6 w-1/4" />
          <Skeleton className="mt-8 h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="px-6 py-24 lg:px-10">
        <EmptyState
          title={error || 'Product not found'}
          description="This product may no longer be available."
          actionLabel="Back to shop"
          actionTo="/shop"
        />
      </div>
    );
  }

  const images = product.images?.length ? product.images : [{ url: '', alt: product.name }];
  const inStock = product.stock > 0;

  return (
    <>
      <SEO
        title={product.seoTitle || product.name}
        description={product.seoDescription || product.shortDescription}
        path={`/shop/${product.slug}`}
        type="Product"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.shortDescription,
          image: images[0]?.url,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'USD',
            availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          },
        }}
      />

      <article className="bg-obsidian">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:px-10">
          <div>
            <div className="aspect-square overflow-hidden border border-white/10 bg-carbon">
              {images[selectedImage]?.url ? (
                <img
                  src={images[selectedImage].url}
                  alt={images[selectedImage].alt || product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-steel">No image</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={img.publicId || i}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    className={`h-20 w-20 shrink-0 overflow-hidden border-2 ${
                      selectedImage === i ? 'border-signal' : 'border-white/10'
                    }`}
                  >
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <Link to="/shop" className="text-sm text-steel hover:text-signal">
              ← Back to shop
            </Link>
            {product.category && (
              <p className="mt-4 text-xs uppercase tracking-wider text-steel">{product.category}</p>
            )}
            <h1 className="mt-2 font-display text-4xl text-bone md:text-5xl">{product.name}</h1>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-3xl text-signal">{formatMoney(product.price)}</span>
              {product.compareAtPrice > product.price && (
                <span className="text-steel line-through">{formatMoney(product.compareAtPrice)}</span>
              )}
            </div>
            {!inStock && <Badge variant="muted" className="mt-4">Out of stock</Badge>}
            {inStock && product.stock <= (product.lowStockThreshold || 5) && (
              <Badge variant="signal" className="mt-4">Low stock</Badge>
            )}

            <p className="mt-6 text-steel">{product.shortDescription}</p>

            <div className="mt-8 space-y-4">
              {product.sizes?.length > 0 && (
                <Select
                  label="Size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  options={product.sizes.map((s) => ({ value: s, label: s }))}
                />
              )}
              {product.colors?.length > 0 && (
                <Select
                  label="Color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  options={product.colors.map((c) => ({ value: c, label: c }))}
                />
              )}
              <Input
                label="Quantity"
                type="number"
                min={1}
                max={Math.min(20, product.stock || 1)}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                disabled={!inStock}
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button variant="primary" onClick={handleAddToCart} disabled={!inStock}>
                {added ? 'Added to cart' : 'Add to cart'}
              </Button>
              <Button to="/cart" variant="outline">
                View cart
              </Button>
            </div>

            <div className="mt-10 space-y-4 border-t border-white/10 pt-8 text-sm text-steel">
              <p>
                <strong className="text-bone">Shipping:</strong> Orders ship within 5–7 business days.
                See our{' '}
                <Link to="/shipping-returns" className="text-signal hover:underline">
                  shipping & returns policy
                </Link>
                .
              </p>
              <p>
                <strong className="text-bone">Mission impact:</strong> Proceeds from this shop support the
                Jackson-Lashley Foundation&apos;s advocacy and assistance programs.
              </p>
            </div>
          </div>
        </div>

        {product.description && (
          <div className="border-t border-white/10 px-6 py-16 lg:px-10">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-2xl text-bone">Details</h2>
              <p className="mt-6 whitespace-pre-line leading-relaxed text-steel">{product.description}</p>
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="border-t border-white/10 bg-carbon px-6 py-16 lg:px-10">
            <div className="mx-auto max-w-7xl">
              <h2 className="font-display text-3xl text-bone">Related products</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                {related.map((item) => (
                  <Link
                    key={item._id}
                    to={`/shop/${item.slug}`}
                    className="group border border-white/10 bg-obsidian p-4 transition hover:border-signal/40"
                  >
                    {item.images?.[0]?.url && (
                      <img
                        src={item.images[0].url}
                        alt={item.name}
                        className="aspect-square w-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <h3 className="mt-3 font-display text-lg text-bone">{item.name}</h3>
                    <p className="text-signal">{formatMoney(item.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </article>
    </>
  );
}
