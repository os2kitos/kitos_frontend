import { createSelector } from '@ngrx/store';
import { itContactAdapter, itContractFeature } from './reducer';

const { selectITContractState } = itContractFeature;

export const selectAll = createSelector(selectITContractState, itContactAdapter.getSelectors().selectAll);

export const selectTotal = createSelector(selectITContractState, (state) => state.total);
export const selectContractGridLoading = createSelector(
  selectITContractState,
  (state) => state.isLoadingContractsQuery
);
export const selectContractGridState = createSelector(selectITContractState, (state) => state.gridState);
export const selectContractGridData = createSelector(selectAll, selectTotal, (data, total) => ({ data, total }));

export const selectContractLoading = createSelector(selectITContractState, (state) => state.loading);
export const selectContract = createSelector(selectITContractState, (state) => state.itContract);

export const selectItContractUuid = createSelector(selectITContractState, (state) => state.itContract?.uuid);
export const selectItContractName = createSelector(selectContract, (contract) => contract?.name);

export const selectItContractSystemAgreementElements = createSelector(
  selectContract,
  (contract) => contract?.general.agreementElements
);
export const selectItContractSystemUsages = createSelector(selectContract, (contract) => contract?.systemUsages);
export const selectItContractDataProcessingRegistrations = createSelector(
  selectContract,
  (contract) => contract?.dataProcessingRegistrations
);
export const selectItContractExternalReferences = createSelector(
  selectContract,
  (contract) => contract?.externalReferences
);
export const selectItContractValidity = createSelector(selectContract, (contract) => contract?.general.validity);
export const selectItContractIsValid = createSelector(selectItContractValidity, (validity) => validity?.valid);

export const selectItContractHasReadPermissions = createSelector(
  selectITContractState,
  (state) => state.permissions?.read
);
export const selectItContractHasModifyPermissions = createSelector(
  selectITContractState,
  (state) => state.permissions?.modify
);
export const selectItContractHasDeletePermissions = createSelector(
  selectITContractState,
  (state) => state.permissions?.delete
);
export const selectItContractHasCollectionCreatePermissions = createSelector(
  selectITContractState,
  (state) => state.collectionPermissions?.create
);
