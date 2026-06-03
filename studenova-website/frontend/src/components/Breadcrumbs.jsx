import { Link, useLocation } from 'react-router-dom';

const labels = {
  auth: 'Auth',
  'select-role': 'Select role',
  signup: 'Signup',
  events: 'Events',
  dashboard: 'Dashboard',
  notifications: 'Notifications',
  about: 'About',
  contact: 'Contact',
  admin: 'Admin'
};

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);
  if (!parts.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-nova-muted">
      <Link to="/" className="font-semibold hover:text-nova-coral">Home</Link>
      {parts.map((part, index) => {
        const to = `/${parts.slice(0, index + 1).join('/')}`;
        const isLast = index === parts.length - 1;
        return (
          <span key={to} className="flex items-center gap-2">
            <span>/</span>
            {isLast ? <span className="font-semibold text-nova-ink">{labels[part] || part}</span> : <Link to={to} className="font-semibold hover:text-nova-coral">{labels[part] || part}</Link>}
          </span>
        );
      })}
    </nav>
  );
}
