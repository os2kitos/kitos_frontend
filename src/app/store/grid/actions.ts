import { createAction } from '@ngrx/store';

export const GridExportActions = {
  exportStart: createAction('[Grid Export] Start', (exportAllColumns: boolean) => ({ exportAllColumns })),
  exportCompleted: createAction('[Grid Export] Completed'),
};
