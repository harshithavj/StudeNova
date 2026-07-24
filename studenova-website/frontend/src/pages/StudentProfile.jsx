import { useRef } from 'react';
import { Edit, Github, Linkedin, Save, Upload, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import StudentShell from '../components/student/StudentShell';
import { useAuth } from '../context/AuthContext';
import { studentAchievements } from '../data/mockData';
import api from '../services/api';

export default function StudentProfile() {
  const { user, updateUser, updateProfile, loading } = useAuth();
  const formRef = useRef(null);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const name = formData.get('fullName');
    const college = formData.get('collegeName');
    const phone_number = formData.get('phoneNumber');
    const address = formData.get('address');
    const department = formData.get('department');
    const academic_year = formData.get('academicYear');
    const skills = formData.get('skills')?.split(',').map(s => s.trim()).filter(Boolean) || [];
    const domains = formData.get('domainsOfInterest')?.split(',').map(s => s.trim()).filter(Boolean) || [];
    const interests = formData.get('areasOfInterest')?.split(',').map(s => s.trim()).filter(Boolean) || [];
    const portfolio_url = formData.get('portfolioWebsite');
    const github_url = formData.get('githubUrl');
    const linkedin_url = formData.get('linkedinUrl');

    const updateToast = toast.loading('Saving profile changes...');
    try {
      await updateProfile({
        name,
        college,
        phone_number,
        address,
        profile: {
          department,
          academic_year,
          skills,
          domains,
          interests,
          portfolio_url,
          github_url,
          linkedin_url
        }
      });
      toast.success('Profile changes saved successfully', { id: updateToast });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update profile', { id: updateToast });
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    const uploadToast = toast.loading('Uploading resume...');
    try {
      const { data } = await api.post('/auth/profile/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      updateUser(data.user);
      toast.success('Resume uploaded and saved successfully!', { id: uploadToast });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Resume upload failed', { id: uploadToast });
    }
  };

  const handleGithubClick = () => {
    const githubUrl = user?.profile?.github_url;
    if (githubUrl) {
      window.open(githubUrl, '_blank', 'noopener,noreferrer');
    } else {
      const url = prompt('Enter your GitHub Profile URL (e.g. https://github.com/username):');
      if (url) {
        const input = formRef.current.querySelector('input[name="githubUrl"]');
        if (input) {
          input.value = url;
          toast.success('GitHub URL added to form. Click "Save Profile" at the bottom to persist.');
        }
      }
    }
  };

  const handleLinkedinClick = () => {
    const linkedinUrl = user?.profile?.linkedin_url;
    if (linkedinUrl) {
      window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
    } else {
      const url = prompt('Enter your LinkedIn Profile URL (e.g. https://linkedin.com/in/username):');
      if (url) {
        const input = formRef.current.querySelector('input[name="linkedinUrl"]');
        if (input) {
          input.value = url;
          toast.success('LinkedIn URL added to form. Click "Save Profile" at the bottom to persist.');
        }
      }
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
            <form ref={formRef} className="grid gap-4 md:grid-cols-2" onSubmit={handleUpdateProfile}>
              {[
                ['Full Name', user?.name || '', 'fullName'],
                ['Phone Number (Optional)', user?.phone_number || '', 'phoneNumber'],
                ['Address (Optional)', user?.address || '', 'address'],
                ['College Name', user?.college || '', 'collegeName'],
                ['Department', user?.profile?.department || '', 'department'],
                ['Academic Year', user?.profile?.academic_year || '', 'academicYear'],
                ['Skills (Comma-separated)', user?.profile?.skills?.join(', ') || '', 'skills'],
                ['Domains of Interest (Comma-separated)', user?.profile?.domains?.join(', ') || '', 'domainsOfInterest'],
                ['Areas of Interest (Comma-separated)', user?.profile?.interests?.join(', ') || '', 'areasOfInterest'],
                ['Portfolio Website (Optional)', user?.profile?.portfolio_url || '', 'portfolioWebsite'],
                ['GitHub Profile URL (Optional)', user?.profile?.github_url || '', 'githubUrl'],
                ['LinkedIn Profile URL (Optional)', user?.profile?.linkedin_url || '', 'linkedinUrl']
              ].map(([label, value, nameAttr]) => (
                <label key={label} className="grid gap-2 text-sm font-bold text-nova-muted">
                  {label}
                  <input name={nameAttr} defaultValue={value} className="rounded-lg bg-white px-4 py-3 text-nova-ink ring-1 ring-slate-200" />
                </label>
              ))}
              <div className="md:col-span-2 grid gap-3 md:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-bold ring-1 ring-slate-200 hover:bg-slate-50 transition">
                    <Upload size={16} />Resume Upload
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
                  </label>
                  {user?.profile?.resume_url && (
                    <a href={user.profile.resume_url} target="_blank" rel="noreferrer" className="text-xs text-nova-coral text-center font-bold underline">
                      View Uploaded Resume
                    </a>
                  )}
                </div>
                <Button type="button" variant="secondary" onClick={handleGithubClick}>
                  <Github size={16} />
                  {user?.profile?.github_url ? 'Open GitHub' : 'Add GitHub'}
                </Button>
                <Button type="button" variant="secondary" onClick={handleLinkedinClick}>
                  <Linkedin size={16} />
                  {user?.profile?.linkedin_url ? 'Open LinkedIn' : 'Add LinkedIn'}
                </Button>
              </div>
              <Button className="md:col-span-2" variant="accent" type="submit" disabled={loading}>
                <Save size={16} />{loading ? 'Saving...' : 'Save Profile'}
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
