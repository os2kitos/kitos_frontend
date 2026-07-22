import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie';
import { catchError, combineLatestWith, map, mergeMap, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { AuthorizeService } from 'src/app/api/v1';
import {
  APIDefaultUserStartPreferenceChoice,
  APIOrganizationGridPermissionsResponseDTO,
  OrganizationGridInternalV2Service,
  OrganizationsInternalV2Service,
  PasswordResetInternalV2Service,
  UsersInternalV2Service,
} from 'src/app/api/v2';
import { AppPath } from 'src/app/shared/enums/app-path';
import { StartPreferenceChoice } from 'src/app/shared/models/organization/organization-user/start-preference.model';
import { UIRootConfig } from 'src/app/shared/models/ui-config/ui-root-config.model';
import { adaptUser } from 'src/app/shared/models/user.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { resetOrganizationStateAction, resetStateAction } from '../meta/actions';
import { selectPagedOrganizationUnits } from '../organization/organization-unit/selectors';
import { selectUIRootConfig } from '../organization/selectors';
import { UserActions } from './actions';
import { selectOrganizationUuid, selectUser, selectUserUuid } from './selectors';

@Injectable()
export class UserEffects {
  constructor(
    private store: Store,
    private actions$: Actions,
    @Inject(AuthorizeService)
    private authorizeService: AuthorizeService,
    private router: Router,
    private cookieService: CookieService,
    @Inject(OrganizationGridInternalV2Service)
    private organizationGridService: OrganizationGridInternalV2Service,
    @Inject(OrganizationsInternalV2Service)
    private organizationInternalService: OrganizationsInternalV2Service,
    @Inject(PasswordResetInternalV2Service)
    private resetPasswordService: PasswordResetInternalV2Service,
    @Inject(UsersInternalV2Service)
    private userInternalService: UsersInternalV2Service,
  ) {}

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.login),
      // Remove XSRF cookie before and after login request
      tap(() => this.cookieService.removeAll()),
      mergeMap(({ login: { email, password, remember } }) =>
        this.authorizeService
          .postSingleAuthorizePostLogin({
            aPILoginDTO: {
              email,
              password,
              rememberMe: remember,
            },
          })
          .pipe(
            tap(() => this.cookieService.removeAll()),
            map((userDTO) => UserActions.loginSuccess(adaptUser(userDTO.response))),
            catchError(() => of(UserActions.loginError())),
          ),
      ),
    );
  });

  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.logout),
      mergeMap(() =>
        this.authorizeService.postSingleAuthorizePostLogout().pipe(
          tap(() => this.cookieService.removeAll()),
          map(() => UserActions.logoutSuccess()),
          catchError(() => of(UserActions.logoutError())),
        ),
      ),
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
          catchError(() => of(UserActions.authenticateError(returnUrl))),
        ),
      ),
    );
  });

  resetOnLogout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.logoutSuccess),
      tap(() => this.router.navigate([AppPath.root])),
      map(() => resetStateAction()),
    );
  });

  resetOnOrganizationUpdate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.resetOnOrganizationUpdate),
      map(() => resetOrganizationStateAction()),
    );
  });

  useUserDefaultStartPageOnLogin$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserActions.resetOnOrganizationUpdate),
        switchMap(() =>
          this.store.select(selectUIRootConfig).pipe(filterNullish(), withLatestFrom(this.store.select(selectUser))),
        ),
        tap(([uiRootConfig, user]) => {
          const userDefaultStartPage = user?.defaultStartPage;
          if (this.shouldGoToUserDefaultStartPage(userDefaultStartPage, uiRootConfig)) {
            this.navigateToUserDefaultStartPage(userDefaultStartPage!);
          }
        }),
      );
    },
    { dispatch: false },
  );

  goToRootOnAuthenticateFailed$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserActions.authenticateError),
        tap(({ returnUrl }) => {
          const extras = returnUrl ? { queryParams: { returnUrl } } : {};
          return this.router.navigate([AppPath.root], extras);
        }),
      );
    },
    { dispatch: false },
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
              UserActions.getUserGridPermissionsSuccess(response),
            ),
            catchError(() => of(UserActions.getUserGridPermissionsError())),
          ),
      ),
    );
  });

  patchOrganization$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.patchOrganization),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([{ request }, organizationUuid]) =>
        this.organizationInternalService
          .patchSingleOrganizationsInternalV2PatchOrganization({
            organizationUuid,
            aPIOrganizationUpdateRequestDTO: request,
          })
          .pipe(
            map((organizationResponseDto) => UserActions.patchOrganizationSuccess(organizationResponseDto)),
            catchError(() => of(UserActions.patchOrganizationError())),
          ),
      ),
    );
  });

  sendResetPasswordRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.resetPasswordRequest),
      switchMap(({ email }) =>
        this.resetPasswordService
          .postSinglePasswordResetInternalV2RequestPasswordReset({
            aPIRequestPasswordResetRequestDTO: { email },
          })
          .pipe(
            map(() => UserActions.resetPasswordRequestSuccess(email)),
            catchError(() => of(UserActions.resetPasswordRequestError())),
          ),
      ),
    );
  });

  resetPassword$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.resetPassword),
      switchMap(({ requestId, password }) =>
        this.resetPasswordService
          .postSinglePasswordResetInternalV2PostPasswordReset({
            requestId,
            aPIResetPasswordRequestDTO: { password },
          })
          .pipe(
            map(() => UserActions.resetPasswordSuccess()),
            catchError(() => of(UserActions.resetPasswordError())),
          ),
      ),
    );
  });

  getDefaultUnit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.getUserDefaultUnit),
      combineLatestWith(this.store.select(selectUserUuid).pipe(filterNullish())),
      switchMap(([{ organizationUuid }, userUuid]) =>
        this.userInternalService.getSingleUsersInternalV2GetUserDefaultUnit({ organizationUuid, userUuid }).pipe(
          map((unit) => {
            return UserActions.getUserDefaultUnitSuccess(unit);
          }),
          catchError(() => of(UserActions.getUserDefaultUnitError())),
        ),
      ),
    );
  });

  setDefaultUnit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.setUserDefaultUnit),
      concatLatestFrom(() => [
        this.store.select(selectOrganizationUuid).pipe(filterNullish()),
        this.store.select(selectUserUuid).pipe(filterNullish()),
        this.store.select(selectPagedOrganizationUnits).pipe(filterNullish()),
      ]),
      switchMap(([{ organizationUnitUuid }, organizationUuid, userUuid, organizationUnits]) =>
        this.userInternalService
          .patchSingleUsersInternalV2PatchDefaultOrgUnit({
            organizationUuid,
            userUuid,
            organizationUnitUuid: organizationUnitUuid,
          })
          .pipe(
            map(() => {
              const defaultUnit = organizationUnits.find((unit) => unit.uuid === organizationUnitUuid);
              if (!defaultUnit) {
                return UserActions.setUserDefaultUnitError();
              }
              return UserActions.setUserDefaultUnitSuccess(defaultUnit);
            }),
            catchError(() => of(UserActions.setUserDefaultUnitError())),
          ),
      ),
    );
  });

  private shouldGoToUserDefaultStartPage(
    userDefaultStartPage: StartPreferenceChoice | undefined,
    uiRootConfig: UIRootConfig,
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
    uiRootConfig: UIRootConfig,
  ): boolean {
    const startPageValue = userDefaultStartPage.value;
    switch (startPageValue) {
      case APIDefaultUserStartPreferenceChoice.ItSystemCatalog:
      case APIDefaultUserStartPreferenceChoice.ItSystemUsage:
        return !uiRootConfig.showItSystemModule;
      case APIDefaultUserStartPreferenceChoice.ItContract:
        return !uiRootConfig.showItContractModule;
      case APIDefaultUserStartPreferenceChoice.DataProcessing:
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
      case APIDefaultUserStartPreferenceChoice.StartSite:
        return AppPath.root;
      case APIDefaultUserStartPreferenceChoice.Organization:
        return `${AppPath.organization}/${AppPath.structure}`;
      case APIDefaultUserStartPreferenceChoice.ItSystemCatalog:
        return `${AppPath.itSystems}/${AppPath.itSystemCatalog}`;
      case APIDefaultUserStartPreferenceChoice.ItSystemUsage:
        return `${AppPath.itSystems}/${AppPath.itSystemUsages}`;
      case APIDefaultUserStartPreferenceChoice.ItContract:
        return AppPath.itContracts;
      case APIDefaultUserStartPreferenceChoice.DataProcessing:
        return AppPath.dataProcessing;
      default:
        throw new Error(`Unknown start page: ${startPageValue}`);
    }
  }
}
