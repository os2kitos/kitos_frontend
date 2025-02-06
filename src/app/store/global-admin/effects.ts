import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { APIV2GlobalUserInternalINTERNALService } from 'src/app/api/v2';
import { adaptGlobalAdminUser } from 'src/app/shared/models/global-admin/global-admin-user.model';
import { GlobalAdminActions } from './actions';

@Injectable()
export class GlobalAdminEffects {
  constructor(
    private actions$: Actions,
    @Inject(APIV2GlobalUserInternalINTERNALService)
    private globalUserService: APIV2GlobalUserInternalINTERNALService
  ) {}

  getGlobalAdmins$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalAdminActions.getGlobalAdmins),
      switchMap(() => {
        return this.globalUserService.getManyGlobalUserInternalV2GetGlobalAdmins().pipe(
          map((adminsDto) => adminsDto.map((userDto) => adaptGlobalAdminUser(userDto))),
          map((admins) => GlobalAdminActions.getGlobalAdminsSuccess(admins)),
          catchError(() => of(GlobalAdminActions.getGlobalAdminsError()))
        );
      })
    );
  });

  addGlobalAdmin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalAdminActions.addGlobalAdmin),
      switchMap(({ userUuid }) => {
        return this.globalUserService.postSingleGlobalUserInternalV2AddGlobalAdmin({ userUuid }).pipe(
          map((userDto) => adaptGlobalAdminUser(userDto)),
          map((user) => GlobalAdminActions.addGlobalAdminSuccess(user)),
          catchError(() => of(GlobalAdminActions.addGlobalAdminError()))
        );
      })
    );
  });

  removeGlobalAdmin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalAdminActions.removeGlobalAdmin),
      switchMap(({ userUuid }) => {
        return this.globalUserService.deleteSingleGlobalUserInternalV2RemoveGlobalAdmin({ userUuid }).pipe(
          map(() => GlobalAdminActions.removeGlobalAdminSuccess(userUuid)),
          catchError(() => of(GlobalAdminActions.removeGlobalAdminError()))
        );
      })
    );
  });
}
