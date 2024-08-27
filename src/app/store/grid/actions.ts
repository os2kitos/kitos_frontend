import { createAction } from '@ngrx/store';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';

export const GridExportActions = {
  exportDataFetch: createAction('[Grid Export] Fetch Data', (exportAllColumns: boolean, gridState: GridState, entityType: RegistrationEntityTypes) => ({ exportAllColumns, gridState, entityType })),
  exportCompleted: createAction('[Grid Export] Completed', (gridState: GridState, entityType: RegistrationEntityTypes) => ({ gridState, entityType })),
};
