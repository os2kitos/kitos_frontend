import { APIUserDTO } from 'src/app/api/v1';

export interface User {
  id: number;
  uuid: string;
  email: string;
  fullName: string;
  isGlobalAdmin: boolean;
  isLocalAdmin: boolean;
}

const localAdminEnumValue = 1;

export const adaptUser = (apiUser?: APIUserDTO): User | undefined => {
  if (apiUser?.id === undefined || apiUser?.uuid === undefined || apiUser?.email === undefined) return;

  return {
    id: apiUser.id,
    uuid: apiUser.uuid,
    email: apiUser.email,
    fullName: apiUser?.fullName ?? '',
    isGlobalAdmin: apiUser?.isGlobalAdmin ?? false,
    isLocalAdmin:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      apiUser.organizationRights?.map((right) => (right as any).role).includes(localAdminEnumValue) ?? false,
  };
};
