import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';

import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { APIV2KleOptionService } from 'src/app/api/v2';
import { KLEActions } from './actions';
import { selectHasValidCache } from './selectors';

@Injectable()
export class KLEEffects {
  constructor(private actions$: Actions, private store: Store, private apiKleOptionService: APIV2KleOptionService) {}

  getKles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(KLEActions.getKLEs),
      concatLatestFrom(() => this.store.select(selectHasValidCache)),
      filter(([_, validCache]) => !validCache),
      switchMap(() =>
        this.apiKleOptionService.getSingleKleOptionV2Get({ kleUuid: ''}).pipe(
          map((response) => KLEActions.getKLEsSuccess(response.payload)),
          catchError(() => of(KLEActions.getKLEsError()))
        )
      )
    );
  });
}
