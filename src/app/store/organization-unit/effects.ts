import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { APIV2OrganizationService } from 'src/app/api/v2';
import { BOUNDED_PAGINATION_QUERY_MAX_SIZE } from 'src/app/shared/constants';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from '../user-store/selectors';
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
    // eslint-disable-next-line @ngrx/avoid-cyclic-effects
    return this.actions$.pipe(
      ofType(OrganizationUnitActions.getOrganizationUnits),
      concatLatestFrom(() => [
        this.store.select(selectOrganizationUuid).pipe(filterNullish()),
        this.store.select(selectOrganizationUnitHasValidCache),
      ]),
      filter(([_, __, validCache]) => {
        return !validCache;
      }),
      switchMap(([{ units, currentPage, pageSize }, organizationUuid]) =>
        this.apiOrganizationService
          .getManyOrganizationV2GetOrganizationsByOrganizationuuid({
            uuid: organizationUuid,
            page: currentPage,
            pageSize: pageSize,
          })
          .pipe(
            map((newUnits) => {
              const allUnits = (units ?? []).concat(newUnits);
              const maxPageSize = pageSize ?? BOUNDED_PAGINATION_QUERY_MAX_SIZE;
              if (newUnits.length < maxPageSize) {
                return OrganizationUnitActions.getOrganizationUnitsSuccess(allUnits);
              }
              const nextPage = (currentPage ?? 0) + 1;
              return OrganizationUnitActions.getOrganizationUnits(maxPageSize, nextPage, allUnits);
            }),
            catchError(() => of(OrganizationUnitActions.getOrganizationUnitsError()))
          )
      )
    );
  });
}
