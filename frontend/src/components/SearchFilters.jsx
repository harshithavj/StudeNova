import { Filter, Search } from 'lucide-react';
import { categories } from '../data/mockData';

export default function SearchFilters({ filters, setFilters }) {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <section className="surface rounded-lg p-4">
      <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
        <label className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200">
          <Search size={18} className="text-slate-400" />
          <input value={filters.q} onChange={(event) => update('q', event.target.value)} placeholder="Search events, tags, organizer" className="w-full bg-transparent text-sm outline-none" />
        </label>
        <select value={filters.category} onChange={(event) => update('category', event.target.value)} className="rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-slate-200">
          <option value="">All categories</option>
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
        <input value={filters.location} onChange={(event) => update('location', event.target.value)} placeholder="Location" className="rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-slate-200" />
        <select value={filters.sort} onChange={(event) => update('sort', event.target.value)} className="rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-slate-200">
          <option value="trending">Trending</option>
          <option value="newest">Newest</option>
          <option value="deadline">Deadline soon</option>
        </select>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-nova-coral px-4 py-2 text-sm font-bold text-white"><Filter size={18} />Filter</button>
      </div>
    </section>
  );
}
