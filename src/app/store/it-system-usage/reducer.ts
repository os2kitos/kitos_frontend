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

    on(ITSystemUsageActions.getItSystemUsage, (state): ITSystemUsageState => ({ ...state, itSystemUsage: undefined })),
    on(
      ITSystemUsageActions.getItSystemUsageSuccess,
      (state, { itSystemUsage }): ITSystemUsageState => ({ ...state, itSystemUsage })
    ),

    on(ITSystemUsageActions.removeItSystemUsage, (state): ITSystemUsageState => ({ ...state, isRemoving: true })),
    on(
      ITSystemUsageActions.removeItSystemUsageSuccess,
      (state): ITSystemUsageState => ({ ...state, itSystemUsage: undefined, isRemoving: false })
    ),
    on(ITSystemUsageActions.removeItSystemUsageError, (state): ITSystemUsageState => ({ ...state, isRemoving: false })),

    on(
      ITSystemUsageActions.getItSystemUsagePermissions,
      (state): ITSystemUsageState => ({ ...state, permissions: undefined })
    ),
    on(
      ITSystemUsageActions.getItSystemUsagePermissionsSuccess,
      (state, { permissions }): ITSystemUsageState => ({ ...state, permissions })
    ),

    on(
      ITSystemUsageActions.getItSystemUsageClassificationTypesSuccess,
      (state, { itSystemUsageDataClassificationTypes }): ITSystemUsageState => ({
        ...state,
        itSystemUsageDataClassificationTypes,
      })
    )
  ),
});
