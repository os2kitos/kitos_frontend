import { Organization } from 'src/app/shared/models/organization.model';
import { User } from 'src/app/shared/models/user.model';

export interface UserState {
  user: User | undefined;
  isAuthenticating: boolean;
  hasAuthenticated: boolean;

  organization: Organization | undefined;
}

export const initialState: UserState = {
  user: undefined,
  isAuthenticating: false,
  hasAuthenticated: false,

  organization: undefined,
};
