import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  APIIdentityNamePairResponseDTO,
  APIOrganizationGridPermissionsResponseDTO,
  APIOrganizationResponseDTO,
  APIOrganizationUpdateRequestDTO,
  APIPasswordResetResponseDTO,
} from 'src/app/api/v2';
import { SsoErrorCode } from 'src/app/shared/enums/sso-error-code';
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

    'Authenticate ': (returnUrl?: string) => ({ returnUrl }),
    'Authenticate Success ': (user?: User) => ({ user }),
    'Authenticate Error': (returnUrl?: string) => ({ returnUrl }),

    'Update XSRF Token': (xsrfToken: string) => ({ xsrfToken }),

    'Get organizations for user': emptyProps(),
    'Reset on organization update': (organization?: APIOrganizationResponseDTO) => ({ organization }),
    'Update has multiple organizations': (hasMultipleOrganizations: boolean) => ({ hasMultipleOrganizations }),

    'Get User Grid Permissions': emptyProps(),
    'Get User Grid Permissions Success': (response: APIOrganizationGridPermissionsResponseDTO) => ({ response }),
    'Get User Grid Permissions Error': emptyProps(),

    'Patch organization': props<{ request: APIOrganizationUpdateRequestDTO }>(),
    'Patch organization success': (organization: APIOrganizationResponseDTO) => organization,
    'Patch organization error': emptyProps(),

    'Reset Password Request': (email: string) => ({ email }),
    'Reset Password Request Success': (email: string) => ({ email }),
    'Reset Password Request Error': emptyProps(),

    'Get Reset Password Request': (requestId: string) => ({ requestId }),
    'Get Reset Password Request Success': (response: APIPasswordResetResponseDTO) => ({ response }),
    'Get Reset Password Request Error': emptyProps(),

    'Reset Password': (requestId: string, password: string) => ({ requestId, password }),
    'Reset Password Success': emptyProps(),
    'Reset Password Error': emptyProps(),

    'Update SSO Error Code': (ssoErrorCode: SsoErrorCode) => ({ ssoErrorCode }),

    'Get User Default Unit': (organizationUuid: string) => ({ organizationUuid }),
    'Get User Default Unit Success': (unit: APIIdentityNamePairResponseDTO) => ({ unit }),
    'Get User Default Unit Error': emptyProps(),

    'Set User Default Unit': (organizationUnitUuid: string) => ({ organizationUnitUuid }),
    'Set User Default Unit Success': (organizationUnit: APIIdentityNamePairResponseDTO) => ({ organizationUnit }),
    'Set User Default Unit Error': emptyProps(),
  },
});
