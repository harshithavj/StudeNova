import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Award, BookOpenCheck, CalendarDays, Flame } from 'lucide-react';
import StudentShell from '../components/student/StudentShell';
import { useAuth } from '../context/AuthContext';
import { sampleEvents } from '../data/mockData';
import { formatDate } from '../utils/date';

const monthlyStats = [
  { name: 'Jan', events: 2 },
  { name: 'Feb', events: 4 },
  { name: 'Mar', events: 3 },
  { name: 'Apr', events: 6 },
  { name: 'May', events: 5 },
  { name: 'Jun', events: 7 }
];

const domainStats = [
  { name: 'AI/ML', value: 34, color: '#0ea5e9' },
  { name: 'Design', value: 22, color: '#f97316' },
  { name: 'Cloud', value: 18, color: '#22c55e' },
  { name: 'Business', value: 14, color: '#a855f7' }
];

function MiniStat({ icon: Icon, label, value }) {
  return <div className="rounded-lg bg-white p-4 ring-1 ring-slate-200"><Icon className="text-nova-coral" /><p className="mt-3 text-2xl font-black">{value}</p><p className="text-sm text-nova-muted">{label}</p></div>;
}

export default function StudentHistory() {
  const { user } = useAuth();
  const lists = [
    ['Registered Events', sampleEvents.slice(0, 3)],
    ['Attended Events', sampleEvents.slice(2, 5)],
    ['Cancelled Events', sampleEvents.slice(5, 6)]
  ];

  return (
    <StudentShell user={user}>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-nova-coral">History</p>
          <h2 className="text-4xl font-black">Participation record and analytics</h2>
        </div>
        <section className="surface rounded-lg p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <MiniStat icon={CalendarDays} label="Total Events Participated" value="26" />
            <MiniStat icon={BookOpenCheck} label="Registered Events" value="18" />
            <MiniStat icon={Award} label="Domains Covered" value="8" />
            <MiniStat icon={Flame} label="Participation Streak" value="10" />
          </div>
        </section>
        {lists.map(([title, events]) => (
          <section key={title} className="surface rounded-lg p-6">
            <h3 className="text-2xl font-black">{title}</h3>
            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {events.map((event) => <div key={`${title}-${event.id}`} className="rounded-lg bg-white p-4 ring-1 ring-slate-200"><p className="font-black">{event.title}</p><p className="text-sm text-nova-muted">{formatDate(event.date)}</p></div>)}
            </div>
          </section>
        ))}
        <section className="grid gap-6 lg:grid-cols-[1fr_.8fr]">
          <div className="surface rounded-lg p-6">
            <h3 className="text-2xl font-black">Monthly Participation Trend</h3>
            <div className="mt-4 h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={monthlyStats}><CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.25)" /><XAxis dataKey="name" stroke="#64748b" fontSize={12} /><YAxis stroke="#64748b" fontSize={12} /><Tooltip /><Bar dataKey="events" fill="#ff5f6d" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
          </div>
          <div className="surface rounded-lg p-6">
            <h3 className="text-2xl font-black">Domain-wise Participation</h3>
            <div className="mt-4 h-72"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={domainStats} dataKey="value" nameKey="name" innerRadius={58} outerRadius={96}>{domainStats.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
          </div>
        </section>
      </div>
    </StudentShell>
  );
}
