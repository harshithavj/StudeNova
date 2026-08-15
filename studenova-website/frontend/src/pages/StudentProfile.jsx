import { useEffect, useRef, useState } from 'react';
import { Edit, Github, Linkedin, Save, Upload, UserRound, Camera, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import StudentShell from '../components/student/StudentShell';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ENGINEERING_DOMAINS = {
  'Computer Science & IT': [
    'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'TypeScript', 'JavaScript', 
    'HTML/CSS', 'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Express.js', 
    'Django', 'Flask', 'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Git & GitHub', 
    'Docker', 'Kubernetes', 'Cloud Computing', 'AWS', 'Azure', 'GCP', 'Linux/Unix', 
    'CI/CD', 'API Development', 'GraphQL', 'Cybersecurity', 'Data Structures & Algorithms', 
    'System Design'
  ],
  'Artificial Intelligence & Data Science': [
    'Python', 'R', 'Machine Learning', 'Deep Learning', 'Data Analysis', 
    'Data Visualization', 'Pandas', 'NumPy', 'Scikit-Learn', 'TensorFlow', 
    'PyTorch', 'Keras', 'Hadoop', 'Spark', 'Natural Language Processing', 
    'Computer Vision', 'LLMs', 'Prompt Engineering', 'Reinforcement Learning', 
    'Generative AI', 'Feature Engineering', 'Data Warehousing', 'MLOps', 'SQL'
  ],
  'Electronics & Communication': [
    'Embedded Systems', 'Arduino', 'Raspberry Pi', 'VLSI Design', 'Verilog', 
    'VHDL', 'FPGA Design', 'Microcontrollers', 'MATLAB', 'PCB Design', 'IoT', 
    'Signal Processing', 'DSP (Digital Signal Processing)', 'RF Engineering', 
    'Antenna Design', 'Analog Electronics', 'Digital Electronics', 'Oscilloscopes', 
    'Wireless Networks', 'Communication Systems'
  ],
  'Electrical Engineering': [
    'Circuit Design', 'Power Systems', 'Power Electronics', 'Smart Grid', 
    'SCADA', 'High Voltage Engineering', 'Microgrid Systems', 'Energy Auditing', 
    'MATLAB', 'LabVIEW', 'PLC Programming', 'Control Systems', 'Electrical Machines', 
    'Renewable Energy Systems', 'AutoCAD Electrical', 'Electrical Simulation'
  ],
  'Mechanical Engineering': [
    'AutoCAD', 'SolidWorks', 'CATIA', 'Fusion 360', 'ANSYS', 'Finite Element Analysis', 
    'CAD/CAM', 'CNC Programming', 'Robotic Systems', 'HVAC Design', 'Thermodynamics', 
    'Fluid Mechanics', 'GD&T (Geometric Dimensioning and Tolerancing)', 
    'Aerodynamics', 'Kinematics', 'Manufacturing Processes', '3D Printing'
  ],
  'Civil Engineering': [
    'AutoCAD', 'STAAD.Pro', 'Revit', 'ETABS', 'Surveying', 'Structural Analysis', 
    'Construction Management', 'Building Information Modeling', 'GIS (Geographic Information Systems)', 
    'Geotechnical Engineering', 'Transportation Engineering', 'Hydraulics', 
    'Concrete Technology', 'Primavera P6', 'Estimation & Costing'
  ],
  'Chemical Engineering': [
    'Aspen HYSYS', 'MATLAB', 'Process Simulation', 'Process Control', 
    'Chemical Process Design', 'Heat Transfer', 'Mass Transfer', 'Fluid Dynamics', 
    'Thermodynamics', 'Reaction Kinetics', 'Petrochemical Processing', 'Water Treatment', 
    'Safety Engineering', 'Biochemical Engineering'
  ],
  'Biomedical Engineering': [
    'MATLAB', 'Medical Imaging', 'Bioinstrumentation', 'Biomedical Signal Processing', 
    'CAD', 'Biomaterials', 'Python', 'Biomechanics', 'Tissue Engineering', 
    'Medical Devices', 'Bioinformatics', 'Rehabilitation Engineering', 'Clinical Engineering'
  ],
  'Aerospace Engineering': [
    'CATIA', 'ANSYS', 'MATLAB', 'Aerodynamics', 'Flight Mechanics', 'CAD', 
    'Computational Fluid Dynamics', 'Propulsion Systems', 'Orbital Mechanics', 
    'Avionics', 'Structural Analysis', 'Aircraft Design', 'Spacecraft Dynamics'
  ],
  'Industrial Engineering': [
    'AutoCAD', 'SolidWorks', 'Operations Research', 'Supply Chain Management', 
    'Quality Control', 'Lean Manufacturing', 'Data Analysis', 'Six Sigma', 
    'Systems Engineering', 'Facility Layout', 'Project Management', 'Logistics', 
    'Ergonomics', 'Inventory Control'
  ]
};

function MultiSelect({ label, options, value, onChange, placeholder, disabled = false }) {
  const toggleOption = (option) => {
    onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option]);
  };

  return (
    <label className="grid gap-2 text-sm font-bold text-nova-muted">
      {label}
      <details className={`group relative ${disabled ? 'pointer-events-none opacity-60' : ''}`}>
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between rounded-lg bg-white px-4 py-3 text-nova-ink ring-1 ring-slate-200 marker:content-none">
          <span className={value.length ? 'truncate pr-2' : 'text-slate-400'} title={value.join(', ')}>
            {value.length ? value.join(', ') : placeholder}
          </span>
          <span className="ml-3 text-xs transition group-open:rotate-180">▼</span>
        </summary>
        <div className="absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-lg bg-white p-2 shadow-lg ring-1 ring-slate-200">
          {options.map((option) => (
            <label key={option} className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-nova-ink hover:bg-slate-50">
              <input
                type="checkbox"
                checked={value.includes(option)}
                onChange={() => toggleOption(option)}
                className="h-4 w-4 accent-nova-coral"
              />
              {option}
            </label>
          ))}
        </div>
      </details>
    </label>
  );
}

export default function StudentProfile() {
  const { user, updateUser, updateProfile, loading } = useAuth();
  const formRef = useRef(null);
  const [domains, setDomains] = useState([]);
  const [skills, setSkills] = useState([]);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    setDomains(user?.profile?.domains || []);
    setSkills(user?.profile?.skills || []);
  }, [user]);

  const availableSkills = [...new Set(domains.flatMap((domain) => ENGINEERING_DOMAINS[domain] || []))].sort();

  const handleDomainChange = (selectedDomains) => {
    setDomains(selectedDomains);
    const selectedDomainSkills = new Set(selectedDomains.flatMap((domain) => ENGINEERING_DOMAINS[domain] || []));
    setSkills((currentSkills) => currentSkills.filter((skill) => selectedDomainSkills.has(skill)));
  };
  
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
          interests: [],
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
            <div className="rounded-lg bg-white p-5 text-center ring-1 ring-slate-200 flex flex-col items-center">
              <div className="relative group">
                <div className="mx-auto h-28 w-28 overflow-hidden rounded-lg bg-nova-peach text-nova-coral flex items-center justify-center ring-4 ring-nova-peach/30">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <UserRound size={48} />
                  )}
                </div>
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                    <Loader2 className="animate-spin text-white" size={24} />
                  </div>
                )}
              </div>
              <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold ring-1 ring-slate-200 hover:bg-slate-50 transition active:scale-95">
                <Camera size={16} />Change Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
              </label>
            </div>
            <form ref={formRef} className="grid gap-4 md:grid-cols-2" onSubmit={handleUpdateProfile}>
              {[
                ['Full Name', user?.name || '', 'fullName'],
                ['Phone Number', user?.phone_number || '', 'phoneNumber'],
                ['Address', user?.address || '', 'address'],
                ['College Name', user?.college || '', 'collegeName'],
                ['Department', user?.profile?.department || '', 'department'],
                ['Academic Year', user?.profile?.academic_year || '', 'academicYear']
              ].map(([label, value, nameAttr]) => (
                <label key={label} className="grid gap-2 text-sm font-bold text-nova-muted">
                  {label}
                  <input name={nameAttr} defaultValue={value} className="rounded-lg bg-white px-4 py-3 text-nova-ink ring-1 ring-slate-200" />
                </label>
              ))}
              <MultiSelect
                label="Domains of Interest"
                options={Object.keys(ENGINEERING_DOMAINS)}
                value={domains}
                onChange={handleDomainChange}
                placeholder="Select one or more domains"
              />
              <MultiSelect
                label="Skills"
                options={availableSkills}
                value={skills}
                onChange={setSkills}
                placeholder={domains.length ? 'Select one or more skills' : 'Select domains first'}
                disabled={!domains.length}
              />
              {[
                ['Portfolio Website', user?.profile?.portfolio_url || '', 'portfolioWebsite'],
                ['GitHub Profile URL', user?.profile?.github_url || '', 'githubUrl'],
                ['LinkedIn Profile URL', user?.profile?.linkedin_url || '', 'linkedinUrl']
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
      </div>
    </StudentShell>
  );
}
