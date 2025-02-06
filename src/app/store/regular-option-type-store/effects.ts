import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';

import { Store } from '@ngrx/store';
import { catchError, filter, map, mergeMap, of } from 'rxjs';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { RegularOptionTypeService } from 'src/app/shared/services/regular-option-type.service';
import { selectOrganizationUuid } from '../user-store/selectors';
import { RegularOptionTypeActions } from './actions';
import { selectHasValidCache } from './selectors';

@Injectable()
export class RegularOptionTypeEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private regularOptionTypeService: RegularOptionTypeService
  ) {}

  getOptions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RegularOptionTypeActions.getOptions),
      concatLatestFrom(({ optionType }) => [
        this.store.select(selectOrganizationUuid).pipe(filterNullish()),
        this.store.select(selectHasValidCache(optionType)),
      ]),
      filter(([_, __, validCache]) => {
        return !validCache;
      }),
      map(([{ optionType }, organizationUuid]) => (organizationUuid ? { optionType, organizationUuid } : null)),
      filterNullish(),
      mergeMap((params) =>
        this.regularOptionTypeService.getAvailableOptions(params.organizationUuid, params.optionType).pipe(
          map((response) => RegularOptionTypeActions.getOptionsSuccess(params.optionType, response)),
          catchError(() => of(RegularOptionTypeActions.getOptionsError(params.optionType)))
        )
      )
    );
  });
}
