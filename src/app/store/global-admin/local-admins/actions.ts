import { createActionGroup, emptyProps } from '@ngrx/store';
import { LocalAdminUser } from 'src/app/shared/models/local-admin/local-admin-user.model';

export const LocalAdminUserActions = createActionGroup({
  source: 'LocalAdminUser',
  events: {
    'Get Local Admins': () => emptyProps(),
    'Get Local Admins Success': (admins: LocalAdminUser[]) => ({ admins }),
    'Get Local Admins Error': () => emptyProps(),

    'Add Local Admin': (organizationUuid: string, userUuid: string) => ({ organizationUuid, userUuid }),
    'Add Local Admin Success': (user: LocalAdminUser) => ({ user }),
    'Add Local Admin Error': () => emptyProps(),

    'Remove Local Admin': (organizationUuid: string, userUuid: string) => ({ organizationUuid, userUuid }),
    'Remove Local Admin Success': (organizationUuid: string, userUuid: string) => ({ organizationUuid, userUuid }),
    'Remove Local Admin Error': () => emptyProps(),
  },
});
