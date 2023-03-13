import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CookieService } from 'ngx-cookie';
import { catchError, EMPTY, map, mergeMap, of, tap } from 'rxjs';
import { APIV1AuthorizeINTERNALService } from 'src/app/api/v1';
import { AppPath } from 'src/app/shared/enums/app-path';
import { adaptUser } from 'src/app/shared/models/user.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { resetOrganizationStateAction, resetStateAction } from '../meta/actions';
import { OrganizationActions } from '../organization/actions';
import { UserActions } from './actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private authorizeService: APIV1AuthorizeINTERNALService,
    private router: Router,
    private notificationService: NotificationService,
    private cookieService: CookieService
  ) {}

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.login),
      // Remove XSRF cookie before and after login request
      tap(() => this.cookieService.removeAll()),
      mergeMap(({ login: { email, password, remember } }) =>
        this.authorizeService
          .pOSTAuthorizePostLoginLoginDTOLoginDto({
            email,
            password,
            rememberMe: remember,
          })
          .pipe(
            tap(() => this.cookieService.removeAll()),
            tap(() => this.notificationService.showDefault($localize`Du er nu logget ind`)),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            map((userDTO: any) => UserActions.authenticateSuccess(adaptUser(userDTO.response))),
            catchError(() => {
              this.notificationService.showError($localize`Kunne ikke logge ind`);
              return of(UserActions.authenticateError());
            })
          )
      )
    );
  });

  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.logout),
      mergeMap(() =>
        this.authorizeService.pOSTAuthorizePostLogout().pipe(
          tap(() => this.notificationService.showDefault($localize`Du er nu logget ud`)),
          tap(() => this.cookieService.removeAll()),
          tap(() => this.router.navigate([AppPath.root])),
          map(() => resetStateAction()),
          catchError(() => {
            this.notificationService.showError($localize`Kunne ikke logge ud`);
            return EMPTY;
          })
        )
      )
    );
  });

  authenticate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.authenticate),
      // Remove possibly invalid XSRF cookie before authenticating
      tap(() => this.cookieService.removeAll()),
      mergeMap(() =>
        this.authorizeService.gETAuthorizeGetLogin().pipe(
          map((userDTO) => UserActions.authenticateSuccess(adaptUser(userDTO.response))),
          catchError(() => of(UserActions.authenticateError()))
        )
      )
    );
  });

  getOrganizationsForAuthenticatedUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.authenticateSuccess),
      map(() => OrganizationActions.getOrganizations())
    );
  });

  resetOnOrganizationUpdate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.updateOrganization),
      map(() => resetOrganizationStateAction())
    );
  });

  goToRootOnAuthenticateFailed$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserActions.authenticateError),
        tap(() => this.router.navigate([AppPath.root]))
      );
    },
    { dispatch: false }
  );
}
