import { createActionGroup, emptyProps } from '@ngrx/store';
import { ShallowUser } from 'src/app/shared/models/userV2.model';

export const GlobalAdminActions = createActionGroup({
  source: 'GlobalAdmin',
  events: {
    'Get Global Admins': () => emptyProps(),
    'Get Global Admins Success': (admins: ShallowUser[]) => ({ admins }),
    'Get Global Admins Error': () => emptyProps(),

    'Add Global Admin': (userUuid: string) => ({ userUuid }),
    'Add Global Admin Success': (user: ShallowUser) => ({ user }),
    'Add Global Admin Error': () => emptyProps(),

    'Remove Global Admin': (userUuid: string) => ({ userUuid }),
    'Remove Global Admin Success': (userUuid: string) => ({ userUuid }),
    'Remove Global Admin Error': () => emptyProps(),
  },
});
