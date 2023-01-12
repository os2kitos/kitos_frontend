import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { delay, map, mergeMap, of } from 'rxjs';
import { testUser } from 'src/app/shared/models/user.model';
import { UserActions } from './actions';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions) {}

  apiGetUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.getUser),
      mergeMap(() =>
        of(testUser).pipe(
          delay(500),
          map((user) => UserActions.updateUser(user))
        )
      )
    );
  });
}
