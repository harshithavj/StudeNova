import BackButton from '../components/BackButton';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/ui/Button';

export default function Contact() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <Breadcrumbs />
      <BackButton />
      <h1 className="text-4xl font-black">Contact</h1>
      <form className="surface mt-6 grid gap-4 rounded-lg p-6">
        <input required placeholder="Name" className="rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200" />
        <input required type="email" placeholder="Email" className="rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200" />
        <textarea required rows="5" placeholder="How can we help?" className="rounded-lg bg-white px-4 py-3 ring-1 ring-slate-200" />
        <Button variant="accent">Send message</Button>
      </form>
    </section>
  );
}
