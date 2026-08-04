import { CalendarPlus, ChevronDown, ExternalLink, IndianRupee, MapPin, QrCode, ShieldCheck, Users } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import BackButton from '../components/BackButton';
import Breadcrumbs from '../components/Breadcrumbs';
import EventCard from '../components/EventCard';
import Button from '../components/ui/Button';
import { useEvents } from '../hooks/useEvents';
import { daysUntil, formatDate } from '../utils/date';
import api from '../services/api';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { events: similarDbEvents } = useEvents(
    event ? { category: event.category } : {}
  );
  const similarEvents = similarDbEvents.filter((item) => String(item.id) !== String(event?.id)).slice(0, 3);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    let apiId = id;
    if (typeof id === 'string' && id.startsWith('db-')) {
      apiId = id.replace('db-', '');
    }

    api.get(`/events/${apiId}`)
      .then(({ data }) => {
        if (active) {
          setEvent({
            ...data,
            id: `db-${data.id}`,
            date: data.starts_at,
            deadline: data.registration_deadline,
            image_url: data.poster_url || data.event_banner || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80'
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  const markRegistered = () => {
    if (!event) return;

    let apiId = event.id;
    if (typeof apiId === 'string' && apiId.startsWith('db-')) {
      apiId = apiId.replace('db-', '');
    }

    api.post(`/registrations/events/${apiId}/complete-external`, {
      external_platform: 'External',
      external_registration_url: event.registration_link || ''
    })
      .then(() => {
        toast.success('Added to My Events, calendar, and deadline alerts');
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to update registration status on the server.');
      });
  };

  const openRegistration = async () => {
    if (!event) return;
    let apiId = event.id;
    if (typeof apiId === 'string' && apiId.startsWith('db-')) {
      apiId = apiId.replace('db-', '');
    }

    window.open(event.registration_link || '#', '_blank', 'noopener,noreferrer');
    try {
      await api.post(`/bookmarks/events/${apiId}`);
      toast.success('Registration opened and deadline alerts are enabled.');
    } catch (error) {
      console.error(error);
      toast('Registration opens on the original event platform. Sign in to receive deadline alerts.');
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs />
        <BackButton />
        <div className="mt-10 flex flex-col items-center justify-center py-20">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-nova-coral border-t-transparent"></div>
          <p className="mt-4 font-bold text-nova-muted">Loading event details...</p>
        </div>
      </section>
    );
  }

  if (error || !event) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs />
        <BackButton />
        <div className="mt-10 text-center py-20">
          <h2 className="text-2xl font-black text-red-500">Event Not Found</h2>
          <p className="mt-2 text-nova-muted">We couldn't retrieve the details for this event.</p>
        </div>
      </section>
    );
  }

  const imageUrl = event.image_url || event.poster_url || event.event_banner || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80';
  const eventDate = event.date || event.starts_at;
  const eventDeadline = event.deadline || event.registration_deadline;
  const organizer = event.organizer || event.conducting_organization || event.organizer_name || 'STUDENOVA Partner';
  const tags = Array.isArray(event.tags) ? event.tags : [];
  const status = event.registration_status || (daysUntil(eventDeadline) > 0 ? 'Open' : 'Closed');

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs />
      <BackButton />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_.65fr]">
        <div className="space-y-6">
          <img src={imageUrl} alt={event.title} className="aspect-[16/8] w-full rounded-lg object-cover shadow-soft" />
          <div>
            <span className="rounded-lg bg-nova-peach px-3 py-1 text-sm font-bold text-nova-coral">{event.category}</span>
            <h1 className="mt-4 text-4xl font-black">{event.title}</h1>
            <p className="mt-3 text-lg leading-8 text-nova-muted">{event.description}</p>
          </div>
          <div className="surface rounded-lg p-6">
            <h2 className="text-2xl font-black">Event details</h2>
            <p className="mt-3 text-nova-muted">This page is the single source of event information for rules, eligibility, team requirements, location, schedule, prizes, and organizer contact details.</p>
            <div className="mt-4 flex flex-wrap gap-2">{tags.map((tag) => <span key={tag} className="rounded-lg bg-white px-3 py-1 text-sm font-bold text-nova-muted ring-1 ring-slate-200">{tag}</span>)}</div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['Rules and guidelines', 'Submit original work, respect team-size limits, and follow organizer-specific judging rules published on the external platform.'],
              ['Complete schedule', `${formatDate(eventDate)} kickoff, mentor checkpoints during the event, final submission before the listed end window.`],
              ['Venue / location', `${event.location} / ${event.mode}`],
              ['Contact information', `${organizer} support desk and official event discussion channel.`],
              ['Prize information', event.prize_pool ? `Prize pool of Rs. ${Number(event.prize_pool).toLocaleString('en-IN')}` : 'Recognition, certificates, and recruiter visibility.'],
              ['Team requirements', `Team size: ${event.team_size}. Eligibility: ${event.eligibility}.`]
            ].map(([title, body]) => (
              <div key={title} className="surface rounded-lg p-5">
                <h3 className="font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-nova-muted">{body}</p>
              </div>
            ))}
          </div>
          <div className="surface rounded-lg p-6">
            <h2 className="text-2xl font-black">FAQ</h2>
            {['Who can register?', 'Will I get calendar reminders?', 'Where does registration happen?', 'Can I upload certificates after the event?'].map((item) => (
              <details key={item} className="mt-3 rounded-lg bg-white p-4 ring-1 ring-slate-200">
                <summary className="flex cursor-pointer list-none items-center justify-between font-bold">{item}<ChevronDown size={18} /></summary>
                <p className="mt-2 text-sm leading-6 text-nova-muted">Registration happens on the original event platform. STUDENOVA tracks your saved status, reminders, certificates, achievements, and personal calendar after you mark registration completed.</p>
              </details>
            ))}
          </div>
        </div>
        <aside className="space-y-4">
          <div className="surface rounded-lg p-6">
            <h2 className="text-2xl font-black">Register</h2>
            <div className="mt-5 grid gap-3 text-sm text-nova-muted">
              <span className="flex items-center gap-2"><CalendarPlus size={18} />Event: {formatDate(eventDate)}</span>
              <span className="flex items-center gap-2"><CalendarPlus size={18} />Deadline: {formatDate(eventDeadline)}</span>
              <span className="flex items-center gap-2"><MapPin size={18} />{event.location} / {event.mode}</span>
              <span className="flex items-center gap-2"><ShieldCheck size={18} />{event.eligibility}</span>
              <span className="flex items-center gap-2"><IndianRupee size={18} />{event.prize_pool ? `Rs. ${Number(event.prize_pool).toLocaleString('en-IN')}` : 'No cash prize listed'}</span>
              <span className="flex items-center gap-2"><Users size={18} />{event.seats_available} seats available</span>
            </div>
            <div className="mt-5 rounded-lg bg-nova-peach p-4 text-sm font-bold text-nova-coral">{daysUntil(eventDeadline)} days left to register</div>
            <div className="mt-5 grid gap-3">
              <Button onClick={openRegistration} variant="accent" disabled={status === 'Closed'}>
                {status === 'Closed' ? 'Registration Closed' : <><ExternalLink size={16} />Register on Original Platform</>}
              </Button>
              {status !== 'Closed' && (
                <>
                  <Button variant="secondary" onClick={markRegistered}>Mark Registration Completed</Button>
                  <Button variant="secondary" onClick={() => toast.success('Added to your calendar')}>Export to Google Calendar</Button>
                </>
              )}
            </div>
          </div>
          <div className="surface rounded-lg p-6">
            <QrCode className="text-nova-coral" />
            <h3 className="mt-3 text-xl font-black">QR check-in ready</h3>
            <p className="mt-2 text-sm text-nova-muted">Organizers can verify attendance with unique registration QR codes from the dashboard.</p>
          </div>
          <div className="surface rounded-lg p-6">
            <h3 className="text-xl font-black">Organizer</h3>
            <p className="mt-2 font-bold">{organizer}</p>
            <p className="text-sm text-nova-muted">{event.college || 'STUDENOVA Partner'}</p>
          </div>
        </aside>
      </div>
      {similarEvents.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-black">Similar events</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {similarEvents.map((item) => <EventCard key={item.id} event={item} />)}
          </div>
        </div>
      )}
    </section>
  );
}
