import moment from 'moment';

const oneHourInMs = 60 * 60 * 1000;

export function getMaximumFutureDate(): Date {
  const maximumYearsAhead = 100;
  const today = new Date();
  return new Date(today.getFullYear() + maximumYearsAhead, today.getMonth(), today.getDate());
}

export const optionalNewDate = (date?: string): Date | undefined => {
  return date ? new Date(date) : undefined;
};

export const hasValidCache = (cacheTime?: number, time = new Date(), durationMs = oneHourInMs): boolean => {
  return !!cacheTime && cacheTime > time.getTime() - durationMs;
};

export const mapDateToString = (date: Date | string): string => {
  return moment(date).format('DD-MM-YYYY');
};
