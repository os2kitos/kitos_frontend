import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { toODataString } from 'src/app/shared/models/grid-state.model';
import { DataProcessingActions } from '../data-processing/actions';
import { ITContractActions } from '../it-contract/actions';
import { ITInterfaceActions } from '../it-system-interfaces/actions';
import { ITSystemUsageActions } from '../it-system-usage/actions';
import { ITSystemActions } from '../it-system/actions';
import { GridExportActions } from './actions';

@Injectable()
export class GridExportEffects {
  constructor(private actions$: Actions) { }

  updateGridStateOnExport$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GridExportActions.exportDataFetch, GridExportActions.exportCompleted),
      mergeMap(action => {
        return of(action).pipe(
          filter(({ entityType }) =>
            entityType === 'it-system-usage' ||
            entityType === 'it-system' ||
            entityType === 'it-contract' ||
            entityType === 'data-processing-registration' ||
            entityType === 'it-interface'
          ),
          mergeMap(action => {
            const gridState = action.gridState;
            if (action.entityType === 'it-system-usage') {
              return of(ITSystemUsageActions.getITSystemUsages(toODataString(gridState)));
            } else if (action.entityType === 'it-system') {
              return of(ITSystemActions.getITSystems(toODataString(gridState)));
            } else if (action.entityType === 'it-contract') {
              return of(ITContractActions.getITContracts(toODataString(gridState)));
            } else if (action.entityType === 'data-processing-registration') {
              return of(DataProcessingActions.getDataProcessings(toODataString(gridState)));
            } else if (action.entityType === 'it-interface') {
              return of(ITInterfaceActions.getITInterfaces(toODataString(gridState)));
            } else {
              return of(); // Return an empty observable for other cases
            }
          })
        );
      })
    );
  });
}
