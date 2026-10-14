import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SEO from '../components/ui/SEO.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import Select from '../components/ui/Select.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { getServices, submitBooking } from '../services/publicApi.js';

const bookingFormSchema = z.object({
  service: z.string().min(2, 'Please select a service'),
  serviceSlug: z.string().optional(),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().max(30).optional(),
  preferredDate: z.string().min(4, 'Preferred date is required'),
  preferredTime: z.string().min(2, 'Preferred time is required'),
  contactPreference: z.enum(['email', 'phone']),
  message: z.string().max(2000).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: 'Consent is required' }) }),
  website: z.string().max(0).optional(),
});

const STEPS = ['Select Service', 'Contact Details', 'Overview & Consent', 'Review & Submit'];

export default function BookingPage() {
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      service: location.state?.service || '',
      serviceSlug: location.state?.serviceSlug || '',
      contactPreference: 'email',
      consent: false,
      website: '',
    },
  });

  const values = watch();

  useEffect(() => {
    getServices()
      .then((res) => setServices(Array.isArray(res.data) ? res.data : []))
      .catch(() => setServices([]))
      .finally(() => setLoadingServices(false));
  }, []);

  const nextStep = async () => {
    const fieldsByStep = [
      ['service'],
      ['name', 'email', 'phone', 'preferredDate', 'preferredTime', 'contactPreference'],
      ['message', 'consent'],
      [],
    ];
    const valid = await trigger(fieldsByStep[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setSubmitError('');
    try {
      await submitBooking(data);
      setSuccess(true);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Unable to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <>
        <SEO title="Booking Submitted" description="Your booking request has been received." path="/booking" noIndex />
        <section className="mx-auto max-w-2xl px-6 py-24 text-center lg:px-10">
          <h1 className="font-display text-4xl text-bone">Request Received</h1>
          <p className="mt-6 text-lg text-steel">
            Thank you. We will respond using your preferred contact method. A confirmation has been sent to{' '}
            {values.email}.
          </p>
          <Button to="/" variant="primary" className="mt-8">
            Return home
          </Button>
        </section>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Request a Case Review"
        description="Book a consultation or case review with the CEO Foundation."
        path="/booking"
      />

      <section className="page-x bg-obsidian py-12 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-signal">Booking</p>
          <h1 className="mt-4 font-display text-[clamp(2rem,8vw,3rem)] text-bone">Request a Case Review</h1>
          <p className="mt-4 text-steel">
            Complete this form to request a consultation. Do not submit Social Security numbers, payment
            card data, confidential evidence, or sensitive case files.
          </p>

          {/* Progress */}
          <div className="mt-10 flex gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="min-w-0 flex-1">
                <div className={`h-1 rounded ${i <= step ? 'bg-signal' : 'bg-white/10'}`} />
                <p className={`mt-2 truncate text-[0.65rem] sm:text-xs ${i === step ? 'text-bone' : 'text-steel'}`}>
                  <span className="sm:hidden">{i + 1}. </span>
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{label.split(' ')[0]}</span>
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-6">
            <input type="text" {...register('website')} className="hidden" tabIndex={-1} autoComplete="off" />
            <input type="hidden" {...register('serviceSlug')} />

            {/* Step 1 */}
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl text-bone">Select a service</h2>
                {loadingServices ? (
                  <Skeleton className="h-12 w-full" />
                ) : (
                  <Select
                    label="Service"
                    {...register('service', {
                      onChange: (e) => {
                        const selected = services.find((s) => s.title === e.target.value);
                        if (selected) setValue('serviceSlug', selected.slug);
                      },
                    })}
                    error={errors.service?.message}
                    options={[
                      { value: '', label: 'Choose a service...' },
                      ...services.map((s) => ({ value: s.title, label: `${s.title} — ${s.priceLabel}` })),
                    ]}
                  />
                )}
              </div>
            )}

            {/* Step 2 */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl text-bone">Contact details</h2>
                <Input label="Full name" {...register('name')} error={errors.name?.message} />
                <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
                <Input label="Phone (optional)" type="tel" {...register('phone')} error={errors.phone?.message} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Preferred date" type="date" {...register('preferredDate')} error={errors.preferredDate?.message} />
                  <Input label="Preferred time" type="time" {...register('preferredTime')} error={errors.preferredTime?.message} />
                </div>
                <Select
                  label="Contact preference"
                  {...register('contactPreference')}
                  options={[
                    { value: 'email', label: 'Email' },
                    { value: 'phone', label: 'Phone' },
                  ]}
                />
              </div>
            )}

            {/* Step 3 */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl text-bone">Overview & consent</h2>
                <Textarea
                  label="Brief overview (non-confidential)"
                  rows={5}
                  placeholder="Share a general overview without sensitive details..."
                  {...register('message')}
                  error={errors.message?.message}
                />
                <label className="flex items-start gap-3 text-sm text-steel">
                  <input type="checkbox" {...register('consent')} className="mt-1 accent-signal" />
                  <span>
                    I consent to being contacted about my request and understand that submitting this form
                    does not create an attorney-client relationship. Outcomes vary and no result is guaranteed.
                  </span>
                </label>
                {errors.consent && <p className="text-sm text-signal">{errors.consent.message}</p>}
              </div>
            )}

            {/* Step 4 */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl text-bone">Review your request</h2>
                <dl className="space-y-3 rounded border border-white/10 p-6 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-steel">Service</dt>
                    <dd className="text-bone">{values.service}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-steel">Name</dt>
                    <dd className="text-bone">{values.name}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-steel">Email</dt>
                    <dd className="text-bone">{values.email}</dd>
                  </div>
                  {values.phone && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-steel">Phone</dt>
                      <dd className="text-bone">{values.phone}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <dt className="text-steel">Preferred date/time</dt>
                    <dd className="text-bone">
                      {values.preferredDate} at {values.preferredTime}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-steel">Contact via</dt>
                    <dd className="capitalize text-bone">{values.contactPreference}</dd>
                  </div>
                  {values.message && (
                    <div>
                      <dt className="text-steel">Overview</dt>
                      <dd className="mt-1 text-bone">{values.message}</dd>
                    </div>
                  )}
                </dl>
                {submitError && (
                  <p className="rounded border border-signal/30 bg-signal/10 px-4 py-3 text-sm text-bone">
                    {submitError}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-4 pt-4">
              {step > 0 && (
                <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
                  Back
                </Button>
              )}
              {step < STEPS.length - 1 ? (
                <Button type="button" variant="primary" onClick={nextStep}>
                  Continue
                </Button>
              ) : (
                <Button type="submit" variant="primary" loading={submitting} disabled={submitting}>
                  Submit request
                </Button>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
