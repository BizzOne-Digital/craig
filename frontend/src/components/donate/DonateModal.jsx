import { useEffect, useState } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import { cn } from '../../utils/cn.js';
import { createDonationCheckout } from '../../services/publicApi.js';

const PRESET_AMOUNTS = [25, 50, 100, 250];

export function DonateModal({ open, onClose }) {
  const [selectedPreset, setSelectedPreset] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError('');
    setLoading(false);
  }, [open]);

  const resolvedAmount = useCustom ? Number.parseFloat(customAmount) : selectedPreset;

  const handleDonate = async () => {
    setError('');
    if (!Number.isFinite(resolvedAmount) || resolvedAmount < 1) {
      setError('Please enter an amount of at least $1.');
      return;
    }
    if (resolvedAmount > 100_000) {
      setError('For large gifts, please contact us directly.');
      return;
    }

    setLoading(true);
    try {
      const result = await createDonationCheckout({
        amount: Math.round(resolvedAmount * 100) / 100,
        customer: email.trim() ? { email: email.trim() } : undefined,
        website: '',
      });

      const checkoutUrl = result.data?.url;
      if (!checkoutUrl) {
        setError('Unable to start checkout. Please try again.');
        setLoading(false);
        return;
      }

      window.location.href = checkoutUrl;
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || 'Unable to start checkout. Please try again.';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Donate"
      description="Choose an amount to support CEO Foundation. You’ll complete payment securely on Stripe."
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDonate} loading={loading}>
            Continue to Stripe
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-steel">Select amount</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PRESET_AMOUNTS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setUseCustom(false);
                  setSelectedPreset(value);
                }}
                className={cn(
                  'border px-3 py-3 text-sm font-semibold transition',
                  !useCustom && selectedPreset === value
                    ? 'border-signal bg-signal/15 text-white'
                    : 'border-white/15 text-bone hover:border-signal/50'
                )}
              >
                ${value}
              </button>
            ))}
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setUseCustom(true)}
            className={cn(
              'mb-2 text-xs font-semibold uppercase tracking-[0.18em] transition',
              useCustom ? 'text-signal' : 'text-steel hover:text-bone'
            )}
          >
            Custom amount
          </button>
          <Input
            label="Amount (USD)"
            type="number"
            min="1"
            step="0.01"
            inputMode="decimal"
            placeholder="Enter amount"
            value={customAmount}
            onChange={(event) => {
              setUseCustom(true);
              setCustomAmount(event.target.value);
            }}
          />
        </div>

        <Input
          label="Email (optional)"
          type="email"
          autoComplete="email"
          placeholder="For your receipt on Stripe"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        {error ? (
          <p className="rounded border border-signal/40 bg-signal/10 px-3 py-2 text-sm text-bone" role="alert">
            {error}
          </p>
        ) : null}

        <p className="text-xs text-steel">
          Payments are processed by Stripe. CEO Foundation does not store card details on this site.
        </p>
      </div>
    </Modal>
  );
}

export default DonateModal;
