import { map, Observable } from 'rxjs';
import { GridColumn } from '../models/grid-column.model';

export function getColumnsToShow(columns: GridColumn[], defaultColumns: GridColumn[]): GridColumn[] {
  const defaultColumnMap = new Map(defaultColumns.map((col) => [col.field, col]));
  return columns.map((column) => ({
    ...column,
    hidden: isColumnHiddenByDefault(column, defaultColumnMap) || (column.disabledByUIConfig ?? false),
  }));
}

function isColumnHiddenByDefault(column: GridColumn, defaultColumnMap: Map<string, GridColumn>): boolean {
  const defaultColumn = defaultColumnMap.get(column.field);
  if (!defaultColumn) return true; // Some columns are not in the default columns, and thus should be hidden
  return defaultColumn.hidden;
}

function filterColumnsByUIConfig(columns: GridColumn[] | null): GridColumn[] | null {
  if (!columns) {
    return null;
  }
  return columns.map((column) => ({
    ...column,
    hidden: column.hidden || (column.disabledByUIConfig ?? false),
  }));
}

export function filterGridColumnsByUIConfig(): (source: Observable<GridColumn[] | null>) => Observable<GridColumn[]> {
  return (source: Observable<GridColumn[] | null>) =>
    source.pipe(map((columns) => filterColumnsByUIConfig(columns) || []));
}
