import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, map, of, switchMap } from 'rxjs';
import { toODataString } from 'src/app/shared/models/grid-state.model';
import { adaptITSystemUsage } from 'src/app/shared/models/it-system-usage.model';
import { OData } from 'src/app/shared/models/odata.model';
import { selectOrganizationUuid } from '../user-store/selectors';
import { ITSystemUsageActions } from './actions';

@Injectable()
export class ITSystemUsageEffects {
  constructor(private actions$: Actions, private store: Store, private httpClient: HttpClient) {}

  getItSystemUsages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.getItSystemUsages),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid)),
      switchMap(([{ odataString }, organizationUuid]) =>
        this.httpClient
          .get<OData>(
            `/odata/ItSystemUsageOverviewReadModels?organizationUuid=${organizationUuid}&${odataString}&$count=true`
          )
          .pipe(
            map((data) =>
              ITSystemUsageActions.getItSystemUsagesSuccess(
                compact(data.value.map(adaptITSystemUsage)),
                data['@odata.count']
              )
            ),
            catchError(() => of(ITSystemUsageActions.getItSystemUsagesError()))
          )
      )
    );
  });

  updateGridState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemUsageActions.updateGridState),
      map(({ gridState }) => ITSystemUsageActions.getItSystemUsages(toODataString(gridState, { utcDates: true })))
    );
  });
}
