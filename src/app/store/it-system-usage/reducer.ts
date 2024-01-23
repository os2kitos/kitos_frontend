import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { defaultGridState } from 'src/app/shared/models/grid-state.model';
import { ITSystemUsage } from 'src/app/shared/models/it-system-usage/it-system-usage.model';
import { ITSystemUsageActions } from './actions';
import { ITSystemUsageState } from './state';

export const itSystemUsageAdapter = createEntityAdapter<ITSystemUsage>();

export const itSystemUsageInitialState: ITSystemUsageState = itSystemUsageAdapter.getInitialState({
  total: 0,
  isLoadingSystemUsagesQuery: false,
  gridState: defaultGridState,

  itSystemUsage: undefined,
  itSystemUsageLoading: false,
  permissions: undefined,

  isRemoving: false,
});

export const itSystemUsageFeature = createFeature({
  name: 'ITSystemUsage',
  reducer: createReducer(
    itSystemUsageInitialState,
    on(
      ITSystemUsageActions.getItSystemUsages,
      (state): ITSystemUsageState => ({ ...state, isLoadingSystemUsagesQuery: true })
    ),
    on(
      ITSystemUsageActions.getItSystemUsagesSuccess,
      (state, { itSystemUsages, total }): ITSystemUsageState => ({
        ...itSystemUsageAdapter.setAll(itSystemUsages, state),
        total,
        isLoadingSystemUsagesQuery: false,
      })
    ),
    on(
      ITSystemUsageActions.getItSystemUsagesError,
      (state): ITSystemUsageState => ({ ...state, isLoadingSystemUsagesQuery: false })
    ),

    on(ITSystemUsageActions.updateGridState, (state, { gridState }): ITSystemUsageState => ({ ...state, gridState })),

    on(
      ITSystemUsageActions.getItSystemUsage,
      (state): ITSystemUsageState => ({ ...state, itSystemUsage: undefined, itSystemUsageLoading: true })
    ),
    on(
      ITSystemUsageActions.getItSystemUsageSuccess,
      (state, { itSystemUsage }): ITSystemUsageState => ({ ...state, itSystemUsage, itSystemUsageLoading: false })
    ),
    on(
      ITSystemUsageActions.getItSystemUsageError,
      (state): ITSystemUsageState => ({ ...state, itSystemUsageLoading: false })
    ),

    on(ITSystemUsageActions.removeItSystemUsage, (state): ITSystemUsageState => ({ ...state, isRemoving: true })),
    on(
      ITSystemUsageActions.removeItSystemUsageSuccess,
      (state): ITSystemUsageState => ({ ...state, itSystemUsage: undefined, isRemoving: false })
    ),
    on(ITSystemUsageActions.removeItSystemUsageError, (state): ITSystemUsageState => ({ ...state, isRemoving: false })),

    on(
      ITSystemUsageActions.removeItSystemUsageUsingUnitSuccess,
      (state, { itSystemUsage }): ITSystemUsageState => ({ ...state, itSystemUsage: itSystemUsage })
    ),

    on(
      ITSystemUsageActions.patchItSystemUsageSuccess,
      (state, { itSystemUsage }): ITSystemUsageState => ({ ...state, itSystemUsage })
    ),

    on(
      ITSystemUsageActions.getItSystemUsagePermissions,
      (state): ITSystemUsageState => ({ ...state, permissions: undefined })
    ),
    on(
      ITSystemUsageActions.getItSystemUsagePermissionsSuccess,
      (state, { permissions }): ITSystemUsageState => ({ ...state, permissions })
    ),

    on(
      ITSystemUsageActions.addItSystemUsageRoleSuccess,
      (state, { itSystemUsage }): ITSystemUsageState => ({ ...state, itSystemUsage })
    ),
    on(
      ITSystemUsageActions.removeItSystemUsageRoleSuccess,
      (state, { itSystemUsage }): ITSystemUsageState => ({ ...state, itSystemUsage })
    ),
    on(
      ITSystemUsageActions.addExternalReferenceSuccess,
      (state, { itSystemUsage }): ITSystemUsageState => ({ ...state, itSystemUsage })
    ),
    on(
      ITSystemUsageActions.editExternalReferenceSuccess,
      (state, { itSystemUsage }): ITSystemUsageState => ({ ...state, itSystemUsage })
    ),
    on(
      ITSystemUsageActions.removeExternalReferenceSuccess,
      (state, { itSystemUsage }): ITSystemUsageState => ({ ...state, itSystemUsage })
    )
  ),
});
