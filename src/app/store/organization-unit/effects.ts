import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { APIV2OrganizationService } from 'src/app/api/v2';
import { BOUNDED_PAGINATION_QUERY_MAX_SIZE } from 'src/app/shared/constants';
import { OrganizationUnitActions } from './actions';
import { selectOrganizationUnitHasValidCache } from './selectors';

@Injectable()
export class OrganizationUnitEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private apiOrganizationService: APIV2OrganizationService
  ) {}

  getOrganizationUnits$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationUnitActions.getOrganizationUnits),
      concatLatestFrom(() => this.store.select(selectOrganizationUnitHasValidCache)),
      filter(([_, validCache]) => {
        return !validCache;
      }),
      switchMap(([{ organizationUuid, units, currentPage }]) =>
        this.apiOrganizationService
          .getManyOrganizationV2GetOrganizationUnits({
            organizationUuid: organizationUuid,
            page: currentPage,
            pageSize: BOUNDED_PAGINATION_QUERY_MAX_SIZE,
          })
          .pipe(
            map((newUnits) => {
              const allUnits = (units ?? []).concat(newUnits);
              if (newUnits.length < BOUNDED_PAGINATION_QUERY_MAX_SIZE) {
                return OrganizationUnitActions.getOrganizationUnitsSuccess(allUnits);
              }
              const nextPage = (currentPage ?? 0) + 1;
              return OrganizationUnitActions.getOrganizationUnits(organizationUuid, nextPage, allUnits);
            }),
            catchError(() => of(OrganizationUnitActions.getOrganizationUnitsError()))
          )
      )
    );
  });
}
