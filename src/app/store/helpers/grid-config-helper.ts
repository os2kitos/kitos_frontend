import { APIColumnConfigurationResponseDTO } from "src/app/api/v2";
import { GridColumn } from "src/app/shared/models/grid-column.model";

export function getNewGridColumnsBasedOnConfig(configColumns: APIColumnConfigurationResponseDTO[], columns: GridColumn[]): GridColumn[] {
  const visisbleColumns: GridColumn[] = configColumns
    .map((configCol) => columns.find((col) => col.persistId === configCol.persistId))
    .filter((col) => col !== undefined)
    .map((col) => ({ ...col!, hidden: false }));
  const hiddenColumns = columns
    .filter((col) => !configColumns.find((configCol) => configCol.persistId === col.persistId))
    .map((col) => ({ ...col, hidden: true }));
  const newColumns = visisbleColumns.concat(hiddenColumns);
  return newColumns;
}
