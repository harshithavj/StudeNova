import { ArrowRight, Clock3, Home, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PendingApproval() {
  return (
    <section className="mx-auto flex min-h-[75vh] max-w-5xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="surface w-full overflow-hidden rounded-2xl shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
        <div className="grid gap-8 bg-gradient-to-br from-nova-peach via-white to-slate-50 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-nova-coral ring-1 ring-nova-peach">
              <Clock3 size={16} /> Verification Under Review
            </div>
            <h1 className="mt-6 text-4xl font-black text-slate-900 sm:text-5xl">Verification Under Review</h1>
            <p className="mt-5 text-lg leading-8 text-nova-muted">
              Thank you for registering as a College Organizer on StudeNova.
            </p>
            <p className="mt-4 text-base leading-8 text-nova-muted">
              Your account and submitted information are currently being reviewed by our administration team to ensure the authenticity of event organizers on the platform.
            </p>
            <p className="mt-4 text-base leading-8 text-nova-muted">
              Once the verification process is completed and your account is approved, you will receive access to the College Organizer Dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-nova-coral px-5 py-3 text-sm font-bold text-white transition hover:bg-nova-coral/90">
                <Home size={16} /> Return Home <ArrowRight size={16} />
              </Link>
              <a href="mailto:support@studenova.com" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-white">
                <Mail size={16} /> Contact Support
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white p-8 shadow-sm">
            <div className="grid h-40 w-40 place-items-center rounded-full bg-nova-peach text-nova-coral shadow-inner">
              <Clock3 size={64} />
            </div>
            <h2 className="mt-8 text-2xl font-black text-slate-900">We appreciate your patience</h2>
            <p className="mt-3 text-base leading-7 text-nova-muted">
              We appreciate your patience and will notify you as soon as the review is complete. Thank you for choosing StudeNova.
            </p>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">— Team StudeNova</p>
          </div>
        </div>
      </div>
    </section>
  );
}
