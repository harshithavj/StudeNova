import { useEffect, useState } from 'react';
import api from '../services/api';
import { sampleEvents } from '../data/mockData';

export function useEvents(params = {}) {
  const [events, setEvents] = useState(sampleEvents);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.get('/events', { params })
      .then(({ data }) => {
        if (active) {
          const dbEvents = (data.items || []).map((event) => ({
            ...event,
            id: `db-${event.id}`,
            date: event.starts_at,
            image_url: event.poster_url || event.event_banner || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80'
          }));
          setEvents(dbEvents.length ? [...dbEvents, ...sampleEvents] : sampleEvents);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err);
          setEvents(sampleEvents); // fallback to sampleEvents on error
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [JSON.stringify(params)]);

  return { events, loading, error };
}
