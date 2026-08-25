import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../components/ui/Toast.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default function AdminLoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/admin/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-obsidian">
        <p className="text-sm uppercase tracking-[0.18em] text-steel">Checking session…</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast({ title: 'Welcome back', message: 'Signed in successfully.', variant: 'success' });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast({
        title: 'Sign in failed',
        message: error.message || 'Invalid email or password.',
        variant: 'error',
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian px-4 py-12">
      <div className="w-full max-w-md border border-steel/20 bg-carbon p-8 shadow-glow">
        <div className="mb-8 text-center">
          <p className="font-display text-4xl tracking-[0.1em] text-white">CEO Admin</p>
          <p className="mt-2 text-sm text-steel">Secure portal for foundation staff</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            required
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
