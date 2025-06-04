import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { APIV2GlobalUserInternalINTERNALService } from 'src/app/api/v2';
import { GlobalAdminSystemIntegratorActions } from './actions';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class SystemIntegratorEffects {
  constructor(
    private readonly globalUserService: APIV2GlobalUserInternalINTERNALService,
    private readonly actions$: Actions,
  ) {}

  updateSystemIntegrator$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalAdminSystemIntegratorActions.editSystemIntegrator),
      switchMap(({ userUuid, requestedSystemIntegratorStatus }) =>
        this.globalUserService
          .patchSingleGlobalUserInternalV2UpdateSystemIntegrator({
            userUuid,
            requestedValue: requestedSystemIntegratorStatus,
          })
          .pipe(
            map(() => GlobalAdminSystemIntegratorActions.editSystemIntegratorSuccess()),
            catchError(() => of(GlobalAdminSystemIntegratorActions.editSystemIntegratorError())),
          ),
      ),
    );
  });
}
