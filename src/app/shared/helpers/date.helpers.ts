const oneHourInMs = 60 * 60 * 1000;

export const optionalNewDate = (date?: string): Date | undefined => {
  return date ? new Date(date) : undefined;
};

export const hasValidCache = (cacheTime?: number, time = new Date(), durationMs = oneHourInMs): boolean => {
  return !!cacheTime && cacheTime > time.getTime() - durationMs;
};

export const toLocalISOString = (date: Date): string => {
  const tzo = -date.getTimezoneOffset();
  const dif = tzo >= 0 ? '+' : '-';
  const pad = function (num: number) {
    const norm = Math.floor(Math.abs(num));
    return (norm < 10 ? '0' : '') + norm;
  };

  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds()) +
    dif +
    pad(tzo / 60) +
    ':' +
    pad(tzo % 60)
  );
};
