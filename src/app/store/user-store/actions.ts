import { createActionGroup, emptyProps } from '@ngrx/store';
import { Login } from 'src/app/shared/models/login.model';
import { User } from 'src/app/shared/models/user.model';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    Login: (login: Login) => ({ login }),
    Logout: emptyProps(),
    Authenticate: emptyProps(),
    Authenticated: (user?: User) => ({ user }),
    Update: (user?: User) => ({ user }),

    'Update XSRF Token': (xsrfToken?: string) => ({ xsrfToken }),
  },
});
