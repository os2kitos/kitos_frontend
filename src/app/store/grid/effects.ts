import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { toODataString } from 'src/app/shared/models/grid-state.model';
import { DataProcessingActions } from '../data-processing/actions';
import { ITContractActions } from '../it-contract/actions';
import { ITInterfaceActions } from '../it-system-interfaces/actions';
import { ITSystemUsageActions } from '../it-system-usage/actions';
import { ITSystemActions } from '../it-system/actions';
import { OrganizationActions } from '../organization/actions';
import { OrganizationUserActions } from '../organization/organization-user/actions';
import { GridExportActions } from './actions';

@Injectable()
export class GridExportEffects {
  constructor(private actions$: Actions) {}

  updateGridStateOnExport$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GridExportActions.exportDataFetch, GridExportActions.exportCompleted),
      mergeMap((action) => {
        return of(action).pipe(
          mergeMap((action) => {
            const gridState = action.gridState;
            const odataString = toODataString(gridState);
            switch (action.entityType) {
              case 'it-system-usage':
                return of(ITSystemUsageActions.getITSystemUsages(odataString));
              case 'it-system':
                return of(ITSystemActions.getITSystems(odataString));
              case 'it-contract':
                return of(ITContractActions.getITContracts(odataString));
              case 'data-processing-registration':
                return of(DataProcessingActions.getDataProcessings(odataString));
              case 'it-interface':
                return of(ITInterfaceActions.getITInterfaces(odataString));
              case 'organization-user':
                return of(OrganizationUserActions.getOrganizationUsers(odataString));
              case 'local-admin-organization':
              case 'global-admin-organization':
                return of(OrganizationActions.getOrganizations(odataString));
              default:
                throw 'Grid Effects Excel export not implemented for entity type: ' + action.entityType;
            }
          })
        );
      })
    );
  });
}
