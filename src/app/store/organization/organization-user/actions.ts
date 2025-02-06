import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  APICreateUserRequestDTO,
  APIMutateUserRightsRequestDTO,
  APIOrganizationUserResponseDTO,
  APIUpdateUserRequestDTO,
  APIUserCollectionPermissionsResponseDTO,
  APIUserResponseDTO,
} from 'src/app/api/v2';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { SavedFilterState } from 'src/app/shared/models/grid/saved-filter-state.model';
import { ODataOrganizationUser } from 'src/app/shared/models/organization/organization-user/organization-user.model';

export const OrganizationUserActions = createActionGroup({
  source: 'OrganizationUser',
  events: {
    'Get Organization Users': (gridState: GridState) => ({ gridState }),
    'Get Organization Users Success ': (users: ODataOrganizationUser[], total: number) => ({ users, total }),
    'Get Organization Users Error': emptyProps(),

    'Update Grid State': (gridState: GridState) => ({ gridState }),
    'Update Grid Columns': (gridColumns: GridColumn[]) => ({ gridColumns }),
    'Update Grid Columns Success': (gridColumns: GridColumn[]) => ({ gridColumns }),

    'Save Organization Users Filter': (localStoreKey: string) => ({ localStoreKey }),
    'Apply Organization Users Filter': (state: SavedFilterState) => ({ state }),

    'Reset Grid Configuration': emptyProps(),

    'Get Organization User Permissions': emptyProps(),
    'Get Organization User Permissions Success': (permissions: APIUserCollectionPermissionsResponseDTO) => ({
      permissions,
    }),
    'Get Organization User Permissions Error': emptyProps(),

    'Create User': (request: APICreateUserRequestDTO) => ({ request }),
    'Create User Success': (user: APIOrganizationUserResponseDTO) => ({ user }),
    'Create User Error': emptyProps(),

    'Send Notification': (userUuid: string) => ({ userUuid }),
    'Send Notification Success': (userUuid: string) => ({ userUuid }),
    'Send Notification Error': emptyProps(),

    'Get user permissions': emptyProps(),
    'Get user permissions success': (permissions: APIUserCollectionPermissionsResponseDTO) => ({ permissions }),
    'Get user permissions error': emptyProps(),

    'Update User': (userUuid: string, request: APIUpdateUserRequestDTO) => ({ userUuid, request }),
    'Update User Success': (user: APIUserResponseDTO) => ({ user }),
    'Update User Error': emptyProps(),

    'Verify User Email': (email: string) => ({ email }),
    'Verify User Email Success': (email: string) => ({ email }),
    'Verify User Email Error': emptyProps(),

    'Copy roles': (fromUserUuid: string, toUserUuid: string, request: APIMutateUserRightsRequestDTO) => ({
      fromUserUuid,
      toUserUuid,
      request,
    }),
    'Copy roles success': emptyProps(),
    'Copy roles error': emptyProps(),

    'Delete User': (userUuid: string) => ({ userUuid }),
    'Delete User Success': (userUuid: string) => ({ userUuid }),
    'Delete User Error': emptyProps(),

    'Transfer roles': (fromUserUuid: string, toUserUuid: string, request: APIMutateUserRightsRequestDTO) => ({
      fromUserUuid,
      toUserUuid,
      request,
    }),
    'Transfer roles success': emptyProps(),
    'Transfer roles error': emptyProps(),
  },
});
