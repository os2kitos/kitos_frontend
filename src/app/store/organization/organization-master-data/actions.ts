import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIOrganizationMasterDataResponseDTO } from 'src/app/api/v2';

export const OrganizationMasterDataActions = createActionGroup({
  source: 'OrganizationMasterData',
  events: {
    'Get master data': (organizationUuid: string) => ({ organizationUuid }),
    'Get master data success': (masterData: APIOrganizationMasterDataResponseDTO) => ({ masterData }),
    'Get master data error': emptyProps(),
  },
});
