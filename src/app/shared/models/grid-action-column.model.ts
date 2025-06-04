import { GridColumn } from './grid-column.model';

export type GridColumnActionType = 'edit' | 'delete' | 'toggle';

export interface GridActionColumn {
  type: GridColumnActionType;
}

export function createGridActionColumn(types: GridColumnActionType[]): GridColumn {
  return {
    field: 'Actions',
    title: ' ',
    hidden: false,
    style: 'action-buttons',
    sortable: false,
    isSticky: true,
    noFilter: true,
    extraData: types.map((type) => ({ type })) as GridActionColumn[],
    width: types.length * 50,
  };
}
