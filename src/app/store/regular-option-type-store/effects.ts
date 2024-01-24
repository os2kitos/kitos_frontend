import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, mergeMap, of } from 'rxjs';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { RegularOptionTypeServiceService } from 'src/app/shared/services/regular-option-type-service.service';
import { selectOrganizationUuid } from '../user-store/selectors';
import { RegularOptionTypeActions } from './actions';
import { selectHasValidCache } from './selectors';

@Injectable()
export class RegularOptionTypeEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private regularOptionTypeService: RegularOptionTypeServiceService
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
