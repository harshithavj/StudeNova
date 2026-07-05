import { ArrowRight, Building2, CalendarDays, CheckCircle2, Sparkles, UsersRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { categories, sampleEvents } from '../data/mockData';
import { daysUntil } from '../utils/date';
import { getCollegeOrganizerPath, isCollegeOrganizer } from '../utils/navigation';

const stats = [
  { label: 'Events indexed', value: '2.4K', icon: CalendarDays },
  { label: 'Partner colleges', value: '180+', icon: Building2 },
  { label: 'Student reach', value: '92K', icon: UsersRound }
];

const mockCards = [
  { title: 'Cloud Careers Internship Drive', meta: 'Aster Cloud / Online', tag: 'Internships' },
  { title: 'Design Systems Workshop', meta: 'Mumbai / Hybrid', tag: 'Workshops' },
  { title: 'NovaHack Inter-College Hackathon', meta: 'Bengaluru / Offline', tag: 'Hackathons' }
];

export default function Home() {
  const { user } = useAuth();

  if (isCollegeOrganizer(user)) {
    return <Navigate to={getCollegeOrganizerPath(user)} replace />;
  }

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-lg bg-nova-peach px-3 py-2 text-sm font-bold text-nova-coral">
              <Sparkles size={18} /> Unified student opportunity ecosystem
            </div>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-black leading-tight text-nova-ink sm:text-6xl lg:text-7xl">STUDENOVA</h1>
              <p className="text-2xl font-semibold text-nova-ink">Never miss an opportunity again.</p>
              <p className="max-w-2xl text-lg leading-8 text-nova-muted">One home for hackathons, internships, workshops, conferences, and opportunities across India.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to="/events" size="lg" variant="accent">Explore Events <ArrowRight size={20} /></Button>
              <Button as={Link} to="/auth/select-role" size="lg" variant="secondary">Join Platform</Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="surface rounded-lg p-4">
                  <Icon className="mb-3 text-nova-coral" />
                  <p className="text-2xl font-black">{value}</p>
                  <p className="text-sm text-nova-muted">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="relative">
            <div className="absolute -left-8 top-12 hidden w-44 rounded-lg bg-white p-4 shadow-coral ring-1 ring-slate-200 lg:block">
              <p className="text-xs font-bold text-nova-coral">Deadline alert</p>
              <p className="mt-1 text-sm font-black">3 events close this week</p>
            </div>
            <div className="surface rounded-lg p-5">
              <div className="rounded-lg bg-gradient-to-br from-nova-peach via-white to-nova-sky p-4">
                <div className="rounded-lg bg-white p-4 shadow-soft">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <p className="text-sm font-bold text-nova-coral">Opportunity command center</p>
                      <p className="text-xs text-nova-muted">Live across colleges and organizers</p>
                    </div>
                    <span className="rounded-lg bg-nova-peach px-2 py-1 text-xs font-bold text-nova-coral">Live</span>
                  </div>
                  <div className="mt-4 grid gap-3">
                    {mockCards.map((card) => (
                      <div key={card.title} className="rounded-lg border border-slate-100 bg-nova-soft p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-black">{card.title}</p>
                            <p className="mt-1 text-sm text-nova-muted">{card.meta}</p>
                          </div>
                          <CheckCircle2 className="text-nova-coral" size={20} />
                        </div>
                        <span className="mt-3 inline-flex rounded-lg bg-white px-2 py-1 text-xs font-bold text-nova-muted ring-1 ring-slate-200">{card.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-nova-coral">Trending now</p>
            <h2 className="text-3xl font-black">Events students are joining</h2>
          </div>
          <Link to="/events" className="text-sm font-bold text-nova-coral">View all</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">{sampleEvents.slice(0, 3).map((event) => <EventCard key={event.id} event={event} />)}</div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-nova-coral">Categories</p>
          <h2 className="mt-2 text-3xl font-black">Academic, cultural, technical, and career opportunities</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => <Link to={`/events?category=${category}`} key={category} className="surface rounded-lg p-4 font-bold transition hover:-translate-y-0.5 hover:border-nova-coral">{category}</Link>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="surface rounded-lg p-6">
          <h2 className="text-2xl font-black">Upcoming deadlines</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {sampleEvents.slice(0, 3).map((event) => (
              <Link to={`/events/${event.id}`} key={event.id} state={{ from: '/' }} className="rounded-lg bg-white p-4 ring-1 ring-slate-200 transition hover:-translate-y-0.5">
                <p className="font-bold">{event.title}</p>
                <p className="mt-2 text-sm text-nova-coral">{daysUntil(event.deadline)} days until registration closes</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
