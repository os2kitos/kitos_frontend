import { ONLY_DIGITS_REGEX } from '../constants/regex-constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromAnyToNumber(source: any): number {
  const sourceAsNumericString = source.toString().replace(ONLY_DIGITS_REGEX, '');
  if (!sourceAsNumericString) throw new Error('Invalid input provided for conversion into number');
  return parseInt(sourceAsNumericString);
}
