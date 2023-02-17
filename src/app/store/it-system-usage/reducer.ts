import { createFeature, createReducer, on } from '@ngrx/store';
import { ITSystemUsageActions } from './actions';
import { itSystemUsageAdapter } from './selectors';
import { initialState, ITSystemUsageState } from './state';

export const itSystemUsageFeature = createFeature({
  name: 'ITSystemUsage',
  reducer: createReducer(
    initialState,
    on(ITSystemUsageActions.getItSystemUsages, (state): ITSystemUsageState => ({ ...state, isLoading: true })),
    on(
      ITSystemUsageActions.getItSystemUsagesSuccess,
      (state, { itSystemUsages, total }): ITSystemUsageState => ({
        ...itSystemUsageAdapter.setAll(itSystemUsages, state),
        total,
        isLoading: false,
      })
    ),
    on(ITSystemUsageActions.getItSystemUsagesError, (state): ITSystemUsageState => ({ ...state, isLoading: false })),

    on(ITSystemUsageActions.updateGridState, (state, { gridState }): ITSystemUsageState => ({ ...state, gridState })),

    on(
      ITSystemUsageActions.getItSystemUsageSuccess,
      (state, { itSystemUsage }): ITSystemUsageState => ({ ...state, itSystemUsage })
    )
  ),
});
