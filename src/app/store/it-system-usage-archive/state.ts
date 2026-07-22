import { EntityState } from '@ngrx/entity';
import {
  APIItSystemUsageArchiveResponseDTO,
  APIResourceCollectionPermissionsResponseDTO,
  APIResourcePermissionsResponseDTO,
} from 'src/app/api/v2';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ItSystemUsageArchiveOData } from 'src/app/shared/models/it-system/it-system-usage-archive-odata.model';

export interface ITSystemUsageArchiveState extends EntityState<ItSystemUsageArchiveOData> {
  total: number;
  isLoading: boolean;
  gridState: GridState;
  previousGridState: GridState;
  gridColumns: GridColumn[];
  isRemoving: boolean;
  error: string | undefined;
  permissions: APIResourcePermissionsResponseDTO | undefined;
  collectionPermissions: APIResourceCollectionPermissionsResponseDTO | undefined;
  itSystemUsageArchive: APIItSystemUsageArchiveResponseDTO | undefined;
  itSystemUsageArchiveLoading: boolean;
}
