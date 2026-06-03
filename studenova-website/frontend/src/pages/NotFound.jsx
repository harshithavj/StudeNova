import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-nova-coral">404</p>
        <h1 className="mt-3 text-5xl font-black">Page not found</h1>
        <p className="mx-auto mt-3 max-w-lg text-nova-muted">The event, dashboard, or page you were looking for is not available.</p>
        <Button as={Link} to="/" className="mt-6">Go home</Button>
      </div>
    </section>
  );
}
