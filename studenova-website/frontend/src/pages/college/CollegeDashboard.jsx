import { useEffect, useMemo, useState } from 'react';
import { Bell, CalendarDays, ClipboardList, LayoutGrid, LogOut, UsersRound } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CollegeHome from './CollegeHome';
import EventManagement from './EventManagement';
import Registrations from './Registrations';
import NotificationsPage from './NotificationsPage';
import ProfilePage from './ProfilePage';
import api from '../../services/api';

const navItems = [
  { to: '/college/dashboard', label: 'Dashboard', end: true },
  { to: '/college/events', label: 'Events' },
  { to: '/college/registrations', label: 'Registrations' },
  { to: '/college/notifications', label: 'Notifications' },
  { to: '/college/profile', label: 'Profile' }
];

export default function CollegeDashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const isRoot = location.pathname === '/college/dashboard';
  const isEventsView = location.pathname.startsWith('/college/events');
  const isRegistrationsView = location.pathname === '/college/registrations';
  const isNotificationsView = location.pathname === '/college/notifications';
  const isProfileView = location.pathname === '/college/profile';

  useEffect(() => {
    const loadDashboardEvents = async () => {
      try {
        const { data } = await api.get('/events/mine');
        setEvents(data.items || []);
      } finally {
        setLoadingStats(false);
      }
    };

    loadDashboardEvents();
  }, []);

  const summaryCards = useMemo(() => {
    const now = new Date();
    const registrations = events.reduce((total, event) => total + (event.registrations_count || 0), 0);
    const views = events.reduce((total, event) => total + Math.round(event.popularity_score || 0), 0);

    return [
      { label: 'Total Events', value: events.length, icon: ClipboardList },
      { label: 'Upcoming Events', value: events.filter((event) => new Date(event.starts_at) > now).length, icon: CalendarDays },
      { label: 'Total Registrations', value: registrations, icon: UsersRound },
      { label: 'Total Event Views', value: views, icon: LayoutGrid }
    ];
  }, [events]);

  return (
    <div className="min-h-[80vh] bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
        <aside className="surface rounded-2xl p-5">
          <div className="rounded-2xl bg-nova-peach p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-nova-coral">College Organizer</p>
            <h2 className="mt-2 text-xl font-black text-slate-900">{user?.name || 'Organizer'}</h2>
            <p className="mt-2 text-sm text-nova-muted">{user?.college || 'Campus Events'}</p>
          </div>
          <nav className="mt-6 grid gap-2">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} end={item.end} className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${location.pathname === item.to ? 'bg-nova-coral text-white' : 'text-nova-muted hover:bg-slate-100 hover:text-slate-900'}`}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-nova-muted">
            <p className="font-bold text-slate-900">Verification status</p>
            <p className="mt-2 capitalize text-emerald-600">{user?.verificationStatus || 'approved'}</p>
          </div>
          <button onClick={logout} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-nova-muted transition hover:border-nova-coral hover:text-nova-coral">
            <LogOut size={16} /> Log out
          </button>
        </aside>
        <section className="space-y-6">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-nova-coral">College Organizer Dashboard</p>
              <h1 className="mt-2 text-3xl font-black text-slate-900">Welcome back, {user?.name || 'Organizer'}</h1>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-nova-peach px-4 py-2 text-sm font-semibold text-nova-coral">
              <Bell size={16} /> 0 new notifications
            </div>
          </div>
          {isRoot ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="surface rounded-2xl p-5">
                    <Icon className="text-nova-coral" size={20} />
                    <p className="mt-4 text-3xl font-black text-slate-900">{loadingStats ? '—' : value}</p>
                    <p className="mt-1 text-sm text-nova-muted">{label}</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="surface rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black text-slate-900">Registration trends</h2>
                      <p className="text-sm text-nova-muted">Registration trend data will appear here as it becomes available.</p>
                    </div>
                  </div>
                  <div className="mt-6 grid h-72 place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-nova-muted">
                    No registration trend data yet.
                  </div>
                </div>
                <div className="surface rounded-2xl p-6">
                  <h2 className="text-xl font-black text-slate-900">Recent activities</h2>
                  <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-nova-muted">
                    No recent activity yet.
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="surface rounded-2xl p-6">
              {isEventsView ? <EventManagement /> : isRegistrationsView ? <Registrations /> : isNotificationsView ? <NotificationsPage /> : isProfileView ? <ProfilePage /> : <CollegeHome />}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
