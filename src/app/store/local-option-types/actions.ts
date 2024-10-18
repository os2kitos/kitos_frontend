import { createActionGroup, emptyProps } from '@ngrx/store';

export const LocalOptionTypeActions = createActionGroup({
  source: 'ChoiceType',
  events: {
    'Update Option Type Success': () => emptyProps(),
    'Update Option Type Error': () => emptyProps(),
  },
});
