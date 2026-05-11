export function toCommaSeparatedString(array: string[]): string {
  if (array.length === 0) return '';
  return array.join(', ');
}
