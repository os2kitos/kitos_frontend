import { createActionGroup } from '@ngrx/store';
import { APIExtendedRoleAssignmentResponseDTO } from 'src/app/api/v2';
import { RoleOptionTypes } from 'src/app/shared/models/options/role-option-types.model';

export const RoleOptionTypeActions = createActionGroup({
  source: 'RoleOptionType',
  events: {
    'Get options': (entityUuid: string, optionType: RoleOptionTypes) => ({ entityUuid, optionType }),
    'Get options Success': (
      entityUuid: string,
      optionType: RoleOptionTypes,
      options: Array<APIExtendedRoleAssignmentResponseDTO>
    ) => ({
      options,
      entityUuid,
      optionType,
    }),
    'Get options Error': (optionType: RoleOptionTypes) => ({ optionType }),
  },
});
