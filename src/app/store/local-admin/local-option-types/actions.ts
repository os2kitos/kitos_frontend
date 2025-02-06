import { createActionGroup, emptyProps } from '@ngrx/store';
import { APILocalRegularOptionUpdateRequestDTO } from 'src/app/api/v2';
import { LocalAdminOptionType } from 'src/app/shared/models/options/local-admin-option-type.model';

export const LocalOptionTypeActions = createActionGroup({
  source: 'ChoiceType',
  events: {
    'Uppdate Option Type': (
      optionType: LocalAdminOptionType,
      optionUuid: string,
      request: APILocalRegularOptionUpdateRequestDTO
    ) => ({ optionType, optionUuid, request }),
    'Update Option Type Active Status': (optionType: LocalAdminOptionType, optionUuid: string, isActive: boolean) => ({
      optionType,
      optionUuid,
      isActive,
    }),
    'Update Option Type Success': (optionType: LocalAdminOptionType) => ({ optionType }),
    'Update Option Type Error': () => emptyProps(),
  },
});
