import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCollegeOrganizerPath, getDashboardPath, isCollegeOrganizer } from '../../utils/navigation';

export default function ProtectedRoute({ roles, loginPath = '/login' }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to={loginPath} state={{ from: location }} replace />;
  if (roles?.length && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  if (location.pathname.startsWith('/college/')) {
    if (!isCollegeOrganizer(user)) {
      return <Navigate to={getDashboardPath(user)} replace />;
    }
    const organizerPath = getCollegeOrganizerPath(user);
    if (organizerPath !== '/college/dashboard' && location.pathname !== organizerPath) {
      return <Navigate to={organizerPath} replace />;
    }
    if (organizerPath === '/college/dashboard' && ['/college/pending-approval', '/college/rejected'].includes(location.pathname)) {
      return <Navigate to={organizerPath} replace />;
    }
  }

  if (location.pathname.startsWith('/student/') || location.pathname === '/dashboard/student' || location.pathname === '/student-dashboard') {
    if (user.role !== 'student') {
      return <Navigate to={getDashboardPath(user)} replace />;
    }
  }

  return <Outlet />;
}
