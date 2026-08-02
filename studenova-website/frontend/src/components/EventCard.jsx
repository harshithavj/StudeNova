import { Bookmark, CalendarClock, Eye, Tags, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { daysUntil, formatDate } from '../utils/date';
import Button from './ui/Button';
import api from '../services/api';

function getRegistrationStatus(event) {
  if (event.registration_status) return event.registration_status;
  const deadline = event.deadline || event.registration_deadline;
  if (!deadline) return 'Open';
  const days = daysUntil(deadline);
  if (days <= 0) return 'Closed';
  if (days <= 3) return 'Closing Soon';
  return 'Open';
}

export default function EventCard({ event }) {
  const location = useLocation();
  const linkState = { from: `${location.pathname}${location.search}` };

  const saveEvent = async () => {
    let apiId = event.id;
    if (typeof apiId === 'string' && apiId.startsWith('db-')) {
      apiId = apiId.replace('db-', '');
    }
    try {
      await api.post(`/bookmarks/events/${apiId}`);
      toast.success('Saved for later');
    } catch (error) {
      console.error(error);
      toast.error('Sign in to save this event');
    }
  };

  const openRegistration = () => {
    window.open(event.registration_link || `/events/${event.id}`, '_blank', 'noopener,noreferrer');
    toast('Complete registration on the original platform, then mark it completed here.');
  };

  const imageUrl = event.image_url || event.poster_url || event.event_banner || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80';
  const eventDate = event.date || event.starts_at;
  const eventDeadline = event.deadline || event.registration_deadline;
  const regStatus = getRegistrationStatus(event);

  return (
    <motion.article whileHover={{ y: -5 }} className="surface overflow-hidden rounded-lg transition">
      <Link to={`/events/${event.id}`} state={linkState} className="block">
        <img src={imageUrl} alt={event.title} className="h-48 w-full object-cover" />
      </Link>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="rounded-lg bg-nova-peach px-2.5 py-1 text-xs font-bold text-nova-coral">{event.category}</span>
            <h3 className="mt-3 text-xl font-black">{event.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-nova-muted">{event.description}</p>
          </div>
          <button onClick={saveEvent} className="rounded-lg p-2 text-nova-muted hover:bg-nova-peach hover:text-nova-coral" aria-label="Save event"><Bookmark size={18} /></button>
        </div>
        <div className="grid gap-2 text-sm text-nova-muted">
          <span className="flex flex-wrap gap-2">
            <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">{event.category}</span>
            <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">{event.domain}</span>
          </span>
          <span className="flex items-center gap-2"><Tags size={16} />{event.tags?.join(', ')}</span>
          <span className="flex items-center gap-2"><CalendarClock size={16} />Event: {formatDate(eventDate)}</span>
          <span className="flex items-center gap-2"><CalendarClock size={16} />Deadline: {formatDate(eventDeadline)}</span>
          <span className="flex items-center gap-2"><Users size={16} />{event.eligibility} / {event.mode}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-nova-coral">{regStatus === 'Closed' ? 'Closed' : regStatus === 'Closing Soon' ? 'Closing Soon' : `${daysUntil(eventDeadline)} days left`}</span>
          <Button as={Link} to={`/events/${event.id}`} state={linkState} size="sm" variant="secondary"><Eye size={16} />View Details</Button>
        </div>
        <Button onClick={openRegistration} size="sm" variant="accent" disabled={regStatus === 'Closed'}>Register</Button>
      </div>
    </motion.article>
  );
}
