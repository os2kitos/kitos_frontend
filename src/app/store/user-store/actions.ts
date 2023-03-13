import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIOrganizationResponseDTO } from 'src/app/api/v2';
import { Login } from 'src/app/shared/models/login.model';
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
    'Update organization': (organization?: APIOrganizationResponseDTO) => ({ organization }),
  },
});
