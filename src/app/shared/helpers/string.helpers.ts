import { SPACE_CHARACTER_REGEX } from '../constants/regex-constants';
import { addOptionalExpiredText } from './option-type.helper';

export function isEmptyOrUndefined(s: string | undefined) {
  return !s || s.length === 0;
}

export function entityWithUnavailableName(name: string, unavailable: boolean): string {
  return unavailable ? $localize`${name} (Ikke tilgængeligt)` : name;
}

export function toBulletPoints(s: Array<string | undefined>): string {
  return s
    .filter((x) => x)
    .map((x) => `• ${x}`)
    .join('\n');
}

export function removeWhitespace(s: string): string {
  return s.replace(SPACE_CHARACTER_REGEX, '');
}

export function organizationNameWithCvr(name: string | undefined, cvr: string | undefined): string {
  if (!name) return '';
  return cvr ? `${name} (${cvr})` : name;
}

export function organizationNameWithCvrAndAvailability(
  name: string | undefined,
  cvr: string | undefined,
  isDisabled: boolean,
): string {
  const nameWithCvr = organizationNameWithCvr(name, cvr);
  return addOptionalExpiredText(nameWithCvr, isDisabled);
}
