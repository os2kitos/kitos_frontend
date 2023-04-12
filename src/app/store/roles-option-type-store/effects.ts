import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { RoleOptionTypeService } from 'src/app/shared/services/role-option-type.service';
import { RoleOptionTypeActions } from './actions';
import { selectHasValidCache } from './selectors';

@Injectable()
export class RoleOptionTypeEffects {
  constructor(private actions$: Actions, private store: Store, private roleService: RoleOptionTypeService) {}

  getOptions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RoleOptionTypeActions.getOptions),
      concatLatestFrom(({ optionType }) => this.store.select(selectHasValidCache(optionType))),
      filter(([_, validCache]) => {
        return !validCache;
      }),
      map(([{ entityUuid, optionType }, _]) => ({ entityUuid, optionType })),
      filterNullish(),
      switchMap((params) =>
        this.roleService.getAvailableOptions(params.entityUuid, params.optionType).pipe(
          map((response) => RoleOptionTypeActions.getOptionsSuccess(params.entityUuid, params.optionType, response)),
          catchError(() => of(RoleOptionTypeActions.getOptionsError(params.optionType)))
        )
      )
    );
  });
}
