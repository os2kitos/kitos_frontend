import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { PublicMessagesV2Service } from 'src/app/api/v2';
import { GlobalAdminPublicMessageActions } from './actions';

@Injectable()
export class PublicMessageEffects {
  constructor(
    private actions$: Actions,
    @Inject(PublicMessagesV2Service)
    private publicMessageService: PublicMessagesV2Service,
  ) {}

  editPublicMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalAdminPublicMessageActions.editPublicMessages),
      switchMap(({ messageUuid, request }) =>
        this.publicMessageService
          .patchSinglePublicMessagesV2Patch({ messageUuid, aPIPublicMessageRequestDTO: request })
          .pipe(
            map((response) => GlobalAdminPublicMessageActions.editPublicMessagesSuccess(response)),
            catchError(() => of(GlobalAdminPublicMessageActions.editPublicMessagesError())),
          ),
      ),
    );
  });
}
