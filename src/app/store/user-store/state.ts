import { User } from 'src/app/shared/models/user.model';

export interface UserState {
  user: User | undefined;
  userLoading: boolean;
  userError: boolean;
}

export const initialState: UserState = {
  user: undefined,
  userLoading: false,
  userError: false,
};
