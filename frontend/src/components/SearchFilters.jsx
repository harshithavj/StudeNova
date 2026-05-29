import { Filter, Search } from 'lucide-react';
import { categories, domains, eligibilityOptions } from '../data/mockData';

export default function SearchFilters({ filters, setFilters }) {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <section className="surface rounded-lg p-4">
      <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_auto]">
        <label className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200">
          <Search size={18} className="text-slate-400" />
          <input value={filters.q} onChange={(event) => update('q', event.target.value)} placeholder="Search events, tags, organizer" className="w-full bg-transparent text-sm outline-none" />
        </label>
        <select value={filters.category} onChange={(event) => update('category', event.target.value)} className="rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-slate-200">
          <option value="">Categories</option>
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
        <select value={filters.domain || ''} onChange={(event) => update('domain', event.target.value)} className="rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-slate-200">
          <option value="">Domains</option>
          {domains.map((domain) => <option key={domain}>{domain}</option>)}
        </select>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-nova-coral px-4 py-2 text-sm font-bold text-white"><Filter size={18} />Filter</button>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-4">
        <select value={filters.mode || ''} onChange={(event) => update('mode', event.target.value)} className="rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-slate-200">
          <option value="">Modes</option>
          {['Online', 'Offline', 'Hybrid'].map((mode) => <option key={mode}>{mode}</option>)}
        </select>
        <select value={filters.eligibility || ''} onChange={(event) => update('eligibility', event.target.value)} className="rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-slate-200">
          <option value="">Eligibility</option>
          {eligibilityOptions.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={filters.registrationStatus || ''} onChange={(event) => update('registrationStatus', event.target.value)} className="rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-slate-200">
          <option value="">Registration status</option>
          {['Open', 'Closing Soon', 'Closed'].map((status) => <option key={status}>{status}</option>)}
        </select>
        <select value={filters.teamSize || ''} onChange={(event) => update('teamSize', event.target.value)} className="rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-slate-200">
          <option value="">Team Size</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="2+">2+</option>
        </select>
      </div>
    </section>
  );
}
