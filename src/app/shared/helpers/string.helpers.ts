import { SPACE_CHARACTER_REGEX } from '../constants/regex-constants';
import { fromCommaSeparatedString, toCommaSeparatedString } from './array.helpers';
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

export const formatNamesAndAttributesFromCsv = (
  namesAsCsv: string | undefined,
  attributesAsCsv: string | undefined,
  addParenthesesForAttributes = true,
): string => {
  if (!namesAsCsv) return '';
  if (!attributesAsCsv) return namesAsCsv;

  const nameList = fromCommaSeparatedString(namesAsCsv);
  const attributeList = fromCommaSeparatedString(attributesAsCsv);
  const namesWithOptionalAttributes = nameList.map((name, i) => {
    const attr = attributeList[i];
    if (attr) {
      const formattedAttr = addParenthesesForAttributes ? `(${attr})` : `${attr}`;
      return `${name} ${formattedAttr}`;
    }
    return name;
  });

  return toCommaSeparatedString(namesWithOptionalAttributes);
};
