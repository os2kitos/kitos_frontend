import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { APIV2GlobalUserInternalINTERNALService } from 'src/app/api/v2';
import { GlobalAdminActions } from './actions';
import { toShallowUser } from 'src/app/shared/models/userV2.model';
import { mapArray } from 'src/app/shared/helpers/observable-helpers';

@Injectable()
export class GlobalAdminEffects {
  constructor(
    private actions$: Actions,
    @Inject(APIV2GlobalUserInternalINTERNALService)
    private globalUserService: APIV2GlobalUserInternalINTERNALService,
  ) {}

  getGlobalAdmins$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalAdminActions.getGlobalAdmins),
      switchMap(() => {
        return this.globalUserService.getManyGlobalUserInternalV2GetGlobalAdmins().pipe(
          mapArray(toShallowUser),
          map((admins) => GlobalAdminActions.getGlobalAdminsSuccess(admins)),
          catchError(() => of(GlobalAdminActions.getGlobalAdminsError())),
        );
      }),
    );
  });

  addGlobalAdmin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalAdminActions.addGlobalAdmin),
      switchMap(({ userUuid }) => {
        return this.globalUserService.postSingleGlobalUserInternalV2AddGlobalAdmin({ userUuid }).pipe(
          map(toShallowUser),
          map((user) => GlobalAdminActions.addGlobalAdminSuccess(user)),
          catchError(() => of(GlobalAdminActions.addGlobalAdminError())),
        );
      }),
    );
  });

  removeGlobalAdmin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalAdminActions.removeGlobalAdmin),
      switchMap(({ userUuid }) => {
        return this.globalUserService.deleteSingleGlobalUserInternalV2RemoveGlobalAdmin({ userUuid }).pipe(
          map(() => GlobalAdminActions.removeGlobalAdminSuccess(userUuid)),
          catchError(() => of(GlobalAdminActions.removeGlobalAdminError())),
        );
      }),
    );
  });
}
