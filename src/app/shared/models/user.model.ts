import { APIUserDTO } from 'src/app/api/v1';

export interface User {
  id: number;
  email: string;
  fullName: string;
  isGlobalAdmin: boolean;
}

export const adaptUser = (apiUser?: APIUserDTO): User | undefined => {
  if (apiUser?.id === undefined || apiUser?.email === undefined) return;

  return {
    id: apiUser.id,
    email: apiUser.email,
    fullName: apiUser?.fullName ?? '',
    isGlobalAdmin: apiUser?.isGlobalAdmin ?? false,
  };
};
