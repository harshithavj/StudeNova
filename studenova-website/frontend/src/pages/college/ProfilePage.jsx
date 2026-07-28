import { useEffect, useState } from 'react';
import { Building2, Save, UserRound } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth();
  const [form, setForm] = useState({ name: '', college: '', bio: '' });

  useEffect(() => {
    setForm({
      name: user?.name || '',
      college: user?.college || '',
      bio: user?.bio || ''
    });
  }, [user]);

  const submit = async (event) => {
    event.preventDefault();
    await updateProfile(form);
  };

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-nova-coral">Organizer Profile</p>
        <h2 className="mt-2 text-4xl font-black text-slate-900">Everything about your organization in one place</h2>
      </div>

      <section className="rounded-lg bg-slate-50 p-6 ring-1 ring-slate-200">
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="rounded-lg bg-white p-5 text-center ring-1 ring-slate-200">
            <div className="mx-auto grid h-28 w-28 place-items-center rounded-lg bg-nova-peach text-nova-coral">
              <UserRound size={48} />
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-900">{user?.name || 'Organizer'}</h3>
            <p className="mt-1 text-sm text-nova-muted">{user?.college || 'College organizer'}</p>
            <div className="mt-5 rounded-lg bg-nova-peach px-3 py-2 text-sm font-bold text-nova-coral">
              <span className="capitalize">{user?.verificationStatus || 'approved'}</span> organizer
            </div>
          </aside>

          <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
            <label className="grid gap-2 text-sm font-bold text-nova-muted">
              Organizer Name
              <input
                value={form.name}
                onChange={updateField('name')}
                className="rounded-lg bg-white px-4 py-3 text-nova-ink ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-nova-coral"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-nova-muted">
              College Name
              <input
                value={form.college}
                onChange={updateField('college')}
                className="rounded-lg bg-white px-4 py-3 text-nova-ink ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-nova-coral"
                required
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-nova-muted md:col-span-2">
              Short Bio
              <textarea
                rows={5}
                value={form.bio}
                onChange={updateField('bio')}
                placeholder="Tell students a little about your organization."
                className="resize-none rounded-lg bg-white px-4 py-3 text-nova-ink ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-nova-coral"
              />
            </label>
            <div className="rounded-lg bg-white p-4 ring-1 ring-slate-200 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-nova-peach text-nova-coral">
                  <Building2 size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Verification status</p>
                  <p className="text-sm capitalize text-nova-muted">{user?.verificationStatus || 'Approved'}</p>
                </div>
              </div>
            </div>
            <Button className="md:col-span-2" variant="accent" type="submit" disabled={loading}>
              <Save size={16} />
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
