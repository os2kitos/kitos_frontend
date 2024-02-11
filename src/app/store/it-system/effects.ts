import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { compact } from 'lodash';
import { catchError, map, of, switchMap } from 'rxjs';
import { APIV2ItSystemService } from 'src/app/api/v2';
import { toODataString } from 'src/app/shared/models/grid-state.model';
import { adaptITSystem } from 'src/app/shared/models/it-system/it-system.model';
import { OData } from 'src/app/shared/models/odata.model';
import { ITSystemActions } from './actions';
import { selectItSystemUuid } from './selectors';

@Injectable()
export class ITSystemEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private apiItSystemService: APIV2ItSystemService,
    private httpClient: HttpClient
  ) {}

  getItSystem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemActions.getITSystem),
      switchMap(({ systemUuid }) =>
        this.apiItSystemService.getSingleItSystemV2GetItSystem({ uuid: systemUuid }).pipe(
          map((itSystem) => ITSystemActions.getITSystemSuccess(itSystem)),
          catchError(() => of(ITSystemActions.getITSystemError()))
        )
      )
    );
  });

  getitSystems$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemActions.getITSystems),
      switchMap(({ odataString }) =>
        this.httpClient.get<OData>(`/odata/ItSystems?${odataString}`).pipe(
          map((data) =>
            ITSystemActions.getITSystemsSuccess(compact(data.value.map(adaptITSystem)), data['@odata.count'])
          ),
          catchError(() => of(ITSystemActions.getITSystemsError()))
        )
      )
    );
  });

  updateGridState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemActions.updateGridState),
      map(({ gridState }) => ITSystemActions.getITSystems(toODataString(gridState)))
    );
  });

  deleteItSystem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemActions.deleteITSystem),
      concatLatestFrom(() => this.store.select(selectItSystemUuid)),
      switchMap(([_, systemUuid]) => {
        if (!systemUuid) return of(ITSystemActions.deleteITSystemError());

        return this.apiItSystemService.deleteSingleItSystemV2DeleteItSystem({ uuid: systemUuid }).pipe(
          map(() => ITSystemActions.deleteITSystemSuccess()),
          catchError(() => of(ITSystemActions.getITSystemsError()))
        );
      })
    );
  });

  patchItSystem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemActions.patchITSystem),
      concatLatestFrom(() => this.store.select(selectItSystemUuid)),
      switchMap(([{ itSystem }, systemUuid]) => {
        if (!systemUuid) return of(ITSystemActions.patchITSystemError());

        return this.apiItSystemService
          .patchSingleItSystemV2PostItSystemV1({ uuid: systemUuid, request: itSystem })
          .pipe(
            map((itSystem) => ITSystemActions.patchITSystemSuccess(itSystem)),
            catchError(() => of(ITSystemActions.patchITSystemError()))
          );
      })
    );
  });
}
