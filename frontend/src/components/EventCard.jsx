import { Bookmark, CalendarClock, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { daysUntil, formatDate } from '../utils/date';
import Button from './ui/Button';

export default function EventCard({ event }) {
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
          <button className="rounded-lg p-2 text-nova-muted hover:bg-nova-peach hover:text-nova-coral" aria-label="Save event"><Bookmark size={18} /></button>
        </div>
        <div className="grid gap-2 text-sm text-nova-muted">
          <span className="flex items-center gap-2"><CalendarClock size={16} />{formatDate(event.date)}</span>
          <span className="flex items-center gap-2"><MapPin size={16} />{event.location} / {event.mode}</span>
          <span className="flex items-center gap-2"><Users size={16} />{event.registrations_count} registered / {event.seats_available} seats</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-nova-coral">{daysUntil(event.deadline)} days left</span>
          <Button as={Link} to={`/events/${event.id}`} size="sm" variant="secondary">View Details</Button>
        </div>
      </div>
    </motion.article>
  );
}
