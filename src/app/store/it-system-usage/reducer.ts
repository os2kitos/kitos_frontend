import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { SYSTEMS_ROLES_SECTION_NAME } from 'src/app/shared/constants/persistent-state-constants';
import { newCache, resetCache } from 'src/app/shared/models/cache-item.model';
import { defaultODataGridState } from 'src/app/shared/models/grid-state.model';
import { ITSystemUsage } from 'src/app/shared/models/it-system-usage/it-system-usage.model';
import { GlobalOptionTypeActions } from '../global-admin/global-option-types/actions';
import { roleDtoToRoleGridColumns } from '../helpers/role-column-helpers';
import { LocalOptionTypeActions } from '../local-admin/local-option-types/actions';
import { ITSystemUsageActions } from './actions';
import { ITSystemUsageState } from './state';

export const itSystemUsageAdapter = createEntityAdapter<ITSystemUsage>();

export const itSystemUsageInitialState: ITSystemUsageState = itSystemUsageAdapter.getInitialState({
  total: 0,
  isLoadingSystemUsagesQuery: false,
  gridState: defaultODataGridState,
  previousGridState: defaultODataGridState,
  gridColumns: [],
  gridRoleColumns: [],
  systemRoles: resetCache(),
  itSystemUsage: undefined,
  itSystemUsageLoading: false,
  permissions: undefined,
  collectionPermissions: undefined,
  isRemoving: false,
  lastSeenGridConfig: undefined,
  isPatching: false,
});

export const itSystemUsageFeature = createFeature({
  name: 'ITSystemUsage',
  reducer: createReducer(
    itSystemUsageInitialState,
    on(
      ITSystemUsageActions.getITSystemUsages,
      (state): ITSystemUsageState => ({ ...state, isLoadingSystemUsagesQuery: true })
    ),
    on(
      ITSystemUsageActions.getITSystemUsagesSuccess,
      (state, { itSystemUsages, total }): ITSystemUsageState => ({
        ...itSystemUsageAdapter.setAll(itSystemUsages, state),
        total,
        isLoadingSystemUsagesQuery: false,
      })
    ),
    on(
      ITSystemUsageActions.getITSystemUsagesError,
      (state): ITSystemUsageState => ({
        ...state,
        isLoadingSystemUsagesQuery: false,
      })
    ),
    on(
      ITSystemUsageActions.updateGridState,
      (state, { gridState }): ITSystemUsageState => ({
        ...state,
        isLoadingSystemUsagesQuery: true,
        gridState,
        previousGridState: state.gridState,
      })
    ),
    on(
      ITSystemUsageActions.getITSystemUsage,
      (state): ITSystemUsageState => ({ ...state, itSystemUsage: undefined, itSystemUsageLoading: true })
    ),
    on(
      ITSystemUsageActions.getITSystemUsageSuccess,
      (state, { itSystemUsage }): ITSystemUsageState => ({ ...state, itSystemUsage, itSystemUsageLoading: false })
    ),
    on(
      ITSystemUsageActions.getITSystemUsageError,
      (state): ITSystemUsageState => ({ ...state, itSystemUsageLoading: false })
    ),

    on(ITSystemUsageActions.removeITSystemUsage, (state): ITSystemUsageState => ({ ...state, isRemoving: true })),
    on(
      ITSystemUsageActions.removeITSystemUsageSuccess,
      (state): ITSystemUsageState => ({ ...state, itSystemUsage: undefined, isRemoving: false })
    ),
    on(ITSystemUsageActions.removeITSystemUsageError, (state): ITSystemUsageState => ({ ...state, isRemoving: false })),

    on(
      ITSystemUsageActions.removeITSystemUsageUsingUnitSuccess,
      (state, { itSystemUsage }): ITSystemUsageState => ({ ...state, itSystemUsage: itSystemUsage })
    ),

    on(ITSystemUsageActions.patchITSystemUsage, (state): ITSystemUsageState => ({ ...state, isPatching: true })),

    on(
      ITSystemUsageActions.patchITSystemUsageSuccess,
      (state, { itSystemUsage }): ITSystemUsageState => ({ ...state, itSystemUsage, isPatching: false })
    ),
    on(ITSystemUsageActions.patchITSystemUsageError, (state): ITSystemUsageState => ({ ...state, isPatching: false })),

    on(
      ITSystemUsageActions.getITSystemUsagePermissions,
      (state): ITSystemUsageState => ({ ...state, permissions: undefined })
    ),
    on(
      ITSystemUsageActions.getITSystemUsagePermissionsSuccess,
      (state, { permissions }): ITSystemUsageState => ({ ...state, permissions })
    ),

    on(
      ITSystemUsageActions.getITSystemUsageCollectionPermissions,
      (state): ITSystemUsageState => ({ ...state, collectionPermissions: undefined })
    ),
    on(
      ITSystemUsageActions.getITSystemUsageCollectionPermissionsSuccess,
      (state, { permissions }): ITSystemUsageState => ({ ...state, collectionPermissions: permissions })
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
    ),

    on(ITSystemUsageActions.updateGridColumnsSuccess, (state, { gridColumns }): ITSystemUsageState => {
      return {
        ...state,
        gridColumns,
      };
    }),

    on(ITSystemUsageActions.getItSystemUsageOverviewRolesSuccess, (state, { roles }): ITSystemUsageState => {
      const gridRoleColumns =
        roles?.flatMap((role) => roleDtoToRoleGridColumns(role, SYSTEMS_ROLES_SECTION_NAME, 'it-system-usage')) ?? [];
      return { ...state, gridRoleColumns, systemRoles: newCache(roles) };
    }),

    on(
      ITSystemUsageActions.resetToOrganizationITSystemUsageColumnConfigurationSuccess,
      (state, { response }): ITSystemUsageState => {
        return {
          ...state,
          lastSeenGridConfig: response,
        };
      }
    ),

    on(ITSystemUsageActions.resetToOrganizationITSystemUsageColumnConfigurationError, (state): ITSystemUsageState => {
      return {
        ...state,
        lastSeenGridConfig: undefined,
      };
    }),

    on(
      ITSystemUsageActions.initializeITSystemUsageLastSeenGridConfigurationSuccess,
      (state, { response }): ITSystemUsageState => {
        return {
          ...state,
          lastSeenGridConfig: response,
        };
      }
    ),

    on(ITSystemUsageActions.getItSystemUsageOverviewRolesError, (state): ITSystemUsageState => {
      return { ...state, gridRoleColumns: [], systemRoles: resetCache() };
    }),

    on(
      GlobalOptionTypeActions.createOptionTypeSuccess,
      GlobalOptionTypeActions.updateOptionTypeSuccess,
      LocalOptionTypeActions.updateOptionTypeSuccess,
      (state, { optionType }): ITSystemUsageState => {
        if (optionType !== 'it-system-usage') {
          return state;
        }
        return {
          ...state,
          systemRoles: resetCache(),
        };
      }
    )
  ),
});
