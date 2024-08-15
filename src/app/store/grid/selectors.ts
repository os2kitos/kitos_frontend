import { createSelector, MemoizedSelector } from '@ngrx/store';
import { exportFeature } from './reducer'; // Adjust the import path as necessary
import { ExportState } from './state';

const { selectGridExportState } = exportFeature;

export const selectReadyToExport: MemoizedSelector<object, { readyToExport: boolean; exportAllColumns: boolean; }> = createSelector(selectGridExportState,
  (state: ExportState) => {
    return {
      readyToExport: state.readyToExport,
      exportAllColumns: state.exportAllColumns
    }
  });

