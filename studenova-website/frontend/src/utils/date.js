export function formatDate(value) {
  if (!value) return 'N/A';
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  } catch {
    return 'N/A';
  }
}

export function daysUntil(value) {
  if (!value) return 0;
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 0;
    const ms = date.getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / 86400000));
  } catch {
    return 0;
  }
}
