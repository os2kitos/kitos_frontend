import { APIOrganizationResponseDTO } from 'src/app/api/v2';
import { User } from 'src/app/shared/models/user.model';

export interface UserState {
  user: User | undefined;
  isAuthenticating: boolean;
  hasTriedAuthenticating: boolean;
  xsrfToken: string | undefined;

  organization: APIOrganizationResponseDTO | undefined;
  hasMultipleOrganizations: boolean | undefined;
}
