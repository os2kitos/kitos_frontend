import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { APIUserDTOApiReturnDTO, APIV1AuthorizeService } from 'src/app/api/v1';
import { adaptUser } from 'src/app/shared/models/user.model';
import { environment } from 'src/environments/environment';
import { UserActions } from './actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private authorizeService: APIV1AuthorizeService,
    private httpClient: HttpClient
  ) {}

  apiLoginUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.loginUser),
      mergeMap(({ email, password }) =>
        this.authorizeService.gETAuthorizeGetAntiForgeryToken().pipe(
          mergeMap((token) =>
            // TODO: Generated authorize endpoint does not take arguments
            // TODO: Authorize endpoint should be POST (ALL endpoints on v1 is GET)
            // TODO: CORS issue
            this.httpClient
              .post<APIUserDTOApiReturnDTO>(
                `${environment.apiBasePath}/Authorize`,
                { email, password },
                {
                  headers: { 'X-XSRF-TOKEN': token.toString() },
                }
              )
              .pipe(map((userDTO) => UserActions.updateUser(adaptUser(userDTO.response))))
          ),
          catchError(() => of(UserActions.loginUserFailed()))
        )
      )
    );
  });
}
