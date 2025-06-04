import {
  APIIdentityNamePairResponseDTO,
  APIOrganizationGridPermissionsResponseDTO,
  APIOrganizationResponseDTO,
} from 'src/app/api/v2';
import { SsoErrorCode } from 'src/app/shared/enums/sso-error-code';
import { User } from 'src/app/shared/models/user.model';

export interface UserState {
  user: User | undefined;
  isAuthenticating: boolean;
  hasTriedAuthenticating: boolean;
  xsrfToken: string | undefined;

  organization: APIOrganizationResponseDTO | undefined;
  hasMultipleOrganizations: boolean | undefined;
  gridPermissions: APIOrganizationGridPermissionsResponseDTO | undefined;

  ssoErrorCode: SsoErrorCode | undefined;
  defaultUnit: APIIdentityNamePairResponseDTO | undefined;
}
