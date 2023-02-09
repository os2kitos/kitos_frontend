import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, map, of, switchMap } from 'rxjs';
import { toODataString } from 'src/app/shared/models/grid-state.model';
import { adaptITSystem } from 'src/app/shared/models/it-system.model';
import { OData } from 'src/app/shared/models/odata.model';
import { selectOrganizationUuid } from '../user-store/selectors';
import { ITSystemActions } from './actions';

@Injectable()
export class ITSystemEffects {
  constructor(private actions$: Actions, private store: Store, private httpClient: HttpClient) {}

  getItSystems$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemActions.getItSystems),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid)),
      switchMap(([{ odataString }, organizationUuid]) =>
        this.httpClient
          .get<OData>(
            `/odata/ItSystemUsageOverviewReadModels?organizationUuid=${organizationUuid}&${odataString}&$count=true`
          )
          .pipe(
            map((data) =>
              ITSystemActions.getItSystemsSuccess(compact(data.value.map(adaptITSystem)), data['@odata.count'])
            ),
            catchError(() => of(ITSystemActions.getItSystemsError()))
          )
      )
    );
  });

  updateGridState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemActions.updateGridState),
      map(({ gridState }) => ITSystemActions.getItSystems(toODataString(gridState)))
    );
  });
}
