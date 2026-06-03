import BackButton from '../components/BackButton';
import Breadcrumbs from '../components/Breadcrumbs';

export default function About() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <Breadcrumbs />
      <BackButton />
      <h1 className="text-4xl font-black">About STUDENOVA</h1>
      <p className="mt-5 text-lg leading-8 text-nova-muted">STUDENOVA centralizes scattered event announcements into a single discovery and management platform. Students find opportunities faster, colleges increase participation, and industry organizers reach interested talent with structured analytics.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {['Unified discovery', 'Role-based dashboards', 'Smart reminders'].map((item) => <div key={item} className="surface rounded-lg p-5 text-xl font-black">{item}</div>)}
      </div>
    </section>
  );
}
