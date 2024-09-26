import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { APIOrganizationMasterDataRequestDTO } from 'src/app/api/v2';
import { OrganizationMasterData } from 'src/app/shared/models/organization/organization-master-data/organizationMasterData.model';
import { OrganizationMasterDataRoles } from 'src/app/shared/models/organization/organization-master-data/organizationMasterDataRoles.model';

export const OrganizationMasterDataActions = createActionGroup({
  source: 'OrganizationMasterData',
  events: {
    'Get master data': props<{ organizationUuid: string }>(),
    'Get master data success': (organizationMasterData: OrganizationMasterData) => organizationMasterData,
    'Get master data error': emptyProps(),

    'Patch master data': props<{ organizationUuid: string; request: APIOrganizationMasterDataRequestDTO }>(),
    'Patch master data success': (organizationMasterData: OrganizationMasterData) => organizationMasterData,
    'Patch master data error': emptyProps(),

    'Get master data roles': props<{ organizationUuid: string }>(),
    'Get master data roles success': (organizationMasterDataRoles: OrganizationMasterDataRoles) =>
      organizationMasterDataRoles,
    'Get master data roles error': emptyProps(),
  },
});
