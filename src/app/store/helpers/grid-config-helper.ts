import { APIColumnConfigurationResponseDTO } from 'src/app/api/v2';
import { GridColumn } from 'src/app/shared/models/grid-column.model';

export function getNewGridColumnsBasedOnConfig(
  columnConfigs: APIColumnConfigurationResponseDTO[],
  columns: GridColumn[]
): GridColumn[] {
  const columnConfigMap = new Map(columnConfigs.map(config => [config.persistId, config.index]));
  const columnsWithHiddenState = columns.map((col) => ({
    ...col,
    hidden: !columnConfigMap.has(col.persistId),
  }));
  
  return columnsWithHiddenState.sort((a, b) => {
    const aIndex = columnConfigMap.get(a.persistId) ?? -1;
    const bIndex = columnConfigMap.get(b.persistId) ?? -1;
    return aIndex - bIndex;
  });
}
