import { createActionGroup } from '@ngrx/store';
import { Login } from 'src/app/shared/models/login.model';
import { User } from 'src/app/shared/models/user.model';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    'Login user': (login: Login) => login,
    'Update user': (user?: User) => ({ user }),
  },
});
