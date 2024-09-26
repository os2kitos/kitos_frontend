import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { APIOrganizationMasterDataRequestDTO, APIOrganizationMasterDataResponseDTO } from 'src/app/api/v2';

export const OrganizationMasterDataActions = createActionGroup({
  source: 'OrganizationMasterData',
  events: {
    'Get master data': props<{ organizationUuid: string }>(),
    'Get master data success': (organizationMasterData: APIOrganizationMasterDataResponseDTO) => organizationMasterData,
    'Get master data error': emptyProps(),

    'Patch master data': props<{ organizationUuid: string; request: APIOrganizationMasterDataRequestDTO }>(),
    'Patch master data success': (organizationMasterData: APIOrganizationMasterDataResponseDTO) =>
      organizationMasterData,
    'Patch master data error': emptyProps(),
  },
});
