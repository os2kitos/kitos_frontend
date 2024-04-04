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
