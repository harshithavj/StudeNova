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
        if (active) setEvents(data.items?.length ? data.items : sampleEvents);
      })
      .catch((err) => {
        if (active) setError(err);
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
