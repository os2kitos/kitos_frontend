import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';

export const ContractTypeActions = createActionGroup({
  source: 'ContractType',
  events: {
    'Get contract types': emptyProps(),
    'Get contract types Success': (contractTypes: APIRegularOptionResponseDTO[]) => ({
      contractTypes,
    }),
    'Get contract types Error': emptyProps(),
  },
});
