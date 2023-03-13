import { APIIdentityNamePairResponseDTO, APIRegularOptionResponseDTO } from 'src/app/api/v2';

export const mapBusinessTypeToOption = (
  value?: APIIdentityNamePairResponseDTO
): APIRegularOptionResponseDTO | undefined => {
  return value ? { uuid: value.uuid, name: value.name, description: '' } : undefined;
};
