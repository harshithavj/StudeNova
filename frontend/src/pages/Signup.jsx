import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import BackButton from '../components/BackButton';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const colleges = ['Global Institute of Technology', 'North City University', 'Westfield School of Design', 'Raman Research College', 'National Institute of Engineering'];

const roleConfig = {
  student: {
    label: 'Student',
    role: 'student',
    fields: ['fullName', 'email', 'password', 'collegeName', 'department', 'yearSemester', 'usn', 'phone']
  },
  'college-organizer': {
    label: 'College Organizer',
    role: 'college_admin',
    fields: ['organizerName', 'collegeName', 'officialEmail', 'position', 'password']
  },
  'industry-organizer': {
    label: 'Industry Organizer',
    role: 'industry_organizer',
    fields: ['companyName', 'organizerName', 'workEmail', 'industryType', 'designation', 'website', 'contactNumber', 'password']
  }
};

const labels = {
  fullName: 'Full Name',
  organizerName: 'Organizer Name',
  email: 'Email',
  officialEmail: 'Official Email',
  workEmail: 'Work Email',
  password: 'Password',
  collegeName: 'College Name',
  department: 'Department',
  yearSemester: 'Year/Semester',
  usn: 'USN',
  phone: 'Phone Number',
  position: 'Position',
  companyName: 'Company Name',
  industryType: 'Industry Type',
  designation: 'Designation',
  website: 'Website',
  contactNumber: 'Contact Number'
};

export default function Signup() {
  const { roleType = 'student' } = useParams();
  const config = roleConfig[roleType] || roleConfig.student;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({});
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const strength = useMemo(() => Math.min(100, ((form.password || '').length / 12) * 100), [form.password]);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    if (step < 3) {
      setStep((current) => current + 1);
      return;
    }
    try {
      await signup({
        name: form.fullName || form.organizerName || form.companyName,
        email: form.email || form.officialEmail || form.workEmail,
        password: form.password,
        role: config.role,
        college: form.collegeName,
        company: form.companyName
      });
      navigate(`/dashboard/${roleType}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create account');
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs />
      <BackButton />
      <div className="mt-8 grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-nova-coral">Step {step} of 3</p>
          <h1 className="mt-2 text-4xl font-black">{config.label} onboarding</h1>
          <p className="mt-3 text-nova-muted">Complete a production-style profile with verification-ready fields, file upload placeholders, and OTP confirmation.</p>
          <div className="mt-6 grid gap-3">
            {['Profile details', 'Verification assets', 'OTP confirmation'].map((item, index) => (
              <div key={item} className={`rounded-lg px-4 py-3 text-sm font-bold ${step === index + 1 ? 'bg-nova-peach text-nova-coral' : 'bg-white text-nova-muted ring-1 ring-slate-200'}`}>{item}</div>
            ))}
          </div>
        </div>
        <form onSubmit={submit} className="surface grid gap-4 rounded-lg p-6 md:grid-cols-2">
          {step === 1 && config.fields.map((field) => (
            field === 'collegeName' ? (
              <select key={field} required value={form[field] || ''} onChange={(e) => update(field, e.target.value)} className="rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200">
                <option value="">Search college</option>
                {colleges.map((college) => <option key={college}>{college}</option>)}
              </select>
            ) : (
              <input key={field} type={field.includes('Email') || field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'} required={field === 'password' || field.toLowerCase().includes('email') || field.includes('Name')} minLength={field === 'password' ? 8 : undefined} placeholder={labels[field]} value={form[field] || ''} onChange={(e) => update(field, e.target.value)} className="rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200" />
            )
          ))}
          {step === 1 && (
            <div className="md:col-span-2">
              <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-nova-coral transition-all" style={{ width: `${strength}%` }} /></div>
              <p className="mt-2 text-xs font-semibold text-nova-muted">Password strength meter</p>
            </div>
          )}
          {step === 2 && (
            <>
              <label className="rounded-lg bg-white p-4 text-sm font-bold text-nova-muted ring-1 ring-slate-200">Avatar / Logo Upload<input type="file" className="mt-3 block w-full text-sm" /></label>
              <label className="rounded-lg bg-white p-4 text-sm font-bold text-nova-muted ring-1 ring-slate-200">Verification Document Upload<input type="file" className="mt-3 block w-full text-sm" /></label>
            </>
          )}
          {step === 3 && (
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-nova-muted">OTP verification</label>
              <input required placeholder="Enter 6-digit OTP" className="mt-2 w-full rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200" />
              <p className="mt-3 text-sm text-nova-muted">Supabase email verification and session persistence are wired through the auth service layer for production credentials.</p>
            </div>
          )}
          <Button disabled={loading} className="md:col-span-2" variant="accent">{loading ? 'Creating...' : step === 3 ? 'Create account' : 'Continue'}</Button>
        </form>
      </div>
    </section>
  );
}
