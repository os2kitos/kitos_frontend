import { createFeature, createReducer, on } from "@ngrx/store";
import { GridExportActions } from "./actions";

export class ExportState {
  readyForExport: boolean | undefined;
}

export const exportInitialState: ExportState = {
  readyForExport: false,
};

export const exportFeature = createFeature({
  name: 'Export',
  reducer: createReducer(
    exportInitialState,
    on(
      GridExportActions.exportStart,
      (state): ExportState => ({ ...state, readyForExport: true })
    ),

    on(
      GridExportActions.exportCompleted,
      (state): ExportState => ({ ...state, readyForExport: false })
    )
  )
});
