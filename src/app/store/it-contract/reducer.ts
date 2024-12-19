import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { CONTRACT_ROLES_SECTION_NAME } from 'src/app/shared/constants/persistent-state-constants';
import { newCache, resetCache } from 'src/app/shared/models/cache-item.model';
import { defaultGridState } from 'src/app/shared/models/grid-state.model';
import { ITContract } from 'src/app/shared/models/it-contract/it-contract.model';
import { roleDtoToRoleGridColumns } from '../helpers/role-column-helpers';
import { ITContractActions } from './actions';
import { ITContractState } from './state';

export const itContactAdapter = createEntityAdapter<ITContract>();

export const itContactInitialState: ITContractState = itContactAdapter.getInitialState({
  total: 0,
  isLoadingContractsQuery: false,
  gridState: defaultGridState,
  gridColumns: [],
  gridRoleColumns: [],
  contractRoles: [],

  loading: undefined,
  itContract: undefined,

  permissions: undefined,
  collectionPermissions: undefined,

  isRemoving: false,
  organizationGridConfig: undefined,

  appliedProcurementPlans: resetCache(),
});

export const itContractFeature = createFeature({
  name: 'ITContract',
  reducer: createReducer(
    itContactInitialState,
    on(
      ITContractActions.getITContract,
      (state): ITContractState => ({ ...state, itContract: undefined, loading: true })
    ),
    on(
      ITContractActions.getITContractSuccess,
      (state, { itContract }): ITContractState => ({ ...state, itContract, loading: false })
    ),
    on(ITContractActions.getITContracts, (state): ITContractState => ({ ...state, isLoadingContractsQuery: true })),
    on(
      ITContractActions.getITContractsSuccess,
      (state, { itContracts, total }): ITContractState => ({
        ...itContactAdapter.setAll(itContracts, state),
        total,
        isLoadingContractsQuery: false,
      })
    ),
    on(
      ITContractActions.getITContractsError,
      (state): ITContractState => ({ ...state, isLoadingContractsQuery: false })
    ),
    on(ITContractActions.deleteITContract, (state): ITContractState => ({ ...state, isRemoving: true })),
    on(ITContractActions.deleteITContractSuccess, (state): ITContractState => ({ ...state, isRemoving: false })),
    on(ITContractActions.deleteITContractError, (state): ITContractState => ({ ...state, isRemoving: false })),
    on(
      ITContractActions.patchITContractSuccess,
      (state, { itContract }): ITContractState => ({ ...state, itContract })
    ),
    on(
      ITContractActions.addITContractSystemAgreementElementSuccess,
      (state, { itContract }): ITContractState => ({ ...state, itContract })
    ),
    on(
      ITContractActions.removeITContractSystemAgreementElementSuccess,
      (state, { itContract }): ITContractState => ({ ...state, itContract })
    ),
    on(
      ITContractActions.addITContractSystemUsageSuccess,
      (state, { itContract }): ITContractState => ({ ...state, itContract })
    ),
    on(
      ITContractActions.removeITContractSystemUsageSuccess,
      (state, { itContract }): ITContractState => ({ ...state, itContract })
    ),
    on(
      ITContractActions.addITContractDataProcessingRegistrationSuccess,
      (state, { itContract }): ITContractState => ({ ...state, itContract })
    ),
    on(
      ITContractActions.removeITContractDataProcessingRegistrationSuccess,
      (state, { itContract }): ITContractState => ({ ...state, itContract })
    ),
    on(ITContractActions.getITContractPermissions, (state): ITContractState => ({ ...state, permissions: undefined })),
    on(
      ITContractActions.getITContractPermissionsSuccess,
      (state, { permissions }): ITContractState => ({ ...state, permissions })
    ),
    on(
      ITContractActions.getITContractCollectionPermissions,
      (state): ITContractState => ({ ...state, collectionPermissions: undefined })
    ),
    on(
      ITContractActions.getITContractCollectionPermissionsSuccess,
      (state, { collectionPermissions }): ITContractState => ({ ...state, collectionPermissions })
    ),
    on(
      ITContractActions.addExternalReferenceSuccess,
      (state, { itContract }): ITContractState => ({ ...state, itContract })
    ),
    on(
      ITContractActions.editExternalReferenceSuccess,
      (state, { itContract }): ITContractState => ({ ...state, itContract })
    ),
    on(
      ITContractActions.removeExternalReferenceSuccess,
      (state, { itContract }): ITContractState => ({ ...state, itContract })
    ),
    on(
      ITContractActions.addItContractRoleSuccess,
      (state, { itContract }): ITContractState => ({ ...state, itContract })
    ),
    on(
      ITContractActions.removeItContractRoleSuccess,
      (state, { itContract }): ITContractState => ({ ...state, itContract })
    ),
    on(
      ITContractActions.addItContractPaymentSuccess,
      (state, { itContract }): ITContractState => ({ ...state, itContract })
    ),
    on(
      ITContractActions.updateItContractPaymentSuccess,
      (state, { itContract }): ITContractState => ({ ...state, itContract })
    ),
    on(
      ITContractActions.removeItContractPaymentSuccess,
      (state, { itContract }): ITContractState => ({ ...state, itContract })
    ),
    on(ITContractActions.updateGridColumnsSuccess, (state, { gridColumns }): ITContractState => {
      return {
        ...state,
        gridColumns,
      };
    }),
    on(ITContractActions.updateGridColumnsAndRoleColumnsSuccess, (state, { gridColumns }): ITContractState => {
      return {
        ...state,
        gridColumns,
      };
    }),
    on(
      ITContractActions.updateGridState,
      (state, { gridState }): ITContractState => ({
        ...state,
        isLoadingContractsQuery: true,
        gridState,
      })
    ),
    on(ITContractActions.getItContractOverviewRolesSuccess, (state, { roles }): ITContractState => {
      const gridRoleColumns =
        roles?.flatMap((role) => roleDtoToRoleGridColumns(role, CONTRACT_ROLES_SECTION_NAME, 'it-contract')) ?? [];
      return { ...state, gridRoleColumns, contractRoles: roles };
    }),

    on(
      ITContractActions.resetToOrganizationITContractColumnConfigurationSuccess,
      (state, { response }): ITContractState => {
        return {
          ...state,
          organizationGridConfig: response,
        };
      }
    ),

    on(ITContractActions.resetToOrganizationITContractColumnConfigurationError, (state): ITContractState => {
      return {
        ...state,
        organizationGridConfig: undefined,
      };
    }),

    on(
      ITContractActions.initializeITContractLastSeenGridConfigurationSuccess,
      (state, { response }): ITContractState => {
        return {
          ...state,
          organizationGridConfig: response,
        };
      }
    ),

    on(ITContractActions.getAppliedProcurementPlansSuccess, (state, { response }): ITContractState => {
      return {
        ...state,
        appliedProcurementPlans: newCache(response),
      };
    })
  ),
});
