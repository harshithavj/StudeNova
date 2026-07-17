import { Award, BookOpenCheck, CalendarDays, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import StudentShell from '../components/student/StudentShell';
import { useAuth } from '../context/AuthContext';
import { studentAchievements } from '../data/mockData';

function readStudentEvents() {
  try {
    return JSON.parse(localStorage.getItem('studenova_student_events') || '[]');
  } catch {
    return [];
  }
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="surface rounded-lg p-5">
      <Icon className="text-nova-coral" />
      <p className="mt-4 text-3xl font-black">{value}</p>
      <p className="text-sm text-nova-muted">{label}</p>
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const registeredEvents = readStudentEvents();

  return (
    <StudentShell user={user}>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-nova-coral">Dashboard overview</p>
          <h2 className="text-4xl font-black">Your opportunity summary</h2>
          <p className="mt-2 max-w-2xl text-nova-muted">Track participation at a glance, then use the sidebar to open dedicated student pages.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard icon={CalendarDays} label="Total Participated Events" value="0" />
          <StatCard icon={BookOpenCheck} label="Active Registrations" value={registeredEvents.length} />
          <StatCard icon={Award} label="Achievements Earned" value={studentAchievements.length} />
          <StatCard icon={Flame} label="Participation Streak" value={user?.participation_streak || 0} />
        </div>
        <div className="surface rounded-lg p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <Button as={Link} to="/student/discover" variant="accent">Discover Events</Button>
            <Button as={Link} to="/student/my-events" variant="secondary">View My Events</Button>
            <Button as={Link} to="/student/notifications" variant="secondary">Check Alerts</Button>
          </div>
        </div>
      </div>
    </StudentShell>
  );
}
