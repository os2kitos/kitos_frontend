import { APIIdentityNamePairResponseDTO } from "src/app/api/v2";

export interface IdentityNamePair {
  uuid: string,
  name: string
}

export const mapIdentityNamePair = (
  value?: APIIdentityNamePairResponseDTO
): IdentityNamePair | undefined => {
  const uuid = value?.uuid ? value.uuid: '';
  const name = value?.name ? value.name: '';
  return { uuid: uuid, name: name };
}
