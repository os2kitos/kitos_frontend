import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { APIItSystemResponseDTO } from 'src/app/api/v2';
import { ITSystemActions } from './actions';
import { ITSystemState } from './state';

export const itSystemAdapter = createEntityAdapter<APIItSystemResponseDTO>();

export const itSystemInitialState: ITSystemState = itSystemAdapter.getInitialState({
  loading: undefined,
  itSystem: undefined,
});

export const itSystemFeature = createFeature({
  name: 'ITSystem',
  reducer: createReducer(
    itSystemInitialState,
    on(ITSystemActions.getItSystem, (state): ITSystemState => ({ ...state, itSystem: undefined, loading: true })),
    on(
      ITSystemActions.getItSystemSuccess,
      (state, { itSystem }): ITSystemState => ({ ...state, itSystem, loading: false })
    )
  ),
});
