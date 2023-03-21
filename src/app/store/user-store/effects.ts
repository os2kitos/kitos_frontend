import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CookieService } from 'ngx-cookie';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { APIUserDTOApiReturnDTO, APIV1AuthorizeINTERNALService } from 'src/app/api/v1';
import { AppPath } from 'src/app/shared/enums/app-path';
import { adaptUser } from 'src/app/shared/models/user.model';
import { resetOrganizationStateAction, resetStateAction } from '../meta/actions';
import { UserActions } from './actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private authorizeService: APIV1AuthorizeINTERNALService,
    private router: Router,
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
            map((userDTO: APIUserDTOApiReturnDTO) => UserActions.loginSuccess(adaptUser(userDTO.response))),
            catchError(() => of(UserActions.loginError()))
          )
      )
    );
  });

  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.logout),
      mergeMap(() =>
        this.authorizeService.pOSTAuthorizePostLogout().pipe(
          tap(() => this.cookieService.removeAll()),
          map(() => UserActions.logoutSuccess()),
          catchError(() => of(UserActions.logoutError()))
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

  resetOnLogout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.logoutSuccess),
      tap(() => this.router.navigate([AppPath.root])),
      map(() => resetStateAction())
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
