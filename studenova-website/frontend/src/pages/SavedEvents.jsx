import { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';
import BackButton from '../components/BackButton';
import Breadcrumbs from '../components/Breadcrumbs';

export default function SavedEvents() {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('studenova_saved_events') || '[]');
      setSaved(stored);
    } catch {
      setSaved([]);
    }
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs />
      <BackButton />
      <h1 className="text-4xl font-black">Saved Events</h1>
      <p className="mt-2 text-nova-muted">Bookmarks sync across devices and feed your recommendation engine.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {saved.length > 0 ? (
          saved.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <div className="col-span-full py-10 text-center text-nova-muted font-bold">No saved events yet.</div>
        )}
      </div>
    </section>
  );
}
