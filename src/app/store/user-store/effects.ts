import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie';
import { catchError, combineLatestWith, filter, map, mergeMap, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { APIUserDTOApiReturnDTO, APIV1AuthorizeINTERNALService } from 'src/app/api/v1';
import { APIOrganizationGridPermissionsResponseDTO, APIUserResponseDTO, APIV2PasswordResetInternalINTERNALService } from 'src/app/api/v2';
import { APIV2OrganizationGridInternalINTERNALService } from 'src/app/api/v2/api/v2OrganizationGridInternalINTERNAL.service';
import { APIV2OrganizationsInternalINTERNALService } from 'src/app/api/v2/api/v2OrganizationsInternalINTERNAL.service';
import { AppPath } from 'src/app/shared/enums/app-path';
import { adaptUser } from 'src/app/shared/models/user.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { resetOrganizationStateAction, resetStateAction } from '../meta/actions';
import { UserActions } from './actions';
import { selectOrganizationUuid, selectUser } from './selectors';
import { selectUIRootConfig } from '../organization/selectors';
import { StartPreferenceChoice } from 'src/app/shared/models/organization/organization-user/start-preference.model';
import { UIRootConfig } from 'src/app/shared/models/ui-config/ui-root-config.model';

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
    @Inject(APIV2OrganizationsInternalINTERNALService)
    private organizationInternalService: APIV2OrganizationsInternalINTERNALService,
    private resetPasswordService: APIV2PasswordResetInternalINTERNALService
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
      mergeMap(({ returnUrl }) =>
        this.authorizeService.getSingleAuthorizeGetLogin().pipe(
          map((userDTO) => UserActions.authenticateSuccess(adaptUser(userDTO.response))),
          catchError(() => of(UserActions.authenticateError(returnUrl)))
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

  useUserDefaultStartPageOnLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.resetOnOrganizationUpdate),
      switchMap(() =>
        this.store.select(selectUIRootConfig).pipe(
          filterNullish(),
          withLatestFrom(this.store.select(selectUser))
        )
      ),
      tap(([uiRootConfig, user]) => {
        const userDefaultStartPage = user?.defaultStartPage;
        if (this.shouldGoToUserDefaultStartPage(userDefaultStartPage, uiRootConfig)) {
          this.navigateToUserDefaultStartPage(userDefaultStartPage!);
        }
      })
    );
  }, { dispatch: false });



  private shouldGoToUserDefaultStartPage(
    userDefaultStartPage: StartPreferenceChoice | undefined,
    uiRootConfig: UIRootConfig
  ): boolean {
    return (
      this.isOnStartPage() &&
      userDefaultStartPage !== undefined &&
      !this.userDefaultStartPageDisabledInOrganization(userDefaultStartPage, uiRootConfig)
    );
  }

  private isOnStartPage(): boolean {
    return this.router.url.replace('/', '') === AppPath.root;
  }

  private userDefaultStartPageDisabledInOrganization(
    userDefaultStartPage: StartPreferenceChoice,
    uiRootConfig: UIRootConfig
  ): boolean {
    const startPageValue = userDefaultStartPage.value;
    switch (startPageValue) {
      case APIUserResponseDTO.DefaultUserStartPreferenceEnum.ItSystemCatalog:
      case APIUserResponseDTO.DefaultUserStartPreferenceEnum.ItSystemUsage:
        return !uiRootConfig.showItSystemModule;
      case APIUserResponseDTO.DefaultUserStartPreferenceEnum.ItContract:
        return !uiRootConfig.showItContractModule;
      case APIUserResponseDTO.DefaultUserStartPreferenceEnum.DataProcessing:
        return !uiRootConfig.showDataProcessing;
      default:
        return false;
    }
  }

  private navigateToUserDefaultStartPage(userDefaultStartPage: StartPreferenceChoice) {
    const path = this.getUserDefaultStartPagePath(userDefaultStartPage);
    this.router.navigate([path]);
  }

  private getUserDefaultStartPagePath(userDefaultStartPage: StartPreferenceChoice): string {
    const startPageValue = userDefaultStartPage.value;
    switch (startPageValue) {
      case APIUserResponseDTO.DefaultUserStartPreferenceEnum.StartSite:
        return AppPath.root;
      case APIUserResponseDTO.DefaultUserStartPreferenceEnum.Organization:
        return `${AppPath.organization}/${AppPath.structure}`;
      case APIUserResponseDTO.DefaultUserStartPreferenceEnum.ItSystemCatalog:
        return `${AppPath.itSystems}/${AppPath.itSystemCatalog}`;
      case APIUserResponseDTO.DefaultUserStartPreferenceEnum.ItSystemUsage:
        return `${AppPath.itSystems}/${AppPath.itSystemUsages}`;
      case APIUserResponseDTO.DefaultUserStartPreferenceEnum.ItContract:
        return AppPath.itContracts;
      case APIUserResponseDTO.DefaultUserStartPreferenceEnum.DataProcessing:
        return AppPath.dataProcessing;
      default:
        throw new Error(`Unknown start page: ${startPageValue}`);
    }
  }

  goToRootOnAuthenticateFailed$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserActions.authenticateError),
        tap(({ returnUrl }) => {
          const extras = returnUrl ? { queryParams: { returnUrl } } : {};
          return this.router.navigate([AppPath.root], extras);
        })
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

  sendResetPasswordRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.resetPasswordRequest),
      switchMap(({ email }) =>
        this.resetPasswordService.postSinglePasswordResetInternalV2RequestPasswordReset({ request: { email } }).pipe(
          map(() => UserActions.resetPasswordRequestSuccess(email)),
          catchError(() => of(UserActions.resetPasswordRequestError()))
        )
      )
    );
  });

  resetPassword$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.resetPassword),
      switchMap(({ requestId, password }) =>
        this.resetPasswordService
          .postSinglePasswordResetInternalV2PostPasswordReset({
            requestId,
            request: { password },
          })
          .pipe(
            map(() => UserActions.resetPasswordSuccess()),
            catchError(() => of(UserActions.resetPasswordError()))
          )
      )
    );
  });
}
