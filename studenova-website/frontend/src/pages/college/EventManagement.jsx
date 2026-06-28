import { Edit, Eye, Plus, Trash2, TrendingUp } from 'lucide-react';

const sampleEvents = [
  { id: 1, title: 'HackSprint 2026', status: 'approved', registrations: 64, views: 1020, date: '2026-08-05' },
  { id: 2, title: 'Campus Career Fair', status: 'pending', registrations: 18, views: 430, date: '2026-08-20' }
];

export default function EventManagement() {
  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-nova-coral">Event Management</p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">My Events</h2>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-nova-coral px-4 py-2 text-sm font-bold text-white">
          <Plus size={16} /> Create Event
        </button>
      </div>
      <div className="mt-6 grid gap-4">
        {sampleEvents.map((event) => (
          <div key={event.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">{event.title}</h3>
                  <span className="rounded-full bg-nova-peach px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-nova-coral">{event.status}</span>
                </div>
                <p className="mt-2 text-sm text-nova-muted">{event.date}</p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-nova-muted">
                <span>Registrations: {event.registrations}</span>
                <span>Views: {event.views}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"> <Eye size={15} className="mr-1 inline" /> View</button>
                <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"> <Edit size={15} className="mr-1 inline" /> Edit</button>
                <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"> <TrendingUp size={15} className="mr-1 inline" /> Analytics</button>
                <button className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600"> <Trash2 size={15} className="mr-1 inline" /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
