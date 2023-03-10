import { APIOrganizationResponseDTO } from 'src/app/api/v2';
import { User } from 'src/app/shared/models/user.model';

export interface UserState {
  user: User | undefined;
  isAuthenticating: boolean;
  hasTriedAuthenticating: boolean;

  organization: APIOrganizationResponseDTO | undefined;
}

export const userInitialState: UserState = {
  user: undefined,
  isAuthenticating: false,
  hasTriedAuthenticating: false,

  organization: undefined,
};
