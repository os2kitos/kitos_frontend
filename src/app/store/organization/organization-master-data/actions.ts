import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { APIOrganizationMasterDataResponseDTO } from 'src/app/api/v2';

export const OrganizationMasterDataActions = createActionGroup({
  source: 'OrganizationMasterData',
  events: {
    'Get master data': props<{ organizationUuid: string }>(),
    'Get master data success': (organizationMasterData: APIOrganizationMasterDataResponseDTO) => organizationMasterData,
    'Get master data error': emptyProps(),
  },
});
