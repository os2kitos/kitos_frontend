import { EntityState } from '@ngrx/entity';
import { defaultGridState, GridState } from 'src/app/shared/models/grid-state.model';
import { ITSystem } from 'src/app/shared/models/it-system.model';
import { itSystemAdapter } from './selectors';

export interface ITSystemState extends EntityState<ITSystem> {
  total: number;
  isLoading: boolean;
  gridState: GridState;
}

export const initialState: ITSystemState = itSystemAdapter.getInitialState({
  total: 0,
  isLoading: false,
  gridState: defaultGridState,
});
