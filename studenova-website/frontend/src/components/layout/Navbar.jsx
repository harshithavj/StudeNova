import { Bell, Bookmark, LayoutDashboard, LogOut, Menu, Search, X, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardPath } from '../../utils/navigation';
import Button from '../ui/Button';
import ProfilePopover from './ProfilePopover';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Explore' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const dashboardPath = getDashboardPath(user);

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
            <div className="flex items-center gap-2">
              <Link to="/notifications" className="rounded-lg p-2 text-nova-muted hover:bg-slate-100 hover:text-nova-coral" aria-label="Notifications"><Bell size={20} /></Link>
              <Link to="/saved" className="rounded-lg p-2 text-nova-muted hover:bg-slate-100 hover:text-nova-coral" aria-label="Saved events"><Bookmark size={20} /></Link>
              <Link to={dashboardPath} className="rounded-lg p-2 text-nova-muted hover:bg-slate-100 hover:text-nova-coral" aria-label="Dashboard"><LayoutDashboard size={20} /></Link>
              
              <div className="relative">
                <button 
                  onClick={() => setProfileOpen(prev => !prev)}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 transition focus:outline-none"
                  aria-label="User Profile"
                >
                  <svg className="absolute left-0 top-0 h-full w-full -rotate-90">
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      className="stroke-slate-100"
                      strokeWidth="2.5"
                      fill="transparent"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      className="stroke-blue-500"
                      strokeWidth="2.5"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 16}
                      strokeDashoffset={2 * Math.PI * 16 * (1 - 0.75)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-sm shadow-inner select-none">
                    👩‍💻
                  </div>
                </button>
                <ProfilePopover isOpen={profileOpen} onClose={() => setProfileOpen(false)} className="right-0 mt-2" />
              </div>
            </div>
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
            {[...navItems, ...(user ? [{ to: dashboardPath, label: 'Dashboard' }, { to: '/notifications', label: 'Notifications' }, { to: '/saved', label: 'Saved' }] : [{ to: '/login', label: 'Login' }, { to: '/auth/select-role', label: 'Get Started' }])].map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 font-semibold hover:bg-slate-100">{item.label}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
