const oneHourInMs = 60 * 60 * 1000;

export const optionalNewDate = (date?: string): Date | undefined => {
  return date ? new Date(date) : undefined;
};

export const hasValidCache = (cacheTime?: number, time = new Date(), durationMs = oneHourInMs): boolean => {
  return !!cacheTime && cacheTime > time.getTime() - durationMs;
};
