import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import BackButton from '../components/BackButton';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/ui/Button';
import PasswordInput from '../components/ui/PasswordInput';
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
    fields: ['organizerName', 'collegeName', 'officialEmail', 'yearOfStudy', 'password']
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
  yearOfStudy: 'Year of Study',
  usn: 'USN',
  phone: 'Phone Number',
  position: 'Position',
  companyName: 'Company Name',
  industryType: 'Industry Type',
  designation: 'Designation',
  website: 'Website',
  contactNumber: 'Contact Number'
};

const studyYears = ['1', '2', '3', '4'];
const popularClubs = ['IEEE', 'ACM', 'CSI', 'IETE', 'Robotics Club', 'Coding Club'];
const clubDetailFields = [
  ['facultyHeadName', 'Faculty Head Name'],
  ['facultyHeadPhone', 'Faculty Head Phone Number'],
  ['studentHeadName', 'Student Head Name'],
  ['studentHeadPhone', 'Student Head Phone Number'],
  ['committeeMemberName', 'Organizing Committee Member Name'],
  ['committeeMemberPhone', 'Organizing Committee Member Phone Number']
];
const maxVerificationFileSize = 3 * 1024 * 1024;
const acceptedVerificationTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const acceptedVerificationExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'];
const indianPhonePattern = /^(?:\+91|91)?[6-9]\d{9}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isEmailValid = (email) => typeof email === 'string' && emailPattern.test(email.trim());
const isIndianPhoneNumber = (value) => typeof value === 'string' && indianPhonePattern.test(value.replace(/\s+/g, ''));

const verificationAssets = {
  'college-organizer': [
    {
      key: 'collegeIdProof',
      label: 'College ID Proof',
      hint: 'Upload your valid college ID as a verified PDF or image.'
    },
    {
      key: 'clubDetails',
      label: 'Club Details',
      hint: 'Upload the club registration, profile, or official details document.'
    },
    {
      key: 'clubMembershipProof',
      label: 'Proof of Club Membership',
      hint: 'Upload proof that confirms your role or membership in the club.'
    }
  ],
  'industry-organizer': [
    {
      key: 'logo',
      label: 'Avatar / Logo Upload',
      hint: 'Upload your organization logo as a PDF or image.'
    },
    {
      key: 'verificationDocument',
      label: 'Verification Document Upload',
      hint: 'Upload an official verification document as a PDF or image.'
    }
  ]
};

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
  const [clubDetailsOpen, setClubDetailsOpen] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const strength = useMemo(() => {
    const password = form.password || '';
    const passedChecks = passwordChecks.filter((check) => check(password)).length;
    return (passedChecks / passwordChecks.length) * 100;
  }, [form.password]);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const updateClubDetail = (key, value) => {
    setForm((current) => ({
      ...current,
      clubDetailsForm: {
        ...(current.clubDetailsForm || {}),
        [key]: value
      }
    }));
  };
  const isBusy = loading || otpLoading;
  const currentVerificationAssets = verificationAssets[roleType] || verificationAssets['industry-organizer'];
  const clubDetails = form.clubDetailsForm || {};
  const customClubRequired = clubDetails.clubName === 'Other';
  const resolvedClubName = customClubRequired ? clubDetails.customClubName : clubDetails.clubName;
  const hasClubDetails = Boolean(
    resolvedClubName
    && clubDetailFields.every(([key]) => clubDetails[key])
  );
  const accountEmail = form.email || form.officialEmail || form.workEmail;

  const handleVerificationFileChange = (key, event) => {
    const file = event.target.files?.[0];
    if (!file) {
      update(key, null);
      return;
    }

    const hasAllowedType = acceptedVerificationTypes.includes(file.type);
    const hasAllowedExtension = acceptedVerificationExtensions.some((extension) => file.name.toLowerCase().endsWith(extension));

    if (!hasAllowedType && !hasAllowedExtension) {
      event.target.value = '';
      update(key, null);
      toast.error('Upload a verified PDF or image file.');
      return;
    }

    if (file.size > maxVerificationFileSize) {
      event.target.value = '';
      update(key, null);
      toast.error('Add files less than 3MB');
      return;
    }

    update(key, file);
  };

  const sendEmailOtp = async () => {
    if (!accountEmail || !isEmailValid(accountEmail)) {
      toast.error('Enter a valid email address before requesting OTP.');
      return false;
    }
    setOtpLoading(true);
    try {
      await api.post('/auth/send-otp', { email: accountEmail });
      toast.success('OTP sent to your email');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to send OTP');
      return false;
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    setOtpLoading(true);
    try {
      await api.post('/auth/verify-otp', { email: accountEmail, otp: form.otp });
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to verify OTP');
      return false;
    } finally {
      setOtpLoading(false);
    }
  };

  const validateClubDetails = () => {
    if (!hasClubDetails) {
      toast.error('Fill every club detail before submitting this form.');
      return false;
    }

    const invalidPhoneFields = clubDetailFields
      .filter(([key]) => key.toLowerCase().includes('phone'))
      .filter(([key]) => !isIndianPhoneNumber(clubDetails[key] || ''))
      .map(([, label]) => label);

    if (invalidPhoneFields.length) {
      toast.error(`Enter valid Indian phone numbers for: ${invalidPhoneFields.join(', ')}.`);
      return false;
    }

    return true;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!accountEmail || !isEmailValid(accountEmail)) {
      toast.error('Enter a valid email address before continuing.');
      return;
    }

    if (isStudent && step === 1) {
      const sent = await sendEmailOtp();
      if (sent) {
        setStep(2);
      }
      return;
    }
    if (!isStudent && step < 3) {
      if (config.role === 'college_admin' && step === 2) {
        if (!validateClubDetails()) {
          setClubDetailsOpen(true);
          return;
        }
      }
      if (step === 2) {
        const sent = await sendEmailOtp();
        if (!sent) {
          return;
        }
      }
      setStep((current) => current + 1);
      return;
    }
    try {
      const otpVerified = await verifyOtp();
      if (!otpVerified) {
        return;
      }
      const signupPayload = {
        name: form.fullName || form.organizerName || form.companyName,
        email: form.email || form.officialEmail || form.workEmail,
        password: form.password,
        role: config.role,
        college: form.collegeName,
        company: form.companyName
      };

      let createdUser;
      if (['college_admin', 'industry_organizer'].includes(config.role)) {
        const multipartPayload = new FormData();
        Object.entries(signupPayload).forEach(([key, value]) => {
          if (value) multipartPayload.append(key, value);
        });
        currentVerificationAssets.forEach((asset) => {
          if (asset.key !== 'clubDetails' && form[asset.key]) multipartPayload.append(asset.key, form[asset.key]);
        });
        if (config.role === 'college_admin') {
          multipartPayload.append('clubDetailsForm', JSON.stringify({
            clubName: resolvedClubName,
            facultyHeadName: clubDetails.facultyHeadName,
            facultyHeadPhone: clubDetails.facultyHeadPhone,
            studentHeadName: clubDetails.studentHeadName,
            studentHeadPhone: clubDetails.studentHeadPhone,
            committeeMemberName: clubDetails.committeeMemberName,
            committeeMemberPhone: clubDetails.committeeMemberPhone
          }));
        }
        createdUser = await signup(multipartPayload);
      } else {
        createdUser = await signup(signupPayload);
      }
      const verificationStatus = createdUser?.verificationStatus || createdUser?.verification_status || 'pending';
      if (config.role === 'college_admin' && verificationStatus === 'pending') {
        navigate('/college/pending-approval');
      } else {
        navigate(`/dashboard/${roleType}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create account');
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs />
      <BackButton
        fallback="/auth/select-role"
        onBack={() => {
          if (step > 1) {
            setStep((current) => current - 1);
          } else {
            navigate('/auth/select-role');
          }
        }}
      />
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
                <option value="">Year of Study</option>
                {studyYears.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            ) : field === 'department' ? (
              <select key={field} required value={form[field] || ''} onChange={(e) => update(field, e.target.value)} className="rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200">
                <option value="">Department</option>
                {engineeringDepartments.map((department) => <option key={department} value={department}>{department}</option>)}
              </select>
            ) : field === 'password' ? (
              <PasswordInput
                key={field}
                required
                minLength={8}
                maxLength={15}
                pattern="(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,15}"
                title="Password must be 8-15 characters and include one uppercase letter, one number, and one special symbol."
                placeholder={labels[field]}
                value={form[field] || ''}
                onChange={(e) => update(field, e.target.value)}
              />
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
            currentVerificationAssets.map((asset) => (
              asset.key === 'clubDetails' && config.role === 'college_admin' ? (
                <div
                  key={asset.key}
                  className="rounded-lg bg-white p-4 text-left text-sm font-bold text-nova-muted ring-1 ring-slate-200"
                >
                  <span className="block text-base font-black text-nova-ink">{asset.label}</span>
                  <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">
                    {hasClubDetails ? `${resolvedClubName} details ready for admin approval.` : 'Open the side form and enter club heads and committee contact details.'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setClubDetailsOpen(true)}
                    className="mt-4 inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    {hasClubDetails ? 'Edit form' : 'Open form'}
                  </button>
                </div>
              ) : (
                <label key={asset.key} className="rounded-lg bg-white p-4 text-sm font-bold text-nova-muted ring-1 ring-slate-200">
                  {asset.label}
                  <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">{asset.hint}<br></br> Max file size: 3MB.</span>
                  <input
                    type="file"
                    required
                    accept="application/pdf,image/jpeg,image/png,image/webp"
                    className="mt-3 block w-full text-sm"
                    onChange={(event) => handleVerificationFileChange(asset.key, event)}
                  />
                </label>
              )
            ))
          )}
          {((isStudent && step === 2) || (!isStudent && step === 3)) && (
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-nova-muted">{isStudent ? 'Email OTP' : 'OTP verification'}</label>
              <input required inputMode="numeric" maxLength={6} placeholder="Enter 6-digit OTP" value={form.otp || ''} onChange={(e) => update('otp', e.target.value)} className="mt-2 w-full rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200" />
              <div className="mt-3 flex flex-col gap-3 text-sm text-nova-muted sm:flex-row sm:items-center sm:justify-between">
                <p>Enter the OTP sent to {accountEmail}.</p>
                <button type="button" disabled={isBusy} onClick={sendEmailOtp} className="text-left font-bold text-nova-coral disabled:cursor-not-allowed disabled:opacity-60">
                  Resend OTP
                </button>
              </div>
            </div>
          )}
          <Button disabled={isBusy} className="md:col-span-2" variant="accent">{isBusy ? 'Please wait...' : step === steps.length ? 'Create account' : (isStudent || step === 2) ? 'Send OTP' : 'Continue'}</Button>
        </form>
      </div>
      {clubDetailsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/35" role="dialog" aria-modal="true" aria-labelledby="club-details-title">
          <div className="h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-nova-coral">Verification asset</p>
                <h2 id="club-details-title" className="mt-1 text-2xl font-black text-slate-900">Club Details</h2>
              </div>
              <button type="button" onClick={() => setClubDetailsOpen(false)} className="rounded-lg px-3 py-2 text-sm font-bold text-nova-muted ring-1 ring-slate-200">Close</button>
            </div>
            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-nova-muted">
                Club Name
                <select required value={clubDetails.clubName || ''} onChange={(event) => updateClubDetail('clubName', event.target.value)} className="rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200">
                  <option value="">Select popular club</option>
                  {popularClubs.map((club) => <option key={club} value={club}>{club}</option>)}
                  <option value="Other">Other club not listed</option>
                </select>
              </label>
              {customClubRequired && (
                <label className="grid gap-2 text-sm font-bold text-nova-muted">
                  Enter Club Name
                  <textarea required rows={3} value={clubDetails.customClubName || ''} onChange={(event) => updateClubDetail('customClubName', event.target.value)} className="resize-none rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200" />
                </label>
              )}
              {clubDetailFields.map(([key, label]) => {
                const isPhone = key.toLowerCase().includes('phone');
                return (
                  <label key={key} className="grid gap-2 text-sm font-bold text-nova-muted">
                    {label}
                    {isPhone ? (
                      <div className="flex items-center gap-2 rounded-lg bg-white px-3 ring-1 ring-slate-200">
                        <span className="text-sm font-semibold text-slate-600">+91</span>
                        <input
                          required
                          type="tel"
                          pattern="[6-9][0-9]{9}"
                          title="Enter a 10-digit Indian phone number without the country code."
                          value={clubDetails[key] || ''}
                          onChange={(event) => updateClubDetail(key, event.target.value)}
                          className="min-w-0 flex-1 border-none bg-transparent px-0 py-3 outline-none"
                        />
                      </div>
                    ) : (
                      <input
                        required
                        type="text"
                        value={clubDetails[key] || ''}
                        onChange={(event) => updateClubDetail(key, event.target.value)}
                        className="rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200"
                      />
                    )}
                  </label>
                );
              })}
              <Button
                type="button"
                variant="accent"
                onClick={() => {
                  if (!validateClubDetails()) {
                    return;
                  }
                  setClubDetailsOpen(false);
                  toast.success('Club details added for admin approval.');
                }}
              >
                Submit Club Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
