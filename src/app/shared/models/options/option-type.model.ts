import { APIIdentityNamePairResponseDTO, APIRegularOptionResponseDTO } from 'src/app/api/v2';

export const mapOptionCrossReferenceToOptionDTO = (
  value?: APIIdentityNamePairResponseDTO
): APIRegularOptionResponseDTO | undefined => {
  return value ? { uuid: value.uuid, name: value.name, description: '' } : undefined;
};

export type ShallowOptionType = {
  uuid: string;
  name: string;
  description: string;
};

// 20/11/24 due to the OData organizations endpoint changing all field names to PascalCase, this needs to account for both uppercase and lowercase starting letters.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adaptShallowOptionTypeFromOData(source: any): ShallowOptionType {
  if (!source.Uuid) throw new Error('No Uuid found on source when adapting shallow option type from OData');

  return {
    uuid: source.Uuid,
    name: source.Name,
    description: source.Description,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adaptShallowOptionType(source: any): ShallowOptionType {
  if (!source.uuid) throw new Error('No uuid found on source when adapting shallow option type');

  return {
    uuid: source.uuid,
    name: source.name,
    description: source.description,
  };
}
