import { createActionGroup, emptyProps } from '@ngrx/store';
import { OptionTypeTableOption } from 'src/app/shared/components/option-type-table/option-type-table.component';

export const OptionTypeActions = createActionGroup({
  source: 'ChoiceType',
  events: {
    'Update Option Type Success': (optionType: OptionTypeTableOption) => ({ optionType }),
    'Update Option Type Error': () => emptyProps(),
  },
});
