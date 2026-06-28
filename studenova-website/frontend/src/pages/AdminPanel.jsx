import { useEffect, useState } from 'react';
import { CheckCircle2, FileText, XCircle } from 'lucide-react';
import BackButton from '../components/BackButton';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/ui/Button';
import api from '../services/api';

export default function AdminPanel() {
  const [requests, setRequests] = useState([]);
  const [reasonById, setReasonById] = useState({});
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/analytics/admin-activity');
        setRequests(data.verification_requests || []);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, []);

  const updateVerification = async (userId, action) => {
    setProcessingId(userId);
    try {
      const payload = { action };
      if (action === 'reject') {
        payload.reason = reasonById[userId] || 'Verification rejected by admin';
      }
      const { data } = await api.patch(`/analytics/admin-verifications/${userId}`, payload);
      setRequests((current) => current.filter((request) => request.user_id !== userId));
      setReasonById((current) => ({ ...current, [userId]: '' }));
      console.info(data);
    } finally {
      setProcessingId(null);
    }
  };

  const formatLabel = (key) => key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (value) => value.toUpperCase());

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs />
      <BackButton />
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-4xl font-black">Super Admin Portal</h1>
          <p className="mt-2 text-nova-muted">Review organizer verification requests, approve trusted college organizers, and reject incomplete submissions.</p>
        </div>
      </div>

      <div className="mb-8 surface overflow-hidden rounded-2xl">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-2xl font-black">Pending College Organizers</h2>
          <p className="mt-1 text-sm text-nova-muted">Review submitted documents, verify details, and grant access to the college organizer dashboard.</p>
        </div>
        {requests.length === 0 ? (
          <div className="p-6 text-sm text-nova-muted">No pending organizer verification requests right now.</div>
        ) : (
          <div className="divide-y divide-slate-200">
            {requests.map((request) => (
              <div key={request.user_id} className="grid gap-5 p-5 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">{request.organizer_name}</h3>
                    <span className="rounded-full bg-nova-peach px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-nova-coral">{request.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-nova-muted">{request.organization_name}</p>
                  <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                    <p><span className="font-semibold">Email:</span> {request.official_email}</p>
                    <p><span className="font-semibold">Role:</span> {request.role}</p>
                    <p><span className="font-semibold">Department:</span> {request.department}</p>
                    <p><span className="font-semibold">Submitted:</span> {request.submission_date}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {request.documents?.map((document) => (
                      document.details ? (
                        <div key={document.id} className="w-full rounded-xl border border-slate-200 bg-white p-4">
                          <p className="mb-3 inline-flex items-center gap-2 text-sm font-black text-slate-900"><FileText size={15} /> {document.file_name}</p>
                          <div className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                            {Object.entries(document.details).map(([key, value]) => (
                              <p key={key}><span className="font-semibold">{formatLabel(key)}:</span> {value}</p>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <a key={document.id} href={document.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                          <FileText size={15} /> {document.file_name}
                        </a>
                      )
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <label className="grid gap-2 text-sm font-semibold text-slate-700">
                    Rejection reason
                    <textarea rows={4} value={reasonById[request.user_id] || ''} onChange={(event) => setReasonById((current) => ({ ...current, [request.user_id]: event.target.value }))} className="rounded-xl border border-slate-200 bg-white px-3 py-2" placeholder="Optional reason for rejection" />
                  </label>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button variant="accent" disabled={processingId === request.user_id} onClick={() => updateVerification(request.user_id, 'approve')}>
                      <CheckCircle2 size={16} className="mr-2" /> Approve
                    </Button>
                    <button disabled={processingId === request.user_id} onClick={() => updateVerification(request.user_id, 'reject')} className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-bold text-rose-600 disabled:opacity-60">
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
