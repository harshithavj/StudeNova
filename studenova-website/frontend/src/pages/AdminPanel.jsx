import { Edit, Plus, Trash2, Users } from 'lucide-react';
import BackButton from '../components/BackButton';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/ui/Button';
import { sampleEvents } from '../data/mockData';

export default function AdminPanel() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs />
      <BackButton />
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-4xl font-black">Organizer Admin Panel</h1>
          <p className="mt-2 text-nova-muted">Create events, manage registrations, post internship drives, and review analytics.</p>
        </div>
        <Button variant="accent"><Plus size={18} />Create event</Button>
      </div>
      <div className="surface overflow-hidden rounded-lg">
        <div className="grid grid-cols-[1.4fr_.7fr_.7fr_.5fr] gap-3 border-b border-slate-200 p-4 text-sm font-bold text-slate-500">
          <span>Event</span><span>Category</span><span>Registrations</span><span>Actions</span>
        </div>
        {sampleEvents.map((event) => (
          <div key={event.id} className="grid grid-cols-[1.4fr_.7fr_.7fr_.5fr] items-center gap-3 border-b border-slate-200 p-4 last:border-0">
            <div>
              <p className="font-bold">{event.title}</p>
              <p className="text-sm text-slate-500">{event.organizer}</p>
            </div>
            <span className="text-sm">{event.category}</span>
            <span className="flex items-center gap-2 text-sm"><Users size={16} />{event.registrations_count}</span>
            <span className="flex gap-2">
              <button className="rounded-lg p-2 hover:bg-slate-100" aria-label="Edit"><Edit size={17} /></button>
              <button className="rounded-lg p-2 text-nova-coral hover:bg-rose-50" aria-label="Delete"><Trash2 size={17} /></button>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
