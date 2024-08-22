import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { DataProcessingRegistration } from 'src/app/shared/models/data-processing/data-processing.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { defaultGridState } from 'src/app/shared/models/grid-state.model';
import { DataProcessingActions } from './actions';
import { DataProcessingState } from './state';
import { roleDtoToRoleGridColumn } from '../helpers/role-column-helpers';

export const dataProcessingAdapter = createEntityAdapter<DataProcessingRegistration>();

export const dataProcessingInitialState: DataProcessingState = dataProcessingAdapter.getInitialState({
  total: 0,
  isLoadingDataProcessingsQuery: false,
  gridState: defaultGridState,
  gridColumns: [],
  gridRoleColumns: [],
  overviewRoles: [],

  loading: undefined,
  dataProcessing: undefined,

  permissions: undefined,
  collectionPermissions: undefined,

  isRemoving: false,
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

    on(DataProcessingActions.updateGridColumnsAndRoleColumnsSuccess, (state, { gridColumns }): DataProcessingState => {
      return {
        ...state,
        gridColumns,
      };
    }),

    on(DataProcessingActions.getDataProcessingOverviewRolesSuccess, (state, { roles }): DataProcessingState => {
      const roleColumns: GridColumn[] = [];
      roles?.forEach((role) => {
        roleColumns.push(roleDtoToRoleGridColumn(role, 'data-processing-registration'));
      });
      return { ...state, gridRoleColumns: roleColumns, overviewRoles: roles };
    })
  ),
});
