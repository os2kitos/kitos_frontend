import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie';
import { catchError, combineLatestWith, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { APIUserDTOApiReturnDTO, APIV1AuthorizeINTERNALService } from 'src/app/api/v1';
import {
  APIOrganizationGridPermissionsResponseDTO,
  APIV2OrganizationGridInternalINTERNALService,
  APIV2OrganizationsInternalINTERNALService,
} from 'src/app/api/v2';
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
    private organizationGridService: APIV2OrganizationGridInternalINTERNALService,
    @Inject(APIV2OrganizationsInternalINTERNALService)private organizationInternalService: APIV2OrganizationsInternalINTERNALService
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
      ofType(UserActions.resetOnOrganizationUpdate),
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
        this.organizationGridService
          .getSingleOrganizationGridInternalV2GetOrganizationGridPermissions({ organizationUuid })
          .pipe(
            map((response: APIOrganizationGridPermissionsResponseDTO) =>
              UserActions.getUserGridPermissionsSuccess(response)
            ),
            catchError(() => of(UserActions.getUserGridPermissionsError()))
          )
      )
    );
  });

  patchOrganization$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.patchOrganization),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ request }, organizationUuid]) =>
        this.organizationInternalService
          .patchSingleOrganizationsInternalV2PatchOrganization({ organizationUuid, requestDto: request })
          .pipe(
            map((organizationResponseDto) => UserActions.patchOrganizationSuccess(organizationResponseDto)),
            catchError(() => of(UserActions.patchOrganizationError()))
          )
      )
    );
  });
}
