import { Organization } from 'src/app/shared/models/organization.model';
import { User } from 'src/app/shared/models/user.model';

export interface UserState {
  user: User | undefined;
  isAuthenticating: boolean;
  hasTriedAuthenticating: boolean;

  organization: Organization | undefined;
}

export const initialState: UserState = {
  user: undefined,
  isAuthenticating: false,
  hasTriedAuthenticating: false,

  organization: undefined,
};
