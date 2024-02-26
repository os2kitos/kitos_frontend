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

  isRemoving: false,
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
    on(ITSystemActions.getITSystemsError, (state): ITSystemState => ({ ...state, isLoadingSystemsQuery: false })),
    on(ITSystemActions.deleteITSystem, (state): ITSystemState => ({ ...state, isRemoving: true })),
    on(ITSystemActions.deleteITSystemSuccess, (state): ITSystemState => ({ ...state, isRemoving: false })),
    on(ITSystemActions.deleteITSystemError, (state): ITSystemState => ({ ...state, isRemoving: false })),
    on(ITSystemActions.patchITSystemSuccess, (state, { itSystem }): ITSystemState => ({ ...state, itSystem })),

    on(ITSystemActions.getITSystemPermissions, (state): ITSystemState => ({ ...state, permissions: undefined })),
    on(
      ITSystemActions.getITSystemPermissionsSuccess,
      (state, { permissions }): ITSystemState => ({ ...state, permissions })
    ),

    on(ITSystemActions.addExternalReferenceSuccess, (state, { itSystem }): ITSystemState => ({ ...state, itSystem })),
    on(ITSystemActions.editExternalReferenceSuccess, (state, { itSystem }): ITSystemState => ({ ...state, itSystem })),
    on(ITSystemActions.removeExternalReferenceSuccess, (state, { itSystem }): ITSystemState => ({ ...state, itSystem }))
  ),
});
