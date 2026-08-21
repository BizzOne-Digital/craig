import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  createAdminProduct,
  getAdminProduct,
  updateAdminProduct,
  uploadProductImages,
} from '../services/adminApi.js';
import { formatMoney } from '../utils/format.js';
import { useToast } from '../components/ui/Toast.jsx';
import Input from '../components/ui/Input.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import Button from '../components/ui/Button.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';

const productFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  slug: z.string().max(200).optional(),
  shortDescription: z.string().max(500).optional(),
  description: z.string().max(10000).optional(),
  category: z.string().max(100).optional(),
  baseCost: z.coerce.number().min(0, 'Base cost must be zero or greater'),
  price: z.coerce.number().min(0, 'Retail price must be zero or greater'),
  compareAtPrice: z.union([z.coerce.number().min(0), z.literal(''), z.nan()]).optional(),
  sku: z.string().max(100).optional(),
  sizes: z.string().optional(),
  colors: z.string().optional(),
  stock: z.coerce.number().int().min(0).optional(),
  lowStockThreshold: z.coerce.number().int().min(0).optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
});

function splitList(value) {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [images, setImages] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(isEdit);
  const [uploading, setUploading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      shortDescription: '',
      description: '',
      category: 'General',
      baseCost: 0,
      price: 0,
      compareAtPrice: '',
      sku: '',
      sizes: '',
      colors: '',
      stock: 0,
      lowStockThreshold: 5,
      featured: false,
      active: true,
      seoTitle: '',
      seoDescription: '',
    },
  });

  const baseCost = watch('baseCost');
  const suggestedRetail = useMemo(() => {
    const cost = Number(baseCost);
    if (Number.isNaN(cost)) return 0;
    return Math.round(cost * 4 * 100) / 100;
  }, [baseCost]);

  useEffect(() => {
    if (!isEdit) return undefined;

    let active = true;
    async function loadProduct() {
      setLoadingProduct(true);
      setLoadError(null);
      try {
        const product = await getAdminProduct(id);
        if (!active) return;
        reset({
          name: product.name || '',
          slug: product.slug || '',
          shortDescription: product.shortDescription || '',
          description: product.description || '',
          category: product.category || 'General',
          baseCost: product.baseCost ?? 0,
          price: product.price ?? 0,
          compareAtPrice: product.compareAtPrice ?? '',
          sku: product.sku || '',
          sizes: (product.sizes || []).join(', '),
          colors: (product.colors || []).join(', '),
          stock: product.stock ?? 0,
          lowStockThreshold: product.lowStockThreshold ?? 5,
          featured: Boolean(product.featured),
          active: product.active !== false,
          seoTitle: product.seoTitle || '',
          seoDescription: product.seoDescription || '',
        });
        setImages(product.images || []);
      } catch (err) {
        if (active) {
          setLoadError(err.message || 'Unable to load product');
          toast({ title: 'Load failed', message: err.message, variant: 'error' });
        }
      } finally {
        if (active) setLoadingProduct(false);
      }
    }

    loadProduct();
    return () => {
      active = false;
    };
  }, [id, isEdit, reset, toast]);

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    setUploading(true);
    try {
      const uploaded = await uploadProductImages(formData);
      setImages((current) => [...current, ...uploaded]);
      toast({ title: 'Images uploaded', variant: 'success' });
    } catch (err) {
      toast({ title: 'Upload failed', message: err.message, variant: 'error' });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const removeImage = (publicId) => {
    setImages((current) => current.filter((image) => image.publicId !== publicId));
  };

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      compareAtPrice: values.compareAtPrice === '' || Number.isNaN(values.compareAtPrice) ? undefined : values.compareAtPrice,
      sizes: splitList(values.sizes),
      colors: splitList(values.colors),
      images,
    };

    try {
      if (isEdit) {
        await updateAdminProduct(id, payload);
        toast({ title: 'Product updated', variant: 'success' });
      } else {
        await createAdminProduct(payload);
        toast({ title: 'Product created', variant: 'success' });
      }
      navigate('/admin/products');
    } catch (err) {
      toast({ title: 'Save failed', message: err.message, variant: 'error' });
    }
  };

  if (loadingProduct) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="border border-signal/40 bg-deep-red/10 p-6">
        <h1 className="font-display text-3xl tracking-[0.08em] text-white">Product unavailable</h1>
        <p className="mt-3 text-sm text-bone/90">{loadError}</p>
        <Link to="/admin/products" className="mt-6 inline-block">
          <Button variant="outline">Back to products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl tracking-[0.08em] text-white">
            {isEdit ? 'Edit product' : 'New product'}
          </h1>
          <p className="mt-2 text-sm text-steel">
            Base cost is admin-only and never shown on the public storefront.
          </p>
        </div>
        <Link to="/admin/products">
          <Button variant="ghost">Cancel</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="grid gap-5 border border-steel/20 bg-carbon/40 p-6 lg:grid-cols-2">
          <Input label="Name" required error={errors.name?.message} {...register('name')} />
          <Input label="Slug" hint="Leave blank to auto-generate" error={errors.slug?.message} {...register('slug')} />
          <Input label="Category" error={errors.category?.message} {...register('category')} />
          <Input label="SKU" error={errors.sku?.message} {...register('sku')} />
          <div className="lg:col-span-2">
            <Textarea label="Short description" rows={3} error={errors.shortDescription?.message} {...register('shortDescription')} />
          </div>
          <div className="lg:col-span-2">
            <Textarea label="Description" rows={6} error={errors.description?.message} {...register('description')} />
          </div>
        </section>

        <section className="grid gap-5 border border-steel/20 bg-carbon/40 p-6 lg:grid-cols-2">
          <Input
            label="Base cost (admin only)"
            type="number"
            step="0.01"
            min="0"
            required
            hint="Internal cost — never exposed publicly"
            error={errors.baseCost?.message}
            {...register('baseCost')}
          />
          <div className="space-y-2">
            <Input
              label="Retail price"
              type="number"
              step="0.01"
              min="0"
              required
              error={errors.price?.message}
              {...register('price')}
            />
            <div className="flex flex-wrap items-center gap-3 border border-steel/20 bg-obsidian/60 px-4 py-3">
              <p className="text-xs text-steel">
                Suggested retail (base cost × 4):{' '}
                <span className="font-semibold text-white">{formatMoney(suggestedRetail)}</span>
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setValue('price', suggestedRetail, { shouldValidate: true })}
              >
                Apply suggestion
              </Button>
            </div>
          </div>
          <Input
            label="Compare at price"
            type="number"
            step="0.01"
            min="0"
            error={errors.compareAtPrice?.message}
            {...register('compareAtPrice')}
          />
          <Input label="Stock" type="number" min="0" error={errors.stock?.message} {...register('stock')} />
          <Input
            label="Low stock threshold"
            type="number"
            min="0"
            error={errors.lowStockThreshold?.message}
            {...register('lowStockThreshold')}
          />
          <Input label="Sizes" hint="Comma-separated" error={errors.sizes?.message} {...register('sizes')} />
          <Input label="Colors" hint="Comma-separated" error={errors.colors?.message} {...register('colors')} />
          <label className="flex items-center gap-3 text-sm text-bone">
            <input type="checkbox" className="accent-signal" {...register('featured')} />
            Featured product
          </label>
          <label className="flex items-center gap-3 text-sm text-bone">
            <input type="checkbox" className="accent-signal" {...register('active')} />
            Active on storefront
          </label>
        </section>

        <section className="space-y-4 border border-steel/20 bg-carbon/40 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl tracking-[0.08em] text-white">Images</h2>
              <p className="mt-1 text-sm text-steel">Upload up to 8 images (JPEG, PNG, WebP, GIF).</p>
            </div>
            <label className="inline-flex cursor-pointer">
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              <span className="inline-flex items-center justify-center border border-signal px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-signal">
                {uploading ? 'Uploading…' : 'Upload images'}
              </span>
            </label>
          </div>

          {images.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {images.map((image) => (
                <div key={image.publicId} className="border border-steel/20 bg-obsidian/60 p-3">
                  <img src={image.url} alt={image.alt || ''} className="aspect-square w-full object-cover" />
                  <Button
                    type="button"
                    size="sm"
                    variant="danger"
                    className="mt-3 w-full"
                    onClick={() => removeImage(image.publicId)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-steel">No images uploaded yet.</p>
          )}
        </section>

        <section className="grid gap-5 border border-steel/20 bg-carbon/40 p-6 lg:grid-cols-2">
          <Input label="SEO title" error={errors.seoTitle?.message} {...register('seoTitle')} />
          <Input label="SEO description" error={errors.seoDescription?.message} {...register('seoDescription')} />
        </section>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? 'Save changes' : 'Create product'}
          </Button>
          <Link to="/admin/products">
            <Button variant="ghost">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
