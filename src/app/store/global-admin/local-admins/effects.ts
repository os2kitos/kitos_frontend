import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { APIV2GlobalUserInternalINTERNALService } from 'src/app/api/v2';
import { LocalAdminUserActions } from './actions';
import { adaptLocalAdminUser } from 'src/app/shared/models/local-admin/local-admin-user.model';
import { UserActions } from '../../user-store/actions';
import { concatLatestFrom } from '@ngrx/operators';
import { selectUserUuid } from '../../user-store/selectors';
import { Store } from '@ngrx/store';

@Injectable()
export class LocalAdminUserEffects {
  constructor(
    private actions$: Actions,
    private globalUserService: APIV2GlobalUserInternalINTERNALService,
    private store: Store
  ) {}

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
      map((action) => {
        switch (action.type) {
          case LocalAdminUserActions.addLocalAdminSuccess.type:
            return action.user.user.uuid;
          case LocalAdminUserActions.removeLocalAdminSuccess.type:
            return action.userUuid;
        }
      }),
      concatLatestFrom(() => this.store.select(selectUserUuid)),
      filter(([modifiedUserUuid, currentUserUuid]) => modifiedUserUuid === currentUserUuid),
      map(() => UserActions.authenticate())
    );
  });
}
