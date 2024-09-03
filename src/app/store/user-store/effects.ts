import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { APIUserDTOApiReturnDTO, APIV1AuthorizeINTERNALService } from 'src/app/api/v1';
import { APIV2OrganizationGridInternalINTERNALService } from 'src/app/api/v2';
import { AppPath } from 'src/app/shared/enums/app-path';
import { adaptUser } from 'src/app/shared/models/user.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { resetOrganizationStateAction, resetStateAction } from '../meta/actions';
import { UserActions } from './actions';
import { selectOrganizationUuid } from './selectors';

@Injectable()
export class UserEffects {
  constructor(
    private store: Store,
    private actions$: Actions,
    @Inject(APIV1AuthorizeINTERNALService)
    private authorizeService: APIV1AuthorizeINTERNALService,
    private router: Router,
    private cookieService: CookieService,
    @Inject(APIV2OrganizationGridInternalINTERNALService)
    private organizationGridService: APIV2OrganizationGridInternalINTERNALService
  ) {}

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.login),
      // Remove XSRF cookie before and after login request
      tap(() => this.cookieService.removeAll()),
      mergeMap(({ login: { email, password, remember } }) =>
        this.authorizeService
          .postSingleAuthorizePostLogin({
            loginDto: {
              email,
              password,
              rememberMe: remember,
            },
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
        this.authorizeService.postSingleAuthorizePostLogout().pipe(
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
        this.authorizeService.getSingleAuthorizeGetLogin().pipe(
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

  getUserGridPermissions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.getUserGridPermissions),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid).pipe(filterNullish())]),
      switchMap(([_, organizationUuid]) =>
        this.organizationGridService.getSingleOrganizationGridInternalV2GetGridPermissionsz({ organizationUuid }).pipe(
          map((response) => UserActions.getUserGridPermissionsSuccess(response)),
          catchError(() => of(UserActions.getUserGridPermissionsError()))
        )
      )
    );
  });
}
