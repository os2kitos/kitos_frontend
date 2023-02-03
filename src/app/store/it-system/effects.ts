import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { compact } from 'lodash';
import { catchError, map, of, switchMap } from 'rxjs';
import { toODataString } from 'src/app/shared/models/grid-state.model';
import { adaptITSystem } from 'src/app/shared/models/it-system.model';
import { OData } from 'src/app/shared/models/odata.model';
import { ITSystemActions } from './actions';

@Injectable()
export class ITSystemEffects {
  constructor(private actions$: Actions, private httpClient: HttpClient) {}

  getItSystems$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemActions.getItSystems),
      switchMap(({ odataString }) =>
        this.httpClient
          .get<OData>(`/odata/Organizations(1)/ItSystemUsageOverviewReadModels?${odataString}&$count=true`)
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
