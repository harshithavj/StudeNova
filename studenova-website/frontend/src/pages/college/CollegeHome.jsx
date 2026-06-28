import { Link } from 'react-router-dom';

export default function CollegeHome() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-nova-coral">Dashboard Home</p>
        <h2 className="mt-2 text-3xl font-black text-slate-900">Everything you need to manage campus events</h2>
        <p className="mt-3 text-sm leading-7 text-nova-muted">
          Create events, track registrations, and monitor participation from one modern workspace designed for college organizers.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Link to="/college/events" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1">
          <p className="text-lg font-black text-slate-900">Manage Events</p>
          <p className="mt-2 text-sm text-nova-muted">Create, edit, or review your event lifecycle from draft to completion.</p>
        </Link>
        <Link to="/college/registrations" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1">
          <p className="text-lg font-black text-slate-900">View Registrations</p>
          <p className="mt-2 text-sm text-nova-muted">Track participant lists and export details for your campus programs.</p>
        </Link>
      </div>
    </div>
  );
}
