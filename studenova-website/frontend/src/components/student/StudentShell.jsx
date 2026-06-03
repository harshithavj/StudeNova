import { NavLink } from 'react-router-dom';
import { Award, Bell, BookOpenCheck, Flame, Search, UserRound } from 'lucide-react';
import BackButton from '../BackButton';
import Breadcrumbs from '../Breadcrumbs';

export const studentNavItems = [
  { to: '/student/discover', label: 'Discover Events', icon: Search },
  { to: '/student/my-events', label: 'My Events', icon: BookOpenCheck },
  { to: '/student/notifications', label: 'Notifications & Alerts', icon: Bell },
  { to: '/student/history', label: 'History', icon: Flame },
  { to: '/student/achievements-networking', label: 'Achievements & Networking', icon: Award },
  { to: '/student/profile', label: 'Profile', icon: UserRound }
];

export function StudentSidebar({ name }) {
  return (
    <aside className="surface h-fit rounded-lg p-4 lg:sticky lg:top-24">
      <p className="text-xs font-bold uppercase tracking-wider text-nova-coral">Student dashboard</p>
      <h1 className="mt-2 text-2xl font-black">Hi, {name || 'student'}</h1>
      <nav className="mt-5 grid gap-1 text-sm font-bold text-nova-muted">
        {studentNavItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-2 rounded-lg px-3 py-2 ${isActive ? 'bg-nova-peach text-nova-coral' : 'hover:bg-slate-100 hover:text-nova-ink'}`}>
            <Icon size={16} />{label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default function StudentShell({ children, user }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs />
      <BackButton />
      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <StudentSidebar name={user?.name} />
        <main>{children}</main>
      </div>
    </section>
  );
}
