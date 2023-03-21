import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { APIV2ItSystemService } from 'src/app/api/v2';
import { ITSystemActions } from './actions';

@Injectable()
export class ITSystemEffects {
  constructor(private actions$: Actions, private store: Store, private apiItSystemService: APIV2ItSystemService) {}

  getItSystem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ITSystemActions.getItSystem),
      switchMap(({ systemUuid }) =>
        this.apiItSystemService.gETSINGLEItSystemV2GetItSystem({ uuid: systemUuid }).pipe(
          map((itSystem) => ITSystemActions.getItSystemSuccess(itSystem)),
          catchError(() => of(ITSystemActions.getItSystemError()))
        )
      )
    );
  });
}
