import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { APIV2GlobalUserInternalINTERNALService } from 'src/app/api/v2';
import { LocalAdminUserActions } from './actions';
import { adaptLocalAdminUser } from 'src/app/shared/models/local-admin/local-admin-user.model';
import { UserActions } from '../../user-store/actions';

@Injectable()
export class LocalAdminUserEffects {
  constructor(private actions$: Actions, private globalUserService: APIV2GlobalUserInternalINTERNALService) {}

  getLocalAdmins$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LocalAdminUserActions.getLocalAdmins),
      switchMap(() => {
        return this.globalUserService.getManyGlobalUserInternalV2GetAllLocalAdmins().pipe(
          map((adminsDto) => adminsDto.map((userDto) => adaptLocalAdminUser(userDto))),
          map((admins) => LocalAdminUserActions.getLocalAdminsSuccess(admins)),
          catchError(() => of(LocalAdminUserActions.getLocalAdminsError()))
        );
      })
    );
  });

  addLocalAdmin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LocalAdminUserActions.addLocalAdmin),
      switchMap(({ organizationUuid, userUuid }) => {
        return this.globalUserService.postSingleGlobalUserInternalV2AddLocalAdmin({ organizationUuid, userUuid }).pipe(
          map((userDto) => adaptLocalAdminUser(userDto)),
          map((user) => LocalAdminUserActions.addLocalAdminSuccess(user)),
          catchError(() => of(LocalAdminUserActions.addLocalAdminError()))
        );
      })
    );
  });

  removeLocalAdmin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LocalAdminUserActions.removeLocalAdmin),
      switchMap(({ organizationUuid, userUuid }) => {
        return this.globalUserService
          .deleteSingleGlobalUserInternalV2RemoveLocalAdmin({ organizationUuid, userUuid })
          .pipe(
            map(() => LocalAdminUserActions.removeLocalAdminSuccess(organizationUuid, userUuid)),
            catchError(() => of(LocalAdminUserActions.removeLocalAdminError()))
          );
      })
    );
  });

  updateUserAuthentication$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LocalAdminUserActions.addLocalAdminSuccess, LocalAdminUserActions.removeLocalAdminSuccess),
      map(() => UserActions.authenticate())
    );
  });
}
