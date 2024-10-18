import { createActionGroup, emptyProps } from '@ngrx/store';

export const OptionTypeActions = createActionGroup({
  source: 'ChoiceType',
  events: {
    'Update Option Type Success': () => emptyProps(),
    'Update Option Type Error': () => emptyProps(),
  },
});
