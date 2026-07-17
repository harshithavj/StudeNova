import { FileUp, MessageSquareText, Send, Star, Trophy, UserPlus, UsersRound } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import StudentShell from '../components/student/StudentShell';
import { useAuth } from '../context/AuthContext';
import { studentAchievements } from '../data/mockData';

const recommendations = [];

export default function StudentAchievementsNetworking() {
  const { user } = useAuth();

  return (
    <StudentShell user={user}>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-nova-coral">Achievements & Networking</p>
          <h2 className="text-4xl font-black">Show proof, find collaborators, form teams</h2>
        </div>
        <section className="surface rounded-lg p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-2xl font-black">Achievements</h3>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold ring-1 ring-slate-200">
              <FileUp size={16} />Upload Certificate or Proof
              <input type="file" className="hidden" onChange={() => toast.success('Achievement proof ready to upload')} />
            </label>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {studentAchievements.length > 0 ? (
              studentAchievements.map((item) => (
                <article key={item.id} className="rounded-lg bg-white p-4 ring-1 ring-slate-200">
                  <Trophy className="text-nova-coral" />
                  <h4 className="mt-3 text-lg font-black">{item.event}</h4>
                  <p className="mt-1 text-sm text-nova-muted">Position secured: {item.title}</p>
                  <p className="mt-3 text-sm font-bold">{item.proof}</p>
                  <span className="mt-3 inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700"><Star size={14} />Achievement Badge</span>
                </article>
              ))
            ) : (
              <p className="col-span-full py-4 text-center text-nova-muted font-bold">No achievements uploaded yet.</p>
            )}
          </div>
        </section>
        <section className="surface rounded-lg p-6">
          <h3 className="text-2xl font-black">Networking Recommendations</h3>
          <p className="mt-2 text-nova-muted">Recommended using uploaded achievements, interests, previous participation, and domain overlap.</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {recommendations.length > 0 ? (
              recommendations.map((person) => (
                <article key={person.name} className="rounded-lg bg-white p-4 ring-1 ring-slate-200">
                  <UsersRound className="text-nova-coral" />
                  <h4 className="mt-3 text-lg font-black">{person.name}</h4>
                  <p className="text-sm font-bold text-nova-muted">{person.role}</p>
                  <p className="mt-1 text-sm text-nova-muted">{person.college}</p>
                  <p className="mt-3 text-sm">{person.reason}</p>
                  <div className="mt-4 grid gap-2">
                    <Button size="sm" variant="secondary"><UserPlus size={16} />Connect Request</Button>
                    <Button size="sm" variant="secondary"><Star size={16} />Follow</Button>
                    <Button size="sm" variant="secondary"><MessageSquareText size={16} />Direct Message</Button>
                    <Button size="sm" variant="accent"><Send size={16} />Team Formation</Button>
                  </div>
                </article>
              ))
            ) : (
              <p className="col-span-full py-4 text-center text-nova-muted font-bold">No networking recommendations available at the moment.</p>
            )}
          </div>
        </section>
      </div>
    </StudentShell>
  );
}
