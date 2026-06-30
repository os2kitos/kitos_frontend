import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  APIItSystemUsageArchiveResponseDTO,
  APIResourceCollectionPermissionsResponseDTO,
  APIResourcePermissionsResponseDTO,
} from 'src/app/api/v2';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { SavedFilterState } from 'src/app/shared/models/grid/saved-filter-state.model';
import { ItSystemUsageArchiveOData } from 'src/app/shared/models/it-system/it-system-usage-archive-odata.model';

export const ITSystemUsageArchiveActions = createActionGroup({
  source: 'ITSystemUsageArchive',
  events: {
    'Get IT System Usage Archives': (gridState: GridState) => ({ gridState }),
    'Get IT System Usage Archives Success': (archives: ItSystemUsageArchiveOData[], total: number) => ({
      archives,
      total,
    }),
    'Get IT System Usage Archives Error': (error?: string) => ({ error }),

    'Update Grid State': (gridState: GridState) => ({ gridState }),
    'Update Grid Columns': (gridColumns: GridColumn[]) => ({ gridColumns }),
    'Update Grid Columns Success': (gridColumns: GridColumn[]) => ({ gridColumns }),

    'Delete IT System Usage Archive': emptyProps(),
    'Delete IT System Usage Archive Success': emptyProps(),
    'Delete IT System Usage Archive Error': emptyProps(),

    'Get IT System Usage Archive Collection Permissions': emptyProps(),
    'Get IT System Usage Archive Collection Permissions Success': (
      collectionPermissions?: APIResourceCollectionPermissionsResponseDTO,
    ) => ({
      collectionPermissions,
    }),
    'Get IT System Usage Archive Collection Permissions Error': emptyProps(),

    'Get IT System Usage Archive Permissions': (archiveUuid: string) => ({ archiveUuid }),
    'Get IT System Usage Archive Permissions Success': (permissions?: APIResourcePermissionsResponseDTO) => ({
      permissions,
    }),
    'Get IT System Usage Archive Permissions Error': emptyProps(),

    'Save IT System Usage Archive Filter': (localStoreKey: string) => ({ localStoreKey }),
    'Apply IT System Usage Archive Filter': (state: SavedFilterState) => ({ state }),

    'Get IT System Usage Archive': (itSystemUsageArchiveUuid: string) => ({ itSystemUsageArchiveUuid }),
    'Get IT System Usage Archive Success': (itSystemUsageArchive?: APIItSystemUsageArchiveResponseDTO) => ({
      itSystemUsageArchive,
    }),
    'Get IT System Usage Archive Error': emptyProps(),
  },
});
