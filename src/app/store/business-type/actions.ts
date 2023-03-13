import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';

export const BusinessTypeActions = createActionGroup({
  source: 'BusinessType',
  events: {
    'Get business types': emptyProps(),
    'Get business types Success': (businessTypes: APIRegularOptionResponseDTO[]) => ({
      businessTypes,
    }),
    'Get business types Error': emptyProps(),
  },
});
