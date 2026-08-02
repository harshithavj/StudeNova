import { BellRing } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatDate } from '../../utils/date';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadNotifications = async () => {
      try {
        const { data } = await api.get('/notifications');
        if (!active) return;
        setNotifications(data.items || []);
        setError('');
      } catch (err) {
        if (!active) return;
        setError(err.response?.data?.message || 'Unable to fetch notifications.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadNotifications();
    const intervalId = window.setInterval(loadNotifications, 30000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <section>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-nova-coral">Notifications</p>
        <h2 className="mt-2 text-3xl font-black text-slate-900">Latest updates</h2>
      </div>
      <div className="mt-6 grid gap-3">
        {loading ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-nova-muted">Loading notifications...</div>
        ) : error ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-nova-muted">{error}</div>
        ) : notifications.length ? (
          notifications.map((item) => (
            <article key={item.id} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-start gap-3">
                <BellRing className="mt-1 shrink-0 text-nova-coral" size={18} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-bold uppercase text-nova-coral">{item.stage?.replaceAll('_', ' ') || 'Notification'}</p>
                    <p className="text-xs text-slate-400">{formatDate(item.scheduled_for || item.created_at)}</p>
                  </div>
                  <h3 className="mt-1 font-black text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-nova-muted">{item.body}</p>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-nova-muted">
            You have no notifications yet.
          </div>
        )}
      </div>
    </section>
  );
}
