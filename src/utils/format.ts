export const formatDuration = (seconds: number): string => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remaining = safeSeconds % 60;
  return `${minutes}:${remaining.toString().padStart(2, '0')}`;
};

export const formatDateLabel = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return 'Date inconnue';
  }
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
};
