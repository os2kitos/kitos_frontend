import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';

import { Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { APIV2KLEInternalINTERNALService, APIV2KleOptionService } from 'src/app/api/v2';
import { KLE_FILE_NAME } from 'src/app/shared/constants/constants';
import { KLEActions } from './actions';
import { selectHasValidCache } from './selectors';

@Injectable()
export class KLEEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    @Inject(APIV2KleOptionService) private apiKleOptionService: APIV2KleOptionService,
    @Inject(APIV2KLEInternalINTERNALService) private apiKleInternalService: APIV2KLEInternalINTERNALService
  ) {}

  getKles$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(KLEActions.getKLEs),
      concatLatestFrom(() => this.store.select(selectHasValidCache)),
      filter(([_, validCache]) => !validCache),
      switchMap(() =>
        this.apiKleOptionService.getSingleKleOptionV2Get({ kleUuid: '' }).pipe(
          map((response) => KLEActions.getKLEsSuccess(response.payload)),
          catchError(() => of(KLEActions.getKLEsError()))
        )
      )
    );
  });

  getAdminKleStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(KLEActions.getAdminKLEStatus),
      switchMap(() =>
        this.apiKleInternalService.getSingleKLEInternalV2GetKLEStatus().pipe(
          map((response) => KLEActions.getAdminKLEStatusSuccess(response)),
          catchError(() => of(KLEActions.getAdminKLEStatusError()))
        )
      )
    );
  });

  getAdminKleFile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(KLEActions.getAdminKLEFile),
      switchMap(() =>
        this.apiKleInternalService
          .getSingleKLEInternalV2GetKLEChanges(undefined, undefined, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            httpHeaderAccept: 'blob' as any,
            context: undefined,
          })
          .pipe(
            map((response) => {
              saveAs(response, KLE_FILE_NAME);
              return KLEActions.getAdminKLEFileSuccess();
            }),
            catchError((err) => {
              console.error(err);
              return of(KLEActions.getAdminKLEFileError());
            })
          )
      )
    );
  });

  updateAdminKle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(KLEActions.updateAdminKLE),
      switchMap(() =>
        this.apiKleInternalService.putSingleKLEInternalV2PutKLEChanges().pipe(
          map(() => KLEActions.updateAdminKLESuccess()),
          catchError(() => of(KLEActions.updateAdminKLEError()))
        )
      )
    );
  });
}
