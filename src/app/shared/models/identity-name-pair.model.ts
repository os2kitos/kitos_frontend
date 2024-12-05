import { APIIdentityNamePairResponseDTO, APIIdentityNamePairWithDeactivatedStatusDTO } from "src/app/api/v2";

export interface IdentityNamePair {
  uuid: string,
  name: string
}

export interface IdentityNamePairWithDeactivatedStatus extends IdentityNamePair {
  deactivated: boolean
}

export const mapIdentityNamePair = (
  value?: APIIdentityNamePairResponseDTO
): IdentityNamePair | undefined => {
  const uuid = value?.uuid ? value.uuid: '';
  const name = value?.name ? value.name: '';
  return { uuid: uuid, name: name };
}

export const mapIdentityNamePairWithDeactivatedStatus = (
  value?: APIIdentityNamePairWithDeactivatedStatusDTO
): IdentityNamePairWithDeactivatedStatus | undefined => {
  const identityNamePair = mapIdentityNamePair(value);
  if (! identityNamePair) return undefined;
  return {
    ...identityNamePair,
    deactivated: value?.deactivated ? value.deactivated: false
  }
}
