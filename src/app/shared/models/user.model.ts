import { APIOrganizationRightDTO, APIUserDTO } from 'src/app/api/v1';
import { adaptV1OrganizationRights, OrganizationRight } from './organization-right.model';
import {
  mapStartPreferenceChoiceFromV1,
  StartPreferenceChoice,
} from './organization/organization-user/start-preference.model';

export interface User {
  id: number;
  uuid: string;
  email: string;
  fullName: string;
  isGlobalAdmin: boolean;
  defaultStartPage: StartPreferenceChoice | undefined;
  organizationRights: OrganizationRight[];
  defaultOrganizationUuid?: string;
  defaultOrganizationName?: string;
  defaultUnitUuid?: string;
}

export const adaptUser = (apiUser?: APIUserDTO): User | undefined => {
  if (apiUser?.id === undefined || apiUser?.uuid === undefined || apiUser?.email === undefined) return;

  const userOrganizationRight = apiUser?.organizationRights?.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (right) => right.role === APIOrganizationRightDTO.RoleEnum.User || right.role === (0 as any)
  );
  const organizationUuid = userOrganizationRight?.organizationUuid;
  const organizationName = userOrganizationRight?.organizationName;

  return {
    id: apiUser.id,
    uuid: apiUser.uuid,
    email: apiUser.email,
    fullName: apiUser?.fullName ?? '',
    isGlobalAdmin: apiUser?.isGlobalAdmin ?? false,
    organizationRights: adaptV1OrganizationRights(apiUser?.organizationRights ?? []),
    defaultOrganizationUuid: organizationUuid,
    defaultOrganizationName: organizationName,
    defaultStartPage: mapStartPreferenceChoiceFromV1(apiUser.defaultUserStartPreference),
    defaultUnitUuid: apiUser.defaultOrganizationUnitUuid,
  };
};
