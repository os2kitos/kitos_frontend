import { EntityState } from '@ngrx/entity';
import {
  APIItSystemUsageResponseDTO,
  APIRegularOptionExtendedResponseDTO,
  APIResourcePermissionsResponseDTO,
} from 'src/app/api/v2';
import { defaultGridState, GridState } from 'src/app/shared/models/grid-state.model';
import { ITSystemUsage } from 'src/app/shared/models/it-system-usage.model';
import { itSystemUsageAdapter } from './selectors';

export interface ITSystemUsageState extends EntityState<ITSystemUsage> {
  total: number;
  isLoading: boolean;
  gridState: GridState;

  itSystemUsage: APIItSystemUsageResponseDTO | undefined;
  permissions: APIResourcePermissionsResponseDTO | undefined;
  itSystemUsageDataClassificationTypes: APIRegularOptionExtendedResponseDTO[] | undefined;

  isRemoving: boolean;
}

export const initialState: ITSystemUsageState = itSystemUsageAdapter.getInitialState({
  total: 0,
  isLoading: false,
  gridState: defaultGridState,

  itSystemUsage: undefined,
  permissions: undefined,
  itSystemUsageDataClassificationTypes: undefined,

  isRemoving: false,
});
