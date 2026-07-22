import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { GlobalUserInternalV2Service } from 'src/app/api/v2';
import { GlobalAdminSystemIntegratorActions } from './actions';

@Injectable()
export class SystemIntegratorEffects {
  constructor(
    @Inject(GlobalUserInternalV2Service)
    private readonly globalUserService: GlobalUserInternalV2Service,
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
