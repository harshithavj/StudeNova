import { useMemo, useState } from 'react';
import { Filter, Search } from 'lucide-react';
import EventCard from '../components/EventCard';
import StudentShell from '../components/student/StudentShell';
import { useAuth } from '../context/AuthContext';
import { domains, eligibilityOptions, sampleEvents } from '../data/mockData';
import { useEvents } from '../hooks/useEvents';
import { daysUntil } from '../utils/date';
import Skeleton from '../components/ui/Skeleton';

const discoverCategories = [
  'Hackathons',
  'Workshops',
  'Webinars',
  'Coding Challenges',
  'Design Challenges',
  'Competitions',
  'Case Study Competitions',
  'Ideathons',
  'Quizzes',
  'Research Programs',
  'Internship Opportunities',
  'Job Opportunities'
];

const teamSizeOptions = [
  { value: 'individual', label: '1' },
  { value: 'pair', label: '2' },
  { value: 'team', label: '2+' }
];

function matchesTeamSize(eventTeamSize, selectedTeamSize) {
  if (!selectedTeamSize) return true;

  const value = String(eventTeamSize || '').toLowerCase();
  const numbers = value.match(/\d+/g)?.map(Number) || [];
  const min = numbers[0];
  const max = numbers[numbers.length - 1];

  if (selectedTeamSize === 'individual') {
    return value.includes('individual') || (numbers.length === 1 && min === 1);
  }

  if (selectedTeamSize === 'pair') {
    return value.includes('pair') || (numbers.length === 1 && min === 2);
  }

  return value.includes('team') || value.includes('+') || (numbers.length > 1 && max > 2) || (numbers.length === 1 && min > 2);
}

function getRegistrationStatus(event) {
  if (event.registration_status) return event.registration_status;
  const deadline = event.deadline || event.registration_deadline;
  if (!deadline) return 'Open';
  const days = daysUntil(deadline);
  if (days <= 0) return 'Closed';
  if (days <= 3) return 'Closing Soon';
  return 'Open';
}

export default function StudentDiscover() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ q: '', category: '', domain: '', mode: '', eligibility: '', registrationStatus: '', teamSize: '' });
  const { events, loading } = useEvents(filters);
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  const filteredEvents = useMemo(() => events.filter((event) => {
    const q = filters.q.toLowerCase();
    const eventTags = Array.isArray(event.tags) ? event.tags : [];
    const eventOrganizer = event.organizer || event.conducting_organization || event.organizer_name || '';
    const eventDesc = event.description || '';
    const eventTitle = event.title || '';
    const eventDomain = event.domain || '';

    return (!q || `${eventTitle} ${eventTags.join(' ')} ${eventDomain} ${eventDesc} ${eventOrganizer}`.toLowerCase().includes(q))
      && (!filters.category || event.category === filters.category)
      && (!filters.domain || event.domain === filters.domain)
      && (!filters.mode || event.mode?.toLowerCase() === filters.mode?.toLowerCase())
      && (!filters.eligibility || event.eligibility === filters.eligibility)
      && (!filters.registrationStatus || getRegistrationStatus(event) === filters.registrationStatus)
      && matchesTeamSize(event.team_size, filters.teamSize);
  }), [events, filters]);

  return (
    <StudentShell user={user}>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-nova-coral">Discover events</p>
          <h2 className="text-4xl font-black">Find hackathons, challenges, internships, and jobs</h2>
        </div>
        <section className="surface rounded-lg p-4">
          <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <label className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200">
              <Search size={18} className="text-slate-400" />
              <input value={filters.q} onChange={(event) => update('q', event.target.value)} placeholder="Search by event name, tags, skills, domains" className="w-full bg-transparent text-sm outline-none" />
            </label>
            <select value={filters.category} onChange={(event) => update('category', event.target.value)} className="rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-slate-200">
              <option value="">Categories</option>
              {discoverCategories.map((category) => <option key={category}>{category}</option>)}
            </select>
            <select value={filters.domain} onChange={(event) => update('domain', event.target.value)} className="rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-slate-200">
              <option value="">Domains</option>
              {domains.map((domain) => <option key={domain}>{domain}</option>)}
            </select>
            <select value={filters.mode} onChange={(event) => update('mode', event.target.value)} className="rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-slate-200">
              <option value="">Mode</option>
              {['Online', 'Offline', 'Hybrid'].map((mode) => <option key={mode}>{mode}</option>)}
            </select>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
            <select value={filters.eligibility} onChange={(event) => update('eligibility', event.target.value)} className="rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-slate-200">
              <option value="">Eligibility</option>
              {eligibilityOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={filters.registrationStatus} onChange={(event) => update('registrationStatus', event.target.value)} className="rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-slate-200">
              <option value="">Registration Status</option>
              {['Open', 'Closing Soon'].map((status) => <option key={status}>{status}</option>)}
            </select>
            <select value={filters.teamSize} onChange={(event) => update('teamSize', event.target.value)} className="rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-slate-200">
              <option value="">Team Size</option>
              {teamSizeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-nova-coral px-4 py-2 text-sm font-bold text-white"><Filter size={18} />Filter</button>
          </div>
        </section>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-96" />)
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <div className="col-span-full py-10 text-center text-nova-muted font-bold">No events found matching your filters.</div>
          )}
        </div>
      </div>
    </StudentShell>
  );
}
