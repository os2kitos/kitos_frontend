import { User } from 'src/app/shared/models/user.model';

export interface UserState {
  user: User | undefined;
  hasAuthenticated: boolean;
  xsrfToken: string | undefined;
  userLoading: boolean;
}

export const initialState: UserState = {
  user: undefined,
  hasAuthenticated: false,
  xsrfToken: undefined,
  userLoading: false,
};
