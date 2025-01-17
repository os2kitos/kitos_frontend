import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { defaultODataGridState } from 'src/app/shared/models/grid-state.model';
import { ITSystem } from 'src/app/shared/models/it-system/it-system.model';
import { ITSystemUsageActions } from '../it-system-usage/actions';
import { ITSystemActions } from './actions';
import { ITSystemState } from './state';

export const itSystemAdapter = createEntityAdapter<ITSystem>();

export const itSystemInitialState: ITSystemState = itSystemAdapter.getInitialState({
  total: 0,
  isLoadingSystemsQuery: false,
  gridState: defaultODataGridState,
  gridColumns: [],

  loading: undefined,
  itSystem: undefined,

  permissions: undefined,
  collectionPermissions: undefined,

  isRemoving: false,
});

export const itSystemFeature = createFeature({
  name: 'ITSystem',
  reducer: createReducer(
    itSystemInitialState,
    on(ITSystemActions.getITSystem, (state): ITSystemState => ({ ...state, itSystem: undefined, loading: true })),
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
    on(
      ITSystemActions.updateGridState,
      (state, { gridState }): ITSystemState => ({
        ...state,
        isLoadingSystemsQuery: true,
        gridState,
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
    on(
      ITSystemActions.getITSystemCollectionPermissions,
      (state): ITSystemState => ({ ...state, collectionPermissions: undefined })
    ),
    on(
      ITSystemActions.getITSystemCollectionPermissionsSuccess,
      (state, { collectionPermissions }): ITSystemState => ({ ...state, collectionPermissions })
    ),

    on(ITSystemActions.addExternalReferenceSuccess, (state, { itSystem }): ITSystemState => ({ ...state, itSystem })),
    on(ITSystemActions.editExternalReferenceSuccess, (state, { itSystem }): ITSystemState => ({ ...state, itSystem })),
    on(
      ITSystemActions.removeExternalReferenceSuccess,
      (state, { itSystem }): ITSystemState => ({ ...state, itSystem })
    ),

    on(ITSystemActions.updateGridColumnsSuccess, (state, { gridColumns }): ITSystemState => {
      return {
        ...state,
        gridColumns,
      };
    }),

    on(ITSystemUsageActions.createItSystemUsageSuccess, (state, { itSystemUuid }): ITSystemState => {
      const itSystem = state.entities[itSystemUuid];
      if (!itSystem) {
        return state;
      }
      const newSystem = { ...itSystem, IsInUse: true };
      return { ...state, entities: { ...state.entities, [itSystemUuid]: newSystem } };
    }),
    on(
      ITSystemUsageActions.deleteItSystemUsageByItSystemAndOrganizationSuccess,
      (state, { itSystemUuid }): ITSystemState => {
        const itSystem = state.entities[itSystemUuid];
        if (!itSystem) {
          return state;
        }
        const newSystem = { ...itSystem, IsInUse: false };
        return { ...state, entities: { ...state.entities, [itSystemUuid]: newSystem } };
      }
    )
  ),
});
