// insertDate may arrive as Unix seconds, milliseconds, or a date string.
const toDate = (value) => {
  if (typeof value === 'number' || /^\d+$/.test(value)) {
    const num = Number(value);
    return new Date(num < 1e12 ? num * 1000 : num);
  }
  return new Date(value);
};

// Reads creationDate and falls back to insertDate -> "2026-10-21", or '' when missing/invalid.
export const formatDateOnly = (item) => {
  const raw = item.creationDate || item.insertDate;
  if (!raw) return '';
  const date = toDate(raw);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};

// "2026-10-21T04:35:00.000Z" -> "10/21/26 10:05 AM" in the viewer's local time.
// Reads creationDate (ISO string) and falls back to insertDate (unix seconds).
export const formatDateTime = (item) => {
  const date = item.creationDate
    ? new Date(item.creationDate)
    : item.insertDate
      ? new Date(item.insertDate * 1000)
      : null;
  if (!date || Number.isNaN(date.getTime())) return '';
  return date
    .toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
    })
    .replace(',', '');
};
