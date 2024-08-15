import { createFeature, createReducer, on } from '@ngrx/store';
import { GridExportActions } from './actions';
import { ExportState } from './state';

export const defaultExportState: ExportState = {
  isExporting: false,
  readyToExport: false,
  exportAllColumns: false
};

export const exportFeature = createFeature({
  name: 'GridExport',
  reducer: createReducer(
    defaultExportState,
    on(GridExportActions.exportDataFetch, (state): ExportState => ({
      ...state,
      isExporting: true,
      readyToExport: false,
      exportAllColumns: state.exportAllColumns
    })),
    // on(
    //   ITSystemUsageActions.getITSystemUsagesSuccess,
    //   (state): ExportState => ({
    //     ...state,
    //     readyToExport: state.isExporting
    //   })
    // ),
    on(
      GridExportActions.exportCompleted,
      (state): ExportState => ({
        ...state,
        isExporting: false
      })
    ),
  )
});

// Use the automatically generated selector
export const { selectGridExportState } = exportFeature;
