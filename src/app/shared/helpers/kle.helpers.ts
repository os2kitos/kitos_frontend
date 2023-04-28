import { APIKLEDetailsDTO } from 'src/app/api/v2';

export function convertKleNumberToNumeric(kle: APIKLEDetailsDTO) {
  return Number(kle.kleNumber.replace('.', ''));
}
