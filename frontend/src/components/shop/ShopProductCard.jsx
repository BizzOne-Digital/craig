import { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import ProductOptions from './ProductOptions.jsx';
import useCart from '../../hooks/useCart.js';
import { formatMoney } from '../../utils/format.js';
import { PRODUCT_COLOR_OPTIONS, PRODUCT_SIZE_OPTIONS } from '../../utils/checkoutTotals.js';

export function ShopProductCard({ product }) {
  const { addItem } = useCart();
  const sizeOptions = product.sizes?.length ? product.sizes : PRODUCT_SIZE_OPTIONS;
  const colorOptions = product.colors?.length ? product.colors : PRODUCT_COLOR_OPTIONS;
  const [size, setSize] = useState(sizeOptions[0]);
  const [color, setColor] = useState(colorOptions[0]);
  const [added, setAdded] = useState(false);
  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    if (!inStock || !size || !color) return;
    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url || '',
      quantity: 1,
      size,
      color,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article className="flex h-full flex-col overflow-hidden border border-white/10 bg-carbon">
      <Link to={`/shop/${product.slug}`} className="group block">
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
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {product.category && <p className="text-xs uppercase tracking-wider text-steel">{product.category}</p>}
        <Link to={`/shop/${product.slug}`}>
          <h2 className="mt-1 font-display text-xl text-bone hover:text-signal">{product.name}</h2>
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-signal">{formatMoney(product.price)}</span>
          {product.compareAtPrice > product.price && (
            <span className="text-sm text-steel line-through">{formatMoney(product.compareAtPrice)}</span>
          )}
        </div>

        <div className="mt-4 flex-1">
          <ProductOptions
            compact
            sizes={sizeOptions}
            colors={colorOptions}
            size={size}
            color={color}
            onSizeChange={setSize}
            onColorChange={setColor}
            disabled={!inStock}
          />
        </div>

        <Button
          variant="primary"
          className="mt-4 w-full"
          onClick={handleAddToCart}
          disabled={!inStock || !size || !color}
        >
          {added ? 'Added to cart' : 'Add to cart'}
        </Button>
      </div>
    </article>
  );
}

export default ShopProductCard;
