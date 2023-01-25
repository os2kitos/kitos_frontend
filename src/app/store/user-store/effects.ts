import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, map, mergeMap, of } from 'rxjs';
import { APIUserDTOApiReturnDTO, APIV1AuthorizeService } from 'src/app/api/v1';
import { XSRFTOKEN } from 'src/app/shared/constants';
import { adaptUser } from 'src/app/shared/models/user.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { environment } from 'src/environments/environment';
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
      mergeMap(({ login: { email, password } }) =>
        this.authorizeService.gETAuthorizeGetAntiForgeryToken().pipe(
          mergeMap((token) =>
            // TODO: Generated authorize endpoint does not take arguments
            // TODO: Authorize endpoint should be POST (ALL endpoints on v1 is GET)
            this.httpClient
              .post<APIUserDTOApiReturnDTO>(
                `${environment.apiBasePath}/api/authorize`,
                { email, password },
                {
                  headers: { [XSRFTOKEN]: token.toString() },
                }
              )
              .pipe(map((userDTO) => UserActions.update(adaptUser(userDTO.response))))
          ),
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
        this.authorizeService.gETAuthorizeGetAntiForgeryToken().pipe(
          mergeMap((token) =>
            // TODO: Authorize endpoint should be POST (ALL endpoints on v1 is GET)
            this.httpClient
              .post<APIUserDTOApiReturnDTO>(`${environment.apiBasePath}/api/authorize?logout`, null, {
                headers: { [XSRFTOKEN]: token.toString() },
              })
              .pipe(map(() => UserActions.update()))
          ),
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
