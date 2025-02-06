import { createFeature, createReducer, on } from '@ngrx/store';
import { GridActions } from './actions';
import { ExportState } from './state';

export const defaultExportState: ExportState = {
  isExporting: false,
  readyToExport: false,
  exportAllColumns: false,
};

export const exportFeature = createFeature({
  name: 'GridExport',
  reducer: createReducer(
    defaultExportState,
    on(GridActions.exportDataFetch, (state, { exportAllColumns }): ExportState => {
      return {
        ...state,
        isExporting: true,
        exportAllColumns: exportAllColumns,
      };
    }),
    on(GridActions.exportCompleted, (state): ExportState => {
      return {
        ...state,
        isExporting: false,
        readyToExport: false,
        exportAllColumns: false,
      };
    })
  ),
});

// Use the automatically generated selector
export const { selectGridExportState } = exportFeature;
