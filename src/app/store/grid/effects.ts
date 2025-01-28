import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { interval, merge, of } from 'rxjs';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { TWO_MINUTES_IN_MILLISECONDS } from 'src/app/shared/constants/constants';
import { usageGridStateToAction, contractsGridStateToAction } from 'src/app/shared/helpers/grid-filter.helpers';
import { GridDataCacheService } from 'src/app/shared/services/grid-data-cache.service';
import { DataProcessingActions } from '../data-processing/actions';
import { ITInterfaceActions } from '../it-system-interfaces/actions';
import { ITSystemActions } from '../it-system/actions';
import { OrganizationActions } from '../organization/actions';
import { OrganizationUserActions } from '../organization/organization-user/actions';
import { GridActions } from './actions';

@Injectable()
export class GridExportEffects {
  constructor(private actions$: Actions, private router: Router, private gridDataCacheService: GridDataCacheService) {}

  invalidateGridDataCache$ = createEffect(
    () => {
      return merge(
        interval(TWO_MINUTES_IN_MILLISECONDS),
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd))
      ).pipe(
        tap(() => {
          this.gridDataCacheService.reset();
          return GridActions.invalidateGridDataCacheSuccess();
        })
      );
    },
    { dispatch: false }
  );

  updateGridStateOnExport$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GridActions.exportDataFetch, GridActions.exportCompleted),
      mergeMap((action) => {
        return of(action).pipe(
          mergeMap((action) => {
            const gridState = action.gridState;
            switch (action.entityType) {
              case 'it-system-usage':
                return of(usageGridStateToAction(gridState));
              case 'it-system':
                return of(ITSystemActions.getITSystems(gridState));
              case 'it-contract':
                return of(contractsGridStateToAction(gridState));
              case 'data-processing-registration':
                return of(DataProcessingActions.getDataProcessings(gridState));
              case 'it-interface':
                return of(ITInterfaceActions.getITInterfaces(gridState));
              case 'organization-user':
                return of(OrganizationUserActions.getOrganizationUsers(gridState));
              case 'local-admin-organization':
              case 'global-admin-organization':
                return of(OrganizationActions.getOrganizations(gridState));
              default:
                throw 'Grid Effects Excel export not implemented for entity type: ' + action.entityType;
            }
          })
        );
      })
    );
  });
}
