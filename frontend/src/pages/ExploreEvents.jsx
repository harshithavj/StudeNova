import { useMemo, useState } from 'react';
import EventCard from '../components/EventCard';
import SearchFilters from '../components/SearchFilters';
import Breadcrumbs from '../components/Breadcrumbs';
import Skeleton from '../components/ui/Skeleton';
import { useEvents } from '../hooks/useEvents';

function matchesTeamSize(eventTeamSize, selectedTeamSize) {
  if (!selectedTeamSize) return true;
  const value = String(eventTeamSize || '').toLowerCase();
  const numbers = value.match(/\d+/g)?.map(Number) || [];
  const min = numbers[0];
  const max = numbers[numbers.length - 1];

  if (selectedTeamSize === '1') {
    return value.includes('individual') || (numbers.length === 1 && min === 1);
  }
  if (selectedTeamSize === '2') {
    return value.includes('pair') || (numbers.length === 1 && min === 2);
  }
  return value.includes('+') || value.includes('team') || (numbers.length > 1 && max >= 2) || (numbers.length === 1 && min >= 2);
}

export default function ExploreEvents() {
  const [filters, setFilters] = useState({ q: '', category: '', domain: '', mode: '', eligibility: '', registrationStatus: '', teamSize: '' });
  const { events, loading } = useEvents(filters);
  const filtered = useMemo(() => events.filter((event) => {
    const q = filters.q.toLowerCase();
    return (!q || `${event.title} ${event.tags?.join(' ')} ${event.organizer}`.toLowerCase().includes(q))
      && (!filters.category || event.category === filters.category)
      && (!filters.domain || event.domain === filters.domain)
      && (!filters.mode || event.mode === filters.mode)
      && (!filters.eligibility || event.eligibility === filters.eligibility)
      && (!filters.registrationStatus || event.registration_status === filters.registrationStatus)
      && matchesTeamSize(event.team_size, filters.teamSize);
  }), [events, filters]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    return (b.registrations_count || 0) - (a.registrations_count || 0);
  }), [filtered]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs />
      <div className="mb-6">
        <h1 className="text-4xl font-black">Explore Events</h1>
        <p className="mt-2 text-nova-muted">"Discover events that match your interests"</p>
      </div>
      <SearchFilters filters={filters} setFilters={setFilters} />
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {loading ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-96" />) : sorted.map((event) => <EventCard key={event.id} event={event} />)}
      </div>
      {!loading && sorted.length > 0 && <div className="mt-8 flex justify-center"><button className="rounded-lg bg-white px-5 py-3 text-sm font-bold text-nova-muted ring-1 ring-slate-200">Load more opportunities</button></div>}
    </section>
  );
}
