import { User } from 'src/app/shared/models/user.model';

export interface UserState {
  user: User | undefined;
  hasAuthenticated: boolean;
  userLoading: boolean;
}

export const initialState: UserState = {
  user: undefined,
  hasAuthenticated: false,
  userLoading: false,
};
