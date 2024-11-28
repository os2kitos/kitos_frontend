import { APIUserDTO } from 'src/app/api/v1';
import { adaptV1OrganizationRights, OrganizationRight } from './organization-right.model';

export interface User {
  id: number;
  uuid: string;
  email: string;
  fullName: string;
  isGlobalAdmin: boolean;
  organizationRights: OrganizationRight[];
  defaultUnitUuid?: string;
}

export const adaptUser = (apiUser?: APIUserDTO): User | undefined => {
  if (apiUser?.id === undefined || apiUser?.uuid === undefined || apiUser?.email === undefined) return;

  return {
    id: apiUser.id,
    uuid: apiUser.uuid,
    email: apiUser.email,
    fullName: apiUser?.fullName ?? '',
    isGlobalAdmin: apiUser?.isGlobalAdmin ?? false,
    organizationRights: adaptV1OrganizationRights(apiUser?.organizationRights ?? []),
    defaultUnitUuid: apiUser.defaultOrganizationUnitUuid,
  };
};
