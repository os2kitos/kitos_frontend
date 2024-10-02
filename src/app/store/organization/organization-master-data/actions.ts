import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { APIOrganizationMasterDataRequestDTO, APIOrganizationMasterDataRolesRequestDTO } from 'src/app/api/v2';
import { OrganizationMasterData } from 'src/app/shared/models/organization/organization-master-data/organization-master-data.model';
import { OrganizationMasterDataRoles } from 'src/app/shared/models/organization/organization-master-data/organization-master-data-roles.model';
import { OrganizationPermissions } from 'src/app/shared/models/organization/organization-permissions.model';

export const OrganizationMasterDataActions = createActionGroup({
  source: 'OrganizationMasterData',
  events: {
    'Get master data': emptyProps(),
    'Get master data success': (organizationMasterData: OrganizationMasterData) => organizationMasterData,
    'Get master data error': emptyProps(),

    'Patch master data': props<{ request: APIOrganizationMasterDataRequestDTO }>(),
    'Patch master data success': (organizationMasterData: OrganizationMasterData) => organizationMasterData,
    'Patch master data error': emptyProps(),

    'Get master data roles': emptyProps(),
    'Get master data roles success': (organizationMasterDataRoles: OrganizationMasterDataRoles) =>
      organizationMasterDataRoles,
    'Get master data roles error': emptyProps(),

    'Patch master data roles': props<{ request: APIOrganizationMasterDataRolesRequestDTO }>(),
    'Patch master data roles success': (organizationMasterDataRoles: OrganizationMasterDataRoles) =>
      organizationMasterDataRoles,
    'Patch master data roles error': emptyProps(),

    'Get Organization Permissions': (organizationUuid: string) => ({ organizationUuid }),
    'Get Organization Permissions Success ': (permissions: OrganizationPermissions) => permissions,

    'Get Organization Permissions Error': emptyProps(),
  },
});
