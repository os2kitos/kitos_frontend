import { createSelector, MemoizedSelector } from '@ngrx/store';
import { exportFeature } from './reducer'; // Adjust the import path as necessary
import { ExportState } from './state';

const { selectGridExportState } = exportFeature;

export const selectReadyToExport: MemoizedSelector<object, boolean> = createSelector(selectGridExportState,
  (state: ExportState) => state.readyToExport);

export const selectExportAllColumns: MemoizedSelector<object, boolean> = createSelector(selectGridExportState,
  (state: ExportState) => state.exportAllColumns);
