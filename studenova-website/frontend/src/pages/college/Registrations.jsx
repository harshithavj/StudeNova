import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import api from '../../services/api';

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRegistrations = async () => {
      try {
        const { data: eventsData } = await api.get('/events/mine');
        const events = eventsData.items || [];
        const responses = await Promise.all(events.map((event) => api.get(`/registrations/events/${event.id}`)));
        const items = responses.flatMap((response) => response.data.items || []);
        setRegistrations(items.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load participant registrations');
      } finally {
        setLoading(false);
      }
    };

    loadRegistrations();
  }, []);

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-nova-coral">Student Registrations</p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">Participant List</h2>
        </div>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-8 text-sm text-nova-muted"><Loader2 size={16} className="animate-spin" /> Loading registrations...</div>
        ) : registrations.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-nova-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Student</th>
                  <th className="px-5 py-3 font-semibold">Event</th>
                  <th className="px-5 py-3 font-semibold">College</th>
                  <th className="px-5 py-3 font-semibold">Registered</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registrations.map((registration) => (
                  <tr key={registration.id} className="text-slate-700">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">{registration.student_name || 'Student'}</p>
                      <p className="mt-1 text-xs text-nova-muted">{registration.student_email || 'Email unavailable'}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold">{registration.event_title || 'Event'}</td>
                    <td className="px-5 py-4">{registration.student_college || '—'}</td>
                    <td className="px-5 py-4">{formatDate(registration.created_at)}</td>
                    <td className="px-5 py-4"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold capitalize text-emerald-700">{registration.status || 'registered'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-nova-muted">No registrations yet.</div>
        )}
      </div>
    </section>
  );
}
