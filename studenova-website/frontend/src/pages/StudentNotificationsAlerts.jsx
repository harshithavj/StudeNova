import { Bell, CalendarDays, Mail, TimerReset } from 'lucide-react';
import { useEffect, useState } from 'react';
import StudentShell from '../components/student/StudentShell';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/date';
import api from '../services/api';

export default function StudentNotificationsAlerts() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadStudentUpdates = async () => {
      try {
        const [notificationsResponse, registrationsResponse] = await Promise.all([
          api.get('/notifications'),
          api.get('/registrations/me')
        ]);
        if (!active) return;
        setNotifications(notificationsResponse.data.items || []);
        setRegistrations(registrationsResponse.data.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadStudentUpdates();
    const intervalId = window.setInterval(loadStudentUpdates, 30000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const upcomingRegistrations = registrations
    .filter((registration) => registration.event && new Date(registration.event.starts_at).getTime() >= Date.now())
    .sort((a, b) => new Date(a.event.starts_at) - new Date(b.event.starts_at));

  return (
    <StudentShell user={user}>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-nova-coral">Notifications & Alerts</p>
          <h2 className="text-4xl font-black">Updates, deadlines, and your event calendar</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_.85fr]">
          <section className="surface rounded-lg p-6">
            <h3 className="flex items-center gap-2 text-2xl font-black"><Bell className="text-nova-coral" />Notifications</h3>
            <div className="mt-4 grid gap-3">
              {loading ? (
                <div className="text-center py-4 text-sm text-nova-muted font-bold">Loading notifications...</div>
              ) : notifications.length > 0 ? (
                notifications.map((item) => (
                  <div key={item.id} className="rounded-lg bg-white p-4 ring-1 ring-slate-200">
                    <span className="rounded-lg px-2 py-1 text-xs font-bold bg-blue-50 text-blue-700">{item.stage || 'General'}</span>
                    <p className="mt-2 font-bold">{item.title}</p>
                    <p className="text-xs font-bold text-nova-muted">{item.body}</p>
                    <p className="mt-2 text-xs text-slate-400">{formatDate(item.scheduled_for || item.created_at)}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-sm text-nova-muted font-bold">No notifications yet.</div>
              )}
            </div>
          </section>
          <section className="surface rounded-lg p-6">
            <h3 className="flex items-center gap-2 text-2xl font-black"><TimerReset className="text-nova-coral" />Deadline Alerts</h3>
            <div className="mt-4 grid gap-3">
              {loading ? (
                <div className="rounded-lg bg-white p-4 text-sm font-bold text-nova-muted ring-1 ring-slate-200">Loading deadlines...</div>
              ) : upcomingRegistrations.length > 0 ? (
                upcomingRegistrations.slice(0, 4).map((registration) => (
                  <div key={registration.id} className="rounded-lg bg-white p-4 ring-1 ring-slate-200">
                    <p className="font-bold">{registration.event.title}</p>
                    <p className="mt-1 text-xs font-bold text-nova-muted">Deadline: {formatDate(registration.event.registration_deadline)}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-lg bg-white p-4 text-sm font-bold text-nova-muted ring-1 ring-slate-200">No upcoming deadlines.</div>
              )}
            </div>
            <div className="mt-5 rounded-lg bg-blue-50 p-4 text-sm font-bold text-blue-700">
              <Mail className="mb-2" size={18} />Email alerts are scheduled for registration deadlines, upcoming events, event starts, and result announcements.
            </div>
          </section>
        </div>
        <section className="surface rounded-lg p-6">
          <h3 className="flex items-center gap-2 text-2xl font-black"><CalendarDays className="text-nova-coral" />Upcoming Calendar Events</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {upcomingRegistrations.length > 0 ? (
              upcomingRegistrations.slice(0, 3).map((registration) => (
                <article key={registration.id} className="rounded-lg bg-white p-4 ring-1 ring-slate-200">
                  <h4 className="font-black">{registration.event.title}</h4>
                  <p className="mt-2 text-sm text-nova-muted">Event: {formatDate(registration.event.starts_at)}</p>
                  <p className="text-sm text-nova-muted">Deadline: {formatDate(registration.event.registration_deadline)}</p>
                </article>
              ))
            ) : (
              <p className="col-span-full text-sm text-nova-muted font-bold">No upcoming calendar events.</p>
            )}
          </div>
        </section>
      </div>
    </StudentShell>
  );
}
