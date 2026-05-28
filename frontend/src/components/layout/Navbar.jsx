import { Bell, Bookmark, LayoutDashboard, LogOut, Menu, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Explore' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-nova-coral text-sm font-black text-white shadow-coral">SN</span>
          <span>
            <span className="block text-lg font-black tracking-wide">STUDENOVA</span>
            <span className="hidden text-xs text-nova-muted sm:block">Never miss an opportunity again</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-nova-peach text-nova-coral' : 'text-nova-muted hover:bg-slate-100 hover:text-nova-ink'}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/events" className="rounded-lg p-2 text-nova-muted hover:bg-slate-100 hover:text-nova-coral" aria-label="Search events"><Search size={20} /></Link>
          {user ? (
            <>
              <Link to="/notifications" className="rounded-lg p-2 text-nova-muted hover:bg-slate-100 hover:text-nova-coral" aria-label="Notifications"><Bell size={20} /></Link>
              <Link to="/saved" className="rounded-lg p-2 text-nova-muted hover:bg-slate-100 hover:text-nova-coral" aria-label="Saved events"><Bookmark size={20} /></Link>
              <Link to={`/dashboard/${user.role === 'college_admin' ? 'college-organizer' : user.role === 'industry_organizer' ? 'industry-organizer' : 'student'}`} className="rounded-lg p-2 text-nova-muted hover:bg-slate-100 hover:text-nova-coral" aria-label="Dashboard"><LayoutDashboard size={20} /></Link>
              <button onClick={logout} className="rounded-lg p-2 text-nova-muted hover:bg-slate-100 hover:text-nova-coral" aria-label="Log out"><LogOut size={20} /></button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" size="sm" variant="secondary">Login</Button>
              <Button as={Link} to="/auth/select-role" size="sm" variant="subtle">Sign Up</Button>
              <Button as={Link} to="/auth/select-role" size="sm" variant="accent">Get Started</Button>
            </>
          )}
        </div>

        <button onClick={() => setOpen((value) => !value)} className="rounded-lg p-2 md:hidden" aria-label="Open navigation">{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="grid gap-2">
            {[...navItems, ...(user ? [{ to: '/dashboard/student', label: 'Dashboard' }, { to: '/notifications', label: 'Notifications' }, { to: '/saved', label: 'Saved' }] : [{ to: '/login', label: 'Login' }, { to: '/auth/select-role', label: 'Get Started' }])].map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 font-semibold hover:bg-slate-100">{item.label}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
