import { useEffect, useState } from 'react';
import { Building2, Save, UserRound, Camera, Loader2, Phone, MapPin, CheckCircle, Globe, Linkedin } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function ProfilePage() {
  const { user, updateUser, updateProfile, loading } = useAuth();
  const [form, setForm] = useState({ name: '', college: '', bio: '', phone_number: '', address: '', website: '', linkedin_url: '' });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    setForm({
      name: user?.name || '',
      college: user?.college || '',
      bio: user?.bio || '',
      phone_number: user?.phone_number || '',
      address: user?.address || '',
      website: user?.website || '',
      linkedin_url: user?.linkedin_url || ''
    });
  }, [user]);

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    setUploadingAvatar(true);
    const uploadToast = toast.loading('Uploading profile photo...');
    try {
      const { data } = await api.post('/auth/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      updateUser(data.user);
      toast.success('Profile photo updated successfully!', { id: uploadToast });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload profile photo', { id: uploadToast });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    const updateToast = toast.loading('Saving profile changes...');
    try {
      await updateProfile(form);
      toast.success('Profile updated successfully!', { id: updateToast });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile', { id: updateToast });
    }
  };

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const status = (user?.verificationStatus || 'approved').toLowerCase();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-nova-coral">Organizer Profile</p>
        <h2 className="mt-2 text-4xl font-black text-slate-900 leading-tight">Everything about your organization in one place</h2>
      </div>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar Section */}
          <aside className="flex flex-col items-center rounded-2xl bg-slate-50/50 p-6 text-center ring-1 ring-slate-100/70">
            <div className="relative group">
              <div className="mx-auto h-32 w-32 overflow-hidden rounded-2xl bg-nova-peach text-nova-coral flex items-center justify-center ring-4 ring-nova-peach/30 transition-all duration-300">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Organizer Profile" className="h-full w-full object-cover" />
                ) : (
                  <UserRound size={56} />
                )}
              </div>
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center rounded-2xl">
                  <Loader2 className="animate-spin text-white" size={24} />
                </div>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/45 text-white opacity-0 group-hover:opacity-100 transition duration-200 rounded-2xl cursor-pointer">
                <Camera size={20} className="mr-1.5" />
                <span className="text-xs font-black">Change</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
              </label>
            </div>

            <h3 className="mt-5 text-xl font-black text-slate-900 leading-tight">{user?.name || 'Organizer'}</h3>
            <p className="mt-2 text-xs font-semibold text-nova-muted leading-normal max-w-[180px]">{user?.college || 'College organizer'}</p>

            <div className={`mt-6 w-full rounded-xl py-2 px-3 text-xs font-black uppercase tracking-wider ${
              status === 'approved'
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                : status === 'pending'
                ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
                : 'bg-rose-50 text-rose-700 ring-1 ring-rose-100'
            }`}>
              {status} organizer
            </div>
          </aside>

          {/* Form Section */}
          <form className="grid gap-6 md:grid-cols-2" onSubmit={submit}>
            <label className="grid gap-2 text-sm font-black text-nova-muted">
              Organizer Name
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <UserRound size={18} />
                </span>
                <input
                  value={form.name}
                  onChange={updateField('name')}
                  className="w-full rounded-xl bg-slate-50/50 py-3.5 pl-11 pr-4 text-nova-ink ring-1 ring-slate-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-nova-coral"
                  required
                />
              </div>
            </label>

            <label className="grid gap-2 text-sm font-black text-nova-muted">
              College Name
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Building2 size={18} />
                </span>
                <input
                  value={form.college}
                  onChange={updateField('college')}
                  className="w-full rounded-xl bg-slate-50/50 py-3.5 pl-11 pr-4 text-nova-ink ring-1 ring-slate-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-nova-coral"
                  required
                />
              </div>
            </label>

            <label className="grid gap-2 text-sm font-black text-nova-muted">
              Phone Number
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Phone size={18} />
                </span>
                <input
                  value={form.phone_number}
                  onChange={updateField('phone_number')}
                  placeholder="Enter contact number"
                  className="w-full rounded-xl bg-slate-50/50 py-3.5 pl-11 pr-4 text-nova-ink ring-1 ring-slate-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-nova-coral"
                />
              </div>
            </label>

            <label className="grid gap-2 text-sm font-black text-nova-muted">
              Campus Address
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <MapPin size={18} />
                </span>
                <input
                  value={form.address}
                  onChange={updateField('address')}
                  placeholder="Enter campus address details"
                  className="w-full rounded-xl bg-slate-50/50 py-3.5 pl-11 pr-4 text-nova-ink ring-1 ring-slate-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-nova-coral"
                />
              </div>
            </label>

            <label className="grid gap-2 text-sm font-black text-nova-muted">
              College Website
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Globe size={18} />
                </span>
                <input
                  value={form.website}
                  onChange={updateField('website')}
                  placeholder="Enter college website URL"
                  className="w-full rounded-xl bg-slate-50/50 py-3.5 pl-11 pr-4 text-nova-ink ring-1 ring-slate-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-nova-coral"
                />
              </div>
            </label>

            <label className="grid gap-2 text-sm font-black text-nova-muted">
              LinkedIn Profile
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Linkedin size={18} />
                </span>
                <input
                  value={form.linkedin_url}
                  onChange={updateField('linkedin_url')}
                  placeholder="Enter LinkedIn profile URL"
                  className="w-full rounded-xl bg-slate-50/50 py-3.5 pl-11 pr-4 text-nova-ink ring-1 ring-slate-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-nova-coral"
                />
              </div>
            </label>

            <label className="grid gap-2 text-sm font-black text-nova-muted md:col-span-2">
              Short Bio
              <textarea
                rows={4}
                value={form.bio}
                onChange={updateField('bio')}
                placeholder="Tell students a little about your organization, club, or department."
                className="w-full resize-none rounded-xl bg-slate-50/50 px-4 py-3.5 text-nova-ink ring-1 ring-slate-200 transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-nova-coral"
              />
            </label>

            {/* Verification Status Card */}
            <div className={`rounded-xl p-4 md:col-span-2 flex items-center justify-between ${
              status === 'approved'
                ? 'bg-emerald-50/70 border border-emerald-100 text-emerald-800'
                : status === 'pending'
                ? 'bg-amber-50/70 border border-amber-100 text-amber-800'
                : 'bg-rose-50/70 border border-rose-100 text-rose-800'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`grid h-10 w-10 place-items-center rounded-lg ${
                  status === 'approved' ? 'bg-emerald-100 text-emerald-600' : status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                }`}>
                  {status === 'approved' ? <CheckCircle size={20} /> : <Building2 size={20} />}
                </div>
                <div>
                  <p className="text-sm font-black">Verification Status</p>
                  <p className="text-xs font-semibold opacity-90">
                    {status === 'approved'
                      ? 'Your organization is verified. You can post and manage campus events.'
                      : status === 'pending'
                      ? 'Verification is pending. Our admin team will review your details shortly.'
                      : 'Verification rejected. Please review your details and contact support.'}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-black uppercase tracking-wider rounded-lg px-2.5 py-1 ${
                status === 'approved' ? 'bg-emerald-100 text-emerald-800' : status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {status}
              </span>
            </div>

            <Button className="md:col-span-2 py-3.5 text-base font-black transition-all hover:-translate-y-0.5" variant="accent" type="submit" disabled={loading}>
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
