import { Building2, GraduationCap, Landmark, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Breadcrumbs from '../components/Breadcrumbs';

const roles = [
  {
    title: 'Student',
    to: '/signup/student',
    icon: GraduationCap,
    description: 'Discover events, save deadlines, register faster, and get opportunity reminders.',
    features: ['Personal recommendations', 'Saved events', 'Registration history']
  },
  {
    title: 'College Organizer',
    to: '/signup/college-organizer',
    icon: Landmark,
    description: 'Publish campus events, verify registrations, and measure student participation.',
    features: ['Event approvals', 'College branding', 'Participation analytics']
  },
  {
    title: 'Industry Organizer',
    to: '/signup/industry-organizer',
    icon: Building2,
    description: 'Run recruitment drives, internships, workshops, and talent discovery programs.',
    features: ['Candidate pipeline', 'Drive analytics', 'Company profile']
  }
];

export default function RoleSelection() {
  const location = useLocation();
  const linkState = { from: location.pathname };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs />
      <BackButton />
      <div className="mt-8 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wider text-nova-coral">Choose your onboarding path</p>
        <h1 className="mt-2 text-4xl font-black">Join STUDENOVA as the role that fits <span className="whitespace-nowrap">your work.</span></h1>
        <p className="mt-3 text-nova-muted">Each workspace gets a focused dashboard, permissions, and API access for its use case.</p>
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {roles.map(({ title, to, icon: Icon, description, features }) => (
          <Link key={title} to={to} state={linkState} className="surface group rounded-lg p-6 transition hover:-translate-y-1 hover:border-nova-coral">
            <div className="grid h-14 w-14 place-items-center rounded-lg bg-nova-peach text-nova-coral">
              <Icon size={28} />
            </div>
            <h2 className="mt-6 text-2xl font-black">{title}</h2>
            <p className="mt-3 leading-7 text-nova-muted">{description}</p>
            <div className="mt-5 grid gap-2">
              {features.map((feature) => <span key={feature} className="rounded-lg bg-nova-soft px-3 py-2 text-sm font-semibold text-nova-muted">{feature}</span>)}
            </div>
            <span className="mt-6 inline-flex items-center gap-2 font-bold text-nova-coral">Continue <ArrowRight size={18} className="transition group-hover:translate-x-1" /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
