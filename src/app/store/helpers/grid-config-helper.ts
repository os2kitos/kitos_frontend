import { APIColumnConfigurationResponseDTO } from 'src/app/api/v2';
import { GridColumn } from 'src/app/shared/models/grid-column.model';

export function getNewGridColumnsBasedOnConfig(
  configColumns: APIColumnConfigurationResponseDTO[],
  columns: GridColumn[]
): GridColumn[] {
  return columns.map((col) => ({
    ...col,
    hidden: !configColumns.some((configCol) => configCol.persistId === col.persistId),
  }));
}
