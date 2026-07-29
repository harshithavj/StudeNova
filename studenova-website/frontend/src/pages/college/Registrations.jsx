export default function Registrations() {
  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-nova-coral">Student Registrations</p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">Participant List</h2>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-nova-muted">
        No registrations yet.
      </div>
    </section>
  );
}
