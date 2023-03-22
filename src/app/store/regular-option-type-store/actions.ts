import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';

export const RegularOptionTypeActions = createActionGroup({
  source: 'RegularOptionType',
  events: {
    'Get options': emptyProps(),
    'Get options Success': (contractTypes: APIRegularOptionResponseDTO[]) => ({
      contractTypes,
    }),
    'Get options Error': emptyProps(),
  },
});
