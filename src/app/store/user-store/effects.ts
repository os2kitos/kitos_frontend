import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, map, mergeMap, of, switchMap, tap } from 'rxjs';
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
    private organizationService: OrganizationService
  ) {}

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.login),
      mergeMap(({ login: { email, password, remember } }) =>
        this.authorizeService
          .pOSTAuthorizePostLoginLoginDTOLoginDto({
            email,
            password,
            rememberMe: remember,
          })
          .pipe(
            tap(() => this.notificationService.showDefault($localize`Du er nu logget ind`)),
            // eslint-disable-next-line @ngrx/no-multiple-actions-in-effects
            switchMap((userDTO: APIUserDTOApiReturnDTO) => [
              // Clear state and update with new user
              UserActions.clear(),
              UserActions.authenticated(adaptUser(userDTO.response)),
            ]),
            catchError(() => {
              this.notificationService.showError($localize`Kunne ikke logge ind`);
              return of(UserActions.authenticateFailed());
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
          // eslint-disable-next-line @ngrx/no-multiple-actions-in-effects
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
          map((userDTO: APIUserDTOApiReturnDTO) => UserActions.authenticated(adaptUser(userDTO.response))),
          catchError(() => of(UserActions.authenticateFailed()))
        )
      )
    );
  });

  getOrganizationsForAuthenticatedUser$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserActions.authenticated),
        tap(() => this.organizationService.getAll())
      );
    },
    { dispatch: false }
  );

  goToRootOnAuthenticateFailed$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(UserActions.authenticateFailed),
        tap(() => this.router.navigate([AppPath.root]))
      );
    },
    { dispatch: false }
  );
}
