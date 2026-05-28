import { BellRing, Clock, Mail } from 'lucide-react';
import BackButton from '../components/BackButton';
import Breadcrumbs from '../components/Breadcrumbs';

const notifications = [
  { icon: BellRing, title: 'NovaHack deadline approaching', body: 'Registration closes soon. Complete your team profile.' },
  { icon: Clock, title: 'Workshop starts tomorrow', body: 'Cloud Careers prep session begins at 11:00 AM.' },
  { icon: Mail, title: 'Email reminder sent', body: 'A calendar invite and QR check-in token were sent to your inbox.' }
];

export default function Notifications() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs />
      <BackButton />
      <h1 className="text-4xl font-black">Notifications</h1>
      <div className="mt-6 grid gap-3">
        {notifications.map(({ icon: Icon, title, body }) => (
          <article key={title} className="surface flex gap-4 rounded-lg p-5">
            <Icon className="mt-1 text-nova-coral" />
            <div>
              <h2 className="font-black">{title}</h2>
              <p className="text-sm text-nova-muted">{body}</p>
              <button className="mt-3 text-sm font-bold text-nova-coral">Mark as read</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
