import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';import { concatLatestFrom } from '@ngrx/operators';

import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { RoleOptionTypeService } from 'src/app/shared/services/role-option-type.service';
import { selectOrganizationUuid } from '../user-store/selectors';
import { RoleOptionTypeActions } from './actions';
import { selectHasValidCache } from './selectors';

@Injectable()
export class RoleOptionTypeEffects {
  constructor(private actions$: Actions, private store: Store, private roleService: RoleOptionTypeService) {}

  getOptions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RoleOptionTypeActions.getOptions),
      concatLatestFrom(({ optionType }) => [
        this.store.select(selectOrganizationUuid).pipe(filterNullish()),
        this.store.select(selectHasValidCache(optionType)),
      ]),
      filter(([_, __, validCache]) => {
        return !validCache;
      }),
      map(([{ optionType }, organizationUuid]) => (organizationUuid ? { organizationUuid, optionType } : null)),
      filterNullish(),
      switchMap((params) =>
        this.roleService.getAvailableOptions(params.organizationUuid, params.optionType).pipe(
          map((response) => RoleOptionTypeActions.getOptionsSuccess(params.optionType, response)),
          catchError(() => of(RoleOptionTypeActions.getOptionsError(params.optionType)))
        )
      )
    );
  });
}
