import { createActionGroup, emptyProps } from '@ngrx/store';
import { Login } from 'src/app/shared/models/login.model';
import { Organization } from 'src/app/shared/models/organization.model';
import { User } from 'src/app/shared/models/user.model';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    Login: (login: Login) => ({ login }),
    Logout: emptyProps(),
    Authenticate: emptyProps(),
    Authenticated: (user?: User) => ({ user }),
    'Authenticate Failed': emptyProps(),

    'Get organizations for user': emptyProps(),

    Clear: emptyProps(),

    'Update XSRF Token': (xsrfToken?: string) => ({ xsrfToken }),

    'Update organization': (organization?: Organization) => ({ organization }),
  },
});
