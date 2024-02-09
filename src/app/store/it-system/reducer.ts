import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { defaultGridState } from 'src/app/shared/models/grid-state.model';
import { ITSystem } from 'src/app/shared/models/it-system/it-system.model';
import { ITSystemActions } from './actions';
import { ITSystemState } from './state';

export const itSystemAdapter = createEntityAdapter<ITSystem>();

export const itSystemInitialState: ITSystemState = itSystemAdapter.getInitialState({
  total: 0,
  isLoadingSystemsQuery: false,
  gridState: defaultGridState,

  loading: undefined,
  itSystem: undefined,

  permissions: undefined,
});

export const itSystemFeature = createFeature({
  name: 'ITSystem',
  reducer: createReducer(
    itSystemInitialState,
    on(
      ITSystemActions.getITSystemSuccess,
      (state): ITSystemState => ({ ...state, itSystem: undefined, loading: true })
    ),
    on(
      ITSystemActions.getITSystemSuccess,
      (state, { itSystem }): ITSystemState => ({ ...state, itSystem, loading: false })
    ),
    on(ITSystemActions.getITSystems, (state): ITSystemState => ({ ...state, isLoadingSystemsQuery: true })),
    on(
      ITSystemActions.getITSystemsSuccess,
      (state, { itSystems, total }): ITSystemState => ({
        ...itSystemAdapter.setAll(itSystems, state),
        total,
        isLoadingSystemsQuery: false,
      })
    ),
    on(ITSystemActions.getITSystemsError, (state): ITSystemState => ({ ...state, isLoadingSystemsQuery: false }))
  ),
});
