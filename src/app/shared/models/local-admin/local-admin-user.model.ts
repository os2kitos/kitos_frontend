import { APIUserReferenceWithOrganizationResponseDTO } from 'src/app/api/v2';
import { IdentityNamePair } from '../identity-name-pair.model';
import { adaptShallowUser, ShallowUser } from '../userV2.model';

export interface LocalAdminUser {
  user: ShallowUser;
  organization: IdentityNamePair;
}

export function adaptLocalAdminUser(dto: APIUserReferenceWithOrganizationResponseDTO): LocalAdminUser {
  const user = adaptShallowUser(dto);
  const organization = dto.organization;
  return {
    user,
    organization,
  };
}
