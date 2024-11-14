import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  APIOrganizationCreateRequestDTO,
  APIOrganizationMasterDataRequestDTO,
  APIOrganizationMasterDataRolesRequestDTO,
  APIOrganizationUpdateRequestDTO,
  APIUIRootConfigUpdateRequestDTO,
} from 'src/app/api/v2';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { SavedFilterState } from 'src/app/shared/models/grid/saved-filter-state.model';
import { OrganizationMasterDataRoles } from 'src/app/shared/models/organization/organization-master-data/organization-master-data-roles.model';
import { OrganizationMasterData } from 'src/app/shared/models/organization/organization-master-data/organization-master-data.model';
import { OrganizationPermissions } from 'src/app/shared/models/organization/organization-permissions.model';
import { Organization } from 'src/app/shared/models/organization/organization.model';
import { UIRootConfig } from 'src/app/shared/models/ui-config/ui-root-config.model';

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

    'Save Local Admin Organizations Filter': (localStoreKey: string) => ({ localStoreKey }),
    'Apply Local Admin Organizations Filter': (state: SavedFilterState) => ({ state }),

    'Save Global Admin Organizations Filter': (localStoreKey: string) => ({ localStoreKey }),
    'Apply Global Admin Organizations Filter': (state: SavedFilterState) => ({ state }),

    'Get UI Root Config': emptyProps(),
    'Get UI Root Config success': props<{ uiRootConfig: UIRootConfig }>(),
    'Get UI Root Config error': emptyProps(),

    'Patch UI Root Config': props<{
      dto: APIUIRootConfigUpdateRequestDTO;
    }>(),
    'Patch UI Root Config success': props<{ uiRootConfig: UIRootConfig }>(),
    'Patch UI Root Config error': emptyProps(),

    'Patch Organization': (request: APIOrganizationUpdateRequestDTO, organizationUuid: string) => ({
      request,
      organizationUuid,
    }),
    'Patch Organization Success': emptyProps(),
    'Patch Organization Error': emptyProps(),

    'Create Organization': (request: APIOrganizationCreateRequestDTO) => ({ request }),
    'Create Organization Success': emptyProps(),
    'Create Organization Error': emptyProps(),

    'Delete Organization': (organizationUuid: string) => ({ organizationUuid }),
    'Delete Organization Success': emptyProps(),
    'Delete Organization Error': emptyProps(),
  },
});
