import { createFeature, createReducer, on } from '@ngrx/store';
import { ITSystemActions } from './actions';
import { itSystemAdapter } from './selectors';
import { initialState, ITSystemState } from './state';

export const itSystemFeature = createFeature({
  name: 'ITSystem',
  reducer: createReducer(
    initialState,
    on(ITSystemActions.getItSystems, (state): ITSystemState => ({ ...state, isLoading: true })),
    on(
      ITSystemActions.getItSystemsSuccess,
      (state, { itSystems, total }): ITSystemState => ({
        ...itSystemAdapter.setAll(itSystems, state),
        total,
        isLoading: false,
      })
    ),
    on(ITSystemActions.getItSystemsError, (state): ITSystemState => ({ ...state, isLoading: false })),

    on(ITSystemActions.updateGridState, (state, { gridState }): ITSystemState => ({ ...state, gridState }))
  ),
});
