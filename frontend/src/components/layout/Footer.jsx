import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/70 py-8 text-sm text-nova-muted backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p>© 2026 STUDENOVA. Built for students, colleges, and industries.</p>
        <div className="flex gap-4">
          <Link to="/about" className="hover:text-nova-coral">About</Link>
          <Link to="/contact" className="hover:text-nova-coral">Contact</Link>
          <Link to="/events" className="hover:text-nova-coral">Explore</Link>
        </div>
      </div>
    </footer>
  );
}
