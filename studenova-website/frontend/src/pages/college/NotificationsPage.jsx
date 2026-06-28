import { BellRing } from 'lucide-react';

const items = [
  { title: 'Event approved', body: 'HackSprint 2026 has been approved for publishing.', time: '10 min ago' },
  { title: 'Registration milestone', body: 'Your event crossed 50 registrations.', time: '1 hour ago' },
  { title: 'Upcoming event reminder', body: 'Campus Career Fair begins tomorrow.', time: '2 hours ago' }
];

export default function NotificationsPage() {
  return (
    <section>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-nova-coral">Notifications</p>
        <h2 className="mt-2 text-3xl font-black text-slate-900">Latest updates</h2>
      </div>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.title} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-nova-peach text-nova-coral">
              <BellRing size={18} />
            </div>
            <div>
              <p className="font-black text-slate-900">{item.title}</p>
              <p className="mt-1 text-sm text-nova-muted">{item.body}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
