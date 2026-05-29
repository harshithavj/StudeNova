import { Bookmark, CalendarClock, Eye, Tags, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { daysUntil, formatDate } from '../utils/date';
import Button from './ui/Button';

export default function EventCard({ event }) {
  const saveEvent = () => {
    const stored = JSON.parse(localStorage.getItem('studenova_saved_events') || '[]');
    if (!stored.some((item) => item.id === event.id)) {
      localStorage.setItem('studenova_saved_events', JSON.stringify([...stored, event]));
    }
    toast.success('Saved for later');
  };

  const openRegistration = () => {
    window.open(event.registration_link || `/events/${event.id}`, '_blank', 'noopener,noreferrer');
    toast('Complete registration on the original platform, then mark it completed here.');
  };

  return (
    <motion.article whileHover={{ y: -5 }} className="surface overflow-hidden rounded-lg transition">
      <Link to={`/events/${event.id}`} className="block">
        <img src={event.image_url} alt={event.title} className="h-48 w-full object-cover" />
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
          <span className="flex items-center gap-2"><CalendarClock size={16} />Event: {formatDate(event.date)}</span>
          <span className="flex items-center gap-2"><CalendarClock size={16} />Deadline: {formatDate(event.deadline)}</span>
          <span className="flex items-center gap-2"><Users size={16} />{event.eligibility} / {event.mode}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-nova-coral">{event.registration_status || `${daysUntil(event.deadline)} days left`}</span>
          <Button as={Link} to={`/events/${event.id}`} size="sm" variant="secondary"><Eye size={16} />View Details</Button>
        </div>
        <Button onClick={openRegistration} size="sm" variant="accent" disabled={event.registration_status === 'Closed'}>Register</Button>
      </div>
    </motion.article>
  );
}
