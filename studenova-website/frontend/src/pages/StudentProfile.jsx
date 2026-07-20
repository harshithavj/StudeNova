import { useRef } from 'react';
import { Edit, Github, Linkedin, Save, Upload, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import StudentShell from '../components/student/StudentShell';
import { useAuth } from '../context/AuthContext';
import { studentAchievements } from '../data/mockData';

export default function StudentProfile() {
  const { user, updateProfile, loading } = useAuth();
  const formRef = useRef(null);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const name = formData.get('fullName');
    const college = formData.get('collegeName');
    try {
      await updateProfile({ name, college });
    } catch (error) {
      // Error is already handled inside updateProfile with a toast
    }
  };

  return (
    <StudentShell user={user}>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-nova-coral">Profile</p>
          <h2 className="text-4xl font-black">"Everything about you in one place"</h2>
        </div>
        <section className="surface rounded-lg p-6">
          <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
            <div className="rounded-lg bg-white p-5 text-center ring-1 ring-slate-200">
              <div className="mx-auto grid h-28 w-28 place-items-center rounded-lg bg-nova-peach text-nova-coral">
                <UserRound size={48} />
              </div>
              <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold ring-1 ring-slate-200">
                <Upload size={16} />Profile Photo
                <input type="file" className="hidden" />
              </label>
            </div>
            <form ref={formRef} className="grid gap-4 md:grid-cols-2" onSubmit={(event) => { event.preventDefault(); toast.success('Profile changes saved'); }}>
              {[
                ['Full Name', user?.name || 'Student', 'fullName'],
                ['College Name', user?.college || 'Global Institute of Technology', 'collegeName'],
                ['Department', 'Computer Science and Engineering', 'department'],
                ['Academic Year', '3rd Year', 'academicYear'],
                ['Skills', 'React, Python, Machine Learning, UI Design', 'skills'],
                ['Domains of Interest', 'AI/ML, Cloud Computing, Web Development', 'domainsOfInterest'],
                ['Areas of Interest', 'Hackathons, internships, research programs', 'areasOfInterest'],
                ['Portfolio Website', 'https://portfolio.example.com', 'portfolioWebsite']
              ].map(([label, value, nameAttr]) => (
                <label key={label} className="grid gap-2 text-sm font-bold text-nova-muted">
                  {label}
                  <input name={nameAttr} defaultValue={value} className="rounded-lg bg-white px-4 py-3 text-nova-ink ring-1 ring-slate-200" />
                </label>
              ))}
              <div className="md:col-span-2 grid gap-3 md:grid-cols-3">
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-bold ring-1 ring-slate-200">
                  <Upload size={16} />Resume Upload
                  <input type="file" className="hidden" />
                </label>
                <Button type="button" variant="secondary"><Github size={16} />GitHub Profile</Button>
                <Button type="button" variant="secondary"><Linkedin size={16} />LinkedIn Profile</Button>
              </div>
              <Button className="md:col-span-2" variant="accent"><Save size={16} />Save Profile</Button>
              <Button className="md:col-span-2" variant="pink" type="button" onClick={handleUpdateProfile} disabled={loading}>
                <Edit size={16} />{loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </div>
        </section>
        <section className="surface rounded-lg p-6">
          <h3 className="text-2xl font-black">Dashboard Statistics</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            {[
              ['Total Events Participated', '26'],
              ['Active Registrations', '3'],
              ['Achievements Earned', String(studentAchievements.length)],
              ['Participation Streak', '10']
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-white p-4 ring-1 ring-slate-200">
                <p className="text-2xl font-black">{value}</p>
                <p className="text-sm text-nova-muted">{label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </StudentShell>
  );
}
