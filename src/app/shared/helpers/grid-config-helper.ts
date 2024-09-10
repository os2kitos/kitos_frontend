import { GridColumn } from '../models/grid-column.model';

export function getColumnsToShow(columns: GridColumn[], defaultColumns: GridColumn[]): GridColumn[] {
  return columns.map((column) => ({
    ...column,
    hidden: isColumnHiddenByDefault(column, defaultColumns),
  }));
}

function isColumnHiddenByDefault(column: GridColumn, defaultColumns: GridColumn[]): boolean {
  const defaultColumn = defaultColumns.find((defaultColumn) => defaultColumn.field === column.field);
  if (!defaultColumn) return true; //Some columns are not in the default columns, and thus should be hidden
  return defaultColumn.hidden;
}
