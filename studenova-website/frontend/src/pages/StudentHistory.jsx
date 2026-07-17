import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Award, BookOpenCheck, CalendarDays, Flame } from 'lucide-react';
import StudentShell from '../components/student/StudentShell';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/date';

const monthlyStats = [];
const domainStats = [];

function MiniStat({ icon: Icon, label, value }) {
  return <div className="rounded-lg bg-white p-4 ring-1 ring-slate-200"><Icon className="text-nova-coral" /><p className="mt-3 text-2xl font-black">{value}</p><p className="text-sm text-nova-muted">{label}</p></div>;
}

export default function StudentHistory() {
  const { user } = useAuth();
  let registered = [];
  try {
    registered = JSON.parse(localStorage.getItem('studenova_student_events') || '[]');
  } catch {
    registered = [];
  }

  const lists = [
    ['Registered Events', registered],
    ['Attended Events', []],
    ['Cancelled Events', []]
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
            <MiniStat icon={CalendarDays} label="Total Events Participated" value="0" />
            <MiniStat icon={BookOpenCheck} label="Registered Events" value={String(registered.length)} />
            <MiniStat icon={Award} label="Domains Covered" value="0" />
            <MiniStat icon={Flame} label="Participation Streak" value={String(user?.participation_streak || 0)} />
          </div>
        </section>
        {lists.map(([title, events]) => (
          <section key={title} className="surface rounded-lg p-6">
            <h3 className="text-2xl font-black">{title}</h3>
            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {events.length > 0 ? (
                events.map((event) => <div key={`${title}-${event.id}`} className="rounded-lg bg-white p-4 ring-1 ring-slate-200"><p className="font-black">{event.title}</p><p className="text-sm text-nova-muted">{formatDate(event.date || event.starts_at)}</p></div>)
              ) : (
                <p className="col-span-full text-sm text-nova-muted font-bold">No events found in this category.</p>
              )}
            </div>
          </section>
        ))}
        <section className="grid gap-6 lg:grid-cols-[1fr_.8fr]">
          <div className="surface rounded-lg p-6">
            <h3 className="text-2xl font-black">Monthly Participation Trend</h3>
            <div className="mt-4 h-72">
              {monthlyStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.25)" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="events" fill="#ff5f6d" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-nova-muted font-bold">No trend data available</div>
              )}
            </div>
          </div>
          <div className="surface rounded-lg p-6">
            <h3 className="text-2xl font-black">Domain-wise Participation</h3>
            <div className="mt-4 h-72">
              {domainStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={domainStats} dataKey="value" nameKey="name" innerRadius={58} outerRadius={96}>
                      {domainStats.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-nova-muted font-bold">No domain data available</div>
              )}
            </div>
          </div>
        </section>
      </div>
    </StudentShell>
  );
}
