import { map, Observable } from 'rxjs';
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

function filterColumnsByUIConfig(columns: GridColumn[] | null): GridColumn[] | null {
  if (!columns) {
    return null;
  }
  return columns.filter((column) => !column.disabledByUIConfig);
}

export function filterGridColumnsByUIConfig(): (source: Observable<GridColumn[] | null>) => Observable<GridColumn[]> {
  return (source: Observable<GridColumn[] | null>) =>
    source.pipe(map((columns) => filterColumnsByUIConfig(columns) || []));
}
