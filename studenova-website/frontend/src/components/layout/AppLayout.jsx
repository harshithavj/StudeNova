import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

export default function AppLayout() {
  const location = useLocation();
  const isCollegeWorkspace = location.pathname.startsWith('/college/');

  return (
    <div className="min-h-screen text-nova-ink">
      {!isCollegeWorkspace && <Navbar />}
      <main>
        <Outlet />
      </main>
      {!isCollegeWorkspace && <Footer />}
    </div>
  );
}
