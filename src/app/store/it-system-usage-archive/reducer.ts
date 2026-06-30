import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { defaultODataGridState } from 'src/app/shared/models/grid-state.model';
import { ItSystemUsageArchiveOData } from 'src/app/shared/models/it-system/it-system-usage-archive-odata.model';
import { ITSystemUsageArchiveActions } from './actions';
import { ITSystemUsageArchiveState } from './state';

export const itSystemUsageArchiveAdapter = createEntityAdapter<ItSystemUsageArchiveOData>({
  selectId: (archive: ItSystemUsageArchiveOData): string => archive.id,
});

export const itSystemUsageArchiveInitialState: ITSystemUsageArchiveState = itSystemUsageArchiveAdapter.getInitialState({
  total: 0,
  isLoading: false,
  gridState: defaultODataGridState,
  previousGridState: defaultODataGridState,
  gridColumns: [],
  isRemoving: false,
  error: undefined,
  permissions: undefined,
  collectionPermissions: undefined,
  itSystemUsageArchive: undefined,
  itSystemUsageArchiveLoading: false,
});

export const itSystemUsageArchiveFeature = createFeature({
  name: 'ITSystemUsageArchive',
  reducer: createReducer(
    itSystemUsageArchiveInitialState,
    on(
      ITSystemUsageArchiveActions.getITSystemUsageArchives,
      (state): ITSystemUsageArchiveState => ({
        ...state,
        isLoading: true,
        error: undefined,
      }),
    ),
    on(
      ITSystemUsageArchiveActions.getITSystemUsageArchivesSuccess,
      (state, { archives, total }): ITSystemUsageArchiveState => ({
        ...itSystemUsageArchiveAdapter.setAll(archives, state),
        total,
        isLoading: false,
      }),
    ),
    on(
      ITSystemUsageArchiveActions.getITSystemUsageArchivesError,
      (state, { error }): ITSystemUsageArchiveState => ({
        ...state,
        isLoading: false,
        error,
      }),
    ),
    on(
      ITSystemUsageArchiveActions.updateGridState,
      (state, { gridState }): ITSystemUsageArchiveState => ({
        ...state,
        isLoading: true,
        gridState,
        previousGridState: state.gridState,
      }),
    ),
    on(
      ITSystemUsageArchiveActions.updateGridColumnsSuccess,
      (state, { gridColumns }): ITSystemUsageArchiveState => ({
        ...state,
        gridColumns,
      }),
    ),
    on(
      ITSystemUsageArchiveActions.deleteITSystemUsageArchive,
      (state): ITSystemUsageArchiveState => ({
        ...state,
        isRemoving: true,
      }),
    ),
    on(
      ITSystemUsageArchiveActions.deleteITSystemUsageArchiveSuccess,
      (state): ITSystemUsageArchiveState => ({
        ...state,
        isRemoving: false,
      }),
    ),
    on(
      ITSystemUsageArchiveActions.deleteITSystemUsageArchiveError,
      (state): ITSystemUsageArchiveState => ({
        ...state,
        isRemoving: false,
      }),
    ),
    on(
      ITSystemUsageArchiveActions.getITSystemUsageArchivePermissionsSuccess,
      (state, { permissions }): ITSystemUsageArchiveState => ({
        ...state,
        permissions,
      }),
    ),
    on(
      ITSystemUsageArchiveActions.getITSystemUsageArchiveCollectionPermissionsSuccess,
      (state, { collectionPermissions }): ITSystemUsageArchiveState => ({
        ...state,
        collectionPermissions,
      }),
    ),
    on(
      ITSystemUsageArchiveActions.getITSystemUsageArchive,
      (state): ITSystemUsageArchiveState => ({
        ...state,
        itSystemUsageArchiveLoading: true,
      }),
    ),
    on(
      ITSystemUsageArchiveActions.getITSystemUsageArchiveSuccess,
      (state, { itSystemUsageArchive }): ITSystemUsageArchiveState => ({
        ...state,
        itSystemUsageArchiveLoading: false,
        itSystemUsageArchive,
      }),
    ),
    on(
      ITSystemUsageArchiveActions.getITSystemUsageArchiveError,
      (state): ITSystemUsageArchiveState => ({
        ...state,
        itSystemUsageArchiveLoading: false,
      }),
    ),
  ),
});
