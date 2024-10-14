import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { APIOrganizationMasterDataRequestDTO, APIOrganizationMasterDataRolesRequestDTO } from 'src/app/api/v2';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { SavedFilterState } from 'src/app/shared/models/grid/saved-filter-state.model';
import { OrganizationMasterDataRoles } from 'src/app/shared/models/organization/organization-master-data/organization-master-data-roles.model';
import { OrganizationMasterData } from 'src/app/shared/models/organization/organization-master-data/organization-master-data.model';
import { OrganizationPermissions } from 'src/app/shared/models/organization/organization-permissions.model';
import { Organization } from 'src/app/shared/models/organization/organization.model';

export const OrganizationActions = createActionGroup({
  source: 'Organization',
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

    'Get Organization Permissions': emptyProps(),
    'Get Organization Permissions Success ': (permissions: OrganizationPermissions) => permissions,
    'Get Organization Permissions Error': emptyProps(),

    'Get Organizations': (odataString: string) => ({ odataString }),
    'Get Organizations Success': (organizations: Organization[], total: number) => ({ organizations, total }),
    'Get Organizations Error': emptyProps(),

    'Update Grid State': (gridState: GridState) => ({ gridState }),

    'Save Organizations Filter': (localStoreKey: string) => ({ localStoreKey }),
    'Apply Organizations Filter': (state: SavedFilterState) => ({ state }),
  },
});
