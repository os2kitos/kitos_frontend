import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, groupBy, map, mergeMap, of, switchMap } from 'rxjs';
import { GlobalAdminOptionTypeService } from 'src/app/shared/services/global-admin-option-type.service';
import { GlobalOptionTypeActions } from './actions';

@Injectable()
export class GlobalAdminOptionTypeEffects {
  constructor(private actions$: Actions, private globalOptionTypeService: GlobalAdminOptionTypeService) {}

  patchGlobalOptionType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalOptionTypeActions.updateOptionType),
      groupBy((action) => action.optionUuid),
      mergeMap((group$) =>
        group$.pipe(
          concatMap((action) => {
            return this.globalOptionTypeService
              .patchGlobalOption(action.optionType, action.optionUuid, action.request)
              .pipe(
                map(() => GlobalOptionTypeActions.updateOptionTypeSuccess(action.optionType)),
                catchError(() => of(GlobalOptionTypeActions.updateOptionTypeError()))
              );
          })
        )
      )
    );
  });

  createGlobalOptionType$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GlobalOptionTypeActions.createOptionType),
      switchMap((action) => {
        return this.globalOptionTypeService.createGlobalOption(action.optionType, action.request).pipe(
          map(() => GlobalOptionTypeActions.createOptionTypeSuccess(action.optionType)),
          catchError(() => of(GlobalOptionTypeActions.createOptionTypeError()))
        );
      })
    );
  });
}
