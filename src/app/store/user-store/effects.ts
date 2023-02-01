import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CookieService } from 'ngx-cookie';
import { catchError, EMPTY, map, mergeMap, of, tap } from 'rxjs';
import { APIUserDTOApiReturnDTO, APIV1AuthorizeService } from 'src/app/api/v1';
import { AppPath } from 'src/app/shared/enums/app-path';
import { adaptUser } from 'src/app/shared/models/user.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { OrganizationService } from '../organization/organization.service';
import { UserActions } from './actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private authorizeService: APIV1AuthorizeService,
    private router: Router,
    private notificationService: NotificationService,
    private organizationService: OrganizationService,
    private cookieService: CookieService
  ) {}

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.login),
      mergeMap(({ login: { email, password, remember } }) => {
        // Remove XSRF token before and after login request
        this.cookieService.removeAll();

        return this.authorizeService
          .pOSTAuthorizePostLoginLoginDTOLoginDto({
            email,
            password,
            rememberMe: remember,
          })
          .pipe(
            tap(() => this.cookieService.removeAll()),
            tap(() => this.notificationService.showDefault($localize`Du er nu logget ind`)),
            map((userDTO: APIUserDTOApiReturnDTO) => UserActions.authenticateSuccess(adaptUser(userDTO.response))),
            catchError(() => {
              this.notificationService.showError($localize`Kunne ikke logge ind`);
              return of(UserActions.authenticateError());
            })
          );
      })
    );
  });

  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.logout),
      mergeMap(() =>
        this.authorizeService.pOSTAuthorizePostLogout().pipe(
          tap(() => this.notificationService.showDefault($localize`Du er nu logget ud`)),
          tap(() => this.cookieService.removeAll()),
          map(() => UserActions.clear()),
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
      mergeMap(() =>
        this.authorizeService.gETAuthorizeGetLogin().pipe(
          map((userDTO: APIUserDTOApiReturnDTO) => UserActions.authenticateSuccess(adaptUser(userDTO.response))),
          catchError(() => of(UserActions.authenticateError()))
        )
      )
    );
  });

  getOrganizationsForAuthenticatedUser$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserActions.authenticateSuccess),
        tap(() => this.organizationService.getAll())
      );
    },
    { dispatch: false }
  );

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
