import { CalendarPlus, ChevronDown, MapPin, QrCode, Users } from 'lucide-react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import BackButton from '../components/BackButton';
import Breadcrumbs from '../components/Breadcrumbs';
import EventCard from '../components/EventCard';
import Button from '../components/ui/Button';
import { sampleEvents } from '../data/mockData';
import { daysUntil, formatDate } from '../utils/date';

export default function EventDetails() {
  const { id } = useParams();
  const event = sampleEvents.find((item) => String(item.id) === id) || sampleEvents[0];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs />
      <BackButton />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_.65fr]">
        <div className="space-y-6">
          <img src={event.image_url} alt={event.title} className="aspect-[16/8] w-full rounded-lg object-cover shadow-soft" />
          <div>
            <span className="rounded-lg bg-nova-peach px-3 py-1 text-sm font-bold text-nova-coral">{event.category}</span>
            <h1 className="mt-4 text-4xl font-black">{event.title}</h1>
            <p className="mt-3 text-lg leading-8 text-nova-muted">{event.description}</p>
          </div>
          <div className="surface rounded-lg p-6">
            <h2 className="text-2xl font-black">Event details</h2>
            <p className="mt-3 text-nova-muted">Open to undergraduate and postgraduate students from eligible colleges. Industry events may include role-specific screening by organizers.</p>
            <div className="mt-4 flex flex-wrap gap-2">{event.tags.map((tag) => <span key={tag} className="rounded-lg bg-white px-3 py-1 text-sm font-bold text-nova-muted ring-1 ring-slate-200">{tag}</span>)}</div>
          </div>
          <div className="surface rounded-lg p-6">
            <h2 className="text-2xl font-black">FAQ</h2>
            {['Who can register?', 'Will I get calendar reminders?', 'How does QR check-in work?'].map((item) => (
              <details key={item} className="mt-3 rounded-lg bg-white p-4 ring-1 ring-slate-200">
                <summary className="flex cursor-pointer list-none items-center justify-between font-bold">{item}<ChevronDown size={18} /></summary>
                <p className="mt-2 text-sm leading-6 text-nova-muted">Organizers publish verification rules, reminders, and check-in instructions directly through STUDENOVA.</p>
              </details>
            ))}
          </div>
        </div>
        <aside className="space-y-4">
          <div className="surface rounded-lg p-6">
            <h2 className="text-2xl font-black">Register</h2>
            <div className="mt-5 grid gap-3 text-sm text-nova-muted">
              <span className="flex items-center gap-2"><CalendarPlus size={18} />Event: {formatDate(event.date)}</span>
              <span className="flex items-center gap-2"><CalendarPlus size={18} />Deadline: {formatDate(event.deadline)}</span>
              <span className="flex items-center gap-2"><MapPin size={18} />{event.location} / {event.mode}</span>
              <span className="flex items-center gap-2"><Users size={18} />{event.seats_available} seats available</span>
            </div>
            <div className="mt-5 rounded-lg bg-nova-peach p-4 text-sm font-bold text-nova-coral">{daysUntil(event.deadline)} days left to register</div>
            <div className="mt-5 grid gap-3">
              <Button onClick={() => toast.success('Registration request submitted')} variant="accent">Register Now</Button>
              <Button variant="secondary" onClick={() => toast.success('Added to your calendar')}>Export to Google Calendar</Button>
            </div>
          </div>
          <div className="surface rounded-lg p-6">
            <QrCode className="text-nova-coral" />
            <h3 className="mt-3 text-xl font-black">QR check-in ready</h3>
            <p className="mt-2 text-sm text-nova-muted">Organizers can verify attendance with unique registration QR codes from the dashboard.</p>
          </div>
          <div className="surface rounded-lg p-6">
            <h3 className="text-xl font-black">Organizer</h3>
            <p className="mt-2 font-bold">{event.organizer}</p>
            <p className="text-sm text-nova-muted">{event.college}</p>
          </div>
        </aside>
      </div>
      <div className="mt-10">
        <h2 className="mb-4 text-2xl font-black">Similar events</h2>
        <div className="grid gap-5 md:grid-cols-3">{sampleEvents.filter((item) => item.id !== event.id).slice(0, 3).map((item) => <EventCard key={item.id} event={item} />)}</div>
      </div>
    </section>
  );
}
