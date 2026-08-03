import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Check, Download, Loader2, Search, X } from 'lucide-react';
import api from '../../services/api';

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const loadRegistrations = async () => {
      try {
        const { data: eventsData } = await api.get('/events/mine');
        const responses = await Promise.all((eventsData.items || []).map((event) => api.get(`/registrations/events/${event.id}`)));
        setRegistrations(responses.flatMap((response) => response.data.items || []).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load participant registrations');
      } finally {
        setLoading(false);
      }
    };
    loadRegistrations();
  }, []);

  const filterOptions = useMemo(() => ({
    colleges: [...new Set(registrations.map((item) => item.student_college).filter(Boolean))].sort(),
    departments: [...new Set(registrations.map((item) => item.student_department).filter(Boolean))].sort(),
    years: [...new Set(registrations.map((item) => item.student_year).filter(Boolean))].sort()
  }), [registrations]);

  const filteredRegistrations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return registrations.filter((item) => {
      const details = [item.student_name, item.student_email, item.event_title].filter(Boolean).join(' ').toLowerCase();
      return (!query || details.includes(query)) && (!college || item.student_college === college) && (!department || item.student_department === department) && (!year || item.student_year === year);
    });
  }, [registrations, search, college, department, year]);

  const updateStatus = async (registration, status) => {
    let rejectionReason = null;
    if (status === 'rejected') {
      let reason = '';
      while (!reason) {
        const input = window.prompt("Enter rejection reason (Required. e.g. Incomplete details, Duplicate registration):");
        if (input === null) return; // User cancelled
        reason = input.trim();
        if (!reason) {
          window.alert("You must provide a rejection reason to reject a participant.");
        }
      }
      rejectionReason = reason;
    }

    setUpdatingId(registration.id);
    try {
      const { data } = await api.put(`/registrations/${registration.id}/status`, {
        status,
        rejection_reason: rejectionReason
      });
      setRegistrations((current) => current.map((item) => (item.id === data.id ? data : item)));
      toast.success(`${registration.student_name || 'Participant'} ${status}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update participant status');
    } finally { setUpdatingId(null); }
  };

  const exportCsv = () => {
    const headers = ['Student', 'Email', 'Event', 'College', 'Department', 'Year', 'Registered', 'Status', 'Rejection Reason'];
    const rows = filteredRegistrations.map((item) => [item.student_name || 'Student', item.student_email || '', item.event_title || '', item.student_college || '', item.student_department || '', item.student_year || '', formatDate(item.created_at), item.status || 'registered', item.rejection_reason || '']);
    const quote = (value) => `"${String(value).replaceAll('"', '""')}"`;
    const csv = [headers, ...rows].map((row) => row.map(quote).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'studenova-registrations.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return <section>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-nova-coral">Registration Management</p><h2 className="mt-2 text-3xl font-black text-slate-900">Participants</h2></div>
      <button onClick={exportCsv} disabled={!filteredRegistrations.length} className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-nova-coral hover:text-nova-coral disabled:cursor-not-allowed disabled:opacity-50"><Download size={16} /> Export CSV</button>
    </div>
    <div className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[minmax(0,1fr)_repeat(3,minmax(130px,0.35fr))]">
      <label className="relative block"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student, email, or event" className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-nova-coral" /></label>
      <select value={college} onChange={(event) => setCollege(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="">All colleges</option>{filterOptions.colleges.map((item) => <option key={item}>{item}</option>)}</select>
      <select value={department} onChange={(event) => setDepartment(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="">All departments</option>{filterOptions.departments.map((item) => <option key={item}>{item}</option>)}</select>
      <select value={year} onChange={(event) => setYear(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="">All years</option>{filterOptions.years.map((item) => <option key={item}>{item}</option>)}</select>
    </div>
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {loading ? <div className="flex items-center justify-center gap-2 p-8 text-sm text-nova-muted"><Loader2 size={16} className="animate-spin" /> Loading registrations...</div> : filteredRegistrations.length ? <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-nova-muted"><tr><th className="px-5 py-3 font-semibold">Student</th><th className="px-5 py-3 font-semibold">Event</th><th className="px-5 py-3 font-semibold">College</th><th className="px-5 py-3 font-semibold">Department / Year</th><th className="px-5 py-3 font-semibold">Registered</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold"><span className="sr-only">Actions</span></th></tr></thead><tbody className="divide-y divide-slate-100">
        {filteredRegistrations.map((registration) => <tr key={registration.id} className="text-slate-700"><td className="px-5 py-4"><p className="font-bold text-slate-900">{registration.student_name || 'Student'}</p><p className="mt-1 text-xs text-nova-muted">{registration.student_email || 'Email unavailable'}</p></td><td className="px-5 py-4 font-semibold">{registration.event_title || 'Event'}</td><td className="px-5 py-4">{registration.student_college || '—'}</td><td className="px-5 py-4">{[registration.student_department, registration.student_year].filter(Boolean).join(' · ') || '—'}</td><td className="px-5 py-4">{formatDate(registration.created_at)}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${registration.status === 'rejected' ? 'bg-rose-50 text-rose-700' : registration.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{registration.status || 'registered'}</span>{registration.status === 'rejected' && registration.rejection_reason && <p className="mt-1 text-xs text-rose-600 font-semibold max-w-[150px] truncate" title={registration.rejection_reason}>Reason: {registration.rejection_reason}</p>}</td><td className="px-5 py-4"><div className="flex gap-2">{registration.status !== 'approved' && <button disabled={updatingId === registration.id} onClick={() => updateStatus(registration, 'approved')} className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-2.5 py-1.5 text-xs font-bold text-emerald-700 disabled:opacity-50"><Check size={14} /> Approve</button>}{registration.status !== 'rejected' && <button disabled={updatingId === registration.id} onClick={() => updateStatus(registration, 'rejected')} className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-bold text-rose-700 disabled:opacity-50"><X size={14} /> Reject</button>}</div></td></tr>)}
      </tbody></table></div> : <div className="border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-nova-muted">{registrations.length ? 'No registrations match these filters.' : 'No registrations yet.'}</div>}
    </div>
  </section>;
}
