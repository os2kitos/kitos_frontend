import { createActionGroup, emptyProps } from '@ngrx/store';
import { APILocalRegularOptionUpdateRequestDTO } from 'src/app/api/v2';
import { LocalOptionType } from 'src/app/shared/models/options/local-option-type.model';

export const LocalOptionTypeActions = createActionGroup({
  source: 'ChoiceType',
  events: {
    'Uppdate Option Type': (optionType: LocalOptionType, optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO) => ({ optionType, optionUuid, request }),
    'Update Option Type Active Status': (optionType: LocalOptionType, optionUuid: string, isActive: boolean) => ({ optionType, optionUuid, isActive }),
    'Update Option Type Success': () => emptyProps(),
    'Update Option Type Error': () => emptyProps(),
  },
});
