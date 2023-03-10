import { createActionGroup, emptyProps } from '@ngrx/store';
import { Login } from 'src/app/shared/models/login.model';
import { Organization } from 'src/app/shared/models/organization.model';
import { User } from 'src/app/shared/models/user.model';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    'Login ': (login: Login) => ({ login }),
    'Logout ': emptyProps(),
    'Authenticate ': emptyProps(),
    'Authenticate Success ': (user?: User) => ({ user }),
    'Authenticate Error': emptyProps(),

    'Get organizations for user': emptyProps(),
    'Update organization': (organization?: Organization) => ({ organization }),
  },
});
