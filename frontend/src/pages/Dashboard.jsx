import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Bell, Bookmark, BriefcaseBusiness, CalendarDays, ClipboardList, Sparkles, UsersRound } from 'lucide-react';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Breadcrumbs from '../components/Breadcrumbs';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';
import { analytics, sampleEvents } from '../data/mockData';

const roleContent = {
  student: {
    eyebrow: 'Student dashboard',
    cards: [
      { label: 'Registered events', value: 8, icon: CalendarDays },
      { label: 'Saved events', value: 14, icon: Bookmark },
      { label: 'Unread alerts', value: 5, icon: Bell },
      { label: 'Smart matches', value: 11, icon: Sparkles }
    ],
    panelTitle: 'Recommended for you'
  },
  'college-organizer': {
    eyebrow: 'College organizer dashboard',
    cards: [
      { label: 'Managed events', value: 18, icon: ClipboardList },
      { label: 'Registrations', value: 1420, icon: UsersRound },
      { label: 'Pending approvals', value: 6, icon: Bell },
      { label: 'Avg attendance', value: '78%', icon: CalendarDays }
    ],
    panelTitle: 'Active campus events'
  },
  'industry-organizer': {
    eyebrow: 'Industry organizer dashboard',
    cards: [
      { label: 'Recruitment drives', value: 7, icon: BriefcaseBusiness },
      { label: 'Candidates', value: 640, icon: UsersRound },
      { label: 'Internship posts', value: 12, icon: ClipboardList },
      { label: 'Shortlists', value: 96, icon: Sparkles }
    ],
    panelTitle: 'Talent pipeline'
  }
};

export default function Dashboard() {
  const { user } = useAuth();
  const { roleType = user?.role === 'college_admin' ? 'college-organizer' : user?.role === 'industry_organizer' ? 'industry-organizer' : 'student' } = useParams();
  const content = roleContent[roleType] || roleContent.student;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs />
      <BackButton />
      <div className="mb-8 mt-6">
        <p className="text-sm font-bold uppercase tracking-wider text-nova-coral">{content.eyebrow}</p>
        <h1 className="text-4xl font-black">Hi, {user?.name || 'there'}</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {content.cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="surface rounded-lg p-5">
            <Icon className="text-nova-coral" />
            <p className="mt-4 text-3xl font-black">{value}</p>
            <p className="text-sm text-nova-muted">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
        <div className="surface rounded-lg p-5">
          <h2 className="text-2xl font-black">Participation analytics</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.25)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar dataKey="registrations" fill="#FF5F6D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-black">{content.panelTitle}</h2>
          <div className="grid gap-4 md:grid-cols-2">{sampleEvents.slice(0, 2).map((event) => <EventCard key={event.id} event={event} />)}</div>
        </div>
      </div>
    </section>
  );
}
