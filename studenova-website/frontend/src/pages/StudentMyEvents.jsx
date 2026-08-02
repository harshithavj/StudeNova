import { Link } from 'react-router-dom';
import { Clock3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import StudentShell from '../components/student/StudentShell';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/date';
import api from '../services/api';

function EventRow({ event, registrationStatus, eventStatus }) {
  return (
    <article className="rounded-lg bg-white p-4 ring-1 ring-slate-200">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-black">{event.title}</h3>
          <p className="mt-1 text-sm text-nova-muted">{event.category} / {event.domain}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-lg bg-nova-peach px-2 py-1 text-xs font-bold text-nova-coral">{registrationStatus}</span>
          <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">{eventStatus}</span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-nova-muted">
        <span className="flex items-center gap-2"><Clock3 size={16} />Deadline: {formatDate(event.deadline || event.registration_deadline)}</span>
        <Button as={Link} to={`/events/${event.id}`} state={{ from: '/student/my-events' }} size="sm" variant="secondary">Quick Access</Button>
      </div>
    </article>
  );
}

export default function StudentMyEvents() {
  const { user } = useAuth();
  const [saved, setSaved] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    let active = true;
    const loadEvents = async () => {
      try {
        const [savedResponse, registrationsResponse] = await Promise.all([
          api.get('/bookmarks'),
          api.get('/registrations/me')
        ]);
        if (!active) return;
        setSaved(savedResponse.data.items || []);
        setRegistrations(registrationsResponse.data.items || []);
      } catch (error) {
        console.error(error);
      }
    };
    loadEvents();
    const intervalId = window.setInterval(loadEvents, 30000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const registered = registrations.map((registration) => ({
    ...registration.event,
    registration_id: registration.id,
    registration_status: registration.status,
    deadline: registration.event?.registration_deadline
  })).filter((event) => event.id);

  const sections = [
    ['Saved Events', saved, 'Saved', 'Open'],
    ['Registered Events', registered, 'Registered', 'Upcoming'],
    ['Ongoing Events', [], 'Registered', 'Ongoing'],
    ['Completed Events', [], 'Completed', 'Completed'],
    ['Waiting List Events', [], 'Waitlisted', 'Waiting List'],
    ['Cancelled Events', [], 'Cancelled', 'Cancelled']
  ];

  return (
    <StudentShell user={user}>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-nova-coral">My Events</p>
          <h2 className="text-4xl font-black">"Track, Manage, and Attend with Ease"</h2>
        </div>
        {sections.map(([title, events, registrationStatus, eventStatus]) => (
          <section key={title} className="surface rounded-lg p-6">
            <h3 className="text-2xl font-black">{title}</h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {events.length > 0 ? (
                events.map((event) => <EventRow key={`${title}-${event.id}`} event={event} registrationStatus={registrationStatus} eventStatus={eventStatus} />)
              ) : (
                <p className="col-span-full text-sm text-nova-muted font-bold">No events found in this category.</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </StudentShell>
  );
}
