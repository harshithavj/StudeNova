import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

export default function AppLayout() {
  return (
    <div className="min-h-screen text-nova-ink">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
