export function toCommaSeparatedString(array: string[]): string {
  if (array.length === 0) return '';
  return array.join(', ');
}

export function fromCommaSeparatedString(s: string): string[] {
  return s.split(',').map((x) => x.trim());
}
