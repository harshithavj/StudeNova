import { useMemo, useState } from 'react';
import EventCard from '../components/EventCard';
import SearchFilters from '../components/SearchFilters';
import Breadcrumbs from '../components/Breadcrumbs';
import Skeleton from '../components/ui/Skeleton';
import { useEvents } from '../hooks/useEvents';

export default function ExploreEvents() {
  const [filters, setFilters] = useState({ q: '', category: '', location: '', sort: 'trending' });
  const { events, loading } = useEvents(filters);
  const filtered = useMemo(() => events.filter((event) => {
    const q = filters.q.toLowerCase();
    return (!q || `${event.title} ${event.tags?.join(' ')} ${event.organizer}`.toLowerCase().includes(q))
      && (!filters.category || event.category === filters.category)
      && (!filters.location || event.location.toLowerCase().includes(filters.location.toLowerCase()));
  }), [events, filters]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs />
      <div className="mb-6">
        <h1 className="text-4xl font-black">Explore Events</h1>
        <p className="mt-2 text-nova-muted">Search across colleges, companies, categories, locations, dates, and deadlines.</p>
      </div>
      <SearchFilters filters={filters} setFilters={setFilters} />
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {loading ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-96" />) : filtered.map((event) => <EventCard key={event.id} event={event} />)}
      </div>
      {!loading && filtered.length > 0 && <div className="mt-8 flex justify-center"><button className="rounded-lg bg-white px-5 py-3 text-sm font-bold text-nova-muted ring-1 ring-slate-200">Load more opportunities</button></div>}
    </section>
  );
}
