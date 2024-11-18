import { GridColumn } from '../models/grid-column.model';

export function includedColumnInExport(column: GridColumn): boolean {
  return column.style !== 'action-buttons';
}
