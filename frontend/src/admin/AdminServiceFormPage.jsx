import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createAdminService, getAdminService, updateAdminService } from '../services/adminApi.js';
import { useToast } from '../components/ui/Toast.jsx';
import Input from '../components/ui/Input.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import Button from '../components/ui/Button.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';

const serviceFormSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200),
  slug: z.string().max(200).optional(),
  shortDescription: z.string().max(500).optional(),
  description: z.string().max(10000).optional(),
  price: z.coerce.number().min(0, 'Price must be zero or greater'),
  priceLabel: z.string().max(100).optional(),
  billingUnit: z.string().max(100).optional(),
  features: z.string().optional(),
  duration: z.string().max(100).optional(),
  ctaLabel: z.string().max(100).optional(),
  displayOrder: z.coerce.number().int().optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
});

function splitList(value) {
  if (!value) return [];
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AdminServiceFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingService, setLoadingService] = useState(isEdit);
  const [loadError, setLoadError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      shortDescription: '',
      description: '',
      price: 0,
      priceLabel: '',
      billingUnit: '',
      features: '',
      duration: '',
      ctaLabel: 'Book This Service',
      displayOrder: 0,
      featured: false,
      active: true,
    },
  });

  useEffect(() => {
    if (!isEdit) return undefined;

    let active = true;
    async function loadService() {
      setLoadingService(true);
      setLoadError(null);
      try {
        const service = await getAdminService(id);
        if (!active) return;
        reset({
          title: service.title || '',
          slug: service.slug || '',
          shortDescription: service.shortDescription || '',
          description: service.description || '',
          price: service.price ?? 0,
          priceLabel: service.priceLabel || '',
          billingUnit: service.billingUnit || '',
          features: (service.features || []).join('\n'),
          duration: service.duration || '',
          ctaLabel: service.ctaLabel || 'Book This Service',
          displayOrder: service.displayOrder ?? 0,
          featured: Boolean(service.featured),
          active: service.active !== false,
        });
      } catch (err) {
        if (active) {
          setLoadError(err.message || 'Unable to load service');
          toast({ title: 'Load failed', message: err.message, variant: 'error' });
        }
      } finally {
        if (active) setLoadingService(false);
      }
    }

    loadService();
    return () => {
      active = false;
    };
  }, [id, isEdit, reset, toast]);

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      features: splitList(values.features),
    };

    try {
      if (isEdit) {
        await updateAdminService(id, payload);
        toast({ title: 'Service updated', variant: 'success' });
      } else {
        await createAdminService(payload);
        toast({ title: 'Service created', variant: 'success' });
      }
      navigate('/admin/services');
    } catch (err) {
      toast({ title: 'Save failed', message: err.message, variant: 'error' });
    }
  };

  if (loadingService) {
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
        <h1 className="font-display text-3xl tracking-[0.08em] text-white">Service unavailable</h1>
        <p className="mt-3 text-sm text-bone/90">{loadError}</p>
        <Link to="/admin/services" className="mt-6 inline-block">
          <Button variant="outline">Back to services</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl tracking-[0.08em] text-white">
            {isEdit ? 'Edit service' : 'New service'}
          </h1>
          <p className="mt-2 text-sm text-steel">Configure pricing, features, and booking call-to-action.</p>
        </div>
        <Link to="/admin/services">
          <Button variant="ghost">Cancel</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="grid gap-5 border border-steel/20 bg-carbon/40 p-6 lg:grid-cols-2">
          <Input label="Title" required error={errors.title?.message} {...register('title')} />
          <Input label="Slug" hint="Leave blank to auto-generate" error={errors.slug?.message} {...register('slug')} />
          <div className="lg:col-span-2">
            <Textarea label="Short description" rows={3} error={errors.shortDescription?.message} {...register('shortDescription')} />
          </div>
          <div className="lg:col-span-2">
            <Textarea label="Description" rows={6} error={errors.description?.message} {...register('description')} />
          </div>
        </section>

        <section className="grid gap-5 border border-steel/20 bg-carbon/40 p-6 lg:grid-cols-2">
          <Input label="Price" type="number" step="0.01" min="0" required error={errors.price?.message} {...register('price')} />
          <Input label="Price label" error={errors.priceLabel?.message} {...register('priceLabel')} />
          <Input label="Billing unit" hint="e.g. per session" error={errors.billingUnit?.message} {...register('billingUnit')} />
          <Input label="Duration" error={errors.duration?.message} {...register('duration')} />
          <Input label="CTA label" error={errors.ctaLabel?.message} {...register('ctaLabel')} />
          <Input label="Display order" type="number" error={errors.displayOrder?.message} {...register('displayOrder')} />
          <div className="lg:col-span-2">
            <Textarea
              label="Features"
              rows={5}
              hint="One feature per line"
              error={errors.features?.message}
              {...register('features')}
            />
          </div>
          <label className="flex items-center gap-3 text-sm text-bone">
            <input type="checkbox" className="accent-signal" {...register('featured')} />
            Featured service
          </label>
          <label className="flex items-center gap-3 text-sm text-bone">
            <input type="checkbox" className="accent-signal" {...register('active')} />
            Active on storefront
          </label>
        </section>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? 'Save changes' : 'Create service'}
          </Button>
          <Link to="/admin/services">
            <Button variant="ghost">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
