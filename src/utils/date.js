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
