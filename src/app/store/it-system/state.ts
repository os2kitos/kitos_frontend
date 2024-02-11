import { EntityState } from '@ngrx/entity';
import { APIItSystemResponseDTO, APIResourcePermissionsResponseDTO } from 'src/app/api/v2';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITSystem } from 'src/app/shared/models/it-system/it-system.model';

export interface ITSystemState extends EntityState<ITSystem> {
  total: number;
  isLoadingSystemsQuery: boolean;
  gridState: GridState;

  loading: boolean | undefined;
  itSystem: APIItSystemResponseDTO | undefined;

  permissions: APIResourcePermissionsResponseDTO | undefined;

  isRemoving: boolean;
}
