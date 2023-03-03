import { createFeature, createReducer, on } from '@ngrx/store';
import { ITSystemActions } from './actions';
import { initialState, ITSystemState } from './state';

export const itSystemFeature = createFeature({
  name: 'ITSystem',
  reducer: createReducer(
    initialState,
    on(ITSystemActions.getItSystem, (state): ITSystemState => ({ ...state, itSystem: undefined })),
    on(ITSystemActions.getItSystemSuccess, (state, { itSystem }): ITSystemState => ({ ...state, itSystem }))
  ),
});
