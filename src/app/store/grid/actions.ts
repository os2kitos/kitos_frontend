import { createAction } from '@ngrx/store';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';

export const GridExportActions = {
  exportDataFetch: createAction('[Grid Export] Fetch Data', (exportAllColumns: boolean, gridState: GridState, entityType: RegistrationEntityTypes) => ({ exportAllColumns, gridState, entityType })),
  exportCompleted: createAction('[Grid Export] Completed', (gridState: GridState, entityType: RegistrationEntityTypes) => ({ gridState, entityType })),
};

export const GridSavedFilterActions = {
  // One of the filters updates it's options based on the selected value. This is to ensure that the options is updated when the filter value is applied
  dropdownDataOptionsUpdated: createAction('[Grid Saved Filter] Dropdown Data Options Updated', (column: string, entityType: RegistrationEntityTypes) => ({column, entityType})),
}
