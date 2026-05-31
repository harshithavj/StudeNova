import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ roles, loginPath = '/login' }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to={loginPath} state={{ from: location }} replace />;
  if (roles?.length && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
