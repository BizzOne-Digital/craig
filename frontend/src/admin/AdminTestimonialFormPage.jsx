import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  createAdminTestimonial,
  getAdminTestimonial,
  updateAdminTestimonial,
  uploadTestimonialImage,
} from '../services/adminApi.js';
import { useToast } from '../components/ui/Toast.jsx';
import Input from '../components/ui/Input.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import Button from '../components/ui/Button.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';

const testimonialFormSchema = z.object({
  quote: z.string().min(10, 'Quote must be at least 10 characters').max(2000),
  displayName: z.string().min(1, 'Display name is required').max(100),
  roleOrLocation: z.string().max(200).optional(),
  displayOrder: z.coerce.number().int().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

export default function AdminTestimonialFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [image, setImage] = useState({ url: '', publicId: '', alt: '' });
  const [loadingTestimonial, setLoadingTestimonial] = useState(isEdit);
  const [uploading, setUploading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      quote: '',
      displayName: '',
      roleOrLocation: '',
      displayOrder: 0,
      featured: false,
      published: false,
    },
  });

  useEffect(() => {
    if (!isEdit) return undefined;

    let active = true;
    async function loadTestimonial() {
      setLoadingTestimonial(true);
      setLoadError(null);
      try {
        const testimonial = await getAdminTestimonial(id);
        if (!active) return;
        reset({
          quote: testimonial.quote || '',
          displayName: testimonial.displayName || '',
          roleOrLocation: testimonial.roleOrLocation || '',
          displayOrder: testimonial.displayOrder ?? 0,
          featured: Boolean(testimonial.featured),
          published: Boolean(testimonial.published),
        });
        setImage(testimonial.image || { url: '', publicId: '', alt: '' });
      } catch (err) {
        if (active) {
          setLoadError(err.message || 'Unable to load testimonial');
          toast({ title: 'Load failed', message: err.message, variant: 'error' });
        }
      } finally {
        if (active) setLoadingTestimonial(false);
      }
    }

    loadTestimonial();
    return () => {
      active = false;
    };
  }, [id, isEdit, reset, toast]);

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const uploaded = await uploadTestimonialImage(formData);
      setImage(uploaded);
      toast({ title: 'Image uploaded', variant: 'success' });
    } catch (err) {
      toast({ title: 'Upload failed', message: err.message, variant: 'error' });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      image: image.url ? image : undefined,
    };

    try {
      if (isEdit) {
        await updateAdminTestimonial(id, payload);
        toast({ title: 'Testimonial updated', variant: 'success' });
      } else {
        await createAdminTestimonial(payload);
        toast({ title: 'Testimonial created', variant: 'success' });
      }
      navigate('/admin/testimonials');
    } catch (err) {
      toast({ title: 'Save failed', message: err.message, variant: 'error' });
    }
  };

  if (loadingTestimonial) {
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
        <h1 className="font-display text-3xl tracking-[0.08em] text-white">Testimonial unavailable</h1>
        <p className="mt-3 text-sm text-bone/90">{loadError}</p>
        <Link to="/admin/testimonials" className="mt-6 inline-block">
          <Button variant="outline">Back to testimonials</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl tracking-[0.08em] text-white">
            {isEdit ? 'Edit testimonial' : 'New testimonial'}
          </h1>
          <p className="mt-2 text-sm text-steel">Share community stories with care and consent.</p>
        </div>
        <Link to="/admin/testimonials">
          <Button variant="ghost">Cancel</Button>
        </Link>
      </div>

      <div className="border border-signal/30 bg-signal/5 p-4 text-sm text-bone/90">
        <p className="font-semibold text-white">Privacy reminder</p>
        <p className="mt-2">
          Only publish testimonials with written consent. Use first name plus last initial unless the person
          explicitly approved their full name. Never include private contact details, case specifics, or sensitive
          personal information.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="grid gap-5 border border-steel/20 bg-carbon/40 p-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <Textarea label="Quote" rows={5} required error={errors.quote?.message} {...register('quote')} />
          </div>
          <Input
            label="Display name"
            required
            hint="Use the name the person approved for public display"
            error={errors.displayName?.message}
            {...register('displayName')}
          />
          <Input label="Role or location" error={errors.roleOrLocation?.message} {...register('roleOrLocation')} />
          <Input label="Display order" type="number" error={errors.displayOrder?.message} {...register('displayOrder')} />
          <label className="flex items-center gap-3 text-sm text-bone">
            <input type="checkbox" className="accent-signal" {...register('featured')} />
            Featured testimonial
          </label>
          <label className="flex items-center gap-3 text-sm text-bone">
            <input type="checkbox" className="accent-signal" {...register('published')} />
            Published on storefront
          </label>
        </section>

        <section className="space-y-4 border border-steel/20 bg-carbon/40 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl tracking-[0.08em] text-white">Photo</h2>
              <p className="mt-1 text-sm text-steel">Optional portrait or community image.</p>
            </div>
            <label className="inline-flex cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <span className="inline-flex items-center justify-center border border-signal px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-signal">
                {uploading ? 'Uploading…' : 'Upload photo'}
              </span>
            </label>
          </div>

          {image.url ? (
            <div className="max-w-xs border border-steel/20 bg-obsidian/60 p-3">
              <img src={image.url} alt={image.alt || ''} className="aspect-square w-full object-cover" />
              <Button type="button" size="sm" variant="danger" className="mt-3 w-full" onClick={() => setImage({ url: '', publicId: '', alt: '' })}>
                Remove photo
              </Button>
            </div>
          ) : (
            <p className="text-sm text-steel">No photo uploaded.</p>
          )}
        </section>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? 'Save changes' : 'Create testimonial'}
          </Button>
          <Link to="/admin/testimonials">
            <Button variant="ghost">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
