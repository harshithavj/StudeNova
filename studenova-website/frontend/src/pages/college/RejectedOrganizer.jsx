import { AlertTriangle, Home, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RejectedOrganizer() {
  const { user } = useAuth();
  return (
    <section className="mx-auto flex min-h-[75vh] max-w-5xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="surface w-full overflow-hidden rounded-2xl shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
        <div className="grid gap-8 bg-gradient-to-br from-rose-50 via-white to-slate-50 p-8 lg:grid-cols-[1fr_0.9fr] lg:p-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-600">
              <AlertTriangle size={16} /> Verification Rejected
            </div>
            <h1 className="mt-6 text-4xl font-black text-slate-900 sm:text-5xl">Your verification needs attention</h1>
            <p className="mt-5 text-lg leading-8 text-nova-muted">
              Your organizer verification was not approved by the administration team.
            </p>
            <p className="mt-4 text-base leading-8 text-nova-muted">
              {user?.rejectionReason ? `Reason: ${user.rejectionReason}` : 'Please contact support to review the submitted documents and resubmit the verification request.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-nova-coral px-5 py-3 text-sm font-bold text-white transition hover:bg-nova-coral/90">
                <Home size={16} /> Return Home
              </Link>
              <a href="mailto:support@studenova.com" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-white">
                <Mail size={16} /> Contact Support
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-rose-100 bg-white p-8 shadow-sm">
            <div className="grid h-40 w-40 place-items-center rounded-full bg-rose-100 text-rose-600 shadow-inner">
              <AlertTriangle size={64} />
            </div>
            <h2 className="mt-8 text-2xl font-black text-slate-900">What to do next</h2>
            <p className="mt-3 text-base leading-7 text-nova-muted">
              Update the required documents or contact our support team for next steps. Once your profile is re-verified, you will regain access to the organizer dashboard.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
