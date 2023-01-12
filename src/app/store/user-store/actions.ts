import { createActionGroup, emptyProps } from '@ngrx/store';
import { User } from 'src/app/shared/models/user.model';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    'Get user': emptyProps(),
    'Update user': (user?: User) => ({ user }),
  },
});
