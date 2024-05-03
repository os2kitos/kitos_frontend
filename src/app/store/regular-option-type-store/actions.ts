import { createActionGroup } from '@ngrx/store';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { RegularOptionType } from 'src/app/shared/models/options/regular-option-types.model';

export const RegularOptionTypeActions = createActionGroup({
  source: 'RegularOptionType',
  events: {
    'Get options': (optionType: RegularOptionType) => ({ optionType }),
    'Get options Success': (optionType: RegularOptionType, options: Array<APIRegularOptionResponseDTO>) => ({
      options,
      optionType,
    }),
    'Get options Error': (optionType: RegularOptionType) => ({ optionType }),
  },
});
