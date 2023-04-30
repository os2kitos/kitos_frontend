import { APIKLEDetailsDTO } from 'src/app/api/v2';

export function matchMainGroup(candidate: APIKLEDetailsDTO): boolean {
  return candidate.kleNumber.split('.').length === 1;
}

export function matchSubGroup(candidate: APIKLEDetailsDTO): boolean {
  return candidate.kleNumber.split('.').length === 2;
}

export function matchKleChoice(candidate: APIKLEDetailsDTO): boolean {
  return candidate.kleNumber.split('.').length >= 3;
}

export function compareKle(a: APIKLEDetailsDTO, b: APIKLEDetailsDTO) {
  return convertKleNumberToNumeric(a) - convertKleNumberToNumeric(b);
}

export function convertKleNumberToNumeric(kle: APIKLEDetailsDTO) {
  return Number(kle.kleNumber.replace('.', ''));
}
