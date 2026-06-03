import EventCard from '../components/EventCard';
import BackButton from '../components/BackButton';
import Breadcrumbs from '../components/Breadcrumbs';
import { sampleEvents } from '../data/mockData';

export default function SavedEvents() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs />
      <BackButton />
      <h1 className="text-4xl font-black">Saved Events</h1>
      <p className="mt-2 text-nova-muted">Bookmarks sync across devices and feed your recommendation engine.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-3">{sampleEvents.map((event) => <EventCard key={event.id} event={event} />)}</div>
    </section>
  );
}
