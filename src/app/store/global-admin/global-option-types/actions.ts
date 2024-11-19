import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIGlobalRoleOptionCreateRequestDTO, APIGlobalRoleOptionUpdateRequestDTO } from 'src/app/api/v2';
import { GlobalAdminOptionType } from 'src/app/shared/models/options/global-admin-option-type.model';

export const GlobalOptionTypeActions = createActionGroup({
  source: 'GlobalOptionType',
  events: {
    'Update Option Type': (
      optionType: GlobalAdminOptionType,
      optionUuid: string,
      request: APIGlobalRoleOptionUpdateRequestDTO
    ) => ({ optionType, optionUuid, request }),
    'Update Option Type Success': (optionType: GlobalAdminOptionType) => ({ optionType }),
    'Update Option Type Error': () => emptyProps(),

    'Create Option Type': (
      optionType: GlobalAdminOptionType,
      request: APIGlobalRoleOptionCreateRequestDTO
    ) => ({ optionType, request }),
    'Create Option Type Success': (optionType: GlobalAdminOptionType) => ({ optionType }),
    'Create Option Type Error': () => emptyProps(),
  },
});
