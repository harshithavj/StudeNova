import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import BackButton from '../components/BackButton';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to login');
    }
  };

  return (
    <section className="mx-auto grid min-h-[75vh] max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <Breadcrumbs />
        <BackButton />
        <h1 className="text-4xl font-black">Welcome back</h1>
        <p className="mt-3 text-nova-muted">Sign in to manage registrations, notifications, saved events, and organizer tools.</p>
      </div>
      <form onSubmit={submit} className="surface grid gap-4 rounded-lg p-6">
        <input type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200" />
        <input type="password" required placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200" />
        <Button disabled={loading} variant="accent">{loading ? 'Signing in...' : 'Login'}</Button>
        <p className="text-center text-sm text-nova-muted">New here? <Link to="/auth/select-role" className="font-bold text-nova-coral">Create account</Link></p>
      </form>
    </section>
  );
}
