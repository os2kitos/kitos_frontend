import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { APIV2ItSystemBusinessTypeService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from '../user-store/selectors';
import { BusinessTypeActions } from './actions';
import { selectHasValidCache } from './selectors';

@Injectable()
export class BusinessTypeEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private apiItSystemBusinessTypeService: APIV2ItSystemBusinessTypeService
  ) {}

  getBusinessTypes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BusinessTypeActions.getBusinessTypes),
      concatLatestFrom(() => [this.store.select(selectOrganizationUuid), this.store.select(selectHasValidCache)]),
      filter(([_, __, validCache]) => !validCache),
      map(([_, organizationUuid]) => organizationUuid),
      filterNullish(),
      switchMap((organizationUuid) =>
        this.apiItSystemBusinessTypeService
          .gETItSystemBusinessTypeV2GetBusinessTypesUnboundedPaginationQueryPaginationGuidOrganizationUuid(
            organizationUuid
          )
          .pipe(
            map((response) => BusinessTypeActions.getBusinessTypesSuccess(response)),
            catchError(() => of(BusinessTypeActions.getBusinessTypesError()))
          )
      )
    );
  });
}
