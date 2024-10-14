import { createActionGroup, emptyProps } from '@ngrx/store';

export const ChoiceTypeActions = createActionGroup({
  source: 'ChoiceType',
  events: {
    'Edit Choice Type Success': () => emptyProps(),
  },
});
