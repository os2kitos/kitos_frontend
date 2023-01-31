import { Organization } from 'src/app/shared/models/organization.model';
import { User } from 'src/app/shared/models/user.model';

export interface UserState {
  user: User | undefined;
  hasAuthenticated: boolean;
  userLoading: boolean;

  organization: Organization | undefined;
}

export const initialState: UserState = {
  user: undefined,
  hasAuthenticated: false,
  userLoading: false,

  organization: undefined,
};
