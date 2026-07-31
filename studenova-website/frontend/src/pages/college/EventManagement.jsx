import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Edit, Eye, Loader2, Plus, Save, Trash2, TrendingUp, X } from 'lucide-react';
import { categories, domains, eligibilityOptions } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const initialForm = {
  id: null,
  title: '',
  description: '',
  category: categories[0],
  domain: domains[0],
  mode: 'offline',
  location: '',
  college: '',
  conducting_organization: '',
  eligibility: eligibilityOptions[1],
  team_size: '1',
  prize_pool: '',
  seats_available: '',
  registration_link: '',
  contact_email: '',
  starts_at: '',
  ends_at: '',
  registration_deadline: '',
  tags: ''
};

function toDateInputValue(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('sv-SE').slice(0, 16);
}

function displayDate(value) {
  if (!value) return 'Date not set';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function buildPayload(form, user) {
  const tags = form.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    title: form.title.trim(),
    description: form.description.trim(),
    category: form.category,
    domain: form.domain || null,
    mode: form.mode,
    location: form.location.trim(),
    college: form.college.trim() || user?.college || null,
    conducting_organization: form.conducting_organization.trim() || user?.college || user?.name || null,
    eligibility: form.eligibility || null,
    team_size: form.team_size.trim() || null,
    prize_pool: form.prize_pool ? String(form.prize_pool) : '0',
    seats_available: form.seats_available ? Number(form.seats_available) : 0,
    registration_link: form.registration_link.trim() || null,
    contact_email: form.contact_email.trim() || null,
    starts_at: new Date(form.starts_at).toISOString(),
    ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
    registration_deadline: new Date(form.registration_deadline).toISOString(),
    tags
  };
}

export default function EventManagement() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [analyticsEvent, setAnalyticsEvent] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [showForm, setShowForm] = useState(location.pathname.endsWith('/create'));
  const [form, setForm] = useState(() => ({
    ...initialForm,
    college: user?.college || '',
    conducting_organization: user?.college || user?.name || ''
  }));

  const sortedEvents = useMemo(() => [...events].sort((a, b) => new Date(b.starts_at || 0) - new Date(a.starts_at || 0)), [events]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/events/mine');
      setEvents(data.items || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load your events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    setShowForm(location.pathname.endsWith('/create'));
  }, [location.pathname]);

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const openCreateForm = () => {
    setShowForm(true);
    if (!location.pathname.endsWith('/create')) {
      navigate('/college/events/create');
    }
  };

  const closeCreateForm = () => {
    setShowForm(false);
    if (location.pathname.endsWith('/create')) {
      navigate('/college/events');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const startsAt = new Date(form.starts_at);
    const deadline = new Date(form.registration_deadline);

    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(deadline.getTime())) {
      toast.error('Set a valid event date and registration deadline');
      return;
    }
    if (deadline > startsAt) {
      toast.error('Registration deadline must be before the event starts');
      return;
    }

    setSubmitting(true);
    try {
      const request = form.id ? api.put(`/events/${form.id}`, buildPayload(form, user)) : api.post('/events', buildPayload(form, user));
      const { data } = await request;
      setEvents((current) => (form.id ? current.map((item) => (item.id === data.id ? data : item)) : [data, ...current]));
      setForm({
        ...initialForm,
        college: user?.college || '',
        conducting_organization: user?.college || user?.name || ''
      });
      closeCreateForm();
      toast.success(form.id ? 'Event updated' : 'Event created');
    } catch (error) {
      toast.error(error.response?.data?.message || (form.id ? 'Unable to update event' : 'Unable to create event'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (eventId) => {
    const confirmed = window.confirm('Delete this event?');
    if (!confirmed) return;

    try {
      await api.delete(`/events/${eventId}`);
      setEvents((current) => current.filter((item) => item.id !== eventId));
      toast.success('Event deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete event');
    }
  };

  const openAnalytics = async (event) => {
    setAnalyticsEvent(event);
    setAnalytics(null);
    setAnalyticsLoading(true);

    try {
      const { data } = await api.get(`/analytics/event/${event.id}`);
      setAnalytics(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load event analytics');
      setAnalyticsEvent(null);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-nova-coral">Event Management</p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">My Events</h2>
        </div>
        <button onClick={openCreateForm} className="inline-flex items-center justify-center gap-2 rounded-full bg-nova-coral px-4 py-2 text-sm font-bold text-white transition hover:bg-rose-500">
          <Plus size={16} /> Create Event
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900">{form.id ? 'Edit Event' : 'Create Event'}</h3>
              <p className="mt-1 text-sm text-nova-muted">{form.id ? 'Update this event under your organizer account.' : 'New events are published under your organizer account.'}</p>
            </div>
            <button type="button" onClick={closeCreateForm} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
              <X size={16} /> Close
            </button>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Event title
              <input required value={form.title} onChange={(event) => updateField('title', event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-nova-coral" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Category
              <select value={form.category} onChange={(event) => updateField('category', event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-nova-coral">
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Domain
              <select value={form.domain} onChange={(event) => updateField('domain', event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-nova-coral">
                {domains.map((domain) => <option key={domain}>{domain}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Mode
              <select value={form.mode} onChange={(event) => updateField('mode', event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 font-normal capitalize outline-none focus:border-nova-coral">
                <option value="offline">Offline</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Location
              <input required value={form.location} onChange={(event) => updateField('location', event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-nova-coral" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              College
              <input value={form.college} onChange={(event) => updateField('college', event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-nova-coral" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Conducting organization
              <input value={form.conducting_organization} onChange={(event) => updateField('conducting_organization', event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-nova-coral" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Eligibility
              <select value={form.eligibility} onChange={(event) => updateField('eligibility', event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-nova-coral">
                {eligibilityOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Starts at
              <input required type="datetime-local" value={form.starts_at} onChange={(event) => updateField('starts_at', event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-nova-coral" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Ends at
              <input type="datetime-local" value={form.ends_at} onChange={(event) => updateField('ends_at', event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-nova-coral" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Registration deadline
              <input required type="datetime-local" value={form.registration_deadline} onChange={(event) => updateField('registration_deadline', event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-nova-coral" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Team size
              <select value={form.team_size} onChange={(event) => updateField('team_size', event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-nova-coral">
                {[1, 2, 3, 4].map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Prize pool
              <input type="number" min="0" value={form.prize_pool} onChange={(event) => updateField('prize_pool', event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-nova-coral" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Seats available
              <input type="number" min="0" value={form.seats_available} onChange={(event) => updateField('seats_available', event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-nova-coral" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Registration link
              <input type="url" value={form.registration_link} onChange={(event) => updateField('registration_link', event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-nova-coral" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Contact email
              <input type="email" value={form.contact_email} onChange={(event) => updateField('contact_email', event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-nova-coral" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700 lg:col-span-2">
              Tags
              <input value={form.tags} onChange={(event) => updateField('tags', event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-nova-coral" placeholder="AI, workshop, campus" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700 lg:col-span-2">
              Description
              <textarea required minLength={20} rows={4} value={form.description} onChange={(event) => updateField('description', event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-nova-coral" />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap justify-end gap-3">
            <button type="button" onClick={closeCreateForm} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700">
              <X size={16} /> Cancel
            </button>
            <button disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-lg bg-nova-coral px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-70">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} {form.id ? 'Update Event' : 'Save Event'}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 grid gap-4">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-nova-muted shadow-sm">Loading events...</div>
        ) : sortedEvents.length ? sortedEvents.map((event) => (
          <div key={event.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">{event.title}</h3>
                  <span className="rounded-full bg-nova-peach px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-nova-coral">{event.status || 'published'}</span>
                </div>
                <p className="mt-2 text-sm text-nova-muted">{displayDate(event.starts_at || event.date)}</p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-nova-muted">
                <span>Registrations: {event.registrations_count || 0}</span>
                <span>Views: {Math.round(event.popularity_score || 0)}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/events/${event.id}`} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"> <Eye size={15} className="mr-1 inline" /> View</Link>
                <button onClick={() => {
                  setForm({
                    ...initialForm,
                    ...event,
                    starts_at: toDateInputValue(event.starts_at),
                    ends_at: toDateInputValue(event.ends_at),
                    registration_deadline: toDateInputValue(event.registration_deadline),
                    tags: event.tags?.join(', ') || ''
                  });
                  openCreateForm();
                }} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"> <Edit size={15} className="mr-1 inline" /> Edit</button>
                <button onClick={() => openAnalytics(event)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"> <TrendingUp size={15} className="mr-1 inline" /> Analytics</button>
                <button onClick={() => handleDelete(event.id)} className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600"> <Trash2 size={15} className="mr-1 inline" /> Delete</button>
              </div>
            </div>
          </div>
        )) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-black text-slate-900">No events yet</p>
            <button onClick={openCreateForm} className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-nova-coral px-4 py-2 text-sm font-bold text-white">
              <Plus size={16} /> Create Event
            </button>
          </div>
        )}
      </div>

      {analyticsEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" role="dialog" aria-modal="true" aria-labelledby="analytics-title">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-nova-coral">Event analytics</p>
                <h3 id="analytics-title" className="mt-1 text-xl font-black text-slate-900">{analyticsEvent.title}</h3>
              </div>
              <button type="button" onClick={() => setAnalyticsEvent(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700" aria-label="Close analytics">
                <X size={20} />
              </button>
            </div>

            {analyticsLoading ? (
              <div className="flex items-center gap-2 py-8 text-sm text-nova-muted"><Loader2 size={16} className="animate-spin" /> Loading analytics...</div>
            ) : analytics && (
              <>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    ['Registrations', analytics.registrations || 0],
                    ['Bookmarks', analytics.bookmarks || 0],
                    ['Views', Math.round(analytics.popularity_score || 0)]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-slate-50 p-3 text-center">
                      <p className="text-2xl font-black text-slate-900">{value}</p>
                      <p className="mt-1 text-xs font-semibold text-nova-muted">{label}</p>
                    </div>
                  ))}
                </div>
                {analytics.metrics?.length > 0 && (
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-sm font-bold text-slate-800">Recorded metrics</p>
                    <div className="mt-2 grid gap-2">
                      {analytics.metrics.map((metric, index) => (
                        <div key={`${metric.metric}-${index}`} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                          <span className="capitalize text-slate-600">{metric.dimension ? `${metric.metric} (${metric.dimension})` : metric.metric}</span>
                          <span className="font-bold text-slate-900">{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
