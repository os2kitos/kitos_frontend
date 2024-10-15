import { createActionGroup, emptyProps } from '@ngrx/store';

export const ChoiceTypeActions = createActionGroup({
  source: 'ChoiceType',
  events: {
    'Update Choice Type Success': () => emptyProps(),
    'Update Choice Type Error': () => emptyProps(),
  },
});
