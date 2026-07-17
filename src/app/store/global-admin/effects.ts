import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { GlobalUserInternalV2Service } from 'src/app/api/v2';
import { mapArray } from 'src/app/shared/helpers/observable-helpers';
import { toShallowUser } from 'src/app/shared/models/userV2.model';
import { GlobalAdminActions } from './actions';

@Injectable()
export class GlobalAdminEffects {
  constructor(
    private actions$: Actions,
    @Inject(GlobalUserInternalV2Service)
    private globalUserService: GlobalUserInternalV2Service,
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
