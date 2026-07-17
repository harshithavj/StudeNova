import { BellRing } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import BackButton from '../components/BackButton';
import Breadcrumbs from '../components/Breadcrumbs';
import api from '../services/api';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications')
      .then(({ data }) => setNotifications(data.items || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((current) => current.filter((item) => item.id !== id));
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Unable to mark notification as read');
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs />
      <BackButton />
      <h1 className="text-4xl font-black">Notifications</h1>
      <div className="mt-6 grid gap-3">
        {loading ? (
          <div className="text-center py-10 text-nova-muted font-bold">Loading notifications...</div>
        ) : notifications.length > 0 ? (
          notifications.map((item) => (
            <article key={item.id} className="surface flex gap-4 rounded-lg p-5">
              <BellRing className="mt-1 text-nova-coral" />
              <div>
                <h2 className="font-black">{item.title}</h2>
                <p className="text-sm text-nova-muted">{item.body}</p>
                {!item.is_read && (
                  <button onClick={() => markRead(item.id)} className="mt-3 text-sm font-bold text-nova-coral">
                    Mark as read
                  </button>
                )}
              </div>
            </article>
          ))
        ) : (
          <div className="text-center py-10 text-nova-muted font-bold">No new notifications.</div>
        )}
      </div>
    </section>
  );
}
