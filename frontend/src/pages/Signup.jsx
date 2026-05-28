import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import BackButton from '../components/BackButton';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { engineeringColleges } from '../data/engineeringColleges';
import api from '../services/api';

const roleConfig = {
  student: {
    label: 'Student',
    role: 'student',
    fields: ['fullName', 'email', 'password', 'collegeName', 'department', 'yearOfStudy', 'usn', 'phone']
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
  yearOfStudy: 'Year',
  usn: 'USN',
  phone: 'Phone Number',
  position: 'Position',
  companyName: 'Company Name',
  industryType: 'Industry Type',
  designation: 'Designation',
  website: 'Website',
  contactNumber: 'Contact Number'
};

const studyYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const engineeringDepartments = [
  'Aeronautical Engineering',
  'Aerospace Engineering',
  'Agricultural Engineering',
  'Artificial Intelligence and Data Science',
  'Artificial Intelligence and Machine Learning',
  'Automobile Engineering',
  'Biomedical Engineering',
  'Biotechnology Engineering',
  'Chemical Engineering',
  'Civil Engineering',
  'Computer Science and Business Systems',
  'Computer Science and Design',
  'Computer Science and Engineering',
  'Computer Science and Engineering (AI & ML)',
  'Computer Science and Engineering (Cyber Security)',
  'Computer Science and Engineering (Data Science)',
  'Construction Technology and Management',
  'Electrical and Electronics Engineering',
  'Electronics and Communication Engineering',
  'Electronics and Computer Engineering',
  'Electronics and Instrumentation Engineering',
  'Environmental Engineering',
  'Industrial Engineering and Management',
  'Information Science and Engineering',
  'Information Technology',
  'Instrumentation Technology',
  'Manufacturing Science and Engineering',
  'Marine Engineering',
  'Mechanical Engineering',
  'Mechatronics Engineering',
  'Medical Electronics Engineering',
  'Mining Engineering',
  'Petroleum Engineering',
  'Robotics and Automation',
  'Telecommunication Engineering',
  'Textile Technology'
];

const passwordChecks = [
  (password) => password.length >= 8,
  (password) => password.length < 16,
  (password) => /[A-Z]/.test(password),
  (password) => /\d/.test(password),
  (password) => /[^A-Za-z0-9]/.test(password)
];

export default function Signup() {
  const { roleType = 'student' } = useParams();
  const config = roleConfig[roleType] || roleConfig.student;
  const isStudent = config.role === 'student';
  const steps = isStudent ? ['Profile details', 'Email OTP confirmation'] : ['Profile details', 'Verification assets', 'OTP confirmation'];
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({});
  const [otpLoading, setOtpLoading] = useState(false);
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const strength = useMemo(() => {
    const password = form.password || '';
    const passedChecks = passwordChecks.filter((check) => check(password)).length;
    return (passedChecks / passwordChecks.length) * 100;
  }, [form.password]);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const isBusy = loading || otpLoading;

  const sendEmailOtp = async () => {
    setOtpLoading(true);
    try {
      await api.post('/auth/send-otp', { email: form.email });
      toast.success('OTP sent to your email');
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    setOtpLoading(true);
    try {
      await api.post('/auth/verify-otp', { email: form.email || form.officialEmail || form.workEmail, otp: form.otp });
    } finally {
      setOtpLoading(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (isStudent && step === 1) {
      try {
        await sendEmailOtp();
        setStep(2);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to send OTP');
      }
      return;
    }
    if (!isStudent && step < 3) {
      setStep((current) => current + 1);
      return;
    }
    try {
      await verifyOtp();
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
          <p className="text-sm font-bold uppercase tracking-wider text-nova-coral">Step {step} of {steps.length}</p>
          <h1 className="mt-2 text-4xl font-black">{config.label} onboarding</h1>
          <p className="mt-3 text-nova-muted">{isStudent ? 'Complete your student profile and confirm your email with OTP.' : 'Complete a production-style profile with verification-ready fields, file upload placeholders, and OTP confirmation.'}</p>
          <div className="mt-6 grid gap-3">
            {steps.map((item, index) => (
              <div key={item} className={`rounded-lg px-4 py-3 text-sm font-bold ${step === index + 1 ? 'bg-nova-peach text-nova-coral' : 'bg-white text-nova-muted ring-1 ring-slate-200'}`}>{item}</div>
            ))}
          </div>
        </div>
        <form onSubmit={submit} className="surface grid gap-4 rounded-lg p-6 md:grid-cols-2">
          {step === 1 && config.fields.map((field) => (
            field === 'collegeName' ? (
              <div key={field} className="grid gap-2">
                <input
                  list="engineering-colleges"
                  required
                  placeholder="Search/Enter College"
                  value={form[field] || ''}
                  onChange={(e) => update(field, e.target.value)}
                  className="rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200"
                />
                <datalist id="engineering-colleges">
                  {engineeringColleges.map((college) => <option key={college.id} value={college.name} label={college.label} />)}
                </datalist>
              </div>
            ) : field === 'yearOfStudy' ? (
              <select key={field} required value={form[field] || ''} onChange={(e) => update(field, e.target.value)} className="rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200">
                <option value="">Year</option>
                {studyYears.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            ) : field === 'department' ? (
              <select key={field} required value={form[field] || ''} onChange={(e) => update(field, e.target.value)} className="rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200">
                <option value="">Department</option>
                {engineeringDepartments.map((department) => <option key={department} value={department}>{department}</option>)}
              </select>
            ) : (
              <input key={field} type={field.includes('Email') || field === 'email' ? 'email' : field === 'password' ? 'password' : field === 'phone' || field === 'contactNumber' ? 'tel' : 'text'} required={field === 'password' || field === 'phone' || field.toLowerCase().includes('email') || field.includes('Name')} minLength={field === 'password' ? 8 : undefined} maxLength={field === 'password' ? 15 : undefined} pattern={field === 'password' ? '(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,15}' : undefined} title={field === 'password' ? 'Password must be 8-15 characters and include one uppercase letter, one number, and one special symbol.' : undefined} placeholder={labels[field]} value={form[field] || ''} onChange={(e) => update(field, e.target.value)} className="rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200" />
            )
          ))}
          {step === 1 && (
            <div className="md:col-span-2">
              <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-nova-coral transition-all" style={{ width: `${strength}%` }} /></div>
              <p className="mt-2 text-xs font-semibold text-nova-muted">Password strength meter</p>
            </div>
          )}
          {!isStudent && step === 2 && (
            <>
              <label className="rounded-lg bg-white p-4 text-sm font-bold text-nova-muted ring-1 ring-slate-200">Avatar / Logo Upload<input type="file" className="mt-3 block w-full text-sm" /></label>
              <label className="rounded-lg bg-white p-4 text-sm font-bold text-nova-muted ring-1 ring-slate-200">Verification Document Upload<input type="file" className="mt-3 block w-full text-sm" /></label>
            </>
          )}
          {((isStudent && step === 2) || (!isStudent && step === 3)) && (
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-nova-muted">{isStudent ? 'Email OTP' : 'OTP verification'}</label>
              <input required placeholder="Enter 6-digit OTP" value={form.otp || ''} onChange={(e) => update('otp', e.target.value)} className="mt-2 w-full rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200" />
              <p className="mt-3 text-sm text-nova-muted">{isStudent ? `Enter the OTP sent to ${form.email}.` : 'Supabase email verification and session persistence are wired through the auth service layer for production credentials.'}</p>
            </div>
          )}
          <Button disabled={isBusy} className="md:col-span-2" variant="accent">{isBusy ? 'Please wait...' : step === steps.length ? 'Create account' : isStudent ? 'Send OTP' : 'Continue'}</Button>
        </form>
      </div>
    </section>
  );
}
