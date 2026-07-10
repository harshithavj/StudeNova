import { NavLink, useNavigate } from 'react-router-dom';
import { Award, Bell, BookOpenCheck, Flame, LogOut, Search, Trash2, UserRound } from 'lucide-react';
import BackButton from '../BackButton';
import Breadcrumbs from '../Breadcrumbs';
import { useAuth } from '../../context/AuthContext';

export const studentNavItems = [
  { to: '/student/discover', label: 'Discover Events', icon: Search },
  { to: '/student/my-events', label: 'My Events', icon: BookOpenCheck },
  { to: '/student/notifications', label: 'Notifications & Alerts', icon: Bell },
  { to: '/student/history', label: 'History', icon: Flame },
  { to: '/student/achievements-networking', label: 'Achievements & Networking', icon: Award },
  { to: '/student/profile', label: 'Profile', icon: UserRound }
];

export function StudentSidebar({ name }) {
  const { logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (!window.confirm('This will permanently delete your account and all your STUDENOVA data. You will need to register again. Continue?')) {
      return;
    }

    await deleteAccount();
    navigate('/auth/select-role');
  };

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
      <button onClick={logout} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-nova-muted transition hover:border-nova-coral hover:text-nova-coral">
        <LogOut size={16} /> Log out
      </button>
      <button onClick={handleDeleteAccount} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-nova-muted transition hover:border-red-500 hover:text-red-500">
        <Trash2 size={16} /> Delete Account
      </button>
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
