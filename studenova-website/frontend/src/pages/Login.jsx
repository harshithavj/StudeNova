import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import BackButton from '../components/BackButton';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/ui/Button';
import PasswordInput from '../components/ui/PasswordInput';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [resetForm, setResetForm] = useState({ email: '', otp: '', password: '', confirmPassword: '' });
  const [resetStep, setResetStep] = useState('login');
  const [resetLoading, setResetLoading] = useState(false);
  const { clearSession, login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isResetMode = resetStep !== 'login';

  const submit = async (event) => {
    event.preventDefault();
    try {
      const signedInUser = await login(form);
      if (signedInUser.role === 'admin') {
        clearSession();
        toast.error('Use the separate STUDENOVA Admin website for admin access');
        return;
      }
      if (signedInUser.role === 'college_organizer') {
        const verificationStatus = signedInUser.verificationStatus || signedInUser.verification_status || 'approved';
        if (verificationStatus === 'pending') {
          navigate('/college/pending-approval');
          return;
        }
        if (verificationStatus === 'rejected') {
          navigate('/college/rejected');
          return;
        }
      }
      navigate(location.state?.from?.pathname || '/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to login');
    }
  };

  const requestPasswordReset = async (event) => {
    event.preventDefault();
    setResetLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: resetForm.email });
      toast.success('Password reset OTP sent to your email');
      setResetStep('reset');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to send reset OTP');
    } finally {
      setResetLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    if (resetForm.password !== resetForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setResetLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email: resetForm.email,
        otp: resetForm.otp,
        password: resetForm.password
      });
      toast.success('Password updated. Please login.');
      setForm({ email: resetForm.email, password: '' });
      setResetForm({ email: '', otp: '', password: '', confirmPassword: '' });
      setResetStep('login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to reset password');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <section className="mx-auto grid min-h-[75vh] max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <Breadcrumbs />
        <BackButton />
        <h1 className="text-4xl font-black">{isResetMode ? 'Reset password' : 'Welcome back'}</h1>
        <p className="mt-3 text-nova-muted">{isResetMode ? 'Enter your registered email address and set a new password after OTP verification.' : 'Sign in to manage registrations, notifications, saved events, and organizer tools.'}</p>
      </div>
      {resetStep === 'login' && (
        <form onSubmit={submit} className="surface grid gap-4 rounded-lg p-6">
          <input type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200" />
          <PasswordInput required placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <div className="flex justify-end">
            <button type="button" onClick={() => setResetStep('email')} className="text-sm font-bold text-nova-coral hover:underline">Forgot password?</button>
          </div>
          <Button disabled={loading} variant="accent">{loading ? 'Signing in...' : 'Login'}</Button>
          <p className="text-center text-sm text-nova-muted">New here? <Link to="/auth/select-role" className="font-bold text-nova-coral">Create account</Link></p>
        </form>
      )}
      {resetStep === 'email' && (
        <form onSubmit={requestPasswordReset} className="surface grid gap-4 rounded-lg p-6">
          <input type="email" required placeholder="Registered email address" value={resetForm.email} onChange={(e) => setResetForm({ ...resetForm, email: e.target.value })} className="rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200" />
          <Button disabled={resetLoading} variant="accent">{resetLoading ? 'Sending OTP...' : 'Send reset OTP'}</Button>
          <button type="button" onClick={() => setResetStep('login')} className="text-center text-sm font-bold text-nova-coral">Back to login</button>
        </form>
      )}
      {resetStep === 'reset' && (
        <form onSubmit={resetPassword} className="surface grid gap-4 rounded-lg p-6">
          <input type="email" required placeholder="Registered email address" value={resetForm.email} onChange={(e) => setResetForm({ ...resetForm, email: e.target.value })} className="rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200" />
          <input required inputMode="numeric" maxLength={6} placeholder="Enter 6-digit OTP" value={resetForm.otp} onChange={(e) => setResetForm({ ...resetForm, otp: e.target.value })} className="rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200" />
          <PasswordInput required minLength={8} maxLength={15} placeholder="New password" value={resetForm.password} onChange={(e) => setResetForm({ ...resetForm, password: e.target.value })} />
          <PasswordInput required minLength={8} maxLength={15} placeholder="Confirm new password" value={resetForm.confirmPassword} onChange={(e) => setResetForm({ ...resetForm, confirmPassword: e.target.value })} />
          <Button disabled={resetLoading} variant="accent">{resetLoading ? 'Updating password...' : 'Set new password'}</Button>
          <button type="button" onClick={() => setResetStep('email')} className="text-center text-sm font-bold text-nova-coral">Use a different email</button>
        </form>
      )}
    </section>
  );
}
