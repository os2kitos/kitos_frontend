import { createActionGroup, emptyProps } from '@ngrx/store';

export const RoleAssignmentActions = createActionGroup({
  source: 'RoleAssignment',
  events: {
    'Add role Success': () => emptyProps(),
    'Remove role Success': () => emptyProps(),
  },
});
