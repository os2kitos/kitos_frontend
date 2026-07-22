import { createActionGroup, emptyProps } from '@ngrx/store';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { SavedFilterState } from 'src/app/shared/models/grid/saved-filter-state.model';
import { ITContractSupplier } from 'src/app/shared/models/it-contract/it-contract-supplier.model';

export const ITContractSupplierActions = createActionGroup({
  source: 'ITContractSupplier',
  events: {
    'Get Suppliers': (gridState: GridState) => ({ gridState }),
    'Get Suppliers Success': (suppliers: ITContractSupplier[], total: number) => ({ suppliers, total }),
    'Get Suppliers Error': emptyProps(),

    'Update Grid State': (gridState: GridState) => ({ gridState }),
    'Update Grid Columns': (gridColumns: GridColumn[]) => ({ gridColumns }),
    'Update Grid Columns Success': (gridColumns: GridColumn[]) => ({ gridColumns }),

    'Save IT Contract Suppliers Filter': (localStoreKey: string) => ({ localStoreKey }),
    'Apply IT Contract Suppliers Filter': (state: SavedFilterState) => ({ state }),
    'Reset grid configuration': emptyProps(),
  },
});
