import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { DATA_PROCESSING_ROLES_SECTION_NAME } from 'src/app/shared/constants/persistent-state-constants';
import { newCache, resetCache } from 'src/app/shared/models/cache-item.model';
import { DataProcessingRegistration } from 'src/app/shared/models/data-processing/data-processing.model';
import { defaultODataGridState } from 'src/app/shared/models/grid-state.model';
import { GlobalOptionTypeActions } from '../global-admin/global-option-types/actions';
import { roleDtoToRoleGridColumns } from '../helpers/role-column-helpers';
import { LocalOptionTypeActions } from '../local-admin/local-option-types/actions';
import { DataProcessingActions } from './actions';
import { DataProcessingState } from './state';

export const dataProcessingAdapter = createEntityAdapter<DataProcessingRegistration>();

export const dataProcessingInitialState: DataProcessingState = dataProcessingAdapter.getInitialState({
  total: 0,
  isLoadingDataProcessingsQuery: false,
  gridState: defaultODataGridState,
  gridColumns: [],
  gridRoleColumns: [],
  overviewRoles: resetCache(),
  loading: undefined,
  dataProcessing: undefined,
  permissions: undefined,
  collectionPermissions: undefined,
  isRemoving: false,
  lastSeenGridConfig: undefined,
});

export const dataProcessingFeature = createFeature({
  name: 'DataProcessing',
  reducer: createReducer(
    dataProcessingInitialState,
    on(
      DataProcessingActions.getDataProcessing,
      (state): DataProcessingState => ({ ...state, dataProcessing: undefined, loading: true })
    ),
    on(
      DataProcessingActions.getDataProcessingSuccess,
      (state, { dataProcessing }): DataProcessingState => ({ ...state, dataProcessing, loading: false })
    ),
    on(
      DataProcessingActions.getDataProcessings,
      (state): DataProcessingState => ({ ...state, isLoadingDataProcessingsQuery: true })
    ),
    on(
      DataProcessingActions.getDataProcessingsSuccess,
      (state, { dataProcessings, total }): DataProcessingState => ({
        ...dataProcessingAdapter.setAll(dataProcessings, state),
        total,
        isLoadingDataProcessingsQuery: false,
      })
    ),
    on(
      DataProcessingActions.getDataProcessingsError,
      (state): DataProcessingState => ({ ...state, isLoadingDataProcessingsQuery: false })
    ),
    on(DataProcessingActions.updateGridState, (state, { gridState }): DataProcessingState => ({ ...state, gridState })),
    on(DataProcessingActions.deleteDataProcessing, (state): DataProcessingState => ({ ...state, isRemoving: true })),
    on(
      DataProcessingActions.deleteDataProcessingSuccess,
      (state): DataProcessingState => ({ ...state, isRemoving: false })
    ),
    on(
      DataProcessingActions.deleteDataProcessingError,
      (state): DataProcessingState => ({ ...state, isRemoving: false })
    ),
    on(
      DataProcessingActions.getDataProcessingPermissionsSuccess,
      (state, { permissions }): DataProcessingState => ({ ...state, permissions })
    ),
    on(
      DataProcessingActions.getDataProcessingCollectionPermissionsSuccess,
      (state, { collectionPermissions }): DataProcessingState => ({ ...state, collectionPermissions })
    ),
    on(
      DataProcessingActions.addExternalReferenceSuccess,
      (state, { dataProcessing }): DataProcessingState => ({ ...state, dataProcessing })
    ),
    on(
      DataProcessingActions.editExternalReferenceSuccess,
      (state, { dataProcessing }): DataProcessingState => ({ ...state, dataProcessing })
    ),
    on(
      DataProcessingActions.removeExternalReferenceSuccess,
      (state, { dataProcessing }): DataProcessingState => ({ ...state, dataProcessing })
    ),

    on(
      DataProcessingActions.patchDataProcessingSuccess,
      (state, { dataProcessing }): DataProcessingState => ({ ...state, dataProcessing })
    ),
    on(
      DataProcessingActions.addDataProcessingRoleSuccess,
      (state, { dataProcessing }): DataProcessingState => ({ ...state, dataProcessing })
    ),
    on(
      DataProcessingActions.removeDataProcessingRoleSuccess,
      (state, { dataProcessing }): DataProcessingState => ({ ...state, dataProcessing })
    ),
    on(
      DataProcessingActions.updateGridColumnsSuccess,
      (state, { gridColumns }): DataProcessingState => ({ ...state, gridColumns })
    ),
    on(DataProcessingActions.updateGridColumnsSuccess, (state, { gridColumns }): DataProcessingState => {
      return {
        ...state,
        gridColumns,
      };
    }),

    on(DataProcessingActions.getDataProcessingOverviewRolesSuccess, (state, { roles }): DataProcessingState => {
      const roleColumns =
        roles?.flatMap((role) =>
          roleDtoToRoleGridColumns(role, DATA_PROCESSING_ROLES_SECTION_NAME, 'data-processing-registration')
        ) ?? [];
      return { ...state, gridRoleColumns: roleColumns, overviewRoles: newCache(roles) };
    }),

    on(
      DataProcessingActions.resetToOrganizationDataProcessingColumnConfigurationSuccess,
      (state, { response }): DataProcessingState => {
        return {
          ...state,
          lastSeenGridConfig: response,
        };
      }
    ),

    on(
      DataProcessingActions.resetToOrganizationDataProcessingColumnConfigurationError,
      (state): DataProcessingState => {
        return {
          ...state,
          lastSeenGridConfig: undefined,
        };
      }
    ),

    on(
      DataProcessingActions.initializeDataProcessingLastSeenGridConfigurationSuccess,
      (state, { response }): DataProcessingState => {
        return {
          ...state,
          lastSeenGridConfig: response,
        };
      }
    ),

    on(
      GlobalOptionTypeActions.createOptionTypeSuccess,
      GlobalOptionTypeActions.updateOptionTypeSuccess,
      LocalOptionTypeActions.updateOptionTypeSuccess,
      (state, { optionType }): DataProcessingState => {
        if (optionType !== 'data-processing') {
          return state;
        }
        return {
          ...state,
          overviewRoles: resetCache(),
        };
      }
    )
  ),
});
