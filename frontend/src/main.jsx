import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import PageLoader from './components/ui/PageLoader';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const RoleSelection = lazy(() => import('./pages/RoleSelection'));
const ExploreEvents = lazy(() => import('./pages/ExploreEvents'));
const EventDetails = lazy(() => import('./pages/EventDetails'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const StudentDiscover = lazy(() => import('./pages/StudentDiscover'));
const StudentMyEvents = lazy(() => import('./pages/StudentMyEvents'));
const StudentNotificationsAlerts = lazy(() => import('./pages/StudentNotificationsAlerts'));
const StudentHistory = lazy(() => import('./pages/StudentHistory'));
const StudentAchievementsNetworking = lazy(() => import('./pages/StudentAchievementsNetworking'));
const StudentProfile = lazy(() => import('./pages/StudentProfile'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Notifications = lazy(() => import('./pages/Notifications'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const SavedEvents = lazy(() => import('./pages/SavedEvents'));
const NotFound = lazy(() => import('./pages/NotFound'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<AppLayout />}>
                <Route index element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth/select-role" element={<RoleSelection />} />
                <Route path="/signup/:roleType" element={<Signup />} />
                <Route path="/signup" element={<RoleSelection />} />
                <Route path="/events" element={<ExploreEvents />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard/student" element={<StudentDashboard />} />
                  <Route path="/student-dashboard" element={<StudentDashboard />} />
                  <Route path="/student/discover" element={<StudentDiscover />} />
                  <Route path="/student/my-events" element={<StudentMyEvents />} />
                  <Route path="/student/notifications" element={<StudentNotificationsAlerts />} />
                  <Route path="/student/history" element={<StudentHistory />} />
                  <Route path="/student/achievements-networking" element={<StudentAchievementsNetworking />} />
                  <Route path="/student/profile" element={<StudentProfile />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/:roleType" element={<Dashboard />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/saved" element={<SavedEvents />} />
                </Route>
                <Route element={<ProtectedRoute roles={['college_admin', 'industry_organizer']} />}>
                  <Route path="/admin" element={<AdminPanel />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
