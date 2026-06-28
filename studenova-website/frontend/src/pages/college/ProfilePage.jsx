import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', college: user?.college || '', bio: user?.bio || '' });

  const submit = async (event) => {
    event.preventDefault();
    await updateProfile(form);
  };

  return (
    <section>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-nova-coral">Organizer Profile</p>
        <h2 className="mt-2 text-3xl font-black text-slate-900">Manage your profile</h2>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Current details</p>
          <div className="mt-4 space-y-3 text-sm text-nova-muted">
            <p><span className="font-bold text-slate-900">Name:</span> {user?.name}</p>
            <p><span className="font-bold text-slate-900">College:</span> {user?.college || 'Not provided'}</p>
            <p><span className="font-bold text-slate-900">Verification status:</span> <span className="capitalize">{user?.verificationStatus || 'approved'}</span></p>
          </div>
        </div>
        <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Organizer Name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              College Name
              <input value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Short Bio
              <textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3" />
            </label>
            <button disabled={loading} className="rounded-full bg-nova-coral px-4 py-3 text-sm font-bold text-white disabled:opacity-60">{loading ? 'Saving...' : 'Save Profile'}</button>
          </div>
        </form>
      </div>
    </section>
  );
}
