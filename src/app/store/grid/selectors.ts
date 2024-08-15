import { createSelector } from "@ngrx/store";
import { exportFeature } from "./reducer";

const { selectExportState } = exportFeature;

export const selectExporting = createSelector(selectExportState, (state) => state.readyForExport);
