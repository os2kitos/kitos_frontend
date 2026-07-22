import { createSelector } from '@ngrx/store';
import { GridData } from 'src/app/shared/models/grid-data.model';
import { itContractSupplierFeature } from './reducer';

const { selectITContractSupplierState } = itContractSupplierFeature;

export const selectSupplierGridData = createSelector(
  selectITContractSupplierState,
  (state): GridData => ({ data: state.suppliers, total: state.total }),
);

export const selectSupplierIsLoading = createSelector(selectITContractSupplierState, (state) => state.isLoading);

export const selectSupplierGridState = createSelector(selectITContractSupplierState, (state) => state.gridState);

export const selectSupplierPreviousGridState = createSelector(
  selectITContractSupplierState,
  (state) => state.previousGridState,
);

export const selectSupplierGridColumns = createSelector(selectITContractSupplierState, (state) => state.gridColumns);
