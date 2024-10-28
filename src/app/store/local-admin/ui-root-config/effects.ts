import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { UIRootConfigActions } from "./actions";
import { of, switchMap } from "rxjs";

@Injectable()
export class UIRootConfigEffects {
  constructor(
    private actions$: Actions,
  ) {}

  setCurrentTabModuleKey$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UIRootConfigActions.setCurrentTabModuleKey),
      switchMap(({ moduleKey }) => {
        return of(UIRootConfigActions.setCurrentTabModuleKeySuccess({ moduleKey }));
      })
    );
  });

}
