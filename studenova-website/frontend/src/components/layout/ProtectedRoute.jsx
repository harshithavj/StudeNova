import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ roles, loginPath = '/login' }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to={loginPath} state={{ from: location }} replace />;
  if (roles?.length && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  if (location.pathname.startsWith('/college/') && user.role === 'college_organizer') {
    const verificationStatus = user.verificationStatus || user.verification_status || 'approved';
    if (verificationStatus === 'pending' && location.pathname !== '/college/pending-approval') {
      return <Navigate to="/college/pending-approval" replace />;
    }
    if (verificationStatus === 'rejected' && location.pathname !== '/college/rejected') {
      return <Navigate to="/college/rejected" replace />;
    }
    if (verificationStatus === 'approved' && ['/college/pending-approval', '/college/rejected'].includes(location.pathname)) {
      return <Navigate to="/college/dashboard" replace />;
    }
  }
  return <Outlet />;
}
