import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { APIV2PublicMessagesINTERNALService } from 'src/app/api/v2';
import { GlobalAdminPublicMessageActions } from './actions';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class PublicMessageEffects {
  constructor(private actions$: Actions, private publicMessageService: APIV2PublicMessagesINTERNALService) {}

  editPublicMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalAdminPublicMessageActions.editPublicMessages),
      switchMap(({ request }) =>
        this.publicMessageService.patchSinglePublicMessagesV2Patch({ body: request }).pipe(
          map((response) => GlobalAdminPublicMessageActions.editPublicMessagesSuccess(response)),
          catchError(() => of(GlobalAdminPublicMessageActions.editPublicMessagesError()))
        )
      )
    );
  });
}
