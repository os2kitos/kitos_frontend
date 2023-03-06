export const optionalNewDate = (date?: string): Date | undefined => {
  return date ? new Date(date) : undefined;
};
