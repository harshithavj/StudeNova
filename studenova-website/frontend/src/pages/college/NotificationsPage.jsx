export default function NotificationsPage() {
  return (
    <section>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-nova-coral">Notifications</p>
        <h2 className="mt-2 text-3xl font-black text-slate-900">Latest updates</h2>
      </div>
      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-nova-muted">
        You have no notifications yet.
      </div>
    </section>
  );
}
