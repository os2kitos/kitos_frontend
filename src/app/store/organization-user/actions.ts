import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIUserCollectionPermissionsResponseDTO } from 'src/app/api/v2';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { SavedFilterState } from 'src/app/shared/models/grid/saved-filter-state.model';
import { OrganizationUser } from 'src/app/shared/models/organization-user/organization-user.model';

export const OrganizationUserActions = createActionGroup({
  source: 'OrganizationUser',
  events: {
    'Get Organization Users': (odataString: string) => ({ odataString }),
    'Get Organization Users Success ': (users: OrganizationUser[], total: number) => ({ users, total }),
    'Get Organization Users Error': emptyProps(),

    'Update Grid State': (gridState: GridState) => ({ gridState }),
    'Update Grid Columns': (gridColumns: GridColumn[]) => ({ gridColumns }),
    'Update Grid Columns Success': (gridColumns: GridColumn[]) => ({ gridColumns }),

    'Save Organization Users Filter': (localStoreKey: string) => ({ localStoreKey }),
    'Apply Organization Users Filter': (state: SavedFilterState) => ({ state }),

    'Reset Grid Configuration': emptyProps(),

    'Send Notification': (userUuid: string) => ({ userUuid }),
    'Send Notification Success': emptyProps(),
    'Send Notification Error': emptyProps(),

    'Get user permissions': emptyProps(),
    'Get user permissions success': (permissions: APIUserCollectionPermissionsResponseDTO) => ({ permissions }),
    'Get user permissions error': emptyProps(),
  },
});
