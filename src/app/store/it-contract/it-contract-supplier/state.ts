import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ITContractSupplier } from 'src/app/shared/models/it-contract/it-contract-supplier.model';

export interface ITContractSuppliersState {
  suppliers: ITContractSupplier[];
  total: number;
  isLoading: boolean;
  gridState: GridState;
  previousGridState: GridState;
  gridColumns: GridColumn[];
}
