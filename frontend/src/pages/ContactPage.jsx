import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SEO from '../components/ui/SEO.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import Select from '../components/ui/Select.jsx';
import { submitContact } from '../services/publicApi.js';

const BUSINESS = {
  email: 'ceoassociatesllc@gmail.com',
  phone: '314-267-5674',
};

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().max(30).optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  replyMethod: z.enum(['email', 'phone']),
  consent: z.literal(true, { errorMap: () => ({ message: 'Consent is required' }) }),
  website: z.string().max(0).optional(),
});

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { replyMethod: 'email', consent: false, website: '' },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      await submitContact(data);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact"
        description="Contact the CEO Foundation by phone, email, or our secure contact form."
        path="/contact"
      />

      <section className="page-x bg-obsidian py-12 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-[0.25em] text-signal">Contact</p>
          <h1 className="mt-4 font-display text-[clamp(2rem,8vw,4.5rem)] text-bone md:text-7xl">Get In Touch</h1>
        </div>
      </section>

      <section className="page-x bg-carbon py-12 sm:py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-bone">Reach Us Directly</h2>
            <div className="mt-8 space-y-6">
              <div>
                <p className="text-sm uppercase tracking-wider text-steel">Phone</p>
                <a
                  href={`tel:${BUSINESS.phone.replace(/-/g, '')}`}
                  className="mt-1 block font-display text-2xl text-bone hover:text-signal"
                >
                  {BUSINESS.phone}
                </a>
              </div>
              <div>
                <p className="text-sm uppercase tracking-wider text-steel">Email</p>
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="mt-1 block break-all text-base text-bone hover:text-signal sm:text-lg"
                >
                  {BUSINESS.email}
                </a>
              </div>
            </div>
            <p className="mt-8 text-sm text-steel">
              Do not submit Social Security numbers, payment card data, or confidential case files through
              this form. For sensitive documents, we will provide secure transfer instructions after initial contact.
            </p>
          </div>

          <div>
            {success ? (
              <div className="rounded border border-signal/30 bg-signal/5 p-8 text-center">
                <h2 className="font-display text-2xl text-bone">Message Sent</h2>
                <p className="mt-4 text-steel">
                  Thank you for contacting us. We have received your message and sent a confirmation to your email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input type="text" {...register('website')} className="hidden" tabIndex={-1} autoComplete="off" />
                <Input label="Name" {...register('name')} error={errors.name?.message} />
                <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
                <Input label="Phone (optional)" type="tel" {...register('phone')} error={errors.phone?.message} />
                <Input label="Subject" {...register('subject')} error={errors.subject?.message} />
                <Textarea label="Message" rows={6} {...register('message')} error={errors.message?.message} />
                <Select
                  label="Preferred reply method"
                  {...register('replyMethod')}
                  options={[
                    { value: 'email', label: 'Email' },
                    { value: 'phone', label: 'Phone' },
                  ]}
                />
                <label className="flex items-start gap-3 text-sm text-steel">
                  <input type="checkbox" {...register('consent')} className="mt-1 accent-signal" />
                  <span>I consent to being contacted regarding my inquiry.</span>
                </label>
                {errors.consent && <p className="text-sm text-signal">{errors.consent.message}</p>}
                {error && (
                  <p className="rounded border border-signal/30 bg-signal/10 px-4 py-3 text-sm text-bone">
                    {error}
                  </p>
                )}
                <Button type="submit" variant="primary" loading={submitting} disabled={submitting}>
                  Send message
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
