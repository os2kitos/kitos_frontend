import { createActionGroup, emptyProps } from '@ngrx/store';
import { GlobalAdminUser } from 'src/app/shared/models/global-admin/global-admin-user.model';

export const GlobalAdminActions = createActionGroup({
  source: 'GlobalAdmin',
  events: {
    'Get Global Admins': () => emptyProps(),
    'Get Global Admins Success': (admins: GlobalAdminUser[]) => ({ admins }),
    'Get Global Admins Error': () => emptyProps(),

    'Add Global Admin': (userUuid: string) => ({ userUuid }),
    'Add Global Admin Success': (user: GlobalAdminUser) => ({ user }),
    'Add Global Admin Error': () => emptyProps(),

    'Remove Global Admin': (userUuid: string) => ({ userUuid }),
    'Remove Global Admin Success': (userUuid: string) => ({ userUuid }),
    'Remove Global Admin Error': () => emptyProps(),
  },
});
