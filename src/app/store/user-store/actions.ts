import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIOrganizationResponseDTO } from 'src/app/api/v2';
import { Login } from 'src/app/shared/models/login.model';
import { User } from 'src/app/shared/models/user.model';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    'Login ': (login: Login) => ({ login }),
    'Login Success ': (user?: User) => ({ user }),
    'Login Error ': emptyProps(),

    'Logout ': emptyProps(),
    'Logout Success': emptyProps(),
    'Logout Error': emptyProps(),

    'Authenticate ': emptyProps(),
    'Authenticate Success ': (user?: User) => ({ user }),
    'Authenticate Error': emptyProps(),

    'Update XSRF Token': (xsrfToken: string) => ({ xsrfToken }),

    'Get organizations for user': emptyProps(),
    'Update organization': (organization?: APIOrganizationResponseDTO) => ({ organization }),
    'Update has multiple organizations': (hasMultipleOrganizations: boolean) => ({ hasMultipleOrganizations }),

    'Get User Grid Permissions': emptyProps(),
    'Get User Grid Permissions Success': (response: object) =>  ({response}),
    'Get User Grid Permissions Error': emptyProps(),
  },
});
