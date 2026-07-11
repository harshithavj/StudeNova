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
