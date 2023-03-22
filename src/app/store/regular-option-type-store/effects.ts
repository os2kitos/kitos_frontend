import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
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
      ofType(RegularOptionTypeActions.getOptions), //TODO_ Add payload
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid), this.store.select(selectHasValidCache)]),
      filter(([_, __, validCache]) => !validCache), //TODO: Type of option should also be a parameter to select cache
      map(([_, organizationUuid]) => organizationUuid),
      filterNullish(),
      switchMap((organizationUuid) =>
        this.regularOptionTypeService.getAvailableOptions(organizationUuid, 'it-contract_contract-type').pipe(
          //TODO: Use the type from the payload
          map((response) => RegularOptionTypeActions.getOptionsSuccess(response)),
          catchError(() => of(RegularOptionTypeActions.getOptionsError()))
        )
      )
    );
  });
}
