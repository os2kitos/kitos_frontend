import { createFeature, createReducer, on } from '@ngrx/store';
import { defaultODataGridState } from 'src/app/shared/models/grid-state.model';
import { ITContractSupplierActions } from './actions';
import { ITContractSuppliersState } from './state';

export const itContractSupplierInitialState: ITContractSuppliersState = {
  suppliers: [],
  total: 0,
  isLoading: false,
  gridState: defaultODataGridState,
  previousGridState: defaultODataGridState,
  gridColumns: [],
};

export const itContractSupplierFeature = createFeature({
  name: 'ITContractSupplier',
  reducer: createReducer(
    itContractSupplierInitialState,
    on(ITContractSupplierActions.getSuppliers, (state): ITContractSuppliersState => ({ ...state, isLoading: true })),
    on(
      ITContractSupplierActions.getSuppliersSuccess,
      (state, { suppliers, total }): ITContractSuppliersState => ({
        ...state,
        suppliers,
        total,
        isLoading: false,
      }),
    ),
    on(
      ITContractSupplierActions.getSuppliersError,
      (state): ITContractSuppliersState => ({
        ...state,
        isLoading: false,
      }),
    ),
    on(ITContractSupplierActions.updateGridColumnsSuccess, (state, { gridColumns }): ITContractSuppliersState => {
      return {
        ...state,
        gridColumns,
      };
    }),
    on(
      ITContractSupplierActions.updateGridState,
      (state, { gridState }): ITContractSuppliersState => ({
        ...state,
        isLoading: true,
        gridState,
        previousGridState: state.gridState,
      }),
    ),
  ),
});
