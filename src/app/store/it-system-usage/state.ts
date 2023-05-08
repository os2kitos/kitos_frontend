import { EntityState } from '@ngrx/entity';
import { APIItSystemUsageResponseDTO, APIResourcePermissionsResponseDTO } from 'src/app/api/v2';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITSystemUsage } from 'src/app/shared/models/it-system-usage.model';

export interface ITSystemUsageState extends EntityState<ITSystemUsage> {
  total: number;
  isLoadingSystemUsagesQuery: boolean;
  gridState: GridState;

  itSystemUsage: APIItSystemUsageResponseDTO | undefined;
  itSystemUsageLoading: boolean;
  permissions: APIResourcePermissionsResponseDTO | undefined;

  isRemoving: boolean;
}
