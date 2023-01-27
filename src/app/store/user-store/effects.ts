import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { APIUserDTOApiReturnDTO, APIV1AuthorizeService } from 'src/app/api/v1';
import { adaptUser } from 'src/app/shared/models/user.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserActions } from './actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private authorizeService: APIV1AuthorizeService,
    private httpClient: HttpClient,
    private notificationService: NotificationService
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
              // Update user and clear XSRF token after authorize request
              UserActions.update(adaptUser(userDTO.response)),
              UserActions.updateXsrfToken(),
            ]),
            catchError(() => {
              this.notificationService.showError($localize`Kunne ikke logge ind`);
              return of(UserActions.update());
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
          switchMap(() => [
            // Update user and clear XSRF token after authorize request
            UserActions.update(),
            UserActions.updateXsrfToken(),
          ]),
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
          catchError(() => of(UserActions.authenticated()))
        )
      )
    );
  });
}
