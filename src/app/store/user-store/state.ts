import { User } from 'src/app/shared/models/user.model';

export interface UserState {
  user: User | undefined;

  userIsFetching: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any | undefined;
}

export const initialState: UserState = {
  user: undefined,
  userIsFetching: false,
  error: undefined,
};
