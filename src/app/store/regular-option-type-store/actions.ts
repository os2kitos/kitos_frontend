import { createActionGroup } from '@ngrx/store';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { RegularOptionTypes } from 'src/app/shared/models/options/regular-option-types.model';

export const RegularOptionTypeActions = createActionGroup({
  source: 'RegularOptionType',
  events: {
    'Get options': (optionType: RegularOptionTypes) => ({ optionType }),
    'Get options Success': (optionType: RegularOptionTypes, options: Array<APIRegularOptionResponseDTO>) => ({
      options,
      optionType,
    }),
    'Get options Error': (optionType: RegularOptionTypes) => ({ optionType }),
  },
});
