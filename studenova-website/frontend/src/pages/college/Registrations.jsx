import { Download } from 'lucide-react';

const registrations = [
  { name: 'Aarav Sharma', college: 'NITK', department: 'CSE', year: '3', email: 'aarav@example.com' },
  { name: 'Meera Iyer', college: 'RVCE', department: 'ISE', year: '2', email: 'meera@example.com' }
];

export default function Registrations() {
  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-nova-coral">Student Registrations</p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">Participant List</h2>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-nova-coral px-4 py-2 text-sm font-bold text-white">
          <Download size={16} /> Export CSV
        </button>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid grid-cols-[1.3fr_1fr_1fr_0.6fr_1.3fr] gap-3 border-b border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-500">
          <span>Name</span><span>College</span><span>Department</span><span>Year</span><span>Email</span>
        </div>
        {registrations.map((entry) => (
          <div key={entry.email} className="grid grid-cols-[1.3fr_1fr_1fr_0.6fr_1.3fr] gap-3 border-b border-slate-200 p-4 text-sm text-slate-700 last:border-0">
            <span>{entry.name}</span><span>{entry.college}</span><span>{entry.department}</span><span>{entry.year}</span><span>{entry.email}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
